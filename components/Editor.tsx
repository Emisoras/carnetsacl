
import React from 'react';
import { AffiliateData } from '../types';

interface Props {
  data: AffiliateData;
  onChange: (newData: AffiliateData) => void;
  onExport: (id: string, fileName: string) => Promise<void>;
  exportProgress: number;
  exportStatus: string;
  onExportPdf: (fileName: string) => Promise<void>;
}

const Editor: React.FC<Props> = ({ data, onChange, onExport, exportProgress, exportStatus, onExportPdf }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'range' ? parseFloat(value) : value;
    onChange({ ...data, [name]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AffiliateData, lockField: keyof AffiliateData) => {
    if (data[lockField as keyof AffiliateData]) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLockField = (lockField: keyof AffiliateData) => {
    onChange({ ...data, [lockField as keyof AffiliateData]: !data[lockField as keyof AffiliateData] });
  };

  const resetPhoto = () => {
    onChange({ ...data, photoScale: 1, photoX: 0, photoY: 0 });
  };

  const LockButton = ({ locked, onClick }: { locked: boolean; onClick: () => void }) => (
    <button 
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all duration-200 shadow-sm ${locked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
    >
      {locked ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-md w-full no-print max-h-[90vh] overflow-y-auto border border-slate-200 relative">
      
      {/* Overlay de Progreso de Exportación */}
      {exportProgress > 0 && (
        <div className="absolute top-0 left-0 w-full z-50 animate-in fade-in duration-300">
          <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${exportProgress === 100 ? 'bg-green-500' : 'bg-red-700'}`}
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <div className={`px-6 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest shadow-sm ${exportProgress === 100 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-800'}`}>
            <span>{exportStatus}</span>
            <span>{exportProgress}%</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-b pb-4 pt-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Configuración del Carné</h3>
        <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-widest">Modo Editor</div>
      </div>
      
      {/* Identidad Visual */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Identidad Visual</label>
          <div className="space-y-4">
            <div className={`relative ${data.lockLogo ? 'opacity-75' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase">Logo Principal</label>
                <LockButton locked={data.lockLogo} onClick={() => toggleLockField('lockLogo')} />
              </div>
              <input 
                type="file" 
                accept="image/*"
                disabled={data.lockLogo}
                onChange={(e) => handleFileChange(e, 'logoUrl', 'lockLogo')}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-gray-700 border rounded-lg p-1"
              />
            </div>

            <div className={`relative ${data.lockWatermark ? 'opacity-75' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase">Marca de Agua (Fondo)</label>
                <LockButton locked={data.lockWatermark} onClick={() => toggleLockField('lockWatermark')} />
              </div>
              <input 
                type="file" 
                accept="image/*"
                disabled={data.lockWatermark}
                onChange={(e) => handleFileChange(e, 'watermarkUrl', 'lockWatermark')}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-gray-700 border rounded-lg p-1"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex justify-between">
              Escala Logo <span>{data.logoScale.toFixed(2)}x</span>
            </label>
            <input 
              type="range" 
              name="logoScale" 
              min="0.5" 
              max="2" 
              step="0.01" 
              value={data.logoScale} 
              onChange={handleChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex justify-between">
              Rotación Agua <span>{data.watermarkRotation}°</span>
            </label>
            <input 
              type="range" 
              name="watermarkRotation" 
              min="-180" 
              max="180" 
              step="1" 
              value={data.watermarkRotation} 
              onChange={handleChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                Opacidad Agua <span>{Math.round(data.watermarkOpacity * 100)}%</span>
              </label>
              <LockButton locked={data.lockWatermarkOpacity} onClick={() => toggleLockField('lockWatermarkOpacity')} />
            </div>
            <input 
              type="range" 
              name="watermarkOpacity" 
              min="0" 
              max="1" 
              step="0.01" 
              disabled={data.lockWatermarkOpacity}
              value={data.watermarkOpacity} 
              onChange={handleChange}
              className={`w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800 ${data.lockWatermarkOpacity ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Datos Personales */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nombres</label>
          <input 
            type="text" 
            name="firstName" 
            value={data.firstName} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Apellidos</label>
          <input 
            type="text" 
            name="lastName" 
            value={data.lastName} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Documento de Identidad</label>
          <input 
            type="text" 
            name="documentNumber" 
            value={data.documentNumber} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Afiliado N°</label>
          <input 
            type="text" 
            name="affiliateNumber" 
            value={data.affiliateNumber} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Vigencia</label>
          <input 
            type="text" 
            name="validUntil" 
            value={data.validUntil} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
      </div>

      {/* Foto Settings */}
      <div className="space-y-4 border-t pt-4">
        <div className={`relative ${data.lockPhoto ? 'opacity-75' : ''}`}>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[11px] font-bold text-gray-600 uppercase">Foto Afiliado</label>
            <LockButton locked={data.lockPhoto} onClick={() => toggleLockField('lockPhoto')} />
          </div>
          <input 
            type="file" 
            accept="image/*"
            disabled={data.lockPhoto}
            onChange={(e) => handleFileChange(e, 'photoUrl', 'lockPhoto')}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 border rounded-lg p-1"
          />
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encuadre (Zoom y Posición)</label>
            <button type="button" onClick={resetPhoto} className="text-[10px] text-red-700 font-bold hover:underline">Reset</button>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex justify-between">
              Zoom <span>{data.photoScale.toFixed(2)}x</span>
            </label>
            <input 
              type="range" 
              name="photoScale" 
              min="0.5" 
              max="3" 
              step="0.01" 
              value={data.photoScale} 
              onChange={handleChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex justify-between">
                Eje X <span>{data.photoX}%</span>
              </label>
              <input 
                type="range" 
                name="photoX" 
                min="-100" 
                max="100" 
                step="1" 
                value={data.photoX} 
                onChange={handleChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex justify-between">
                Eje Y <span>{data.photoY}%</span>
              </label>
              <input 
                type="range" 
                name="photoY" 
                min="-100" 
                max="100" 
                step="1" 
                value={data.photoY} 
                onChange={handleChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Firma y Autoridad */}
      <div className="space-y-4 border-t pt-4">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Firma y Autoridad</label>
        
        <div className={`relative ${data.lockSignature ? 'opacity-75' : ''}`}>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[11px] font-bold text-gray-600 uppercase">Firma Presidente (PNG)</label>
            <LockButton locked={data.lockSignature} onClick={() => toggleLockField('lockSignature')} />
          </div>
          <input 
            type="file" 
            accept="image/*"
            disabled={data.lockSignature}
            onChange={(e) => handleFileChange(e, 'presidentSignatureUrl', 'lockSignature')}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-700 border rounded-lg p-1"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nombre del Presidente</label>
          <input 
            type="text" 
            name="presidentName" 
            value={data.presidentName} 
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
      </div>

      {/* Export Options */}
      <div className="pt-4 border-t space-y-3">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
          Acciones de Exportación
          {exportProgress > 0 && exportProgress < 100 && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </label>
        
        <button 
          type="button"
          disabled={exportProgress > 0 && exportProgress < 100}
          onClick={() => onExportPdf(`Carnet_ACL_${data.lastName}`)}
          className="w-full bg-red-800 text-white text-xs font-black py-3 rounded-xl hover:bg-red-900 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Exportar PDF (Ambos + Frente + Reverso)
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            disabled={exportProgress > 0 && exportProgress < 100}
            onClick={() => onExport('card-front-capture', `Frente_ACL_${data.lastName}`)}
            className="bg-blue-600 text-white text-[9px] font-black py-3 rounded-lg hover:bg-blue-700 transition-all flex flex-col items-center justify-center gap-1 uppercase disabled:opacity-50 shadow-sm"
          >
            Frente HD
          </button>
          <button 
            type="button"
            disabled={exportProgress > 0 && exportProgress < 100}
            onClick={() => onExport('card-back-capture', `Reverso_ACL_${data.lastName}`)}
            className="bg-blue-600 text-white text-[9px] font-black py-3 rounded-lg hover:bg-blue-700 transition-all flex flex-col items-center justify-center gap-1 uppercase disabled:opacity-50 shadow-sm"
          >
            Reverso HD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
