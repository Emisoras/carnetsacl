
import React, { useState, useEffect } from 'react';
import { AffiliateData, CardSide } from './types';
import { DEFAULT_DATA } from './constants';
import CardFront from './components/CardFront';
import CardBack from './components/CardBack';
import Editor from './components/Editor';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [data, setData] = useState<AffiliateData>(DEFAULT_DATA);
  const [activeSide, setActiveSide] = useState<CardSide>(CardSide.FRONT);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<string>("");

  const handleCapture = async (id: string, fileName: string) => {
    setExportProgress(10);
    setExportStatus("Preparando elementos...");
    
    try {
      // Esperar a que las fuentes estén listas
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setExportProgress(40);
      setExportStatus("Renderizando imagen HD...");
      
      const node = document.getElementById(id);
      if (!node) {
        throw new Error("El elemento de captura no se encontró.");
      }
      
      // Dimensiones dinámicas para captura combinada vs individual
      const isCombined = id === 'card-combined-capture';
      const rect = node.getBoundingClientRect();
      const captureWidth = isCombined ? Math.round(rect.width) || 740 : 340;
      const captureHeight = isCombined ? Math.round(rect.height) || 580 : 540;
      
      // toPng suele ser más estable para capturas complejas que toJpeg
      const dataUrl = await htmlToImage.toPng(node, { 
        pixelRatio: 5, // Mantener calidad de impresión existente
        width: captureWidth, 
        height: captureHeight, 
        backgroundColor: '#ffffff',
        cacheBust: true,
        useCORS: true, // Manejo de imágenes externas
      });
      
      setExportProgress(85);
      setExportStatus("Generando archivo...");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportProgress(100);
      setExportStatus("¡Exportado con éxito!");
      
      setTimeout(() => {
        setExportProgress(0);
        setExportStatus("");
      }, 3000);

    } catch (err) {
      console.error('Error al capturar:', err);
      setExportStatus("Error: Reintenta");
      setExportProgress(0);
      alert("Hubo un error al generar la imagen. Intenta cerrar otras pestañas o usa una foto más pequeña.");
    }
  };

  const handleExportPdf = async (fileName: string) => {
    setExportProgress(10);
    setExportStatus('Preparando PDF...');
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 600));

      const combinedNode = document.getElementById('card-combined-capture');
      const frontNode = document.getElementById('card-front-capture');
      const backNode = document.getElementById('card-back-capture');
      if (!combinedNode || !frontNode || !backNode) {
        throw new Error('Elementos de captura no encontrados');
      }

      const rect = combinedNode.getBoundingClientRect();
      const combinedWidth = Math.round(rect.width) || 740;
      const combinedHeight = Math.round(rect.height) || 580;

      const [combinedDataUrl, frontDataUrl, backDataUrl] = await Promise.all([
        htmlToImage.toPng(combinedNode, {
          pixelRatio: 5,
          width: combinedWidth,
          height: combinedHeight,
          backgroundColor: '#ffffff',
          cacheBust: true,
          useCORS: true,
        }),
        htmlToImage.toPng(frontNode, {
          pixelRatio: 5,
          width: 340,
          height: 540,
          backgroundColor: '#ffffff',
          cacheBust: true,
          useCORS: true,
        }),
        htmlToImage.toPng(backNode, {
          pixelRatio: 5,
          width: 340,
          height: 540,
          backgroundColor: '#ffffff',
          cacheBust: true,
          useCORS: true,
        }),
      ]);

      setExportProgress(80);
      setExportStatus('Componiendo PDF...');

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [combinedWidth, combinedHeight] });
      pdf.addImage(combinedDataUrl, 'PNG', 0, 0, combinedWidth, combinedHeight, undefined, 'FAST');
      pdf.addPage([340, 540], 'portrait');
      pdf.addImage(frontDataUrl, 'PNG', 0, 0, 340, 540, undefined, 'FAST');
      pdf.addPage([340, 540], 'portrait');
      pdf.addImage(backDataUrl, 'PNG', 0, 0, 340, 540, undefined, 'FAST');

      pdf.save(`${fileName}.pdf`);

      setExportProgress(100);
      setExportStatus('¡PDF generado!');
      setTimeout(() => { setExportProgress(0); setExportStatus(''); }, 3000);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      setExportStatus('Error: Reintenta');
      setExportProgress(0);
      alert('Hubo un error al generar el PDF. Intenta cerrar otras pestañas o usa una foto más pequeña.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 flex flex-col items-center selection:bg-red-100 selection:text-red-900">
      
      {/* AREA DE CAPTURA - Optimizada para no ser bloqueada por el navegador */}
      <div 
        className="absolute pointer-events-none" 
        style={{ opacity: 0, left: '-10000px', top: '-10000px' }}
        aria-hidden="true"
      >
        <div id="card-combined-capture" className="bg-white p-5 inline-block">
          <div className="flex gap-5 items-center">
            <div id="card-front-capture">
              <CardFront data={data} />
            </div>
            <div id="card-back-capture">
              <CardBack data={data} />
            </div>
          </div>
        </div>
      </div>

      <header className="mb-10 text-center no-print">
        <div className="inline-block bg-red-50 px-4 py-1 rounded-full mb-3">
          <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">Herramienta Institucional</span>
        </div>
        <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tight">
          Carné Digital <span className="text-red-800">ACL</span>
        </h1>
        <h1 className="text-2xl font-brand font-black text-slate-900 tracking-tight">
          Asociación Colombiana de Locutores y Comunicadores
        </h1>
        <p className="text-slate-500 font-medium mt-1">Generador de Identidad para Locutores y Comunicadores</p>
      </header>

      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 items-start justify-center">
        <div className="w-full lg:w-auto lg:sticky lg:top-8 no-print">
          <Editor 
            data={data} 
            onChange={setData} 
            onExport={handleCapture}
            exportProgress={exportProgress}
            exportStatus={exportStatus}
            onExportPdf={(file) => handleExportPdf(file)}
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8 no-print">
            <div className="flex p-1 bg-white rounded-full shadow-sm border border-slate-200">
              <button 
                onClick={() => setActiveSide(CardSide.FRONT)}
                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeSide === CardSide.FRONT ? 'bg-red-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Frente
              </button>
              <button 
                onClick={() => setActiveSide(CardSide.BACK)}
                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeSide === CardSide.BACK ? 'bg-red-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Reverso
              </button>
            </div>
            
            <button 
              onClick={() => handleCapture('card-combined-capture', `Completo_ACL_${data.lastName}`)}
              disabled={exportProgress > 0 && exportProgress < 100}
              className="bg-gray-800 text-white p-2.5 rounded-full shadow-lg hover:bg-gray-900 transition-all group flex items-center gap-2 px-4 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${exportProgress > 0 && exportProgress < 100 ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {exportProgress > 0 && exportProgress < 100 ? 'Procesando...' : 'Descargar Ambos'}
              </span>
            </button>
          </div>

          <div className="print-area flex flex-col items-center">
            <div className="bg-white p-12 rounded-3xl shadow-sm lg:block hidden">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex flex-col items-center gap-4 relative group">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] no-print">Anverso</span>
                  <div className="transform transition-transform hover:scale-[1.02] duration-500">
                    <CardFront data={data} />
                  </div>
                  <button 
                    onClick={() => handleCapture('card-front-capture', `Frente_ACL_${data.lastName}`)}
                    className="absolute -top-2 -right-2 bg-red-800 text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 no-print"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col items-center gap-4 relative group">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] no-print">Reverso</span>
                  <div className="transform transition-transform hover:scale-[1.02] duration-500">
                    <CardBack data={data} />
                  </div>
                  <button 
                    onClick={() => handleCapture('card-back-capture', `Reverso_ACL_${data.lastName}`)}
                    className="absolute -top-2 -right-2 bg-red-800 text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 no-print"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:hidden block mt-8 no-print relative">
              {activeSide === CardSide.FRONT ? (
                <div className="relative">
                  <CardFront data={data} />
                  <button 
                    onClick={() => handleCapture('card-front-capture', `Frente_ACL_${data.lastName}`)}
                    className="absolute -bottom-4 -right-4 bg-red-800 text-white p-4 rounded-full shadow-2xl no-print"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <CardBack data={data} />
                  <button 
                    onClick={() => handleCapture('card-back-capture', `Reverso_ACL_${data.lastName}`)}
                    className="absolute -bottom-4 -right-4 bg-red-800 text-white p-4 rounded-full shadow-2xl no-print"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-slate-400 text-[10px] no-print font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Asociación Colombiana de Locutores y Comunicadores
      </footer>
    </div>
  );
};

export default App;