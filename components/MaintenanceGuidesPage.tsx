import React, { useState } from 'react';
import { encimera_page_1_b64, encimera_page_2_b64, plato_page_1_b64, plato_page_2_b64 } from '../assets/guides';

// Make jsPDF available from window
declare global {
    interface Window {
        jspdf: any;
    }
}

const GuideCard: React.FC<{ title: string; description: string; onDownload: () => void; isGenerating: boolean; }> = ({ title, description, onDownload, isGenerating }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">{title}</h3>
        <p className="flex-grow text-slate-500 mb-6 text-sm">{description}</p>
        <button
            onClick={onDownload}
            disabled={isGenerating}
            className="w-full mt-auto px-6 py-2.5 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 disabled:cursor-wait"
        >
            {isGenerating ? 'Generando PDF...' : 'Descargar Guía'}
        </button>
    </div>
);


const MaintenanceGuidesPage: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const handleDownload = (guideType: 'platos' | 'encimeras') => {
        setIsGenerating(guideType);
        
        // Using setTimeout to allow UI to update before blocking with PDF generation
        setTimeout(() => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                const pageWidth = 210;
                const pageHeight = 297;

                if (guideType === 'platos') {
                    doc.addImage(plato_page_1_b64, 'JPEG', 0, 0, pageWidth, pageHeight);
                    doc.addPage();
                    doc.addImage(plato_page_2_b64, 'JPEG', 0, 0, pageWidth, pageHeight);
                    doc.save('guia_mantenimiento_platos_ducha_aqg.pdf');
                } else {
                    doc.addImage(encimera_page_1_b64, 'JPEG', 0, 0, pageWidth, pageHeight);
                    doc.addPage();
                    doc.addImage(encimera_page_2_b64, 'JPEG', 0, 0, pageWidth, pageHeight);
                    doc.save('guia_mantenimiento_encimeras_aqg.pdf');
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
            } finally {
                setIsGenerating(null);
            }
        }, 50); // Small delay for UI update
    };

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Guías de Mantenimiento</h2>
            <p className="text-slate-500 mb-8">Descarga nuestras guías de instalación y mantenimiento para asegurar la longevidad y el correcto funcionamiento de tus productos AQG.</p>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GuideCard
                    title="Platos de Ducha"
                    description="Guía completa para la instalación y el cuidado de nuestros platos de ducha de resina con cargas minerales."
                    onDownload={() => handleDownload('platos')}
                    isGenerating={isGenerating === 'platos'}
                />
                <GuideCard
                    title="Encimeras"
                    description="Instrucciones detalladas para la instalación y el mantenimiento de las encimeras de resina AQG."
                    onDownload={() => handleDownload('encimeras')}
                    isGenerating={isGenerating === 'encimeras'}
                />
            </div>
        </div>
    );
};

export default MaintenanceGuidesPage;
