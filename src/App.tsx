import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import Cirugias from './pages/Cirugias';
import ProblemasClinicos from './pages/ProblemasClinicos';
import ApoyoAlPaciente from './pages/ApoyoAlPaciente';
import Equipo from './pages/Equipo';
import Contacto from './pages/Contacto';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cirugias" element={<Cirugias />} />
            <Route path="/problemas-clinicos" element={<ProblemasClinicos />} />
            <Route path="/apoyo-al-paciente" element={<ApoyoAlPaciente />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
