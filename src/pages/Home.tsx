import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, MessageSquare } from 'lucide-react';
import { CTAButton } from '../components/CTAButton';
import { SectionHeader } from '../components/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import { SURGERIES, CLINICAL_PROBLEMS } from '../data/content';
import heroImage from '../assets/images/home/h-hero.png';
import patientSupportImage from '../assets/images/home/h-pasos_cirugia_palette_highres-scaled.png';
import teamImage from '../assets/images/home/h-team.jpg';

export default function Home() {
  return (
    <>
      <Hero />
      <SurgeryTeaser />
      <ProblemsTeaser />
      <ApoyoTeaser />
      <EquipoTeaser />
      <ClosingCTA />
    </>
  );
}

function Hero() {
  const { ref, visible } = useReveal();
  return (
    <section className="relative overflow-hidden bg-sand-50 pt-28 pb-16 md:pt-40 md:pb-24">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page relative`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="eyebrow mb-5">
              <span className="h-px w-6 bg-sage-400" aria-hidden />
              Red de Endometriosis y Dolor Pélvico
            </span>
            <h1 className="text-4xl font-semibold leading-[1.08] text-ink-900 sm:text-5xl md:text-6xl lg:text-[4rem]">
              Dolor pélvico no es normal.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 md:text-xl">
              Equipo experto especializado en el tratamiento de la endometriosis, adenomiosis y dolor pélvico persistente en forma multidisciplinaria y una toma de decisiones compartida.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton to="/contacto">Solicitar evaluación expedita</CTAButton>
              <CTAButton to="/apoyo-al-paciente" variant="secondary">Ver recursos de apoyo</CTAButton>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-lift ring-1 ring-sand-200">
              <img
                src={heroImage}
                alt="Imagen ilustrativa del equipo clínico de REDEP Chile"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SurgeryTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Cirugías"
            title="Evaluación de cirugías en REDEP"
            intro="Realizadas por equipo de referencia especializado en mínima invasión."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {SURGERIES.map((s, i) => (
              <Link
                key={s.id}
                to={`/cirugias#${s.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-sage-200"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-100 font-display text-sm font-semibold text-sage-700">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug text-ink-800 group-hover:text-sage-800">
                    {s.title}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-sage-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemsTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-50 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <span className="eyebrow mb-4">
              <span className="h-px w-6 bg-sage-400" aria-hidden />
              Problemas Clínicos
            </span>
            <h2 className="text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl md:text-[2.75rem]">
              Selecciona tu síntoma principal o problema clínico
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
              Una red interdisciplinaria permite integrar diagnóstico, dolor, fertilidad, rehabilitación y cirugía en un plan coherente.
            </p>
            <CTAButton to="/problemas-clinicos" variant="secondary" className="mt-8">
              Ver todos los problemas clínicos
            </CTAButton>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {CLINICAL_PROBLEMS.map((p) => (
              <Link
                key={p.id}
                to={`/problemas-clinicos#${p.id}`}
                className="group flex items-center justify-between gap-2 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-sage-200"
              >
                <span className="text-sm font-medium leading-snug text-ink-800 group-hover:text-sage-800">{p.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-sage-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApoyoTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-4xl shadow-card ring-1 ring-sand-200">
              <img
                src={patientSupportImage}
                alt="Imagen ilustrativa de la biblioteca de recursos para pacientes"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              eyebrow="Apoyo al Paciente"
              title="Material de apoyo dirigido a pacientes"
              intro="Accede a toda nuestra biblioteca de recursos, guías de apoyo, formularios y material educativo para tu proceso."
            />
            <div className="mt-8">
              <CTAButton to="/apoyo-al-paciente">
                <BookOpen className="h-4 w-4" />
                Ir a la biblioteca
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EquipoTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-50 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Equipo"
              title="Conoce a nuestro equipo clínico"
              intro="Un grupo multidisciplinario de profesionales altamente comprometidos con tu proceso."
            />
            <div className="mt-8">
              <CTAButton to="/equipo">
                <Users className="h-4 w-4" />
                Nuestros Profesionales
              </CTAButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-4xl shadow-card ring-1 ring-sand-200">
            <img
              src={teamImage}
              alt="Foto del equipo clínico de REDEP Chile"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="relative overflow-hidden rounded-5xl bg-ink-900 px-6 py-16 text-center shadow-lift md:px-16 md:py-24">
          <div className="relative">
            <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-500 text-white">
              <MessageSquare className="h-6 w-6" />
            </span>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Cuéntanos tu caso
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sand-200/70">
              Una coordinadora clínica revisará tu solicitud y orientará el siguiente paso de evaluación.
            </p>
            <div className="mt-8">
              <CTAButton to="/contacto" className="bg-white text-ink-900 hover:bg-sand-100">
                Contáctanos
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
