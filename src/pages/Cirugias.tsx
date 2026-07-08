import { useEffect, useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Callout } from '../components/Callout';
import { SURGERIES } from '../data/content';

export default function Cirugias() {
  const [active, setActive] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return SURGERIES.find((s) => s.id === hash)?.id ?? SURGERIES[0].id;
  });

  // Sync active topic when the hash changes (e.g. deep link from Home)
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace('#', '');
      if (id && SURGERIES.some((s) => s.id === id)) setActive(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const current = SURGERIES.find((s) => s.id === active) ?? SURGERIES[0];

  return (
    <>
      <PageHero
        eyebrow="Cirugías"
        title="Cirugías en REDEP"
        subtitle="[Texto de relleno introductorio. Descripción general del enfoque quirúrgico del equipo REDEP, enfatizando la decisión compartida y el carácter personalizado de cada intervención.]"
      />

      {/* Topic selector + detail */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
            {/* Side nav */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Temas</p>
              <nav className="flex flex-row flex-wrap gap-2 lg:flex-col">
                {SURGERIES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(s.id)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      active === s.id
                        ? 'bg-sage-600 text-white shadow-soft'
                        : 'bg-white text-ink-700 ring-1 ring-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                        active === s.id ? 'bg-white/20 text-white' : 'bg-sage-100 text-sage-700'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug">{s.title}</span>
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
                  <div className="p-7 md:p-10">
                    <h2 className="text-2xl font-semibold leading-tight text-ink-900 md:text-3xl">{current.title}</h2>
                    <p className="mt-4 leading-relaxed text-ink-600">{current.intro}</p>
                  </div>
                </div>

                <div className="border-t border-sand-200 p-7 md:p-10">
                  {/* Endometriosis: 6-step journey */}
                  {current.steps && <StepJourney steps={current.steps} />}

                  {/* Histerectomía: sub-parts */}
                  {current.subParts && (
                    <div className="grid gap-5 md:grid-cols-3">
                      {current.subParts.map((part) => (
                        <div key={part.title} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-sand-200">
                          <h3 className="font-display text-lg font-semibold text-sage-800">{part.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-600">{part.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preservación uterina: two options */}
                  {current.options && (
                    <div className="grid gap-5 md:grid-cols-2">
                      {current.options.map((opt) => (
                        <div key={opt.title} className="rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200">
                          <div className="mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-sage-600" />
                            <h3 className="font-display text-lg font-semibold text-sage-800">{opt.title}</h3>
                          </div>
                          <p className="text-sm leading-relaxed text-ink-600">{opt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Callouts + reference */}
                  {current.callout && (
                    <div className="mt-8">
                      <Callout variant="note" title="Nota destacada">
                        {current.callout}
                      </Callout>
                    </div>
                  )}
                  {current.reference && (
                    <div className="mt-5">
                      <Callout variant="reference" title={current.reference.label}>
                        <a
                          href={current.reference.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline"
                        >
                          {current.reference.text}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </Callout>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anchored sections for deep links from Home (also rendered as a fallback list) */}
      <AnchorSections />
    </>
  );
}

function StepJourney({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="eyebrow">
          Recorrido del paciente
        </span>
      </div>
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl bg-sand-50 p-5 ring-1 ring-sand-200">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-600 font-display text-sm font-semibold text-white shadow-soft">
                {i + 1}
              </span>
              <h3 className="font-display text-base font-semibold leading-tight text-ink-900">{step.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{step.text}</p>
            {i < steps.length - 1 && (
              <span className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sage-600 shadow-soft ring-1 ring-sand-200 md:flex">
                <ArrowRight className="h-3 w-3" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Hidden anchor targets so deep links from the Home page (#id) land somewhere valid.
 * The interactive selector above is the primary UI; these ensure hash navigation works.
 */
function AnchorSections() {
  return (
    <div className="sr-only" aria-hidden>
      {SURGERIES.map((s) => (
        <div key={s.id} id={s.id}>
          {s.title}
        </div>
      ))}
    </div>
  );
}
