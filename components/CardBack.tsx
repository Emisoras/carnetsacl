
import React from 'react';
import { AffiliateData } from '../types';
import { COLORS } from '../constants';

interface Props {
  data: AffiliateData;
}

const CardBack: React.FC<Props> = ({ data }) => {
  return (
    <div className="relative w-[340px] h-[540px] bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl border border-gray-100 flex">
      {/* Left Red Vertical Label */}
      <div 
        className="w-16 h-full flex items-center justify-center overflow-hidden relative shrink-0"
        style={{ background: `linear-gradient(180deg, ${COLORS.wineDark} 0%, ${COLORS.wine} 100%)` }}
      >
        <div className="rotate-[-90deg] whitespace-nowrap">
          <span className="text-white font-brand text-[40px] font-black tracking-tight relative z-10 uppercase">
            #YOSOYACL
          </span>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 flex flex-col p-3 text-gray-700 overflow-hidden justify-between">
        
        {/* Top Info Section */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-5 h-0.5 bg-red-700"></div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-red-800 whitespace-nowrap">Información Oficial</span>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] text-justify font-bold leading-tight text-gray-800 uppercase">
              {data.backAccreditationText}
            </p>
            <p className="text-[8.5px] text-justify leading-tight text-gray-600">
              {data.backSupportText}
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5 leading-none">Mayor Información:</p>
            <p className="text-[10px] font-black text-gray-800 tracking-wide">
              {data.backContactPhone}
            </p>
          </div>
        </div>

        {/* Validity Section */}
        <div className="flex flex-col items-center py-2 shrink-0">
          <p 
            className="text-[8.5px] font-black tracking-[0.2em] uppercase mb-2 whitespace-nowrap"
            style={{ color: COLORS.wine }}
          >
            VÁLIDO HASTA FECHA
          </p>
          <div className="py-2 bg-gray-900 rounded-lg shadow-inner w-full max-w-[340px] flex items-center justify-center">
            <span className="text-white font-brand text-[11px] font-black tracking-tighter uppercase whitespace-nowrap">
              {data.validUntil}
            </span>
          </div>
        </div>

        {/* Signature Section - Eliminado mix-blend para compatibilidad HD */}
        <div className="flex flex-col items-center shrink-0">
          <div className="h-16 w-full flex items-end justify-center relative mb-1">
            <img 
              src={data.presidentSignatureUrl} 
              crossOrigin="anonymous"
              alt="President Signature" 
              className="max-h-full max-w-[130px] object-contain grayscale contrast-150 pb-1"
            />
            <div className="absolute bottom-0 w-3/4 h-[0.5px] bg-gray-300"></div>
          </div>
          <div className="text-center pt-1 w-full max-w-[250px]">
            <p className="text-[9px] font-black text-gray-900 uppercase tracking-normal mb-1">
              {data.presidentName}
            </p>
            <p className="text-[8px] font-bold text-red-800 uppercase tracking-widest leading-none">
              Presidente ACL
            </p>
          </div>
        </div>

        {/* Bottom Website */}
        <div className="text-center border-t border-gray-100 pt-3 shrink-0">
          <p 
            className="text-[9px] font-brand font-black tracking-[0.2em]"
            style={{ color: COLORS.wine }}
          >
            WWW.ACLCOLOMBIA.COM
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
