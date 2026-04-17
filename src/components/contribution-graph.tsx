import {
  getContributionCalendar,
  type ContribCalendar,
  type ContribLevel,
} from "@/lib/github-contributions";
import ContributionGrid from "./contribution-grid";

export default async function ContributionGraph({
  username,
}: {
  username: string;
}) {
  const data = await getContributionCalendar(username);
  return <GraphInner username={username} data={data} />;
}

function GraphInner({
  username,
  data,
}: {
  username: string;
  data: ContribCalendar | null;
}) {
  return (
    <section
      aria-label={`GitHub contributions for @${username}`}
      className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-3 px-1"
    >
      {data ? (
        <>
          <ContributionGrid data={data} />
          <Stats data={data} />
        </>
      ) : (
        <p className="font-mono text-[11px] text-foreground/45">
          github activity will appear here once the token is configured.
        </p>
      )}
    </section>
  );
}

function Stats({ data }: { data: ContribCalendar }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.04em] text-foreground/60 sm:text-[11px]">
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        <span>
          <span className="text-foreground">
            {data.totalContributions.toLocaleString()}
          </span>{" "}
          contributions · last year
        </span>
        <span>
          longest streak{" "}
          <span className="text-foreground">{data.longestStreak}d</span>
        </span>
        <span>
          current streak{" "}
          <span className="text-foreground">{data.currentStreak}d</span>
        </span>
      </div>
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-foreground/45">less</span>
      {[0, 1, 2, 3, 4].map((lvl) => (
        <span
          key={lvl}
          className={`contrib-cell contrib-l${lvl as ContribLevel} inline-block h-[9px] w-[9px] rounded-[2px]`}
        />
      ))}
      <span className="text-foreground/45">more</span>
    </div>
  );
}
