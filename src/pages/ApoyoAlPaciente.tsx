import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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

          {/* Resource grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r) => (
              <ResourceCard key={r.title} resource={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceCard({ resource }: { resource: (typeof RESOURCES)[number] }) {
  const { ref, visible } = useReveal();
  const location = useLocation();
  const isInternalLink = resource.href.startsWith('/');
  const linkClassName =
    'mt-5 inline-flex items-center gap-2 self-start rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-700';

  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-1 hover:shadow-card hover:ring-sage-200`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
        <img
          src={resource.image}
          alt={resource.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">{resource.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{resource.description}</p>
        {isInternalLink ? (
          <Link to={resource.href} state={{ from: location.pathname }} className={linkClassName}>
            {resource.cta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {resource.cta}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
