import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, Home } from 'lucide-react';

function ConstructionScene() {
  return (
    <svg
      viewBox="0 0 240 190"
      className="relative h-52 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="under-construction-stripes" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="#FFFFFF" />
          <rect width="6" height="12" fill="#7C3AED" />
        </pattern>
      </defs>

      <g fill="#DDD6FE" opacity="0.8">
        <rect x="28" y="88" width="30" height="62" rx="2" />
        <rect x="64" y="66" width="34" height="84" rx="2" />
        <rect x="104" y="92" width="26" height="58" rx="2" />
        <rect x="136" y="72" width="32" height="78" rx="2" />
        <rect x="174" y="90" width="30" height="60" rx="2" />
        <rect x="210" y="78" width="22" height="72" rx="2" />
      </g>

      <g fill="#F0EDFE" opacity="0.9">
        <rect x="70" y="76" width="6" height="6" rx="1" />
        <rect x="82" y="76" width="6" height="6" rx="1" />
        <rect x="70" y="88" width="6" height="6" rx="1" />
        <rect x="82" y="88" width="6" height="6" rx="1" />
        <rect x="70" y="100" width="6" height="6" rx="1" />
        <rect x="82" y="100" width="6" height="6" rx="1" />
        <rect x="142" y="82" width="6" height="6" rx="1" />
        <rect x="154" y="82" width="6" height="6" rx="1" />
        <rect x="142" y="94" width="6" height="6" rx="1" />
        <rect x="154" y="94" width="6" height="6" rx="1" />
        <rect x="180" y="100" width="6" height="6" rx="1" />
        <rect x="192" y="100" width="6" height="6" rx="1" />
      </g>

      <g>
        <rect x="92" y="92" width="6" height="58" rx="2" fill="#3821E1" />
        <rect x="148" y="92" width="6" height="58" rx="2" fill="#3821E1" />
        <circle cx="95" cy="83" r="5" fill="#3821E1" />
        <circle cx="151" cy="83" r="5" fill="#3821E1" />

        <polygon points="92,150 112,150 108,143 98,143" fill="#C4B5FD" />
        <polygon points="148,150 168,150 162,143 152,143" fill="#C4B5FD" />

        <rect x="86" y="110" width="68" height="13" rx="3" fill="url(#under-construction-stripes)" />
      </g>

      <g>
        <path d="M182 112 L168 150 L196 150 Z" fill="#8B5CF6" />
        <path d="M171.5 136 L174 150 L190 150 L192.5 136 Z" fill="#EDEBFC" />
        <path d="M176.5 124 L181 112 L183 112 L187.5 124 Z" fill="#C4B5FD" />
        <circle cx="182" cy="110" r="3" fill="#5535FB" />
      </g>
    </svg>
  );
}

export function UnderConstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-20">
      <div className="flex w-full max-w-[640px] flex-col items-center text-center">
        <div className="relative mb-2 flex items-center justify-center">
          <div
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(237,235,252,0.95) 0%, rgba(237,235,252,0) 70%)' }}
            aria-hidden="true"
          />
          <ConstructionScene />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-[15px] font-semibold text-primary-600">
          <Wrench size={16} className="shrink-0" />
          En développement
        </span>

        <h1 className="mt-6 text-[28px] font-extrabold leading-tight text-navy sm:text-[30px]">
          Cette page est en cours de développement
        </h1>

        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
          Nous travaillons actuellement sur cette fonctionnalité pour vous offrir la meilleure expérience possible.
        </p>

        <div className="mt-8 w-full max-w-[620px] border-t border-gray-200" />

        <div className="mt-10 flex items-center gap-2 text-[16px] font-bold text-navy">
          <Clock size={16} className="shrink-0 text-primary-600" />
          Bientôt disponible
        </div>

        <p className="mt-2 text-[15px] text-gray-500">
          Restez connectés, cette page sera bientôt implémentée !
        </p>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="mt-10 inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 px-8 py-3.5 text-[16px] font-bold text-white shadow-md shadow-primary-200 transition-all hover:from-primary-500 hover:to-primary-700 active:scale-[0.98]"
        >
          <Home size={18} className="shrink-0" />
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}