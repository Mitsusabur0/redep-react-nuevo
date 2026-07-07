import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Youtube, Send, CheckCircle2 } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useReveal } from '../hooks/useReveal';

const SUBJECTS = [
  'Consulta general',
  'Endometriosis',
  'Adenomiosis',
  'Dolor pélvico',
  'Cirugías',
  'Apoyo al paciente',
  'Otro',
];

export default function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Contacto"
        subtitle="[Texto de relleno introductorio. Invita a la paciente a contactar al equipo REDEP para una evaluación expedita, resolver dudas o solicitar información sobre los servicios clínicos.]"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
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
    { icon: Mail, label: 'Correo', value: '[correo@redepchile.cl]', href: 'mailto:[correo@redepchile.cl]' },
    { icon: Phone, label: 'Teléfono', value: '[+56 9 0000 0000]', href: 'tel:+56900000000' },
    { icon: MapPin, label: 'Dirección', value: 'Valdivia, Chile', href: '#' },
  ];
  const socials = [
    { icon: MessageCircle, label: 'Whatsapp', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' },
  ];

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} flex flex-col rounded-4xl bg-ink-900 p-8 text-sand-100 shadow-card md:p-10`}>
      <h2 className="font-display text-2xl font-semibold text-white">Información de contacto</h2>
      <p className="mt-3 text-sm leading-relaxed text-sand-200/70">
        [Texto de relleno. Indica los canales disponibles para contactar al equipo REDEP Chile.]
      </p>

      <ul className="mt-8 space-y-5">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a href={href} className="group flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-700 text-sage-300 transition-colors group-hover:bg-sage-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-sand-200/50">{label}</span>
                <span className="text-base font-medium text-sand-50">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-ink-700 pt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-sand-200/50">Síguenos</p>
        <div className="mt-3 flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-700 text-sand-100 transition-colors hover:bg-sage-600 hover:text-white"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { ref, visible } = useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', tema: '', mensaje: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Front-end only — mock submission
    console.log('Formulario de contacto (mock):', form);
    setSubmitted(true);
  };

  const fieldCls =
    'w-full rounded-2xl border-0 bg-sand-50 px-4 py-3 text-ink-900 ring-1 ring-inset ring-sand-200 transition-all placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-sage-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-ink-700';

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} rounded-4xl bg-white p-8 shadow-card ring-1 ring-sand-200 md:p-10`}>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Envíanos un mensaje</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">
        [Texto de relleno. Completa el formulario y el equipo se pondrá en contacto contigo a la brevedad.]
      </p>

      {submitted ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl bg-sage-50 p-10 text-center ring-1 ring-sage-200">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-600 text-white">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">¡Mensaje enviado!</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-600">
            [Texto de relleno. Confirmación de que el mensaje fue recibido y el equipo se contactará pronto.]
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({ nombre: '', email: '', tema: '', mensaje: '' });
            }}
            className="btn-secondary mt-6"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                value={form.nombre}
                onChange={handleChange}
                placeholder="[Tu nombre]"
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
                value={form.email}
                onChange={handleChange}
                placeholder="[tu@correo.cl]"
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
              rows={5}
              value={form.mensaje}
              onChange={handleChange}
              placeholder="[Cuéntanos tu caso o consulta aquí]"
              className={`${fieldCls} resize-none`}
            />
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto">
            <Send className="h-4 w-4" />
            Enviar mensaje
          </button>
        </form>
      )}
    </div>
  );
}
