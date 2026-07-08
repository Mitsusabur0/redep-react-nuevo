import { Linkedin } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';
import { TEAM } from '../data/content';

export default function Equipo() {
  const director = TEAM.find((m) => m.featured) ?? TEAM[0];
  const rest = TEAM.filter((m) => !m.featured);

  return (
    <>
      <PageHero
        title="Conoce a nuestros profesionales"
        titleSize="small"
        subtitle="Equipo experto, especializado y multidisciplinario, comprometido con una atención integral y una toma de decisiones compartida."
      />

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          {/* Featured director */}
          <FeaturedMember member={director} />

          {/* Rest of the team */}
          <div className="mt-16">
            <div className="mb-8 flex items-center gap-3">
              <span className="eyebrow">
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
      <div className="relative flex items-center justify-center overflow-hidden p-6 md:p-8">
        <img
          src={member.image}
          alt={member.imageAlt}
          className="h-auto max-h-[360px] w-auto max-w-full object-contain md:max-h-[440px]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <h2 className="text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">{member.name}</h2>
        <p className="mt-2 font-display text-lg text-sage-700">{member.role}</p>
        <div className="mt-5 max-w-md leading-relaxed text-ink-600 [&_a]:font-medium [&_a]:text-sage-700 [&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink-800 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {member.bio}
        </div>
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
        <div className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 [&_a]:font-medium [&_a]:text-sage-700 [&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink-800 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {member.bio}
        </div>
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
