import { useEffect, useState } from 'react';
import { Eye, Stethoscope, Microscope, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { CTAButton } from '../components/CTAButton';
import { CLINICAL_PROBLEMS } from '../data/content';

const SECTION_ICONS: Record<string, typeof Eye> = {
  Señales: Eye,
  Diagnóstico: Microscope,
  'Qué hacemos': Stethoscope,
};

export default function ProblemasClinicos() {
  const [active, setActive] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return CLINICAL_PROBLEMS.find((p) => p.id === hash)?.id ?? CLINICAL_PROBLEMS[0].id;
  });

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace('#', '');
      if (id && CLINICAL_PROBLEMS.some((p) => p.id === id)) setActive(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const current = CLINICAL_PROBLEMS.find((p) => p.id === active) ?? CLINICAL_PROBLEMS[0];

  return (
    <>
      <PageHero
        eyebrow="Problemas Clínicos"
        title="Problemas clínicos"
        subtitle="Evaluación especializada para tu condición"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-600">
            [Texto de relleno introductorio. Invita a la paciente a seleccionar su problema clínico
            principal para conocer las señales, el abordaje diagnóstico y el enfoque terapéutico del
            equipo REDEP.]
          </p>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* Selector list */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                Selecciona un problema
              </p>
              <nav className="flex flex-row flex-wrap gap-2 lg:flex-col">
                {CLINICAL_PROBLEMS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p.id)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      active === p.id
                        ? 'bg-sage-600 text-white shadow-soft'
                        : 'bg-white text-ink-700 ring-1 ring-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                        active === p.id ? 'bg-white/20 text-white' : 'bg-sage-100 text-sage-700'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug">{p.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Detail panel */}
            <div key={current.id} className="animate-fade-in">
              <div className="overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-sand-200">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                    <img
                      src={current.image}
                      alt={current.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <h2 className="text-2xl font-semibold leading-tight text-ink-900 md:text-3xl">
                      {current.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-ink-600">{current.description}</p>
                  </div>
                </div>

                {/* Sub-points: Señales / Diagnóstico / Qué hacemos */}
                <div className="border-t border-sand-200 p-7 md:p-10">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {current.sections.map((sec) => {
                      const Icon = SECTION_ICONS[sec.title] ?? Eye;
                      return (
                        <div key={sec.title} className="rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200">
                          <div className="mb-3 flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                              <Icon className="h-4.5 w-4.5" />
                            </span>
                            <h3 className="font-display text-lg font-semibold text-sage-800">{sec.title}</h3>
                          </div>
                          <p className="text-sm leading-relaxed text-ink-600">{sec.text}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-sage-50 p-5 ring-1 ring-sage-200">
                    <p className="text-sm text-ink-700">
                      [Texto de relleno. Invita a la paciente a solicitar una evaluación especialada para
                      su condición.]
                    </p>
                    <CTAButton to="/contacto" className="ml-auto">
                      Solicitar evaluación
                      <ArrowRight className="h-4 w-4" />
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden anchors for deep links */}
      <div className="sr-only" aria-hidden>
        {CLINICAL_PROBLEMS.map((p) => (
          <div key={p.id} id={p.id}>
            {p.title}
          </div>
        ))}
      </div>
    </>
  );
}
