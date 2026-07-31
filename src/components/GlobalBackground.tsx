import React from 'react';
import workerBg from '@/assets/images/worker_mobile_bg_1785468649781.jpg';

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Image Layer */}
      <img
        src={workerBg}
        alt="Trabalhador da construção civil com celular no canteiro de obras"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[1px] brightness-75"
      />

      {/* Dark Vignette & Gradient Overlays for high contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070d19] via-[#070d19]/85 to-[#070d19]/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070d19]/40 to-[#070d19]/90" />

      {/* Subtle Blueprint Mesh */}
      <div className="absolute inset-0 blueprint-grid opacity-15" />

      {/* Ambient Color Glow Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 rounded-full blur-[160px]" />
      <div className="absolute top-[25%] right-[5%] w-[35%] h-[40%] bg-signal-500/15 rounded-full blur-[120px]" />
    </div>
  );
}
