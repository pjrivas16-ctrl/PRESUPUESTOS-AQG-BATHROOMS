import React, { useEffect, useMemo } from 'react';
import { SHOWER_MODELS, STANDARD_COLORS } from '../../constants';
import type { ProductOption } from '../../types';

interface Step2ModelProps {
    onSelect: (model: ProductOption) => void;
    selectedModel: ProductOption | null;
    productLine: string | null;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center transition-transform transform scale-0 group-aria-checked:scale-100 duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="http://www.w3.org/2000/svg" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const Step2Model: React.FC<Step2ModelProps> = ({ onSelect, selectedModel, productLine }) => {
    
    const modelsToShow = useMemo(() => {
        if (productLine === 'SOFTUM') {
            return SHOWER_MODELS.filter(m => m.id === 'sand');
        }
        if (productLine === 'FLAT TERRAZO') {
            return SHOWER_MODELS.filter(m => m.id.startsWith('terrazo-'));
        }
        if (productLine === 'CLASSIC TECH') {
            return SHOWER_MODELS.filter(m => m.id.startsWith('tech-'));
        }
        if (productLine === 'LUXE' || productLine === 'LUXE CON TAPETA' || productLine === 'CLASSIC' || productLine === 'CENTRAL') {
            return SHOWER_MODELS.filter(m => m.id === 'pizarra');
        }
        if (productLine === 'STRUCT' || productLine === 'STRUCT DETAIL') {
            return SHOWER_MODELS.filter(m => m.id === 'pizarra');
        }
        if (productLine?.startsWith('FLAT') || productLine?.startsWith('RATIO')) {
             return SHOWER_MODELS.filter(m => m.id === 'lisa');
        }
        return SHOWER_MODELS.filter(m => m.id !== 'sand' && !m.id.startsWith('terrazo') && !m.id.startsWith('tech-'));
    }, [productLine]);

    useEffect(() => {
        // If there's only one model option and it's not already selected, select it automatically.
        if (modelsToShow.length === 1 && (!selectedModel || selectedModel.id !== modelsToShow[0].id) && productLine !== 'CLASSIC TECH') {
            onSelect(modelsToShow[0]);
        }
    }, [modelsToShow, selectedModel, onSelect, productLine]);

    const isClassicTech = productLine === 'CLASSIC TECH';
    const title = isClassicTech ? 'Selecciona el acabado' : 'Selecciona la textura';
    const description = isClassicTech ? 'Elige uno de nuestros acabados de impresión digital. La rejilla se suministra impresa a juego.' : 'Cada textura ofrece una sensación y estética únicas.';


    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 mb-8">{description}</p>
            
            <div className="grid grid-cols-1 gap-4">
                {modelsToShow.map((model) => {
                    const isSelected = selectedModel?.id === model.id;
                    const isDisabled = modelsToShow.length === 1 && productLine !== 'FLAT TERRAZO' && !isClassicTech;
                    
                    let colorSwatch = null;
                    if (productLine === 'FLAT TERRAZO' && model.id.startsWith('terrazo-')) {
                        const colorId = model.id.replace('terrazo-', '');
                        const color = STANDARD_COLORS.find(c => c.id === colorId);
                        if (color) {
                            colorSwatch = (
                                <div 
                                    style={{ backgroundColor: color.hex }}
                                    className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${color.hex === '#FFFFFF' ? 'border-slate-300' : 'border-transparent'}`}
                                ></div>
                            );
                        }
                    }

                    return (
                        <button
                            key={model.id}
                            onClick={() => onSelect(model)}
                            role="radio"
                            aria-checked={isSelected}
                            disabled={isDisabled}
                            className="group relative text-left p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 w-full bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500
                            aria-checked:border-teal-500 aria-checked:bg-teal-50 hover:border-teal-400
                            disabled:cursor-default disabled:hover:border-teal-500 disabled:bg-teal-50"
                        >
                            <CheckBadge />
                            <div className="flex items-center gap-4">
                                {colorSwatch}
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{model.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{model.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedModel?.id === 'tech-decorado-cliente' && (
                <div className="mt-6 text-sm text-amber-800 bg-amber-100 p-4 rounded-lg border border-amber-200 animate-fade-in">
                    <p className="font-bold">Instrucciones para Decorado Personalizado</p>
                    <p className="mt-1">Para este acabado, es necesario contactar con fábrica para especificar el decorado deseado. Puede suministrar una imagen de alta resolución o una referencia de un banco de imágenes.</p>
                </div>
            )}
        </div>
    );
};

export default Step2Model;