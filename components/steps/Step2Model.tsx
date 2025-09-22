import React from 'react';
import { SHOWER_MODELS, MILANO_FINISHES } from '../../constants';
import type { ProductOption } from '../../types';

interface Step2ModelProps {
    onSelect: (model: ProductOption) => void;
    selectedModel: ProductOption | null;
    productLine: string | null;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center transition-transform transform scale-0 group-aria-checked:scale-100 duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const Step2Model: React.FC<Step2ModelProps> = ({ onSelect, selectedModel, productLine }) => {
    
    const isCountertop = productLine === 'MILANO';

    const getShowerModels = () => {
        if (productLine === 'SOFTUM') {
            return SHOWER_MODELS.filter(m => m.id === 'sand');
        }
        if (productLine === 'LUXE' || productLine === 'CLASSIC' || productLine === 'LUXE CON TAPETA') {
            return SHOWER_MODELS.filter(m => m.id === 'pizarra');
        }
        if (productLine?.startsWith('FLAT') || productLine?.startsWith('RATIO')) {
             return SHOWER_MODELS.filter(m => m.id === 'lisa');
        }
        return SHOWER_MODELS.filter(m => m.id !== 'sand');
    }

    const modelsToShow = isCountertop ? MILANO_FINISHES : getShowerModels();
    const title = isCountertop ? 'Selecciona el acabado' : 'Selecciona la textura';
    const description = isCountertop ? 'Elige el acabado para tu encimera.' : 'Cada textura ofrece una sensación y estética únicas.';

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 mb-8">{description}</p>
            
            <div className="grid grid-cols-1 gap-4">
                {modelsToShow.map((model) => {
                    const isSelected = selectedModel?.id === model.id;
                    
                    return (
                        <button
                            key={model.id}
                            onClick={() => onSelect(model)}
                            role="radio"
                            aria-checked={isSelected}
                            className="group relative text-left p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 w-full bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500
                            aria-checked:border-teal-500 aria-checked:bg-teal-50 hover:border-teal-400"
                        >
                            <CheckBadge />
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{model.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{model.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Step2Model;