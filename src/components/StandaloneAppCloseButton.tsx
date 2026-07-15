import { X } from 'lucide-react';

type StandaloneAppCloseButtonProps = {
  onClick: () => void;
  ariaLabel: string;
};

export function StandaloneAppCloseButton({ onClick, ariaLabel }: StandaloneAppCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[100] inline-flex h-11 min-h-11 w-11 items-center justify-center gap-2 rounded-full bg-sage-700/95 p-0 text-sm font-semibold text-white shadow-lift ring-2 ring-white/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 focus-visible:ring-offset-2 active:translate-y-0 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 md:right-8 lg:right-10"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <X className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
      <span className="hidden sm:inline">Cerrar</span>
    </button>
  );
}
