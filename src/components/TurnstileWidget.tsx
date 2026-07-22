import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  onWidgetError: () => void;
}

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  appearance: 'always' | 'execute' | 'interaction-only';
  language: string;
  size: 'normal' | 'compact' | 'flexible';
  theme: 'light' | 'dark' | 'auto';
  retry: 'auto' | 'never';
  'response-field': boolean;
  callback: (token: string) => void;
  'error-callback': () => void;
  'expired-callback': () => void;
  'timeout-callback': () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const finishLoading = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        scriptPromise = null;
        reject(new Error('Cloudflare Turnstile did not initialize'));
      }
    };

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', finishLoading, { once: true });
      existingScript.addEventListener(
        'error',
        () => {
          scriptPromise = null;
          reject(new Error('Cloudflare Turnstile could not be loaded'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', finishLoading, { once: true });
    script.addEventListener(
      'error',
      () => {
        script.remove();
        scriptPromise = null;
        reject(new Error('Cloudflare Turnstile could not be loaded'));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onTokenChange, onWidgetError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          onTokenChange(null);
        }
      },
    }), [onTokenChange]);

    useEffect(() => {
      let cancelled = false;

      loadTurnstile()
        .then((turnstile) => {
          if (cancelled || !containerRef.current) {
            return;
          }

          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action: 'contact',
            appearance: 'interaction-only',
            language: 'es',
            size: 'flexible',
            theme: 'light',
            retry: 'auto',
            'response-field': false,
            callback: (token) => onTokenChange(token),
            'error-callback': () => {
              onTokenChange(null);
              onWidgetError();
            },
            'expired-callback': () => onTokenChange(null),
            'timeout-callback': () => onTokenChange(null),
          });
        })
        .catch(() => {
          if (!cancelled) {
            onTokenChange(null);
            onWidgetError();
          }
        });

      return () => {
        cancelled = true;
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [onTokenChange, onWidgetError, siteKey]);

    return <div ref={containerRef} className="min-h-16 w-full" aria-label="Verificación de seguridad" />;
  },
);
