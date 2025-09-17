import React from 'react';
import type { QuoteState } from '../types';

interface LivePreviewProps {
    item: QuoteState;
    price: number;
}

const LivePreview: React.FC<LivePreviewProps> = ({ item, price }) => {

    const renderDetail = (label: string, value: string | undefined | null) => {
        if (!value) return null;
        return (
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-b-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
            </div>
        );
    };

    const basePrice = price / 1.21;
    const hasConfig = item.productLine || item.model;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in border border-slate-200/80">
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">Resumen del Artículo</h3>
                {hasConfig ? (
                    <div className="space-y-1">
                        {renderDetail('Modelo', item.productLine)}
                        {renderDetail('Dimensiones', item.width && item.length ? `${item.width} x ${item.length} cm` : null)}
                        {renderDetail('Textura', item.model?.name)}
                        {renderDetail('Color', item.color?.name || (item.ralCode ? `RAL ${item.ralCode}` : null))}
                        {item.extras.length > 0 && renderDetail('Extras', item.extras.map(e => e.name).join(', '))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 text-center py-8">Tu configuración aparecerá aquí.</p>
                )}
                

                <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-slate-600">Base imponible</span>
                        <span className="text-2xl font-bold text-teal-600">
                            {basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 text-right mt-1">+ IVA (21%)</p>
                </div>
            </div>
        </div>
    );
};

export default LivePreview;