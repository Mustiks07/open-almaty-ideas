import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import { prisma } from "@/lib/prisma";
import AlmatyMap from "@/components/AlmatyMap";
export const revalidate = 30;

async function getStats() {
  const [proposalCount, userCount, voteCount] = await Promise.all([
    prisma.proposal.count(),
    prisma.user.count(),
    prisma.vote.count(),
  ]);
  return { proposalCount, userCount, voteCount };
}

async function getTopProposals() {
  return prisma.proposal.findMany({
    take: 3,
    orderBy: { likesCount: "desc" },
    include: {
      author: { select: { name: true } },
      district: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
}

async function getDistrictCounts() {
  const districts = await prisma.district.findMany({
    include: { _count: { select: { proposals: true } } },
  });
  return districts.map((d) => ({ name: d.name, count: d._count.proposals }));
}

export default async function HomePage() {
  const stats = await getStats();
  const topProposals = await getTopProposals();
  const districtCounts = await getDistrictCounts();

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Фон суреті */}
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-20">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.3em] uppercase mb-8 animate-fade-up">
            Алматы қаласының тұрғындарына арналған заманауи цифрлық платформа
          </p>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] animate-fade-up-delay">
            <span className="text-white">Open</span>{" "}
            <span className="text-gradient">Almaty</span>
            <br />
            <span className="text-white/90 text-4xl md:text-5xl lg:text-6xl">Ideas</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-4 font-light animate-fade-up-delay-2">
            Алматы қаласын бірге жақсартайық
          </p>

          <p className="text-base text-white/40 mb-12 max-w-2xl mx-auto animate-fade-up-delay-2">
            Бұл платформа Алматы қаласының тұрғындарына өз ұсыныстарын
            енгізуге, басқа идеяларды бағалауға және қаланы дамытуға мүмкіндік береді
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-count-up">
            <Link
              href="/proposals/new"
              className="bg-brand-500 hover:bg-brand-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-brand-500/25 hover:-translate-y-1"
            >
              Ұсыныс қосу
            </Link>
            <Link
              href="/proposals"
              className="glass text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10"
            >
              Барлық ұсыныстар
            </Link>
          </div>
        </div>

      {/* Scroll indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-dark py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: stats.proposalCount, label: "Ұсыныстар" },
              { value: stats.userCount, label: "Қатысушылар" },
              { value: stats.voteCount, label: "Дауыстар" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">
            Мүмкіндіктер
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Не істей аласыз?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Идея ұсыныңыз", desc: "Қала өміріне қатысты ұсынысыңызды жазыңыз", iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
              { title: "Бағалаңыз", desc: "Басқа тұрғындардың ұсыныстарын бағалаңыз", iconPath: "M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" },
              { title: "Үздіктерді көріңіз", desc: "Ең көп дауыс жинаған идеяларды қараңыз", iconPath: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" },
              { title: "Үлес қосыңыз", desc: "Қаланың дамуына белсенді қатысыңыз", iconPath: "M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-8 text-center hover-lift cursor-default group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all">
                  <svg className="w-7 h-7 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-3 text-lg">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top proposals */}
      {topProposals.length > 0 && (
        <section className="section-dark py-24 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">
              Рейтинг
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-white mb-16">
              Ең танымал ұсыныстар
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topProposals.map((proposal, i) => (
                <Link key={proposal.id} href={`/proposals/${proposal.id}`} className="block">
                  <div className="glass rounded-2xl p-7 hover-lift group">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                        <span className="text-brand-400 font-heading font-bold text-lg">#{i + 1}</span>
                      </div>
                      <span className="text-xs bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full border border-brand-500/20">
                        {proposal.category.name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-3 text-lg group-hover:text-brand-400 transition-colors">
                      {proposal.title}
                    </h3>
                    <p className="text-white/40 text-sm mb-5 line-clamp-2">
                      {proposal.description.replace(/<[^>]*>/g, "")}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/30">{proposal.district.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-400">👍 {proposal.likesCount}</span>
                        <span className="text-red-400/60">👎 {proposal.dislikesCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/top" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Барлық үздік идеяларды көру →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Districts map */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">
            Аудандар
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Алматы қаласы
          </h2>
          <p className="text-center text-white/40 mb-16">
            Ауданды басып, сол аудандағы ұсыныстарды көріңіз
          </p>

          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <AlmatyMap districts={districtCounts} />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {districtCounts.map((d) => (
                <Link
                  key={d.name}
                  href={`/proposals?district=${encodeURIComponent(d.name)}`}
                  className="glass rounded-xl p-5 hover-lift group"
                >
                  <div className="font-medium text-white group-hover:text-brand-400 transition-colors">
                    {d.name.replace(" ауданы", "")}
                  </div>
                  <div className="text-xs text-white/30 mt-1">{d.count} ұсыныс</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    <CtaSection />
    </div>
  );
}