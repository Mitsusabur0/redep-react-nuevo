import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  external?: boolean;
}

export function CTAButton({ to, children, variant = 'primary', className = '', external }: CTAButtonProps) {
  const cls = `btn-${variant} ${className}`;
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
