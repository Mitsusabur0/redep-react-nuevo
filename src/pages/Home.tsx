import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, MessageSquare, Pause, Play, Users } from 'lucide-react';
import { CTAButton } from '../components/CTAButton';
import { EndometriosisAdenomyosisDiagram } from '../components/EndometriosisAdenomyosisDiagram';
import { SectionHeader } from '../components/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import { SURGERIES, CLINICAL_PROBLEMS, TEAM } from '../data/content';
import heroImage from '../assets/images/home/h-hero.png';
import patientSupportImage from '../assets/images/home/h-pasos_cirugia_palette_highres-scaled.png';

export default function Home() {
  return (
    <>
      <Hero />
      <QuienesSomosTeaser />
      <SurgeryTeaser />
      <ConditionsComparison />
      <ProblemsTeaser />
      <ApoyoTeaser />
      <EquipoTeaser />
      <ClosingCTA />
    </>
  );
}

function ConditionsComparison() {
  const { ref, visible } = useReveal();

  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeader
            eyebrow="Endometriosis vs Adenomiosis"
            title="Conoce la diferencia"
            intro={(
              <>
                La endometriosis ocurre cuando tejido similar al endometrio crece fuera del útero, mientras que la
                adenomiosis se desarrolla dentro de la pared muscular del útero. Ambas pueden causar dolor menstrual
                y dolor pélvico; la endometriosis puede afectar otros órganos y la adenomiosis suele relacionarse con
                sangrado menstrual abundante.
              </>
            )}
            className="[&_h2]:text-[#103F3F]"
          />
          <div className="mx-auto w-full max-w-lg overflow-hidden rounded-4xl shadow-card ring-1 ring-sand-200 lg:justify-self-center">
            <EndometriosisAdenomyosisDiagram compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { ref, visible } = useReveal();
  return (
    <section className="relative overflow-hidden bg-sand-50 pt-28 pb-16 md:pt-40 md:pb-24">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page relative`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="eyebrow mb-5 md:text-sm">
              Red de Endometriosis y Dolor Pélvico
            </span>
            <h1 className="text-4xl font-semibold leading-[1.08] text-[#103F3F] sm:text-5xl md:text-6xl lg:text-[4rem]">
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

function QuienesSomosTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="max-w-4xl">
          <SectionHeader
            eyebrow="Quiénes Somos"
            title="Un equipo de trabajo especializado construido para mirar el dolor pélvico de forma integral"
            intro="REDEP integra cirugía, terapias de apoyo e investigación para abordar la endometriosis, adenomiosis y dolor pélvico persistente con una mirada multidisciplinaria."
            className="max-w-4xl [&_h2]:text-[#103F3F]"
          />
          <div className="mt-8">
            <CTAButton to="/quienes-somos">
              <Users className="h-4 w-4" />
              Conocer REDEP
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function SurgeryTeaser() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-50 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <SectionHeader
            eyebrow="Cirugías"
            title="Evaluación de cirugías en REDEP"
            intro="Realizadas por equipo de referencia especializado en mínima invasión."
            className="[&_h2]:text-[#103F3F]"
          />
          <div className="grid w-full gap-3 sm:w-max lg:justify-self-center">
            {SURGERIES.map((s) => (
              <Link
                key={s.id}
                to={`/cirugias?seleccion=${s.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-sage-200"
              >
                <span className="text-base font-medium leading-snug text-ink-800 group-hover:text-sage-800 sm:whitespace-nowrap">
                  {s.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-sage-600" />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 hidden sm:block md:mt-16">
          <img
            src={patientSupportImage}
            alt="Ilustración del recorrido de cirugía"
            className="w-full"
            loading="lazy"
          />
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
        <div className="max-w-3xl">
          <span className="eyebrow mb-4">
            Problemas Clínicos
          </span>
          <h2 className="text-3xl font-semibold leading-tight text-[#103F3F] sm:text-4xl md:text-[2.75rem]">
            Selecciona tu síntoma principal o problema clínico
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Una red interdisciplinaria permite integrar diagnóstico, dolor, fertilidad, rehabilitación y cirugía en un plan coherente.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink-600">
            Te entregamos información clara sobre cada problema clínico y cómo podemos orientarte en la evaluación y tratamiento.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-5 md:mt-12">
          {CLINICAL_PROBLEMS.map((p) => (
            <Link
              key={p.id}
              to={`/problemas-clinicos?seleccion=${p.id}`}
              className="group inline-flex min-h-10 items-center rounded-full bg-white px-4 py-2 shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-sage-200"
            >
              <span className="text-base font-medium leading-none text-ink-800 transition-colors group-hover:text-sage-800">
                {p.title}
              </span>
            </Link>
          ))}
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
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="Apoyo al Paciente"
            title="Material de apoyo dirigido a pacientes"
            intro="Accede a toda nuestra biblioteca de recursos, guías de apoyo, formularios y material educativo para tu proceso."
            className="[&_h2]:text-[#103F3F]"
          />
          <div className="mt-8">
            <CTAButton to="/apoyo-al-paciente">
              <BookOpen className="h-4 w-4" />
              Ir a la biblioteca
            </CTAButton>
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
              className="[&_h2]:text-[#103F3F]"
            />
            <div className="mt-8">
              <CTAButton to="/equipo">
                <Users className="h-4 w-4" />
                Nuestros Profesionales
              </CTAButton>
            </div>
          </div>
          <TeamCarousel />
        </div>
      </div>
    </section>
  );
}

function TeamCarousel() {
  const [trackIndex, setTrackIndex] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const slides = [TEAM[TEAM.length - 1], ...TEAM, TEAM[0]];

  const moveCarousel = (nextTrackIndex: number) => {
    if (isAnimating.current || nextTrackIndex === trackIndex) return;
    isAnimating.current = true;
    setTrackIndex(nextTrackIndex);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    const intervalId = window.setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setTrackIndex((currentIndex) => currentIndex + 1);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, isVisible]);

  useEffect(() => {
    if (transitionEnabled) return;

    const timeoutId = window.setTimeout(() => {
      setTransitionEnabled(true);
      isAnimating.current = false;
    }, 20);

    return () => window.clearTimeout(timeoutId);
  }, [transitionEnabled]);

  const finishTransition = () => {
    if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(TEAM.length);
      setActiveIndex(TEAM.length - 1);
      return;
    }

    if (trackIndex === TEAM.length + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
      setActiveIndex(0);
      return;
    }

    setActiveIndex(trackIndex - 1);
    isAnimating.current = false;
  };

  return (
    <div
      ref={carouselRef}
      className="mx-auto w-[92%] max-w-md min-w-0 lg:justify-self-center"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Profesionales de REDEP Chile"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') moveCarousel(trackIndex - 1);
        if (event.key === 'ArrowRight') moveCarousel(trackIndex + 1);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-sand-200 sm:aspect-square lg:aspect-[4/3]">
        <Link
          to="/equipo"
          className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-600"
          aria-label="Conocer al equipo de REDEP Chile"
        />

        <div
          className={`flex h-full ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
          onTransitionEnd={finishTransition}
        >
          {slides.map((teamMember, index) => (
            <article
              key={`${teamMember.name}-${index}`}
              className="relative flex h-full min-w-full flex-col bg-white"
              aria-hidden={index !== trackIndex}
            >
              <div className="min-h-0 flex-1 bg-white">
                <img
                  src={teamMember.mobileImage ?? teamMember.image}
                  alt={teamMember.imageAlt}
                  className="h-full w-full object-contain"
                  loading={index <= 2 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="shrink-0 bg-white p-5 pr-24 sm:px-6 sm:py-5 sm:pr-28">
                <h3 className="text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl">{teamMember.name}</h3>
                <p className="mt-1.5 text-sm font-medium text-sage-700 sm:text-base">{teamMember.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-700 shadow-soft backdrop-blur-sm">
          {activeIndex + 1} / {TEAM.length}
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((playing) => !playing)}
          className="absolute left-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
          aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
          aria-pressed={!isPlaying}
        >
          {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={() => moveCarousel(trackIndex - 1)}
          className="absolute bottom-6 right-[4.5rem] z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 sm:bottom-8 sm:right-20"
          aria-label="Ver profesional anterior"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => moveCarousel(trackIndex + 1)}
          className="absolute bottom-6 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 sm:bottom-8 sm:right-6"
          aria-label="Ver siguiente profesional"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Seleccionar profesional">
        {TEAM.map((teamMember, index) => (
          <button
            key={teamMember.name}
            type="button"
            onClick={() => moveCarousel(index + 1)}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 ${
              index === activeIndex ? 'w-8 bg-sage-600' : 'w-2.5 bg-sand-300 hover:bg-sand-400'
            }`}
            aria-label={`Ver a ${teamMember.name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ClosingCTA() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-100 py-20 md:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page text-center`}>
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 ring-1 ring-sage-200">
          <MessageSquare className="h-6 w-6" />
        </span>
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-[#103F3F] sm:text-4xl md:text-5xl">
          Cuéntanos tu caso
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
          Una coordinadora clínica revisará tu solicitud y orientará el siguiente paso de evaluación.
        </p>
        <div className="mt-8">
          <CTAButton to="/contacto">
            Contáctanos
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
