import { useCallback, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, Mail, Phone, MessageCircle, Instagram, Youtube, Send, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { TurnstileWidget, type TurnstileWidgetHandle } from '../components/TurnstileWidget';
import { useReveal } from '../hooks/useReveal';
import contactImage from '../assets/images/contacto/contacto.jpg';

const SUBJECTS = [
  'Consulta general',
  'Endometriosis',
  'Adenomiosis',
  'Dolor pélvico',
  'Cirugías',
  'Apoyo al paciente',
  'Otro',
];

const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '').trim();
const CONTACT_FORM_ENABLED = import.meta.env.VITE_CONTACT_FORM_ENABLED === 'true';
const CONTACT_ENDPOINT = '/api/contact.php';

interface ContactApiResponse {
  success?: boolean;
  code?: string;
  message?: string;
  retry_after?: number;
}

function createRequestId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function Contacto() {
  return (
    <>
      <PageHero
        title="Contacto"
        subtitle="Estamos disponibles para orientar tus consultas, coordinar una evaluación y entregar información clara sobre las alternativas de atención del equipo REDEP."
        image={contactImage}
        imageAlt="Imagen de apoyo para contacto de REDEP Chile"
      />

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactInfo() {
  const { ref, visible } = useReveal();
  const items = [
    { icon: Mail, label: 'Correo', value: 'redepchile@gmail.com', href: 'mailto:redepchile@gmail.com' },
    { icon: Phone, label: 'Teléfono', value: 'Disponible próximamente', href: '#' },
    { icon: MessageCircle, label: 'Whatsapp', value: 'Disponible próximamente', href: '#' },
  ];
  const socials = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' },
  ];

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} flex flex-col overflow-hidden rounded-4xl`}>
      <div className="flex flex-1 flex-col p-8 md:p-10">
      <h2 className="font-display text-2xl font-semibold text-ink-900">Información de contacto</h2>

      <ul className="mt-8 space-y-5">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a href={href} className="group inline-flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand-100 text-sage-600 transition-colors group-hover:bg-sage-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</span>
                <span className="text-base font-medium text-ink-900">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-sand-200 pt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Síguenos</p>
        <div className="mt-3 flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-sage-600 transition-colors hover:bg-sage-600 hover:text-white"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { ref, visible } = useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', tema: '', mensaje: '' });
  const [website, setWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [turnstileError, setTurnstileError] = useState(false);
  const formStartedAtRef = useRef(Date.now());
  const requestIdRef = useRef<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrorMessage('');
    requestIdRef.current = null;
  };

  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) {
      setTurnstileError(false);
      setErrorMessage('');
    }
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileError(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!CONTACT_FORM_ENABLED) {
      setErrorMessage('El formulario de contacto estará disponible próximamente.');
      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      setErrorMessage('El formulario aún no tiene configurada la verificación de seguridad.');
      return;
    }
    if (!turnstileToken) {
      setErrorMessage('Completa la verificación de seguridad antes de enviar.');
      return;
    }

    const requestId = requestIdRef.current ?? createRequestId();
    requestIdRef.current = requestId;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 35000);

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          website,
          turnstile_token: turnstileToken,
          request_id: requestId,
          form_started_at: formStartedAtRef.current,
        }),
        signal: controller.signal,
      });

      let result: ContactApiResponse = {};
      try {
        result = (await response.json()) as ContactApiResponse;
      } catch {
        // A generic error below handles non-JSON server and proxy responses.
      }

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'No pudimos enviar tu mensaje. Inténtalo nuevamente.');
      }

      setSuccessMessage(result.message || 'Tu mensaje fue recibido correctamente.');
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof DOMException && error.name === 'AbortError'
        ? 'La respuesta tardó demasiado. Reintenta: el sistema evitará enviar el mismo mensaje dos veces.'
        : error instanceof Error
          ? error.message
          : 'No pudimos enviar tu mensaje. Inténtalo nuevamente.';
      setErrorMessage(message);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  const fieldCls =
    'w-full rounded-2xl border-0 bg-sand-50 px-4 py-3 text-ink-900 ring-1 ring-inset ring-sand-200 transition-all placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-sage-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-ink-700';

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} rounded-4xl bg-white p-8 shadow-card ring-1 ring-sand-200 md:p-10`}>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Envíanos un mensaje</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">
        Completa el formulario y el equipo se pondrá en contacto contigo a la brevedad.
      </p>

      {!CONTACT_FORM_ENABLED ? (
        <div
          className="mt-8 flex gap-3 rounded-2xl bg-sand-50 p-5 text-sm leading-relaxed text-ink-700 ring-1 ring-inset ring-sand-200"
          role="status"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-clay-600" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-ink-900">Formulario temporalmente no disponible</h3>
            <p className="mt-1">
              Estamos terminando de habilitar este canal. Por ahora no es posible enviar mensajes desde esta página.
            </p>
          </div>
        </div>
      ) : submitted ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl bg-sage-50 p-10 text-center ring-1 ring-sage-200">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-600 text-white">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">¡Mensaje enviado!</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-600">
            {successMessage || 'Recibimos tu consulta y el equipo se pondrá en contacto contigo a la brevedad.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({ nombre: '', email: '', tema: '', mensaje: '' });
              setWebsite('');
              setTurnstileToken(null);
              setErrorMessage('');
              setSuccessMessage('');
              setTurnstileError(false);
              requestIdRef.current = null;
              formStartedAtRef.current = Date.now();
            }}
            className="btn-secondary mt-6"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={submitting}>
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Sitio web</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={labelCls}>
                Nombre <span className="text-clay-600">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={fieldCls}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email <span className="text-clay-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.cl"
                className={fieldCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tema" className={labelCls}>
              Tema <span className="text-clay-600">*</span>
            </label>
            <select id="tema" name="tema" required value={form.tema} onChange={handleChange} className={fieldCls}>
              <option value="" disabled>
                Selecciona un tema
              </option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mensaje" className={labelCls}>
              Mensaje <span className="text-clay-600">*</span>
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos tu caso o consulta"
              className={`${fieldCls} resize-none`}
            />
          </div>

          {TURNSTILE_SITE_KEY ? (
            <TurnstileWidget
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onTokenChange={handleTurnstileToken}
              onWidgetError={handleTurnstileError}
            />
          ) : (
            <div className="rounded-2xl bg-clay-50 p-4 text-sm text-clay-800 ring-1 ring-inset ring-clay-200">
              La verificación de seguridad no está configurada.
            </div>
          )}

          {turnstileError && (
            <p className="flex items-start gap-2 text-sm text-clay-700" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              No pudimos cargar la verificación de seguridad. Revisa tu conexión y recarga la página.
            </p>
          )}

          {errorMessage && (
            <p className="flex items-start gap-2 rounded-2xl bg-clay-50 p-4 text-sm text-clay-800 ring-1 ring-inset ring-clay-200" role="alert" aria-live="assertive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !TURNSTILE_SITE_KEY || !turnstileToken || turnstileError}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Enviando…' : 'Enviar mensaje'}
          </button>

          <div className="flex gap-3 rounded-2xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-600 ring-1 ring-inset ring-sand-200">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" aria-hidden="true" />
            <p>
              <span className="font-medium text-ink-800">Privacidad:</span> usaremos los datos que ingreses únicamente para gestionar y responder tu consulta. El envío y la protección antispam utilizan proveedores tecnológicos externos (Google y Cloudflare). No incorporaremos tus datos a listas de difusión ni los usaremos con fines publicitarios. Por favor, evita incluir información clínica sensible en este formulario.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
