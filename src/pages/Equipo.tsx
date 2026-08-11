import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';
import { TEAM } from '../data/content';

type Member = (typeof TEAM)[number];

export default function Equipo() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openMember = (member: Member, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedMember(member);
  };

  const closeMember = useCallback(() => {
    setSelectedMember(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <>
      <PageHero
        title="Conoce a nuestros profesionales"
        titleSize="small"
        subtitle="Equipo experto, especializado y multidisciplinario, comprometido con una atención integral y una toma de decisiones compartida."
      />

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEAM.map((member) => (
              <MemberCard key={member.name} member={member} onSelect={openMember} />
            ))}
          </div>
        </div>
      </section>

      {selectedMember && <MemberModal member={selectedMember} onClose={closeMember} />}
    </>
  );
}

function MemberCard({
  member,
  onSelect,
}: {
  member: Member;
  onSelect: (member: Member, trigger: HTMLButtonElement) => void;
}) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <article ref={ref} className={`reveal ${visible ? 'is-visible' : ''} h-full`}>
      <button
        type="button"
        onClick={(event) => onSelect(member, event.currentTarget)}
        aria-haspopup="dialog"
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-soft ring-1 ring-sand-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-sage-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-4"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={member.mobileImage ?? member.image}
            alt={member.imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-black/15 transition-opacity duration-300 group-hover:opacity-0"
            aria-hidden="true"
          />
        </div>

        <div className="flex min-h-24 w-full flex-1 flex-col justify-center p-5">
          <h3 className="font-display text-base font-semibold leading-tight text-ink-900">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-sage-700">{member.role}</p>
        </div>
      </button>
    </article>
  );
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-900/60 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-member-modal-title"
        aria-describedby="team-member-modal-content"
        className="relative max-h-[100dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-lift sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`Cerrar perfil de ${member.name}`}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink-700 shadow-soft ring-1 ring-sand-200 backdrop-blur-sm transition-colors hover:bg-sand-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex items-center bg-sand-100 p-4 sm:p-6 md:min-h-full md:p-8">
            <div className="aspect-square w-full overflow-hidden rounded-full shadow-soft ring-1 ring-sand-200">
              <img
                src={member.mobileImage ?? member.image}
                alt={member.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <p className="eyebrow">Nuestro equipo</p>
            <h2 id="team-member-modal-title" className="mt-3 pr-12 font-display text-3xl font-semibold leading-tight text-ink-900">
              {member.name}
            </h2>
            <p className="mt-2 text-base font-semibold text-sage-700">{member.role}</p>

            <div className="my-6 h-px bg-sand-200" aria-hidden="true" />

            <div
              id="team-member-modal-content"
              className="text-sm leading-relaxed text-ink-600 sm:text-base [&_a]:font-medium [&_a]:text-sage-700 [&_a]:underline [&_a]:decoration-sage-300 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-sage-900 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink-800 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
            >
              {member.bio}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
