import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import Cirugias from './pages/Cirugias';
import ProblemasClinicos from './pages/ProblemasClinicos';
import ApoyoAlPaciente from './pages/ApoyoAlPaciente';
import Equipo from './pages/Equipo';
import Contacto from './pages/Contacto';
import EnzianModel from './pages/EnzianModel';
import PempAssessment from './pages/PempAssessment';

const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');
const modelPath = '/apoyo-al-paciente/modelo-enzian';
const pempPath = '/apoyo-al-paciente/pemp';

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '');
  const isStandaloneAppRoute = currentPath === modelPath || currentPath === pempPath;

  return (
    <>
      <ScrollToTop />
      <div className={isStandaloneAppRoute ? '' : 'flex min-h-screen flex-col'}>
        {!isStandaloneAppRoute && <Header />}
        <main className={isStandaloneAppRoute ? '' : 'flex-1'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/cirugias" element={<Cirugias />} />
            <Route path="/problemas-clinicos" element={<ProblemasClinicos />} />
            <Route path="/apoyo-al-paciente" element={<ApoyoAlPaciente />} />
            <Route path="/apoyo-al-paciente/modelo-enzian" element={<EnzianModel />} />
            <Route path="/apoyo-al-paciente/pemp" element={<PempAssessment />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        {!isStandaloneAppRoute && <Footer />}
      </div>
    </>
  );
}

export default App;
