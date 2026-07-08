// Central content for REDEP Chile. All body text is placeholder.
// Titles, labels, and navigation are final content as specified.
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
import mauricioImage from '../assets/images/equipo/mauricio.webp';

export const NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Cirugías', path: '/cirugias' },
  { label: 'Problemas Clínicos', path: '/problemas-clinicos' },
  { label: 'Apoyo al Paciente', path: '/apoyo-al-paciente' },
  { label: 'Equipo', path: '/equipo' },
  { label: 'Contacto', path: '/contacto' },
];

export const SURGERIES = [
  {
    id: 'endometriosis-multidisciplinaria',
    title: 'Cirugía de endometriosis multidisciplinaria',
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
      href: 'https://sochog.cl/wp-content/uploads/2025/02/GUIA-INFORMATIVA-PARA-EL-ACOMPANAMIENTO-EN-EL-MANEJO-QUIRURGICO-DE-LA-ENDOMETRIOSIS-1.pdf',
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

export const CLINICAL_PROBLEMS = [
  {
    id: 'endometriosis',
    title: 'Endometriosis',
    description:
      'Tejido similar al endometrio que crece fuera del útero: ovarios, peritoneo, vejiga, intestino y más.',
    image: endometriosisProblemImage,
    imageAlt: 'Imagen ilustrativa de endometriosis',
    sections: [
      { title: 'Señales', text: 'Dolor menstrual intenso, dolor pélvico persistente, dolor sexual, síntomas digestivos o urinarios cíclicos, infertilidad. <br> La intensidad del dolor no depende del tamaño de las lesiones.' },
      // { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico de la endometriosis.]' },
      { title: 'Qué hacemos', text: 'Mapeo de la enfermedad y un plan individualizado de manejo del dolor. La mayoría no requiere cirugía.' },
    ],
  },
  {
    id: 'adenomiosis',
    title: 'Adenomiosis',
    description:
      '[Descripción de la condición aquí. Texto de relleno que explica brevemente la adenomiosis.]',
    image: adenomyosisProblemImage,
    imageAlt: 'Imagen ilustrativa de adenomiosis',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas de la adenomiosis.]' },
      { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico de la adenomiosis.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
  {
    id: 'dolor-menstrual-invalidante',
    title: 'Dolor menstrual invalidante',
    description:
      '[Descripción de la condición aquí. Texto de relleno sobre el dolor menstrual que interfiere con la vida cotidiana.]',
    image: menstrualPainImage,
    imageAlt: 'Imagen ilustrativa de dolor menstrual invalidante',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas del dolor menstrual invalidante.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
  {
    id: 'sangrado-menstrual-abundante',
    title: 'Sangrado menstrual abundante',
    description:
      '[Descripción de la condición aquí. Texto de relleno sobre el sangrado menstrual excesivo.]',
    image: heavyBleedingImage,
    imageAlt: 'Imagen ilustrativa de sangrado menstrual abundante',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas del sangrado abundante.]' },
      { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico del sangrado abundante.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
  {
    id: 'dolor-pelvico-persistente',
    title: 'Dolor pélvico persistente',
    description:
      '[Descripción de la condición aquí. Texto de relleno sobre el dolor pélvico crónico y persistente.]',
    image: pelvicPainImage,
    imageAlt: 'Imagen ilustrativa de dolor pélvico persistente',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas del dolor pélvico persistente.]' },
      { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico del dolor pélvico persistente.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
  {
    id: 'dolor-actividad-sexual',
    title: 'Dolor en actividad sexual',
    description:
      '[Descripción de la condición aquí. Texto de relleno sobre el dolor durante la actividad sexual.]',
    image: sexualPainImage,
    imageAlt: 'Imagen ilustrativa de dolor en actividad sexual',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas del dolor en actividad sexual.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
];

export const TEAM = [
  {
    name: 'Dr. Mauricio Correa',
    role: 'Director Clínico REDEP',
    bio: '[Biografía breve de relleno sobre la trayectoria y enfoque clínico del director.]',
    image: mauricioImage,
    imageAlt: 'Foto del Dr. Mauricio Correa',
    featured: true,
  },
  { name: 'M.Sc. Denisse Araya', role: 'Sicóloga clínica', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/c7dccc/243a2c?text=Foto', imageAlt: 'Foto de Denisse Araya' },
  { name: 'Macarena Ferrari', role: 'Nutricionista', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/e3ede5/345840?text=Foto', imageAlt: 'Foto de Macarena Ferrari' },
  { name: 'Stephanie Quijada', role: 'Kinesioterapia piso pélvico', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/f5e6df/7f3e27?text=Foto', imageAlt: 'Foto de Stephanie Quijada' },
  { name: 'Andrea Gutierrez', role: 'Kinesioterapia piso pélvico', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/dcc9ad/5a4431?text=Foto', imageAlt: 'Foto de Andrea Gutierrez' },
  { name: 'Camila Alvallay', role: 'Kinesioterapia piso pélvico', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/c7dccc/243a2c?text=Foto', imageAlt: 'Foto de Camila Alvallay' },
  { name: 'Karin Berkhoff', role: 'Médico general', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/e3ede5/345840?text=Foto', imageAlt: 'Foto de Karin Berkhoff' },
  { name: 'Marcia Avendaño', role: 'Kinesioterapia piso pélvico', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/f5e6df/7f3e27?text=Foto', imageAlt: 'Foto de Marcia Avendaño' },
  { name: 'Octavia Ihnen', role: 'Matrona integral', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/dcc9ad/5a4431?text=Foto', imageAlt: 'Foto de Octavia Ihnen' },
  { name: 'Francibel Figueroa', role: 'Coordinación infertilidad', bio: '[Biografía breve de relleno.]', image: 'https://placehold.co/400x400/c7dccc/243a2c?text=Foto', imageAlt: 'Foto de Francibel Figueroa' },
];

export const RESOURCES = [
  {
    title: 'Modelo de reconstrucción 3D basado en clasificación #Enzian',
    description: '[Descripción del recurso. Texto de relleno sobre el modelo de reconstrucción 3D.]',
    cta: 'Ver modelo',
    href: '#',
  },
];
