import { Linkedin, Star } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';
import { TEAM } from '../data/content';

export default function Equipo() {
  const director = TEAM.find((m) => m.featured) ?? TEAM[0];
  const rest = TEAM.filter((m) => !m.featured);

  return (
    <>
      <PageHero
        eyebrow="Equipo"
        title="Conoce a nuestros profesionales"
        subtitle="[Texto de relleno introductorio. Presentación del equipo multidisciplinario de REDEP Chile, compuesto por profesionales de ginecología, cirugía, psicología, nutrición, kinesioterapia de piso pélvico y matronería, que trabajan de forma coordinada para acompañar a cada paciente.]"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Featured director */}
          <FeaturedMember member={director} />

          {/* Rest of the team */}
          <div className="mt-16">
            <div className="mb-8 flex items-center gap-3">
              <span className="eyebrow">
                <span className="h-px w-6 bg-sage-400" aria-hidden />
                Equipo multidisciplinario
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((m) => (
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

function FeaturedMember({ member }: { member: Member }) {
  const { ref, visible } = useReveal();
  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} grid overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-sand-200 md:grid-cols-[0.85fr_1fr]`}
    >
      <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto">
        <img
          src={member.image}
          alt={member.imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-sage-600 px-3 py-1.5 text-xs font-semibold text-white shadow-soft">
          <Star className="h-3.5 w-3.5" />
          Director/a clínico/a
        </span>
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <h2 className="text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">{member.name}</h2>
        <p className="mt-2 font-display text-lg text-sage-700">{member.role}</p>
        <p className="mt-5 max-w-md leading-relaxed text-ink-600">{member.bio}</p>
        <div className="mt-6">
          <a
            href="#"
            aria-label={`Perfil profesional de ${member.name}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-ink-600 transition-colors hover:bg-sage-100 hover:text-sage-700"
          >
            <Linkedin className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: Member }) {
  const { ref, visible } = useReveal();
  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-1 hover:shadow-card hover:ring-sage-200`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={member.image}
          alt={member.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold leading-tight text-ink-900">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-sage-700">{member.role}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{member.bio}</p>
        <div className="mt-4">
          <a
            href="#"
            aria-label={`Perfil profesional de ${member.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-ink-500 transition-colors hover:bg-sage-100 hover:text-sage-700"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
