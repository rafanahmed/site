import "server-only";

export type ContribLevel = 0 | 1 | 2 | 3 | 4;

export type ContribDay = {
  date: string;
  count: number;
  level: ContribLevel;
  weekday: number;
};

export type ContribWeek = {
  days: ContribDay[];
};

export type ContribCalendar = {
  username: string;
  totalContributions: number;
  weeks: ContribWeek[];
  currentStreak: number;
  longestStreak: number;
  rangeStart: string;
  rangeEnd: string;
};

const LEVEL_FROM_API: Record<string, ContribLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              weekday: number;
              contributionCount: number;
              contributionLevel: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export async function getContributionCalendar(
  username: string,
): Promise<ContribCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "rafan.dev-site",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: username },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as GraphQLResponse;
    const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;

    const weeks: ContribWeek[] = cal.weeks.map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        weekday: d.weekday,
        count: d.contributionCount,
        level: LEVEL_FROM_API[d.contributionLevel] ?? 0,
      })),
    }));

    const flatDays = weeks.flatMap((w) => w.days);
    const { currentStreak, longestStreak } = computeStreaks(flatDays);

    return {
      username,
      totalContributions: cal.totalContributions,
      weeks,
      currentStreak,
      longestStreak,
      rangeStart: flatDays[0]?.date ?? "",
      rangeEnd: flatDays[flatDays.length - 1]?.date ?? "",
    };
  } catch {
    return null;
  }
}

function computeStreaks(days: ContribDay[]): {
  currentStreak: number;
  longestStreak: number;
} {
  let longest = 0;
  let running = 0;
  for (const d of days) {
    if (d.count > 0) {
      running += 1;
      if (running > longest) longest = running;
    } else {
      running = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.count > 0) {
      current += 1;
    } else if (i === days.length - 1) {
      // today has no contributions yet — don't break the streak, just skip back once
      continue;
    } else {
      break;
    }
  }

  return { currentStreak: current, longestStreak: longest };
}
