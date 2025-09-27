import React from 'react';
import type { QuoteState } from '../types';

interface CurrentItemPreviewProps {
    config: QuoteState;
    price: number;
}

const InfoPill: React.FC<{ icon: React.ReactNode, label: string | null | undefined }> = ({ icon, label }) => {
    if (!label) return null;
    return (
        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full">
            <div className="text-slate-500">{icon}</div>
            <span className="text-xs font-semibold text-slate-700">{label}</span>
        </div>
    );
};

const CurrentItemPreview: React.FC<CurrentItemPreviewProps> = ({ config, price }) => {
    const { productLine, width, length, model, color, ralCode } = config;

    const dimensionLabel = width && length ? `${width}x${length} cm` : null;
    const colorLabel = color?.name || (ralCode ? `RAL ${ralCode}` : null);

    return (
        <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-2 flex-grow">
                    <InfoPill 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                        label={productLine}
                    />
                     <InfoPill 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5v4m5 0h-4" /></svg>}
                        label={dimensionLabel}
                    />
                     <InfoPill 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
                        label={model?.name}
                    />
                     <InfoPill 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
                        label={colorLabel}
                    />
                </div>
                <div className="text-right pl-3">
                    <p className="text-xs text-slate-500">Precio actual</p>
                    <p className="text-lg font-bold text-teal-600">
                        {price > 0 ? price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '-'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrentItemPreview;
