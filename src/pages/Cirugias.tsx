import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { CTAButton } from '../components/CTAButton';
import { PageHero } from '../components/PageHero';
import { Callout } from '../components/Callout';
import { SURGERIES } from '../data/content';
import { useReveal } from '../hooks/useReveal';

export default function Cirugias() {
  const location = useLocation();

  const [active, setActive] = useState(() => {
    return getSelectedSurgeryId() ?? SURGERIES[0].id;
  });

  useEffect(() => {
    const selected = getSelectedSurgeryId();
    if (selected) setActive(selected);
  }, [location.search, location.hash]);

  const current = SURGERIES.find((s) => s.id === active) ?? SURGERIES[0];
  const hasDetailContent = Boolean(
    current.steps || current.subParts || current.options || current.callout || current.reference,
  );

  return (
    <>
      <PageHero
        title="Cirugías en REDEP"
        titleSize="small"
        subtitle="Realizadas por equipo de referencia especializado en mínima invasión."
      />

      {/* Topic selector + detail */}
      <section className="pb-16 md:pb-24">
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
                    <h2 className="text-2xl font-semibold leading-tight text-ink-900 md:text-3xl">
                      {current.detailTitle ?? current.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-ink-600">{current.intro}</p>
                  </div>
                </div>

                {hasDetailContent && (
                  <div className="border-t border-sand-200 p-7 md:p-10">
                  {/* Endometriosis: 6-step journey */}
                  {current.steps && <StepJourney steps={current.steps} />}

                  {/* Histerectomía: sub-parts */}
                  {current.subParts && (
                    <div className="grid gap-5 md:grid-cols-3">
                      {current.subParts.map((part) => (
                        <div key={part.title} className="rounded-2xl p-5 ring-1 ring-sand-200">
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
                        <div key={opt.title} className="rounded-2xl p-6 ring-1 ring-sand-200">
                          <div className="mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-sage-600" />
                            <h3 className="font-display text-lg font-semibold text-sage-800">{opt.title}</h3>
                          </div>
                          <p className="text-sm leading-relaxed text-ink-600">{opt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {current.id === 'endometriosis-multidisciplinaria' && (
                    <div className="mt-8 max-w-3xl space-y-3">
                      <p className="font-semibold leading-relaxed text-ink-900">
                        No toda endometriosis se opera. El tratamiento médico resuelve muchos casos; la cirugía se
                        reserva para indicaciones precisas, en un equipo especializado.
                      </p>
                      <p className="leading-relaxed text-ink-600">
                        Cirugías realizadas por el Dr. Mauricio Correa junto a un equipo de referencia: ginecología,
                        urología, coloproctología y cirugía de pared.
                      </p>
                    </div>
                  )}

                  {current.id === 'histerectomia' && current.callout && (
                    <p className="mt-8 max-w-3xl leading-relaxed text-ink-600">{current.callout}</p>
                  )}

                  {/* Callouts + reference */}
                  {current.callout && !['endometriosis-multidisciplinaria', 'histerectomia'].includes(current.id) && (
                    <div className="mt-8">
                      <Callout variant="note" title="Nota destacada">
                        {current.callout}
                      </Callout>
                    </div>
                  )}
                  {current.reference && (
                    <div className="mt-10">
                      <Callout
                        variant="reference"
                        title={current.reference.label}
                        className="[&_a]:text-base [&_div:last-child]:text-base [&_p]:mb-2 [&_p]:text-lg"
                      >
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
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SurgeryContactCTA />

      {/* Hidden anchors preserve compatibility with direct hash links. */}
      <AnchorSections />
    </>
  );
}

function getSelectedSurgeryId() {
  const params = new URLSearchParams(window.location.search);
  const selected = params.get('seleccion') ?? window.location.hash.replace('#', '');
  return SURGERIES.find((s) => s.id === selected)?.id;
}

function SurgeryContactCTA() {
  const { ref, visible } = useReveal();

  return (
    <section className="bg-sand-100 py-16 md:py-24">
      <div
        ref={ref}
        className={`reveal ${visible ? 'is-visible' : ''} container-page flex flex-col items-center text-center`}
      >
        <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-[#103F3F] sm:text-4xl">
          ¿Necesitas más información sobre una cirugía?
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          Escríbenos para revisar tu caso, resolver dudas y orientarte sobre los próximos pasos con nuestro equipo.
        </p>
        <div className="mt-8">
          <CTAButton to="/contacto">Contáctanos</CTAButton>
        </div>
      </div>
    </section>
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
          <li key={step.title} className="relative rounded-2xl p-5 ring-1 ring-sand-200">
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
 * Hidden anchor targets so direct hash links (#id) land somewhere valid.
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
