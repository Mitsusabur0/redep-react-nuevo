import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <button
        type="button"
        onClick={closeModel}
        className="fixed right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-card ring-1 ring-sand-200 backdrop-blur transition-colors hover:bg-sand-50"
        aria-label="Cerrar modelo"
        title="Cerrar modelo"
      >
        <X className="h-5 w-5" />
      </button>
      <EnzianApp />
    </div>
  );
}
