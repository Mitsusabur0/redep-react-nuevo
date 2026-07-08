import { Link } from 'react-router-dom';
import { Heart, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { NAV_LINKS } from '../data/content';

export function Footer() {
  return (
    <footer className="bg-ink-900 text-sand-100">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-500 text-white">
                <Heart className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold text-white">REDEP Chile</span>
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Whatsapp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-sand-100 transition-colors hover:bg-sage-600"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-sand-100 transition-colors hover:bg-sage-600"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-sand-100 transition-colors hover:bg-sage-600"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick nav */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sand-200">Navegación</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-sand-200/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sand-200">Contacto</h3>
            <ul className="mt-4 space-y-2 text-sm text-sand-200/70">
              <li>[correo@redepchile.cl]</li>
              <li>[+56 9 0000 0000]</li>
              <li>Valdivia, Chile</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-700 pt-6">
          <p className="text-center text-xs text-sand-200/50">
            {new Date().getFullYear()} REDEP Chile.
          </p>
        </div>
      </div>
    </footer>
  );
}
