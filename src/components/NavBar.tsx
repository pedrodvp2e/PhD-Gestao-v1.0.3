<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Menu, X, ArrowRight, User, LogOut, Download, Monitor } from 'lucide-react';
import phdLogo from '@/assets/images/phd_app_logo_1785469467323.jpg';

export default function NavBar({ dark = true }: { dark?: boolean }) {
  const { session, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={phdLogo}
            alt="PHD Gestões Logo"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl border border-white/20 shadow-lg shadow-cyan-500/20 object-cover group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight uppercase text-white group-hover:text-signal-400 transition-colors">
                PHD Gestões
              </span>
              <span className="revision-stamp text-[9px] text-signal-400 font-mono px-1.5 py-0.5 rounded">
                Portal Desktop
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Engenharia Civil & Construtoras
            </span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link
            to="/painel"
            className={`hover:text-white transition-colors flex items-center gap-2 ${
              location.pathname === '/painel' ? 'text-signal-400 font-bold' : ''
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Sistema Desktop</span>
          </Link>
          <a href="/#recursos" className="hover:text-white transition-colors">
            Recursos
          </a>
          <a href="/#planos" className="hover:text-white transition-colors">
            Planos
          </a>
          <a href="/#faq" className="hover:text-white transition-colors">
            Dúvidas
          </a>
          <Link
            to="/baixar"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>App Mobile (APK)</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                to="/painel"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-semibold text-slate-200 hover:text-white transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-signal-500/20 text-signal-400 flex items-center justify-center font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>{profile?.full_name?.split(' ')[0] || 'Meu Painel'}</span>
              </Link>
              <button
                onClick={signOut}
                title="Sair da conta"
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-sm font-bold px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-slate-200 hover:text-white transition-all bg-white/5 hover:bg-white/10"
              >
                Entrar no Sistema
              </Link>
              <Link
                to="/painel"
                className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-signal-500 to-orange-500 hover:from-signal-400 hover:to-orange-400 text-white shadow-lg shadow-signal-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Abrir Portal Web</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
          <Link
            to="/painel"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-signal-400 py-2 border-b border-white/5"
          >
            Painel Desktop da Obra
          </Link>
          <a
            href="/#recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-signal-400 py-2 border-b border-white/5"
          >
            Recursos do Sistema
          </a>
          <a
            href="/#planos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-signal-400 py-2 border-b border-white/5"
          >
            Planos & Preços
          </a>
          <Link
            to="/baixar"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-signal-400 py-2 border-b border-white/5"
          >
            Baixar APK Mobile (Android)
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            {session ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl border border-white/10 text-center font-bold text-sm text-white bg-white/5"
                >
                  Entrar
                </Link>
                <Link
                  to="/painel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-signal-500 text-center font-bold text-sm text-white shadow-lg shadow-signal-500/25"
                >
                  Abrir Sistema Web Desktop
                </Link>
              </>
            )}
          </div>
        </div>
      )}
=======
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
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
    </header>
  );
}
