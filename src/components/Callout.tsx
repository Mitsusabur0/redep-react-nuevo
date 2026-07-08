import { type ReactNode } from 'react';
import { Info, AlertCircle, BookOpen } from 'lucide-react';

interface CalloutProps {
  children: ReactNode;
  variant?: 'info' | 'note' | 'reference';
  icon?: ReactNode;
  title?: string;
  className?: string;
}

export function Callout({ children, variant = 'note', icon, title, className = '' }: CalloutProps) {
  const styles = {
    note: {
      wrap: 'bg-sage-50 ring-sage-200',
      iconWrap: 'bg-sage-100 text-sage-700',
      defaultIcon: <Info className="h-5 w-5" />,
    },
    info: {
      wrap: 'bg-sand-100 ring-sand-200',
      iconWrap: 'bg-sand-200 text-ink-700',
      defaultIcon: <AlertCircle className="h-5 w-5" />,
    },
    reference: {
      wrap: 'bg-clay-50 ring-clay-200',
      iconWrap: 'bg-clay-100 text-clay-700',
      defaultIcon: <BookOpen className="h-5 w-5" />,
    },
  }[variant];

  return (
    <div className={`flex gap-4 rounded-2xl p-5 ring-1 ring-inset ${styles.wrap} ${className}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconWrap}`}>
        {icon ?? styles.defaultIcon}
      </div>
      <div className="flex-1 pt-0.5">
        {title && <p className="mb-1 font-display text-base font-semibold text-ink-900">{title}</p>}
        <div className="text-sm leading-relaxed text-ink-700">{children}</div>
      </div>
    </div>
  );
}
