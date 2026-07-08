import {
  CheckCircle2,
  Eye,
  HeartPulse,
  MapPin,
  Microscope,
  Stethoscope,
  Target,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import surgeryImage from '../assets/images/cirugias/c-endometriosis-2.jpg';
import therapyImage from '../assets/images/problemas/p-dolor-pelvico.jpg';

const medicalCenterExteriorImage =
  'https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?auto=format&fit=crop&fm=jpg&q=80&w=1600';
const researchImage = 'https://placehold.co/900x650/f5efe6/7F2D45?text=Investigacion+clinica';

const pillars = [
  {
    title: 'Cirugía especializada',
    text: 'Evaluación quirúrgica, planificación y cirugía mínimamente invasiva para casos con indicación clara.',
    locations: 'Valdivia',
    note: 'Las cirugías se realizan solo en Valdivia.',
    image: surgeryImage,
    imageAlt: 'Equipo quirúrgico realizando una cirugía laparoscópica',
    icon: Stethoscope,
  },
  {
    title: 'Terapias de apoyo',
    text: 'Rehabilitación, acompañamiento clínico y estrategias de apoyo para el manejo del dolor y la recuperación.',
    locations: 'Puerto Montt, Osorno y Valdivia',
    note: 'Las terapias se desarrollan en tres sedes del sur de Chile.',
    image: therapyImage,
    imageAlt: 'Imagen referencial de atención clínica para dolor pélvico',
    icon: HeartPulse,
  },
  {
    title: 'Investigación',
    text: 'Desarrollo de conocimiento clínico y académico para mejorar diagnóstico, tratamiento y seguimiento.',
    locations: 'Santiago, Valdivia, Osorno y Puerto Montt',
    note: 'La investigación conecta al equipo completo en las cuatro ciudades.',
    image: researchImage,
    imageAlt: 'Imagen referencial de investigación clínica',
    icon: Microscope,
  },
];

const principles = [
  'Atención especializada en endometriosis, adenomiosis y dolor pélvico persistente.',
  'Decisiones clínicas compartidas, con indicación quirúrgica solo cuando corresponde.',
  'Trabajo interdisciplinario entre cirugía, rehabilitación, apoyo clínico e investigación.',
  'Acompañamiento orientado a recuperar función, calidad de vida y continuidad del cuidado.',
];

export default function QuienesSomos() {
  return (
    <>
      <HeroSection />
      <MissionVisionSection />
      <PillarsSection />
    </>
  );
}

function HeroSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="bg-sand-50 pt-28 pb-16 md:pt-36 md:pb-24">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} container-page`}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] text-[#103F3F] sm:text-4xl md:text-5xl">
              Quiénes Somos
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-600">
              <p>
                REDEP (Red de Endometriosis y Dolor Pélvico) es una red clínica dedicada al diagnóstico, tratamiento, cirugía, terapias de apoyo e
                investigación en endometriosis y dolor pélvico.
              </p>
              <p>
                REDEP reúne profesionales de Santiago, Valdivia, Osorno y Puerto Montt para abordar enfermedades
                ginecológicas complejas con una mirada multidisciplinaria.
              </p>
              <p>
                Generamos planes pensados para cada paciente y para el momento clínico en que se encuentra.
              </p>
            </div>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-4xl shadow-lift ring-1 ring-sand-200">
              <img
                src={medicalCenterExteriorImage}
                alt="Exterior de un centro médico moderno"
                className="aspect-[4/3] h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-ink-900/10" aria-hidden />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item) => (
            <div key={item} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-sand-200">
              <CheckCircle2 className="mb-3 h-5 w-5 text-sage-600" />
              <p className="text-sm leading-relaxed text-ink-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="bg-sand-100 py-16 md:py-24">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-2">
          <StatementCard
            eyebrow="Misión"
            title="Acompañar con medicina especializada y decisiones claras."
            text="Entregar evaluación, tratamiento y seguimiento de alta calidad para pacientes con endometriosis y dolor pélvico, combinando evidencia, experiencia clínica y una relación respetuosa con cada persona."
            icon={Target}
          />
          <StatementCard
            eyebrow="Visión"
            title="Ser una red de referencia clínica y académica."
            text="Consolidar un modelo de atención que conecte el sur de Chile con investigación, formación y cirugía especializada, elevando el estándar de cuidado para condiciones pélvicas complejas."
            icon={Eye}
          />
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="bg-sand-50 py-16 md:py-24">
      <div className="container-page">
        <SectionHeader
          eyebrow="Qué hacemos"
          title="Tres líneas de trabajo, un mismo objetivo clínico"
          intro="El plan puede incluir evaluación médica, cirugía, rehabilitación, apoyo terapéutico o seguimiento. La indicación depende del diagnóstico, los síntomas y los objetivos de la paciente."
          className="[&_h2]:text-[#103F3F]"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar }: { pillar: (typeof pillars)[number] }) {
  const { ref, visible } = useReveal();
  const Icon = pillar.icon;

  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-all hover:-translate-y-1 hover:shadow-card hover:ring-sage-200`}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={pillar.image}
          alt={pillar.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink-900/10" aria-hidden />
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl font-semibold leading-tight text-ink-900">{pillar.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-ink-600">{pillar.text}</p>
        <div className="mt-5 rounded-2xl bg-sand-50 p-4 ring-1 ring-sand-200">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sage-700">Dónde</p>
              <p className="mt-1 text-sm font-medium text-ink-800">{pillar.locations}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">{pillar.note}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatementCard({
  eyebrow,
  title,
  text,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  text: string;
  icon: typeof Target;
}) {
  const { ref, visible } = useReveal();

  return (
    <article
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} rounded-3xl bg-white p-7 shadow-soft ring-1 ring-sand-200 md:p-8`}
    >
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
        <Icon className="h-5 w-5" />
      </span>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h3 className="font-display text-2xl font-semibold leading-tight text-ink-900">{title}</h3>
      <p className="mt-4 leading-relaxed text-ink-600">{text}</p>
    </article>
  );
}
