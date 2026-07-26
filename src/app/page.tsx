import SiteHeader from "@/components/site-header";
import ContributionGraph from "@/components/contribution-graph";
import { siteConfig } from "@/lib/site";

const fawwwnnnnnnn = String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀
⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⢀⣠⢶⢯⣱⠀
⡧⡞⠁⠻⢗⣦⡀⠀⠀⣐⣦⣬⡼⢟⠳⠶⣄⣀⠠⡞⡴⠋⠀⡗⠂
⡗⣇⠀⢁⠀⢺⡕⢶⡚⡱⢌⡱⢚⡋⣌⢣⠹⣌⠳⢿⡀⠐⣰⠽⠀
⠸⡞⣆⡀⠂⢠⠞⡡⢜⡡⠎⡔⢣⠜⢤⠃⠧⣌⢣⡙⣶⡼⡳⠃⠀
⠀⠘⠦⣝⡣⢟⡌⠷⠃⢸⡱⣌⢣⠚⡤⢋⠖⡤⢃⡞⠈⡟⠁⠀⠀
⠀⠀⠀⠈⠙⣷⢸⢦⣤⣶⣶⣡⠃⣝⡰⣉⠖⣡⢟⣾⣟⠃⠀⠀⠀
⠀⠀⠀⠀⠀⣋⢞⠘⣿⣿⣿⣿⣧⠘⡰⢡⠚⡤⣿⣿⡿⢸⠀⠀⠀
⠀⠀⠀⠀⠀⠩⢞⣑⡹⢿⣿⣿⠟⠀⠷⢓⣻⣲⠿⢟⠱⡚⠀⠀⠀
⠀⠀⣠⠄⠀⠀⠙⢿⣏⠀⠀⠈⠀⠀⠀⠠⠿⠧⠀⣀⠔⠀⠀⠀⠀
⠀⣰⣅⣽⣀⣀⣀⣀⠈⢁⡖⢢⢠⡤⠤⢤⠐⠒⠉⠀⠀⠀⠀⠀⠀
⠀⣿⣩⢛⠤⣃⠎⡥⢋⠵⣈⠇⣎⠁⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⢹⡌⢲⢡⠚⡴⢉⠲⣡⠚⡤⠇⠀⢨⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢈⣎⡱⢌⠽⠢⢽⡦⡑⢎⡜⠀⡀⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠠⣟⢡⠚⢞⠛⡦⢸⡇⡜⡾⡘⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢳⡩⣬⢣⣝⣄⠈⡓⠬⣷⣡⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠘⣉⣉⠠⣤⣇⠀⢋⠛⢃⣌⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠹⣿⠃⠈⠁⠀⠈⢶⣿⠹⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-16 pt-6 sm:px-8">
        <SiteHeader />
        <section className="flex flex-col items-center pt-6 sm:pt-10">
          <div className="flex w-full min-w-0 flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-12 md:gap-16 lg:gap-20">
            <pre
              aria-hidden="true"
              className="shrink-0 whitespace-pre font-mono text-[9px] leading-[0.8] text-foreground/92 sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[26px]"
            >
              {fawwwnnnnnnn}
            </pre>
            <div className="flex w-full min-w-0 max-w-md flex-col gap-3 sm:max-w-lg sm:gap-4">
              <p className="font-mono text-[17px] font-bold tracking-[0.12em] text-foreground/90 sm:text-[22px] sm:tracking-[0.14em] md:text-[26px] lg:text-[30px]">
                hellow! i am rafan (ra-fawn)!
              </p>
              <div className="font-(family-name:--font-space-mono) text-[12px] font-normal leading-relaxed tracking-[0.02em] text-foreground/60 sm:text-[12px] md:text-[13px]">
                <p>
                  data engineering intern working on agile delivery automation &
                  applied ai @ truist
                </p>
                <p className="my-3">based in charlotte nc</p>
                <div>
                  <strong className="font-bold text-foreground/70">
                    currently learning:
                  </strong>
                </div>
                <ul className="ml-5 list-disc font-normal">
                  <li>ml (nlp, rl)</li>
                  <li>mathematics</li>
                  <li>security 4 ai </li>
                  <li>日本語 !!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 w-full min-w-0 sm:mt-20">
            <ContributionGraph username={siteConfig.githubUsername} />
          </div>
        </section>
      </div>
    </main>
  );
}
