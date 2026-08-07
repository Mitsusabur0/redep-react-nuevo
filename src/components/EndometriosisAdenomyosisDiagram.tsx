type EndometriosisAdenomyosisDiagramProps = {
  initialCondition?: 'endometriosis' | 'adenomiosis';
  compact?: boolean;
};

export function EndometriosisAdenomyosisDiagram({
  initialCondition = 'endometriosis',
  compact = false,
}: EndometriosisAdenomyosisDiagramProps) {
  const params = new URLSearchParams({
    condicion: initialCondition,
    integrado: 'true',
  });

  if (compact) params.set('resumido', 'true');

  const diagramUrl = `${import.meta.env.BASE_URL}endometriosis-adenomiosis/index.html?${params.toString()}`;

  return (
    <div className="w-full" aria-label="Comparación interactiva de endometriosis y adenomiosis">
      <iframe
        key={`${initialCondition}-${compact ? 'compact' : 'full'}`}
        src={diagramUrl}
        title="Diagrama interactivo de endometriosis y adenomiosis"
        className={compact ? 'aspect-[108/103] w-full border-0' : 'aspect-[9/16] max-h-[889px] w-full border-0'}
        loading="lazy"
      />
    </div>
  );
}
