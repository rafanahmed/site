import Link from "next/link";
import Image from "next/image";
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

function LandingPhoto({
  src,
  alt,
  className = "",
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 34vw, (min-width: 768px) 42vw, calc(100vw - 48px)"
        className="h-auto w-full rounded-sm"
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8">
        <SiteHeader />
        <p className="pt-5 font-mono text-[12px] font-bold uppercase leading-relaxed tracking-[0.16em] text-foreground/78 sm:text-[13px]">
          RAFAN AHMED - incoming applied AI @{" "}
          <a
            href="https://www.truist.com/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-foreground/35 underline-offset-4 transition hover:decoration-foreground"
          >
            Truist
          </a>{" "}
          , CS Graduate @ UNC Charlotte
        </p>
        <section className="pt-7 sm:pt-12">
          <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
            <pre
              aria-hidden="true"
              className="mt-16 justify-self-center whitespace-pre font-mono text-[9px] leading-[0.8] text-foreground/92 sm:mt-20 sm:text-[14px] md:text-[18px] lg:sticky lg:top-32 lg:mt-44 lg:justify-self-start lg:text-[18px] xl:text-[21px]"
            >
              {fawwwnnnnnnn}
            </pre>
            <div
              className="w-full min-w-0 text-[18px] leading-[1.72] text-foreground/86 sm:text-[20px]"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <div>
                <LandingPhoto
                  src="/landing/headset.jpg"
                  alt="Rafan wearing a sensor headset"
                  width={1206}
                  height={1606}
                  className="mx-auto mb-5 w-52 md:float-right md:mb-5 md:ml-7 md:mt-1 md:w-[34%] lg:w-[29%]"
                />
                <span>hellow!! my name is </span>
                <strong className="font-bold text-foreground">rafan ahmed</strong>
                <span> (pronounced like “ra-fawn”, get it!?)!</span>
                <div className="mt-4 border-l border-foreground/25 pl-5 text-[16px] leading-[1.68] text-foreground/74 sm:text-[18px]">
                  <p>
                    i am a natural lover, i do believe. sometimes i whimsy and
                    frolic a bit too much, or i procure spectacles out of my
                    control, and sometimes i move like a realpolitik pragmatist,
                    to put it bluntly.
                  </p>
                  <p className="mt-4">
                    but, ultimately, i have a love for seeking gnosis. although
                    my perspective on this is highly anthropocentric, i truly
                    believe in, and do my best to, pursue and uphold rigor in the
                    cultivation of knowledge granted to humanity and in
                    humanity’s capacity to shape that knowledge over the
                    environment around us, whether that be for the betterment of
                    and connection with those i love and work with, alllll the
                    way to the things i build, develop and scale (like ai! i
                    like ai a lot, it’s what i spend much of my time thinking
                    about and building)!
                  </p>
                  <p className="mt-4">
                    i do best in contributing to and/or leading spaces through
                    which competence, passion &amp; humility are seen,
                    acknowledged, and loved. for others and myself to be given
                    the opportunity to cultivate and channel knowledge and
                    scaling in ways contributory to oneself and ultimately –
                    hopefully economically (active developments here) – to each
                    other!
                  </p>
                  <p className="mt-4">
                    i am a lover of building meaningful relationships with one
                    another. i am a lover of learning and implementing things of
                    rigor &amp; meaning, and i implement and espouse this onto
                    those who i have immense care for and work with.
                  </p>
                  <p className="mt-4">
                    <strong className="font-bold text-foreground">
                      tl;dr (why didn’t yew read it all mweh ;-;):
                    </strong>
                    <br />i am someone who embodies the fact that knowledge is
                    something humanity cultivates, and that rigor matters in
                    cultivating said knowledge; knowledge gives human beings
                    agency, and that agency should ultimately be directed toward
                    meaningful ends for oneself and each other.
                  </p>
                </div>
              </div>

              <div className="clear-both mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,0.92fr)_minmax(300px,0.68fr)] md:items-center">
                <p>
                  it was 2023, graduating early from highschool and moving to
                  japan, when two really, really, really important things
                  happened that changed the trajectory of what i wanted to
                  contribute to and put purpose towards in my work:
                </p>
                <LandingPhoto
                  src="/landing/cair-robot.png"
                  alt="Rafan at a Charlotte AI Research table with a mascot and a small robot"
                  width={722}
                  height={600}
                  className="w-full md:translate-y-5"
                />
              </div>

              <ol className="mt-5 list-decimal space-y-4 pl-7">
                <li>
                  gpt 4 released, and its capabilities absolutely fascinated me.
                  it marked my (relatively late) dive into the world of
                  technology, coming from a background of political science and
                  psychology at the time. during the dawn of its release, while
                  at a bar in kobe, a family friend convinced me to dive deep
                  into this new frontier of challenge and opportunity
                </li>
                <li>
                  i wanted to play call of duty black ops 3 without hackers and
                  with access to all of the weapons, and the boiii client,
                  created by{" "}
                  <a
                    href="https://github.com/momo5502"
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline decoration-foreground/35 underline-offset-4 transition hover:decoration-foreground"
                  >
                    momo5502
                  </a>
                  , was available through a $5 sponsor on github. although
                  activision sniped that repo, it remains{" "}
                  <a
                    href="https://github.com/rafanahmed?tab=achievements&achievement=public-sponsor"
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline decoration-foreground/35 underline-offset-4 transition hover:decoration-foreground"
                  >
                    the first project i ever sponsored
                  </a>{" "}
                  on the platform. im unsure why this was so impactful for me
                  then, but i know it somehow became a driver in my journey into
                  technology
                </li>
              </ol>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(260px,0.46fr)_minmax(0,1fr)] md:items-center">
                <LandingPhoto
                  src="/landing/group-meal.png"
                  alt="Rafan and friends sharing a meal"
                  width={634}
                  height={466}
                  className="w-full md:-ml-10"
                />
                <p>
                  fast forward, now i am an upcoming computer science graduate
                  this fall (as of 2026), incoming into{" "}
                  <a
                    href="https://www.truist.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline decoration-foreground/35 underline-offset-4 transition hover:decoration-foreground"
                  >
                    truist
                  </a>
                  ’s technology leadership development program doing applied ai
                  and leading a technical project with students at my university
                  writing kernels for tenstorrent’s ai accelerator card —
                  blackhole p100a — learning alongside them ;)
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,0.78fr)_minmax(210px,0.36fr)_minmax(170px,0.28fr)] md:items-start">
                <div>
                  <p>
                    i love, love, love, love, love writing. i have so many
                    drafts and i take forever to write as well, but i do have a{" "}
                    <Link
                      href="/blog"
                      className="text-foreground underline decoration-foreground/35 underline-offset-4 transition hover:decoration-foreground"
                    >
                      blog
                    </Link>
                    !
                  </p>
                  <LandingPhoto
                    src="/landing/bunny-silly-thing.jpg"
                    alt="A bunny standing at a microphone in a silly screenshot"
                    width={1170}
                    height={1191}
                    className="ml-auto mt-6 w-44 md:w-52"
                  />
                </div>
                <LandingPhoto
                  src="/landing/tedx.jpg"
                  alt="Rafan with two people at a TEDx event"
                  width={772}
                  height={838}
                  className="w-56 justify-self-start md:w-full md:translate-y-2"
                />
                <LandingPhoto
                  src="/landing/bunny-smirk.jpg"
                  alt="A round bunny with a small smirking face graphic beside it"
                  width={1179}
                  height={1188}
                  className="w-40 justify-self-end md:w-full md:translate-y-16"
                />
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[minmax(180px,0.26fr)_minmax(0,0.86fr)_minmax(180px,0.26fr)] md:items-center">
                <LandingPhoto
                  src="/landing/truist-program.jpg"
                  alt="Rafan with two people wearing Truist shirts"
                  width={1206}
                  height={1127}
                  className="w-48 md:w-full md:-translate-y-4"
                />
                <p>
                  my favorite animals are fawns and bunnies! if you like them
                  too, or you are also interested about my work and ai, feel free
                  to reach out!
                </p>
                <LandingPhoto
                  src="/landing/fawn-held.jpg"
                  alt="A small fawn being held"
                  width={1206}
                  height={1043}
                  className="w-56 justify-self-end md:w-full md:translate-y-2"
                />
              </div>

              <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.34fr)] md:items-end">
                <LandingPhoto
                  src="/landing/times-square.jpg"
                  alt="Rafan in Times Square"
                  width={1206}
                  height={894}
                  className="w-64 justify-self-start md:w-full"
                />
                <p className="text-right">~ rafan &gt;.&lt;</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
