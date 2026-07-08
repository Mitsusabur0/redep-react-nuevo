import { Box, ArrowUpRight, BookOpen } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';
import { RESOURCES } from '../data/content';

export default function ApoyoAlPaciente() {
  return (
    <>
      <PageHero
        title="Biblioteca de recursos para diagnóstico, cirugía y rehabilitación"
        titleSize="small"
        subtitle="Material educativo de referencia para preparar consultas, comprender procedimientos y acompañar el manejo del dolor."
      />

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="mb-10 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sage-600" />
            <span className="eyebrow">Recursos disponibles</span>
          </div>

          {/* Extensible grid — currently one card, designed to hold many more */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r) => (
              <ResourceCard key={r.title} resource={r} />
            ))}

            {/* Placeholder "coming soon" card to communicate extensibility */}
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sand-300 bg-sand-50/50 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-200 text-ink-400">
                <Box className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-medium text-ink-500">Más recursos próximamente</p>
              <p className="mt-1 text-xs text-ink-400">[Espacio reservado para nuevos materiales]</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceCard({ resource }: { resource: (typeof RESOURCES)[number] }) {
  const { ref, visible } = useReveal();
  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-1 hover:shadow-card hover:ring-sage-200`}
    >
      {/* Thumbnail placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-sage-700 backdrop-blur-sm">
            <Box className="h-7 w-7" />
          </span>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-sage-700 backdrop-blur-sm">
          Recurso
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">{resource.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{resource.description}</p>
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-700"
        >
          {resource.cta}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
