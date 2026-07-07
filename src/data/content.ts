// Central content for REDEP Chile. All body text is placeholder.
// Titles, labels, and navigation are final content as specified.

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
      '[Descripción del procedimiento aquí. Texto de relleno que explica brevemente el enfoque quirúrgico multidisciplinario adoptado por el equipo REDEP para el tratamiento de la endometriosis.]',
    image: 'https://placehold.co/720x540/dcc9ad/5a4431?text=Ilustraci%C3%B3n+cl%C3%ADnica',
    imageAlt: 'Ilustración de la cirugía de endometriosis multidisciplinaria',
    steps: [
      {
        title: 'Síntomas e impacto',
        text: '[Descripción del primer paso aquí. Texto de relleno sobre la evaluación inicial de síntomas y su impacto en la vida de la paciente.]',
      },
      {
        title: 'Diagnóstico y mapeo',
        text: '[Descripción del segundo paso aquí. Texto de relleno sobre el proceso de diagnóstico detallado y mapeo de lesiones.]',
      },
      {
        title: '¿Hay indicación de cirugía?',
        text: '[Descripción del tercer paso aquí. Texto de relleno sobre la decisión compartida respecto a la indicación quirúrgica.]',
      },
      {
        title: 'Prehabilitación',
        text: '[Descripción del cuarto paso aquí. Texto de relleno sobre la preparación física y emocional previa a la cirugía.]',
      },
      {
        title: 'Cirugía laparoscópica multidisciplinaria',
        text: '[Descripción del quinto paso aquí. Texto de relleno sobre el procedimiento quirúrgico laparoscópico realizado por el equipo multidisciplinario.]',
      },
      {
        title: 'Rehabilitación',
        text: '[Descripción del sexto paso aquí. Texto de relleno sobre el proceso de rehabilitación postoperatoria y seguimiento.]',
      },
    ],
    callout:
      '[Nota destacada: No todos los casos de endometriosis requieren cirugía. Texto de relleno que refuerza el enfoque personalizado y la decisión compartida con la paciente.]',
    reference: {
      label: 'Guía clínica de referencia',
      href: '#',
      text: '[Enlace a guía clínica externa — placeholder]',
    },
  },
  {
    id: 'histerectomia',
    title: 'Histerectomía (remoción del útero)',
    intro:
      '[Descripción del procedimiento aquí. Texto de relleno que introduce brevemente la histerectomía como opción quirúrgica.]',
    image: 'https://placehold.co/720x540/c7dccc/243a2c?text=Ilustraci%C3%B3n+cl%C3%ADnica',
    imageAlt: 'Ilustración de la histerectomía',
    subParts: [
      {
        title: 'Qué es',
        text: '[Descripción aquí. Texto de relleno que explica en qué consiste la histerectomía.]',
      },
      {
        title: 'Cuándo se indica',
        text: '[Descripción aquí. Texto de relleno sobre las indicaciones clínicas para este procedimiento.]',
      },
      {
        title: 'Cómo la hacemos',
        text: '[Descripción aquí. Texto de relleno sobre el abordaje quirúrgico y la técnica utilizada por el equipo.]',
      },
    ],
    callout:
      '[Nota destacada: Aclaración de una concepción errónea común sobre la histerectomía. Texto de relleno.]',
    reference: {
      label: 'Recurso de referencia',
      href: '#',
      text: '[Enlace a recurso externo — placeholder]',
    },
  },
  {
    id: 'preservacion-uterina',
    title: 'Cirugía de preservación uterina',
    intro:
      '[Descripción del procedimiento aquí. Texto de relleno que introduce las opciones de cirugía conservadora orientadas a preservar el útero.]',
    image: 'https://placehold.co/720x540/e3ede5/345840?text=Ilustraci%C3%B3n+cl%C3%ADnica',
    imageAlt: 'Ilustración de la cirugía de preservación uterina',
    options: [
      {
        title: 'Histeroscopía',
        text: '[Descripción aquí. Texto de relleno sobre la histeroscopía como opción de preservación uterina.]',
      },
      {
        title: 'Laparoscopía',
        text: '[Descripción aquí. Texto de relleno sobre la laparoscopía como opción de preservación uterina.]',
      },
    ],
  },
  {
    id: 'cirugia-ovarica',
    title: 'Cirugía ovárica (quistes ováricos)',
    intro:
      '[Descripción del procedimiento aquí. Texto de relleno sobre el abordaje quirúrgico de quistes ováricos.]',
    image: 'https://placehold.co/720x540/f5e6df/7f3e27?text=Ilustraci%C3%B3n+cl%C3%ADnica',
    imageAlt: 'Ilustración de la cirugía ovárica',
  },
  {
    id: 'miomas',
    title: 'Miomas',
    intro:
      '[Descripción del procedimiento aquí. Texto de relleno sobre el tratamiento quirúrgico de los miomas uterinos.]',
    image: 'https://placehold.co/720x540/dcc9ad/5a4431?text=Ilustraci%C3%B3n+cl%C3%ADnica',
    imageAlt: 'Ilustración de la cirugía de miomas',
  },
];

export const CLINICAL_PROBLEMS = [
  {
    id: 'endometriosis',
    title: 'Endometriosis',
    description:
      '[Descripción de la condición aquí. Texto de relleno que explica brevemente la endometriosis y su impacto en la vida de la paciente.]',
    image: 'https://placehold.co/640x480/c7dccc/243a2c?text=Imagen+cl%C3%ADnica',
    imageAlt: 'Imagen ilustrativa de endometriosis',
    sections: [
      { title: 'Señales', text: '[Texto de relleno sobre las señales y síntomas característicos de la endometriosis.]' },
      { title: 'Diagnóstico', text: '[Texto de relleno sobre el abordaje diagnóstico de la endometriosis.]' },
      { title: 'Qué hacemos', text: '[Texto de relleno sobre el enfoque terapéutico del equipo REDEP.]' },
    ],
  },
  {
    id: 'adenomiosis',
    title: 'Adenomiosis',
    description:
      '[Descripción de la condición aquí. Texto de relleno que explica brevemente la adenomiosis.]',
    image: 'https://placehold.co/640x480/e3ede5/345840?text=Imagen+cl%C3%ADnica',
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
    image: 'https://placehold.co/640x480/f5e6df/7f3e27?text=Imagen+cl%C3%ADnica',
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
    image: 'https://placehold.co/640x480/dcc9ad/5a4431?text=Imagen+cl%C3%ADnica',
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
    image: 'https://placehold.co/640x480/c7dccc/243a2c?text=Imagen+cl%C3%ADnica',
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
    image: 'https://placehold.co/640x480/e3ede5/345840?text=Imagen+cl%C3%ADnica',
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
    image: 'https://placehold.co/400x400/dcc9ad/5a4431?text=Foto+Dr.+Correa',
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
