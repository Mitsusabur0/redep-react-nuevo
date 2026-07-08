import { type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ eyebrow, title, intro, align = 'left', className = '' }: SectionHeaderProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <span className="eyebrow mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl md:text-[2.75rem]">{title}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-600">{intro}</p>}
    </div>
  );
}
