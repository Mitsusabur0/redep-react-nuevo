import { type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  const { ref, visible } = useReveal();
  return (
    <section className="relative overflow-hidden bg-grain pt-28 pb-14 md:pt-36 md:pb-20">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage-200/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-clay-200/30 blur-3xl" aria-hidden />
      <div
        ref={ref}
        className={`reveal ${visible ? 'is-visible' : ''} container-page relative`}
      >
        {eyebrow && (
          <span className="eyebrow mb-4">
            <span className="h-px w-6 bg-sage-400" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 md:text-xl">{subtitle}</p>}
      </div>
    </section>
  );
}
