// Central content for REDEP Chile. All body text is placeholder.
// Titles, labels, and navigation are final content as specified.
import type { ReactNode } from 'react';
import endometriosisSurgeryImage from '../assets/images/cirugias/c-endometriosis.png';
import hysterectomyImage from '../assets/images/cirugias/c-histerectomia.png';
import uterinePreservationImage from '../assets/images/cirugias/c-ablacion-preservacion-uterina.png';
import ovarianSurgeryImage from '../assets/images/cirugias/c-.png';
import fibroidsImage from '../assets/images/cirugias/c-miomas.png';
import endometriosisProblemImage from '../assets/images/problemas/p-endometriosis.jpg';
import adenomyosisProblemImage from '../assets/images/problemas/p-adenomiosis.png';
import menstrualPainImage from '../assets/images/problemas/p-dolor-menstrual.png';
import heavyBleedingImage from '../assets/images/problemas/p-sangrado.png';
import pelvicPainImage from '../assets/images/problemas/p-dolor-pelvico.jpg';
import sexualPainImage from '../assets/images/problemas/p-dolor-sexual.png';
import andreaGutierrezImage from '../assets/images/equipo/Andrea Gutierrez.jpg';
import camilaAlvallayImage from '../assets/images/equipo/Camila Alvallay.jpg';
import denisseArayaImage from '../assets/images/equipo/Denisse Araya.jpg';
import francibelFigueroaImage from '../assets/images/equipo/Francibel Figueroa.jpg';
import karinBerkhoffImage from '../assets/images/equipo/karin.jpg';
import macarenaFerrariImage from '../assets/images/equipo/Macarena Ferrari.jpg';
import mauricioImage from '../assets/images/equipo/Mauricio Correa D..jpg';
import mauricioMobileImage from '../assets/images/equipo/Mauricio Correa D.-mobile.jpg';
import octaviaIhnenImage from '../assets/images/equipo/Octavia Ihnen.jpg';
import stephanieQuijadaImage from '../assets/images/equipo/Stephanie Quijada.jpg';
import enzianThumbnailImage from '../assets/images/apoyo/enzian_thumbnail.png';
import pempThumbnailImage from '../assets/images/apoyo/pemp_thumbnail.png';
import manualThumbnailImage from '../assets/images/apoyo/manual_thumbnail.png';

type ClinicalProblemSection = {
  title: string;
  content: ReactNode;
};

type ClinicalProblem = {
  id: string;
  title: string;
  description: ReactNode;
  image: string;
  imageAlt: string;
  sections: ClinicalProblemSection[];
};

type TeamMember = {
  name: string;
  role: string;
  bio: ReactNode;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  featured?: boolean;
};

export const NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Quiénes Somos', path: '/quienes-somos' },
  { label: 'Cirugías', path: '/cirugias' },
  { label: 'Problemas Clínicos', path: '/problemas-clinicos' },
  { label: 'Apoyo al Paciente', path: '/apoyo-al-paciente' },
  { label: 'Equipo', path: '/equipo' },
  { label: 'Contacto', path: '/contacto' },
];

export const SURGERIES = [
  {
    id: 'endometriosis-multidisciplinaria',
    title: 'Cirugía de endometriosis',
    detailTitle: 'Cirugía de endometriosis multidisciplinaria',
    intro:
      'Del síntoma a la recuperación. Cada etapa define la siguiente. Operamos solo cuando hay una indicación clara.',
    image: endometriosisSurgeryImage,
    imageAlt: 'Ilustración de la cirugía de endometriosis multidisciplinaria',
    steps: [
      {
        title: 'Síntomas e impacto',
        text: 'Caracterizamos tu dolor y cómo afecta tu día, tu descanso y tu sexualidad.',
      },
      {
        title: 'Diagnóstico y mapeo',
        text: 'Ecografía especializada y/o resonancia con protocolo de endometriosis para localizar cada lesión.',
      },
      {
        title: '¿Hay indicación de cirugía?',
        text: 'Muchos casos se controlan sin operar. Lo decidimos juntos',
      },
      {
        title: 'Prehabilitación',
        text: 'Preparamos tu cuerpo y el control del dolor para una recuperación más rápida y segura.',
      },
      {
        title: 'Cirugía laparoscópica multidisciplinaria',
        text: 'Resección por mínima invasión con el equipo completo.',
      },
      {
        title: 'Rehabilitación',
        text: 'Kinesiología de piso pélvico y seguimiento para sostener el resultado.',
      },
    ],
    callout:
      '[Nota destacada: No todos los casos de endometriosis requieren cirugía. Texto de relleno que refuerza el enfoque personalizado y la decisión compartida con la paciente.]',
    reference: {
      label: 'Guía informativa para el acompañamiento en el manejo quirúrgico de la endometriosis (SOCHOG)',
      href: 'https://sochog.cl/wp-content/uploads/2025/02/GUIA-INFORMATIVA-PARA-EL-ACOMPANAMIENTO-EN-EL-MANEJO-QUIRURGICO-DE-LA-ENDOMETRIOSIS-1.pdf',
      text: 'Ver archivo PDF',
    },
  },
  {
    id: 'histerectomia',
    title: 'Histerectomía (remoción del útero)',
    intro:
      'Una opción para casos específicos. Nunca la primera respuesta, nunca automática.',
    image: hysterectomyImage,
    imageAlt: 'Ilustración de la histerectomía',
    subParts: [
      {
        title: 'Qué es',
        text: 'Cirugía para extirpar el útero. Cuando es posible, conservamos los ovarios para mantener tu función hormonal y evitar una menopausia quirúrgica.',
      },
      {
        title: 'Cuándo se indica',
        text: 'Cuando los síntomas no mejoran con tratamiento médico y ya no buscas embarazo. Causas frecuentes: adenomiosis, miomas y sangrado que no responde a otras terapias.',
      },
      {
        title: 'Cómo la hacemos',
        text: 'Mínima invasión siempre que sea posible — menos dolor y recuperación más rápida que la cirugía abierta.',
      },
    ],
    callout:
      'La histerectomía resuelve lo que nace del útero, pero no cura la endometriosis — sus lesiones están fuera del útero y requieren resección específica.',
    reference: {
      label: 'Guía informativa para la realización de una histerectomía (SOCHOG)',
      href: 'https://sochog.cl/wp-content/uploads/2023/10/GUIA-INFORMATIVA-PARA-LA-REALIZACION-DE-UNA-HISTERECTOMIA.pdf',
      text: 'Ver archivo PDF',
    },
  },
  {
    id: 'preservacion-uterina',
    title: 'Cirugía de preservación uterina',
    intro:
      'La mayoría de las condiciones uterinas pueden tratarse conservando el útero.',
    image: uterinePreservationImage,
    imageAlt: 'Ilustración de la cirugía de preservación uterina',
    options: [
      {
        title: 'Histeroscopía',
        text: 'Por histeroscopía podemos tratar el sangrado actuando sobre el revestimiento interno (ablación endometrial).',
      },
      {
        title: 'Laparoscopía',
        text: 'Por laparoscopía podemos resecar adenomiosis focal en lesiones seleccionadas.',
      },
    ],
  },
  {
    id: 'cirugia-ovarica',
    title: 'Cirugía ovárica (quistes ováricos)',
    intro:
      'Algunos quistes solo requieren observación; otros, cirugía. Una evaluación especializada define la conducta. Cuando se opera, el objetivo es retirar el quiste preservando el ovario siempre que sea posible.',
    image: ovarianSurgeryImage,
    imageAlt: 'Ilustración de la cirugía ovárica',
  },
  {
    id: 'miomas',
    title: 'Miomas',
    intro:
      'Tumores benignos del músculo uterino. Pueden causar sangrado abundante, presión pélvica o infertilidad — o no dar síntomas. Se pueden extraer por laparoscopía o histeroscopía sin quitar el útero cuando se desea preservarlo. El tratamiento es a tu medida.',
    image: fibroidsImage,
    imageAlt: 'Ilustración de la cirugía de miomas',
  },
];

export const CLINICAL_PROBLEMS: ClinicalProblem[] = [
  {
    id: 'endometriosis',
    title: 'Endometriosis',
    description:
      'Tejido similar al endometrio que crece fuera del útero: ovarios, peritoneo, vejiga, intestino y más.',
    image: endometriosisProblemImage,
    imageAlt: 'Imagen ilustrativa de endometriosis',
    sections: [
      {
        title: 'Señales',
        content: (
          <>
            Dolor menstrual intenso, dolor pélvico persistente, dolor sexual, síntomas digestivos o urinarios
            cíclicos, infertilidad.
          </>
        ),
      },
      // { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico de la endometriosis.]' },
      {
        title: 'Qué hacemos',
        content: 'Mapeo de la enfermedad y un plan individualizado de manejo del dolor. La mayoría no requiere cirugía.',
      },
    ],
  },
  {
    id: 'adenomiosis',
    title: 'Adenomiosis',
    description:
      'Tejido endometrial dentro del músculo uterino: el útero se agranda, se vuelve más sensible y se contrae con dolor.',
    image: adenomyosisProblemImage,
    imageAlt: 'Imagen ilustrativa de adenomiosis',
    sections: [
      { title: 'Señales', content: 'Sangrado abundante, dolor menstrual progresivo, dolor pélvico crónico y, a veces, dificultad para embarazarse.' },
      { title: 'Diagnóstico', content: 'Ecografía ginecológica avanzada o resonancia.' },
      { title: 'Qué hacemos', content: 'Tratamiento médico, procedimientos conservadores o cirugía, según tus objetivos.' },
    ],
  },
  {
    id: 'dolor-menstrual-invalidante',
    title: 'Dolor menstrual invalidante',
    description:
      'El dolor que te impide estudiar, trabajar o dormir no es normal.',
    image: menstrualPainImage,
    imageAlt: 'Imagen ilustrativa de dolor menstrual invalidante',
    sections: [
      { title: 'Señales', content: 'Puede ser endometriosis, adenomiosis, miomas u otra causa. Tomar analgésicos sin estudiarlo retrasa el diagnóstico. Es frecuente que tras un tiempo, los análgesicos dejen de funcionar.' },
      { title: 'Qué hacemos', content: 'Diferenciamos un dolor menstrual común de uno secundario a una enfermedad pélvica.' },
    ],
  },
  {
    id: 'sangrado-menstrual-abundante',
    title: 'Sangrado menstrual abundante',
    description:
      'No hay que normalizarlo cuando afecta tu vida.',
    image: heavyBleedingImage,
    imageAlt: 'Imagen ilustrativa de sangrado menstrual abundante',
    sections: [
      { title: 'Señales', content: 'Reglas muy largas, cambios de protección muy frecuentes, coágulos, anemia o fatiga.' },
      { title: 'Causas', content: 'Adenomiosis, miomas, pólipos, alteraciones hormonales o de coagulación.' },
      { title: 'Qué hacemos', content: 'Identificamos si el origen es estructural, hormonal o mixto, y tratamos según la causa.' },
    ],
  },
  {
    id: 'dolor-pelvico-persistente',
    title: 'Dolor pélvico persistente',
    description: (
      <>
        Dolor que se mantiene o reaparece por meses. Casi nunca tiene una sola causa. Pueden convivir inflamación,
        tensión del piso pélvico, sensibilización del sistema nervioso, cicatrices, endometriosis o causas vesicales e
        intestinales.
        <br /><br />
        <strong>El objetivo no es solo encontrar una lesión, sino entender el mecanismo del dolor.</strong>
      </>
    ),
    image: pelvicPainImage,
    imageAlt: 'Imagen ilustrativa de dolor pélvico persistente',
    sections: [
      { title: 'Señales', content: 'Dolor que se mantiene o reaparece por meses.' },
      // { title: 'Diagnóstico', content: '[Texto de relleno sobre el abordaje diagnóstico del dolor pélvico persistente.]' },
      { title: 'Qué hacemos', content: 'Evaluación integral y un plan que combina tratamiento médico, kinesiología, manejo del dolor y apoyo psicológico.' },
    ],
  },
  {
    id: 'dolor-actividad-sexual',
    title: 'Dolor en actividad sexual',
    description: (
      <>
        No debe vivirse con culpa ni resignación. Puede originarse en el fondo vaginal, útero, endometriosis profunda, piso pélvico o sensibilización del dolor.
        <br /><br />
        <strong>La kinesiología de piso pélvico es clave en el tratamiento.</strong>
      </>
    ),
    image: sexualPainImage,
    imageAlt: 'Imagen ilustrativa de dolor en actividad sexual',
    sections: [
      { title: 'Señales', content: 'Dolor durante o después del sexo.' },
      { title: 'Qué hacemos', content: 'Precisamos el tipo de dolor (superficial, profundo, posicional o cíclico) y tratamos con un enfoque interdisciplinario y respetuoso.' },
    ],
  },
];

export const TEAM: TeamMember[] = [
  {
    name: 'Dr. Mauricio Correa',
    role: 'Director Clínico REDEP',
    bio: (
      <>
        Cirugía mínimamente invasiva y endometriosis.
        <br />
        <ul>
          <li>Director Unidad Endometriosis Clínica Alemana Valdivia.</li>
          <li>Doctor en Ciencias Médicas.</li>
          <li>Director Instituto Ginecología y Obstetricia Universidad Austral de Chile.</li>
          <li>Miembro Directorio Cirugía Mínimamente Invasiva SOCHOG.</li>
        </ul>
      </>
    ),
    image: mauricioImage,
    mobileImage: mauricioMobileImage,
    imageAlt: 'Foto del Dr. Mauricio Correa',
    featured: true,
  },
  { name: 'M.Sc. Denisse Araya', role: 'Sicóloga clínica', bio: 'Formación en endometriosis y terapia de reprocesamiento de dolor.', image: denisseArayaImage, imageAlt: 'Foto de Denisse Araya' },
  { name: 'Macarena Ferrari', role: 'Nutricionista', bio: 'Apoyo nutricional en pacientes con endometriosis y dolor pélvico.', image: macarenaFerrariImage, imageAlt: 'Foto de Macarena Ferrari' },
  { name: 'Stephanie Quijada', role: 'Kinesioterapia piso pélvico', bio: 'Rehabilitación de piso pélvico y acompañamiento terapéutico.', image: stephanieQuijadaImage, imageAlt: 'Foto de Stephanie Quijada' },
  { name: 'Andrea Gutierrez', role: 'Kinesioterapia piso pélvico', bio: 'Rehabilitación funcional y abordaje kinésico del dolor pélvico.', image: andreaGutierrezImage, imageAlt: 'Foto de Andrea Gutierrez' },
  { name: 'Camila Alvallay', role: 'Kinesioterapia piso pélvico', bio: 'Rehabilitación pélvica en dolor persistente y disfunción del piso pélvico.', image: camilaAlvallayImage, imageAlt: 'Foto de Camila Alvallay' },
  { name: 'Karin Berkhoff', role: 'Médico general', bio: 'Coordinadora de equipo.', image: karinBerkhoffImage, imageAlt: 'Foto de Karin Berkhoff' },
  { name: 'Marcia Avendaño', role: 'Kinesioterapia piso pélvico', bio: 'Rehabilitación kinésica especializada en piso pélvico.', image: 'https://placehold.co/400x400/f5e6df/7f3e27?text=Foto', imageAlt: 'Foto de Marcia Avendaño' },
  { name: 'Octavia Ihnen', role: 'Matrona integral', bio: 'Acompañamiento integral y educación clínica para pacientes.', image: octaviaIhnenImage, imageAlt: 'Foto de Octavia Ihnen' },
  { name: 'Francibel Figueroa', role: 'Coordinación infertilidad', bio: 'Coordinación de procesos asociados a infertilidad.', image: francibelFigueroaImage, imageAlt: 'Foto de Francibel Figueroa' },
];

export const RESOURCES = [
  {
    title: 'Modelo de reconstrucción 3D basado en clasificación #Enzian',
    description: 'Modelo educativo interactivo para visualizar una reconstrucción 3D.',
    image: enzianThumbnailImage,
    imageAlt: 'Vista previa del modelo de reconstrucción 3D basado en clasificación #Enzian',
    cta: 'Ver modelo',
    href: '/apoyo-al-paciente/modelo-enzian',
  },
  {
    title: 'PEMP — Perfil Evaluativo de Mecanismos del Dolor Pélvico',
    description: 'Cuestionario educativo de auto-reporte para orientar la comprensión de los mecanismos del dolor pélvico persistente.',
    image: pempThumbnailImage,
    imageAlt: 'Vista previa del cuestionario PEMP sobre mecanismos del dolor pélvico',
    cta: 'Iniciar cuestionario',
    href: '/apoyo-al-paciente/pemp',
  },
  {
    title: 'Guía informativa endometriosis (SOCHOG)',
    description: 'Guía informativa para el acompañamiento en el manejo quirúrgico de la endometriosis.',
    image: manualThumbnailImage,
    imageAlt: 'Vista previa del manual para cirugía de endometriosis',
    cta: 'Ver manual',
    href: 'https://sochog.cl/wp-content/uploads/2025/02/GUIA-INFORMATIVA-PARA-EL-ACOMPANAMIENTO-EN-EL-MANEJO-QUIRURGICO-DE-LA-ENDOMETRIOSIS-1.pdf',
  },
  {
    title: 'Guía informativa histerectomía (SOCHOG)',
    description: 'Guía informativa para la realización de una histerectomía.',
    image: manualThumbnailImage,
    imageAlt: 'Vista previa del manual para histerectomía',
    cta: 'Ver manual',
    href: 'https://sochog.cl/wp-content/uploads/2023/10/GUIA-INFORMATIVA-PARA-LA-REALIZACION-DE-UNA-HISTERECTOMIA.pdf',
  },
];
