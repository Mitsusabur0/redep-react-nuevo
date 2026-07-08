import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/content';
import logoImage from '../assets/images/logo.png';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-sand-50/85 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="REDEP Chile — Inicio">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-sand-200 transition-transform group-hover:scale-105 md:h-10 md:w-10">
            <img src={logoImage} alt="" className="h-full w-full object-contain p-1" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-ink-900 md:text-xl">REDEP Chile</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-sage-600 sm:block">
              Endometriosis y Dolor Pélvico
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sage-100 text-sage-800'
                    : 'text-ink-600 hover:bg-sand-100 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-800 hover:bg-sand-100 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`fixed inset-0 top-16 bg-ink-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <nav
          className={`fixed inset-x-0 top-16 origin-top bg-sand-50 px-5 pb-8 pt-4 shadow-lift transition-all duration-300 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                    isActive ? 'bg-sage-100 text-sage-800' : 'text-ink-700 hover:bg-sand-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
