import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function NavBar({ dark = false }: { dark?: boolean }) {
  const { session, profile, signOut } = useAuth();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur ${
        dark
          ? 'bg-blueprint-950/90 border-blueprint-700 text-concrete-100'
          : 'bg-concrete-100/90 border-concrete-200 text-blueprint-950'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span
            className={`h-8 w-8 flex items-center justify-center font-display text-[13px] revision-stamp ${
              dark ? 'text-signal-400' : 'text-signal-500'
            }`}
          >
            P
          </span>
          <span className="font-heading font-bold text-lg tracking-tight uppercase">
            PHD Gestões
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link to="/#recursos" className="hover:text-signal-500 transition-colors">Recursos</Link>
          <Link to="/#planos" className="hover:text-signal-500 transition-colors">Planos</Link>
          <Link to="/baixar" className="hover:text-signal-500 transition-colors">Baixar APK</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                to="/painel"
                className="text-sm font-semibold hover:text-signal-500 transition-colors hidden sm:inline"
              >
                {profile?.full_name?.split(' ')[0] || 'Meu painel'}
              </Link>
              <button
                onClick={signOut}
                className="text-sm font-semibold px-4 py-2 rounded-md border border-current/30 hover:border-signal-500 hover:text-signal-500 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-bold px-4 py-2.5 rounded-md border transition-colors ${
                  dark
                    ? 'border-concrete-100/30 hover:border-signal-400 hover:text-signal-400'
                    : 'border-blueprint-950/30 hover:border-signal-500 hover:text-signal-500'
                }`}
              >
                Entrar
              </Link>
              <Link
                to="/login?modo=cadastro"
                className="text-sm font-bold px-4 py-2.5 rounded-md bg-signal-500 text-white hover:bg-signal-400 transition-colors"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
