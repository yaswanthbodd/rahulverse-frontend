
import { Flame, Hash, Trophy, Sparkles } from "lucide-react";

export default function RightSidebar() {
  const trends = [
    { category: "Cricket", tag: "#IndianCricket", icon: Trophy },
    { category: "Batting", tag: "#TheArtOfBatting", icon: Flame },
    { category: "Community", tag: "#RahulVerse", icon: Sparkles },
  ];

  return (
    <aside className="flex w-full flex-col gap-5 py-5 pr-1">

      {/* RAHULVERSE INTRO CARD */}
      <section className="group relative overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="rv-accent" />

            <p className="text-[10px] font-black tracking-[0.2em] rv-accent">
              RAHULVERSE
            </p>
          </div>

          <h3 className="mt-4 text-xl font-black leading-snug rv-text">
            Every moment has a story.
          </h3>

          <p className="mt-3 text-xs leading-6 rv-secondary">
            Share your thoughts, celebrate the game and connect
            with a community that never stops moving.
          </p>

          <div className="mt-4 h-1 w-12 rounded-full bg-[var(--accent)] transition-all duration-300 group-hover:w-20" />
        </div>
      </section>

      {/* TRENDING TOPICS */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">

        <div className="mb-3 flex items-center gap-2 px-1">
          <Flame size={17} className="rv-accent" />

          <h3 className="text-sm font-bold rv-text">
            Trending Topics
          </h3>
        </div>

        <div className="space-y-1">
          {trends.map((trend, index) => {
            const Icon = trend.icon;

            return (
              <div
                key={trend.tag}
                className="group cursor-default rounded-xl px-3 py-3 transition-all duration-200 hover:translate-x-1 hover:bg-[var(--surface-hover)]"
                style={{
                  animation: `rvSlideUp 350ms ease-out ${index * 80}ms both`,
                }}
              >
                <div className="flex items-center gap-2 text-[11px] rv-muted">
                  <Icon
                    size={13}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>{trend.category}</span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold rv-text">
                  <Hash size={14} className="rv-accent" />
                  <span className="transition-colors group-hover:rv-accent">
                    {trend.tag.replace("#", "")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMUNITY CARD */}
      <section className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
            <Sparkles size={16} className="rv-accent" />
          </div>

          <p className="text-xs font-bold rv-text">
            Your space. Your voice.
          </p>
        </div>

        <p className="mt-3 text-xs leading-6 rv-secondary">
          Follow people, publish posts and join conversations.
          Make every moment count.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="px-2 pb-4">
        <p className="text-[10px] leading-5 rv-muted">
          © 2026 RahulVerse. The game goes on.
        </p>
      </footer>
    </aside>
  );
}
