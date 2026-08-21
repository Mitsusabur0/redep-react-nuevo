import { useEffect, useRef, useState } from 'react';
import { Check, Type, X } from 'lucide-react';

const FONT_STORAGE_KEY = 'redep-font-preset';
const FONT_CHANGE_EVENT = 'redep-font-preset-change';

type FontPreset = {
  id: string;
  label: string;
  pairing: string;
  displayFont: string;
  bodyFont: string;
};

const FONT_PRESETS = [
  {
    id: 'fraunces-inter',
    label: 'Ejemplo',
    pairing: 'Fraunces + Inter',
    displayFont: '"Fraunces", Georgia, serif',
    bodyFont: '"Inter", system-ui, sans-serif',
  },
  {
    id: 'newsreader-mulish',
    label: 'Ejemplo',
    pairing: 'Newsreader + Mulish',
    displayFont: '"Newsreader", Georgia, serif',
    bodyFont: '"Mulish", system-ui, sans-serif',
  },
  {
    id: 'newsreader-inter',
    label: 'Ejemplo',
    pairing: 'Newsreader + Inter',
    displayFont: '"Newsreader", Georgia, serif',
    bodyFont: '"Inter", system-ui, sans-serif',
  },
  {
    id: 'inter-only',
    label: 'Ejemplo',
    pairing: 'Inter',
    displayFont: '"Inter", system-ui, sans-serif',
    bodyFont: '"Inter", system-ui, sans-serif',
  },
  {
    id: 'system-classic',
    label: 'Ejemplo',
    pairing: 'Georgia + Sistema',
    displayFont: 'Georgia, "Times New Roman", serif',
    bodyFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    id: 'eb-garamond-source-sans',
    label: 'Actual',
    pairing: 'EB Garamond + Source Sans 3',
    displayFont: '"EB Garamond", Garamond, Georgia, serif',
    bodyFont: '"Source Sans 3", system-ui, sans-serif',
  },
  {
    id: 'cormorant-mulish',
    label: 'Ejemplo',
    pairing: 'Cormorant Garamond + Mulish',
    displayFont: '"Cormorant Garamond", Garamond, Georgia, serif',
    bodyFont: '"Mulish", system-ui, sans-serif',
  },
  {
    id: 'crimson-inter',
    label: 'Ejemplo',
    pairing: 'Crimson Pro + Inter',
    displayFont: '"Crimson Pro", Georgia, serif',
    bodyFont: '"Inter", system-ui, sans-serif',
  },
] as const satisfies readonly FontPreset[];

type FontPresetId = (typeof FONT_PRESETS)[number]['id'];

const DEFAULT_PRESET: FontPresetId = 'eb-garamond-source-sans';

function isFontPresetId(value: string | null | undefined): value is FontPresetId {
  return FONT_PRESETS.some((preset) => preset.id === value);
}

function getInitialPreset(): FontPresetId {
  if (typeof document === 'undefined') return DEFAULT_PRESET;

  const documentPreset = document.documentElement.dataset.fontPreset;
  if (isFontPresetId(documentPreset)) return documentPreset;

  try {
    const storedPreset = window.localStorage.getItem(FONT_STORAGE_KEY);
    if (isFontPresetId(storedPreset)) return storedPreset;
  } catch {
    // The preview still works for this session when storage is unavailable.
  }

  return DEFAULT_PRESET;
}

export function FontPreviewSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<FontPresetId>(getInitialPreset);
  const switcherRef = useRef<HTMLDivElement>(null);
  const selectedOption = FONT_PRESETS.find((preset) => preset.id === selectedPreset) ?? FONT_PRESETS[0];

  useEffect(() => {
    document.documentElement.dataset.fontPreset = selectedPreset;

    try {
      window.localStorage.setItem(FONT_STORAGE_KEY, selectedPreset);
    } catch {
      // Keep the in-memory selection when storage is unavailable.
    }

    window.dispatchEvent(
      new CustomEvent(FONT_CHANGE_EVENT, {
        detail: { preset: selectedPreset },
      }),
    );
  }, [selectedPreset]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FONT_STORAGE_KEY) {
        setSelectedPreset(isFontPresetId(event.newValue) ? event.newValue : DEFAULT_PRESET);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={switcherRef}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 flex flex-col items-start gap-3"
    >
      {isOpen && (
        <aside
          id="font-preview-panel"
          aria-label="Comparar tipografías"
          className="max-h-[min(78vh,42rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-white p-4 shadow-lift ring-1 ring-sand-200/80 sm:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Vista previa</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-sand-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
              aria-label="Cerrar selector de tipografías"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset className="mt-3 space-y-2">
            <legend className="sr-only">Elige una combinación tipográfica</legend>
            {FONT_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPreset;

              return (
                <label
                  key={preset.id}
                  className={`block cursor-pointer rounded-2xl border px-3.5 py-3 transition-all focus-within:ring-2 focus-within:ring-sage-500 focus-within:ring-offset-2 ${
                    isSelected
                      ? 'border-sage-300 bg-sage-50 shadow-soft'
                      : 'border-sand-200 bg-sand-50/60 hover:border-sage-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="font-preset"
                    value={preset.id}
                    checked={isSelected}
                    onChange={() => setSelectedPreset(preset.id)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span
                        className="block text-lg font-semibold leading-tight text-ink-900"
                        style={{ fontFamily: preset.displayFont }}
                      >
                        {preset.label}
                      </span>
                      <span
                        className="mt-1 block text-xs leading-snug text-ink-600"
                        style={{ fontFamily: preset.bodyFont }}
                      >
                        {preset.pairing}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isSelected ? 'bg-sage-600 text-white' : 'border border-sand-300 text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
        </aside>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sage-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lift ring-2 ring-white/80 transition-all hover:-translate-y-0.5 hover:bg-sage-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 focus-visible:ring-offset-2 active:translate-y-0"
        aria-expanded={isOpen}
        aria-controls="font-preview-panel"
      >
        <Type className="h-4 w-4" aria-hidden="true" />
        <span>Tipografías</span>
        <span className="hidden font-normal text-sage-100 sm:inline">· {selectedOption.label}</span>
      </button>

      <span className="sr-only" aria-live="polite">
        Tipografía {selectedOption.pairing} aplicada a todo el sitio.
      </span>
    </div>
  );
}
