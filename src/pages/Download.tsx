import React from 'react';
import { Download as DownloadIcon, Smartphone, ShieldAlert } from 'lucide-react';
import NavBar from '@/components/NavBar';

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
          </div>
        </div>
      </div>
    </div>
  );
}
