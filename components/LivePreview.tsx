import React from 'react';
import type { QuoteState } from '../types';

interface LivePreviewProps {
    item: QuoteState;
    price: number;
}

const LivePreview: React.FC<LivePreviewProps> = ({ item, price }) => {

    const renderDetail = (label: string, value: React.ReactNode) => {
        if (!value) return null;
        return (
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-b-0">
                <span className="text-sm text-slate-500">{label}</span>
                <div className="text-sm font-semibold text-slate-700 text-right">{value}</div>
            </div>
        );
    };

    const ColorSwatch: React.FC<{ hex?: string; text?: string; }> = ({ hex, text }) => (
        <div className="flex items-center gap-2">
            {hex && (
                <div 
                    className="w-4 h-4 rounded-full border border-slate-300" 
                    style={{ backgroundColor: hex }}
                />
            )}
            <span>{text}</span>
        </div>
    );

    const basePrice = price / 1.21;
    const hasConfig = item.productLine || item.model;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in border border-slate-200/80">
             <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">Tu Configuración</h3>

                {hasConfig ? (
                    <div className="space-y-1">
                        {renderDetail('Colección', item.productLine)}
                        {renderDetail('Dimensiones', item.width && item.length ? `${item.width} x ${item.length} cm` : null)}
                        {renderDetail('Medidas de Corte', item.cutWidth && item.cutLength ? <span className="text-teal-600">{`${item.cutWidth} x ${item.cutLength} cm`}</span> : null)}
                        {renderDetail('Textura', item.model?.name)}
                        {renderDetail('Color', item.color?.name ? <ColorSwatch hex={item.color.hex} text={item.color.name} /> : (item.ralCode ? <ColorSwatch text={`RAL ${item.ralCode}`} /> : null))}
                        {item.bitonoColor && renderDetail('Color Tapa', <ColorSwatch hex={item.bitonoColor.hex} text={item.bitonoColor.name} />)}
                        {item.extras.length > 0 && renderDetail('Extras', item.extras.map(e => e.id === 'bitono' ? 'Tapa Bitono' : e.name).join(', '))}
                        {item.structFrames && item.productLine === 'STRUCT DETAIL' && renderDetail('Marcos', `${item.structFrames}`)}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 text-center py-8">Tu configuración aparecerá aquí.</p>
                )}
                

                <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-slate-600">Total Artículo (ud.)</span>
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