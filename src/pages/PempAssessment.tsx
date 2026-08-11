import { useLocation, useNavigate } from 'react-router-dom';
import { StandaloneAppCloseButton } from '../components/StandaloneAppCloseButton';

type PempLocationState = {
  from?: string;
};

export default function PempAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PempLocationState | null;
  const pempUrl = `${import.meta.env.BASE_URL}pemp/index.html`;

  const closeAssessment = () => {
    navigate(state?.from || '/apoyo-al-paciente', { replace: true });
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-white">
      <StandaloneAppCloseButton
        onClick={closeAssessment}
        ariaLabel="Cerrar Brújula y volver a Apoyo al Paciente"
      />
      <iframe
        src={pempUrl}
        title="Brújula del Dolor Pélvico"
        className="h-full w-full border-0"
      />
    </div>
  );
}
