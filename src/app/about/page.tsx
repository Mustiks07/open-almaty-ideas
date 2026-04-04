import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-bg pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.3em] uppercase mb-6">Жоба туралы</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Open <span className="text-gradient">Almaty</span> Ideas
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Алматы қаласының тұрғындарына арналған заманауи цифрлық платформа
          </p>
        </div>
      </section>

      {/* Миссия */}
      <section className="section-dark py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Миссиямыз</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">Азаматтардың дауысын естірту</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Open Almaty Ideas — азаматтардың қалалық басқару процесіне белсенді қатысуын қамтамасыз ететін платформа. 
                Біз тұрғындар мен жергілікті атқарушы органдар арасындағы тиімді кері байланысты қалыптастырамыз.
              </p>
              <p className="text-white/50 leading-relaxed">
                Платформа қалалық инфрақұрылым, экология, көлік, қауіпсіздік және басқа да әлеуметтік маңызды 
                салалар бойынша тұрғындардың ұсыныстарын жинауға және талдауға мүмкіндік береді.
              </p>
            </div>
            <div>
              <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Мақсатымыз</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">Қаланы бірге дамыту</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Платформаның негізгі мақсаты — Алматы қаласының тұрғындарын қалалық мәселелерді шешу процесіне тарту 
                және олардың ұсыныстары негізінде тиімді шешім қабылдауға мүмкіндік жасау.
              </p>
              <p className="text-white/50 leading-relaxed">
                Цифрлық технологияларды пайдалану арқылы қоғамдық пікірді жүйелеу және оны шешім қабылдау процесінде қолдану.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Салалар */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Салалар</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-12">Қандай салалар қамтылады?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🚗", name: "Көлік" }, { icon: "🌿", name: "Экология" },
              { icon: "🏗️", name: "Инфрақұрылым" }, { icon: "🛡️", name: "Қауіпсіздік" },
              { icon: "📚", name: "Білім" }, { icon: "🏥", name: "Денсаулық сақтау" },
              { icon: "⚽", name: "Мәдениет және спорт" }, { icon: "📋", name: "Басқа" },
            ].map((cat) => (
              <div key={cat.name} className="glass rounded-xl p-5 text-center hover-lift group cursor-default">
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="text-white font-medium text-sm">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Қалай жұмыс істейді */}
      <section className="section-dark py-24 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Қадамдар</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-16">Қалай жұмыс істейді?</h2>
          <div className="space-y-8">
            {[
              { step: "01", title: "Тіркеліңіз", desc: "Аты-жөніңіз бен email-ді енгізіп, платформаға тіркеліңіз" },
              { step: "02", title: "Ұсыныс жазыңыз", desc: "Ауданыңызды, санатты таңдап, идеяңызды толық жазыңыз. Фото мен видео қосуға болады" },
              { step: "03", title: "Бағалаңыз", desc: "Басқа тұрғындардың идеяларына лайк немесе дизлайк қойыңыз" },
              { step: "04", title: "Нәтиже көріңіз", desc: "Ең үздік идеялар админ тарапынан қаралып, іске асырылады" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <span className="text-brand-400 font-heading font-bold text-xl">{item.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">Дайынсыз ба?</h2>
          <p className="text-white/40 mb-10">Бүгін тіркеліп, Алматының болашағына үлес қосыңыз</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-brand-500 hover:bg-brand-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-brand-500/25 hover:-translate-y-1">
              Тіркелу
            </Link>
            <Link href="/proposals" className="glass text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10">
              Ұсыныстарды көру
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}