import React from 'react';
import { Download as DownloadIcon, Smartphone, ShieldAlert } from 'lucide-react';
import NavBar from '@/components/NavBar';
<<<<<<< HEAD
import GlobalBackground from '@/components/GlobalBackground';
import phdLogo from '@/assets/images/phd_app_logo_1785469467323.jpg';

const APK_URL = '/downloads/phd-gestoes.apk';
const APK_VERSION = '1.0.3';

export default function Download() {
  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans relative overflow-hidden flex flex-col">
      <GlobalBackground />

      <NavBar dark />

      <div className="max-w-xl mx-auto px-5 py-16 sm:py-24 w-full relative z-10 my-auto">
        <div className="bg-slate-950/80 border border-white/15 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Subtle Accent Glow Inside Card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-signal-500/10 rounded-full blur-2xl pointer-events-none" />

          <img
            src={phdLogo}
            alt="PHD Gestões App Icon"
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl border border-cyan-400/40 mx-auto shadow-2xl shadow-cyan-500/30 object-cover relative z-10"
          />

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold uppercase tracking-wider relative z-10">
              Versão {APK_VERSION} Android
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
            Baixar Aplicativo Android
          </h1>
          
          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto relative z-10">
            Instalação direta do APK para canteiro de obras. Suporte completo a modo offline com sincronização automática com o sistema desktop.
          </p>

          <div className="pt-2 relative z-10">
            <a
              href={APK_URL}
              download
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-signal-500 via-orange-500 to-amber-500 hover:from-signal-400 hover:to-orange-400 text-white font-extrabold text-base shadow-xl shadow-signal-500/30 hover:scale-[1.02] transition-all w-full sm:w-auto"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Baixar APK PHD Gestões ({APK_VERSION})</span>
            </a>
          </div>

          <div className="text-left space-y-4 pt-6 border-t border-white/10 relative z-10">
            <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Smartphone className="w-5 h-5 text-signal-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-white text-xs block">Como instalar o APK:</strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Abra o arquivo no Android e habilite a permissão de "instalar fontes desconhecidas" quando solicitado.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-white text-xs block">100% Seguro & Sincronizado:</strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  O aplicativo utiliza a mesma conta e banco de dados do portal web desktop.
                </p>
              </div>
            </div>
=======

// Troque pelo link real do APK depois de gerar o build assinado
// (ex: `npm run cap:sync` no projeto do app, gerar o .apk assinado no Android Studio,
// e subir o arquivo em /public/downloads/phd-gestoes.apk deste site, ou num link externo).
const APK_URL = '/downloads/phd-gestoes.apk';
const APK_VERSION = '1.0.1';

export default function Download() {
  return (
    <div className="min-h-screen bg-concrete-100">
      <NavBar />

      <div className="max-w-lg mx-auto px-5 py-16 sm:py-24 text-center">
        <span className="revision-stamp inline-flex text-signal-500 font-mono text-xs uppercase tracking-widest px-3 py-1.5 mb-6">
          REV. {APK_VERSION}
        </span>
        <h1 className="font-heading font-bold uppercase text-3xl">Baixar o app Android</h1>
        <p className="mt-3 text-sm text-concrete-700 leading-relaxed">
          Instalação direta do APK, sem passar pela Google Play. Precisa de aparelho Android
          com permissão pra instalar apps de fontes desconhecidas.
        </p>

        <a
          href={APK_URL}
          download
          className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-md bg-signal-500 text-white font-bold hover:bg-signal-400 transition-colors"
        >
          <DownloadIcon size={18} /> Baixar PHD Gestões ({APK_VERSION})
        </a>

        <div className="mt-10 text-left p-5 rounded-lg border border-concrete-200 bg-white space-y-4">
          <div className="flex gap-3">
            <Smartphone size={18} className="text-signal-500 shrink-0 mt-0.5" />
            <p className="text-sm text-concrete-700">
              <strong className="text-blueprint-950">Como instalar:</strong> abra o arquivo baixado, aceite a
              permissão de "instalar apps desconhecidos" quando o Android pedir, e siga o instalador.
            </p>
          </div>
          <div className="flex gap-3">
            <ShieldAlert size={18} className="text-signal-500 shrink-0 mt-0.5" />
            <p className="text-sm text-concrete-700">
              <strong className="text-blueprint-950">Seguro?</strong> Sim — é o mesmo app, só que instalado fora
              da loja. O login usa a mesma conta que você cria aqui no site.
            </p>
>>>>>>> 81e650ff911497f9aa49347baba54842db56952b
          </div>
        </div>
      </div>
    </div>
  );
}
