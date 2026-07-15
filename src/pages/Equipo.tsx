// Uncomment when the team members' LinkedIn profile URLs are available.
// import { Linkedin } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';
import { TEAM } from '../data/content';

export default function Equipo() {
  return (
    <>
      <PageHero
        title="Conoce a nuestros profesionales"
        titleSize="small"
        subtitle="Equipo experto, especializado y multidisciplinario, comprometido con una atención integral y una toma de decisiones compartida."
      />

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEAM.map((m) => (
                <MemberCard key={m.name} member={m} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type Member = (typeof TEAM)[number];

function MemberCard({ member }: { member: Member }) {
  const { ref, visible } = useReveal();
  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-transform duration-300 lg:hover:-translate-y-1 ${member.featured ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''}`}
    >
      <div className={member.featured ? 'sm:flex sm:items-center' : ''}>
        <div className={`relative w-full overflow-hidden ${member.featured ? 'aspect-square sm:aspect-auto' : 'aspect-square'}`}>
          <picture className={member.featured ? 'block h-full w-full sm:h-auto' : 'block h-full w-full'}>
            {member.mobileImage && <source media="(min-width: 640px)" srcSet={member.image} />}
            <img
              src={member.mobileImage ?? member.image}
              alt={member.imageAlt}
            className={member.featured
              ? 'h-full w-full object-cover sm:block sm:h-auto'
              : 'h-full w-full object-cover transition-transform duration-500 lg:group-hover:scale-105'}
              loading="lazy"
            />
          </picture>
          <div
            className="pointer-events-none absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-0"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className={`flex flex-1 flex-col p-5 ${member.featured ? 'sm:justify-center sm:p-8' : ''}`}>
        <h3 className="font-display text-base font-semibold leading-tight text-ink-900">{member.name}</h3>
        <p className={`mt-1 text-sm font-medium text-sage-700 ${member.featured ? 'uppercase tracking-wide' : ''}`}>
          {member.role}
        </p>
        <div className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 [&_a]:font-medium [&_a]:text-sage-700 [&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink-800 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {member.bio}
        </div>
        {/* Uncomment this section when the team members' LinkedIn profile URLs are available.
        <div className="mt-4">
          <a
            href="#"
            aria-label={`Perfil profesional de ${member.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-ink-500 transition-colors hover:bg-sage-100 hover:text-sage-700"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
        */}
      </div>
    </article>
  );
}
