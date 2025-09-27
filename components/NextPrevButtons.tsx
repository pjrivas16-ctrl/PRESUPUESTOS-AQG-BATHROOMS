

import React from 'react';

interface NextPrevButtonsProps {
    onNext: () => void;
    onPrev: () => void;
    currentStep: number;
    totalSteps: number;
    isNextDisabled?: boolean;
    isLastStep: boolean;
    onDiscard: () => void;
}

const NextPrevButtons: React.FC<NextPrevButtonsProps> = ({ onNext, onPrev, currentStep, totalSteps, isNextDisabled, isLastStep, onDiscard }) => {

    return (
        <div className="p-4 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200 flex justify-between items-center">
             <div>
                <button
                    onClick={onDiscard}
                    className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 rounded-md transition-colors"
                >
                    Descartar
                </button>
            </div>
            <div className="flex items-center gap-3">
                 <button
                    onClick={onPrev}
                    disabled={currentStep === 1}
                    className="px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-200/60 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Atrás
                </button>
                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="px-5 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:shadow-lg disabled:from-teal-300 disabled:to-cyan-300 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-1"
                >
                    {isLastStep ? 'Añadir y ver resumen' : 'Siguiente'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NextPrevButtons;
