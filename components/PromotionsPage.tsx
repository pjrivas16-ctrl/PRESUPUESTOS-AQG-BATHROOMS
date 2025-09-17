import React from 'react';

interface PromotionsPageProps {
    onNavigateToQuoter: () => void;
}

const PromotionsPage: React.FC<PromotionsPageProps> = ({ onNavigateToQuoter }) => {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-white p-10 md:p-12 rounded-2xl shadow-lg border border-slate-200/80 max-w-2xl w-full">
                <div className="w-20 h-20 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">Promociones y Ofertas</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Actualmente no tienes ninguna promoción activa. ¡No te preocupes! Te avisaremos en cuanto tengamos nuevas ofertas disponibles para ti.
                </p>
                <button
                    onClick={onNavigateToQuoter}
                    className="px-8 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2 mx-auto"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Crear un nuevo presupuesto</span>
                </button>
            </div>
        </div>
    );
};

export default PromotionsPage;
