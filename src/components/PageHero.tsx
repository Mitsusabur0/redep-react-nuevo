import { type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  imageAlt?: string;
  titleSize?: 'large' | 'small';
}

export function PageHero({ title, subtitle, image, imageAlt = '', titleSize = 'large' }: PageHeroProps) {
  const { ref, visible } = useReveal();
  const titleSizeClass =
    titleSize === 'small' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl';

  return (
    <section className="relative overflow-hidden bg-sand-50 pt-28 pb-14 md:pt-36 md:pb-20">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page relative`}>
        <div className={`grid items-center gap-10 ${image ? 'lg:grid-cols-[1fr_0.72fr]' : ''}`}>
          <div>
            <h1
              className={`max-w-3xl font-semibold leading-[1.1] text-[#103F3F] ${titleSizeClass}`}
            >
              {title}
            </h1>
            {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 md:text-xl">{subtitle}</p>}
          </div>

          {image && (
            <div className="relative overflow-hidden rounded-4xl shadow-lift ring-1 ring-sand-200">
              <img src={image} alt={imageAlt} className="aspect-[4/3] h-full w-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-ink-900/10" aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
