import SiteHeader from "@/components/site-header";

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
        <section className="flex flex-1 items-start justify-center pt-6 sm:pt-10">
          <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            <pre
              aria-hidden="true"
              className="whitespace-pre font-mono text-[11px] leading-[0.8] text-foreground/92 sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[26px]"
            >
              {fawwwnnnnnnn}
            </pre>

            <div className="flex max-w-md flex-col gap-3 sm:max-w-lg sm:gap-4">
              <p className="font-mono text-[19px] font-bold tracking-[0.14em] text-foreground/90 sm:text-[22px] md:text-[26px] lg:text-[30px]">
                hellow! i am rafan (ra-fawn)!
              </p>
              <p className="font-(family-name:--font-space-mono) text-[11px] leading-relaxed tracking-[0.02em] text-foreground/60 sm:text-[12px] md:text-[13px]">
                interning @ truist & based in charlotte, nc, usa! learning machine learning (nlp, comp. vision, rl), data engineering, operations research, computational finance and mathematics. currently working on undergraduate thesis related to reinforcement learning in dynamic environments 
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
