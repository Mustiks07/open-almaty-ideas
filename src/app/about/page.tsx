import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-bg pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-950/80" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.3em] uppercase mb-6">Жоба туралы</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Open <span className="text-gradient">Almaty</span> Ideas
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Азаматтардың қалалық басқару процесіне белсенді қатысуын қамтамасыз ететін заманауи цифрлық платформа
          </p>
        </div>
      </section>

      {/* Сипаттама */}
      <section className="section-dark py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 md:p-12">
            <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Сипаттама</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">Open Almaty Ideas дегеніміз не?</h2>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                Open Almaty Ideas – азаматтардың қалалық басқару процесіне белсенді қатысуын қамтамасыз ететін заманауи цифрлық платформа. Жүйе тұрғындар мен жергілікті атқарушы органдар арасындағы тиімді кері байланысты қалыптастыруға бағытталған.
              </p>
              <p>
                Платформа қалалық инфрақұрылым, экология, көлік, қауіпсіздік және басқа да әлеуметтік маңызды салалар бойынша тұрғындардың ұсыныстарын жинауға, талдауға және жүйелеуге мүмкіндік береді.
              </p>
              <p>
                Цифрлық технологияларды қолдану арқылы қоғамдық пікір шешім қабылдау процесіне енгізіледі.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Миссия + Мақсат */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8">
              <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Миссиямыз</p>
              <h2 className="font-heading text-2xl font-bold text-white mb-6">Азаматтардың дауысын естірту</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Open Almaty Ideas — азаматтардың қалалық басқару процесіне белсенді қатысуын қамтамасыз ететін платформа.
              </p>
              <p className="text-white/50 leading-relaxed">
                Біз тұрғындар мен жергілікті атқарушы органдар арасындағы тиімді кері байланысты қалыптастырамыз.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Мақсатымыз</p>
              <h2 className="font-heading text-2xl font-bold text-white mb-6">Қаланы бірге дамыту</h2>
              <p className="text-white/50 leading-relaxed mb-4">
                Платформаның негізгі мақсаты — Алматы қаласының тұрғындарын қалалық мәселелерді шешу процесіне тарту.
              </p>
              <p className="text-white/50 leading-relaxed">
                Олардың ұсыныстары негізінде тиімді шешім қабылдауға мүмкіндік жасау.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Өзектілігі */}
      <section className="section-dark py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Өзектілік</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-6">Жобаның өзектілігі</h2>
          <p className="text-center text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed">
            Қазіргі таңда цифрландыру мемлекеттік басқару жүйесінің ажырамас бөлігіне айналып отыр. Әсіресе, өңірлік деңгейде басқару тиімділігін арттыру, азаматтардың шешім қабылдау процесіне қатысуын кеңейту және мемлекеттік органдар қызметінің ашықтығын қамтамасыз ету өзекті мәселелердің бірі болып табылады.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Мемлекеттік басқаруды цифрландыру қажеттілігі",
              "Азаматтардың шешім қабылдау процесіне қатысу деңгейінің жеткіліксіздігі",
              "Тұрғындар мен мемлекеттік органдар арасындағы кері байланыстың әлсіздігі",
              "Деректерге негізделген басқару моделіне көшу қажеттілігі",
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-400 font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ғылыми жаңалығы */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Инновация</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-12">Жобаның ғылыми жаңалығы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Цифрлық жинау", desc: "Азаматтардың ұсыныстарын цифрлық форматта жинау және талдау механизмі ұсынылды" },
              { icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", title: "Деректерге негіздеу", desc: "Мемлекеттік басқаруда деректерге негізделген шешім қабылдау үлгісі қалыптастырылды" },
              { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", title: "Цифрлық платформа", desc: "Өңірлік деңгейде цифрлық қатысу платформасының моделі әзірленді" },
              { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "Интерактивті байланыс", desc: "Тұрғындар мен мемлекеттік органдар арасындағы интерактивті байланыс жүйесі енгізілді" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-7 hover-lift group">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors">
                  <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Салалар */}
      <section className="section-dark py-24 border-y border-white/5">
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

      {/* Күтілетін нәтижелер */}
      <section className="bg-dark-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Нәтижелер</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-12">Күтілетін нәтижелер</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { value: "↑", label: "Азаматтардың мемлекеттік басқаруға қатысу деңгейі артады" },
              { value: "↑", label: "Мемлекеттік органдардың ашықтығы мен есептілігі күшейеді" },
              { value: "↑", label: "Шешім қабылдау сапасы жақсарады" },
              { value: "↑", label: "Қалалық мәселелерді шешу тиімділігі артады" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-400 text-xl font-bold">{item.value}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Практикалық маңызы */}
      <section className="section-dark py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-4">Практика</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-white mb-12">Практикалық маңызы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Мемлекеттік органдар үшін", desc: "Жергілікті атқарушы органдар үшін шешім қабылдау құралы" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Азаматтар үшін", desc: "Өз пікірін білдіру алаңы және қалалық мәселелерді шешуге қатысу мүмкіндігі" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Масштабтау", desc: "Жоба Қазақстанның басқа өңірлерінде де қолдануға бейімделуі мүмкін" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-7 text-center hover-lift group">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-500/20 transition-colors">
                  <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Қалай жұмыс істейді */}
      <section className="bg-dark-950 py-24">
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
      <section className="section-dark py-24 border-t border-white/5">
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