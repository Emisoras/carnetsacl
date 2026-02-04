
import React from 'react';
import { AffiliateData } from '../types';
import { ACLLogo, COLORS } from '../constants';

interface Props {
  data: AffiliateData;
}

const CardFront: React.FC<Props> = ({ data }) => {
  return (
    <div className="relative w-[340px] h-[540px] bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl border border-gray-100 flex flex-col">
      
      {/* Top Header Section */}
      <div 
        className="h-[210px] w-full flex flex-col items-center pt-8 px-4 relative z-40"
        style={{ background: `linear-gradient(135deg, ${COLORS.wineDark} 0%, ${COLORS.wine} 100%)` }}
      >
        <div 
          className="transition-transform duration-200"
          style={{ transform: `scale(${data.logoScale})` }}
        >
          {data.logoUrl ? (
            <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo Institucional" className="h-28 w-auto object-contain mb-2" />
          ) : (
            <ACLLogo className="h-28 mb-2" color="white" />
          )}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Decorative Wave/Curve - Ahora es parte del diseño de transición sin tapar el fondo */}
      <div 
        className="absolute top-[165px] left-0 right-0 h-24 bg-white z-20"
        style={{ 
          clipPath: 'ellipse(75% 50% at 50% 100%)',
          boxShadow: '0 -10px 20px rgba(0,0,0,0.1)'
        }}
      ></div>

      {/* Background Watermark - Re-posicionada para estar al límite exacto */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 flex flex-wrap justify-center items-center overflow-hidden"
        style={{ 
          opacity: data.watermarkOpacity,
          paddingTop: '160px', /* Ajuste para que empiece justo bajo el logo */
          paddingBottom: '56px' /* Ajuste para que termine en el footer */
        }}
      >
        <div 
          className="grid grid-cols-3 gap-x-12 gap-y-16 w-[150%] h-[150%] -rotate-[15deg] items-center justify-items-center"
          style={{ transform: `rotate(${data.watermarkRotation}deg) scale(1.2)` }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center w-24 h-24">
              {data.watermarkUrl ? (
                <img src={data.watermarkUrl} crossOrigin="anonymous" alt="" className="max-w-full max-h-full object-contain grayscale contrast-150" />
              ) : (
                <ACLLogo className="h-20 w-auto" color="black" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Photo Container */}
      <div className="absolute top-[155px] left-1/2 -translate-x-1/2 z-50">
        <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 ring-1 ring-black/5">
          <img 
            src={data.photoUrl} 
            crossOrigin="anonymous"
            alt="Profile" 
            className="w-full h-full object-cover origin-center transition-transform duration-100"
            style={{ 
              transform: `scale(${data.photoScale}) translate(${data.photoX}%, ${data.photoY}%)` 
            }}
          />
        </div>
      </div>

      {/* Identity Info Container */}
      <div className="absolute top-[330px] left-0 right-0 bottom-14 px-4 text-center z-40 flex flex-col justify-start pt-1">
        <div className="space-y-0.5 shrink-0">
          <h2 className="text-[20px] font-brand font-black leading-[1.1] text-gray-900 uppercase tracking-tight break-words max-h-[44px] overflow-hidden">
            {data.firstName}<br />
            <span className="text-gray-800">{data.lastName}</span>
          </h2>
          <div className="h-1 w-8 bg-red-700 mx-auto my-1.5 rounded-full"></div>
          <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
            C.C. {data.documentNumber}
          </p>
        </div>
        
        {/* Affiliate Number Box */}
        <div className="mt-4 py-1.5 px-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-100 inline-flex flex-col items-center mx-auto max-w-[280px] shrink-0">
          <p 
            className="text-[7.5px] font-black tracking-[0.2em] uppercase mb-0.5 leading-none"
            style={{ color: COLORS.wine }}
          >
            AFILIADO NÚMERO
          </p>
          <div className="flex items-center justify-center gap-1.5 px-1 w-full">
            <span className="text-[11px] font-brand font-black text-gray-400 shrink-0">ACL</span>
            <span className="text-base font-brand font-black text-gray-900 whitespace-nowrap">
              {data.affiliateNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div 
        className="absolute bottom-0 left-0 w-full h-14 flex items-center justify-center z-40"
        style={{ background: `linear-gradient(90deg, ${COLORS.wineDark} 0%, ${COLORS.wine} 50%, ${COLORS.wineDark} 100%)` }}
      >
        <p className="text-[22px] font-black text-white uppercase tracking-tighter whitespace-nowrap">
          VOZ ACL
        </p>
      </div>
    </div>
  );
};

export default CardFront;
