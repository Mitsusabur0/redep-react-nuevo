import { useLocation, useNavigate } from 'react-router-dom';
import { StandaloneAppCloseButton } from '../components/StandaloneAppCloseButton';
import EnzianApp from '../features/enzian/EnzianApp.jsx';

type ModelLocationState = {
  from?: string;
};

export default function EnzianModel() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ModelLocationState | null;

  const closeModel = () => {
    navigate(state?.from || '/apoyo-al-paciente', { replace: true });
  };

  return (
    <div className="relative bg-white" style={{ minHeight: '100dvh', width: '100%' }}>
      <StandaloneAppCloseButton
        onClick={closeModel}
        ariaLabel="Cerrar modelo y volver a Apoyo al Paciente"
      />
      <EnzianApp />
    </div>
  );
}
