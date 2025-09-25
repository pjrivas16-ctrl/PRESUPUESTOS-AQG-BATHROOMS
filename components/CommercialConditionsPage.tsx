import React from 'react';
import type { User } from '../types';

interface CommercialConditionsPageProps {
    user: User;
}

const CommercialConditionsPage: React.FC<CommercialConditionsPageProps> = ({ user }) => {
    
    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Condiciones Comerciales</h2>
            <p className="text-slate-500 mb-8">Información sobre la política de precios y descuentos de la empresa.</p>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Política de Descuentos Flexibles</h3>
                        <p className="text-sm text-slate-500">Nuestra estrategia comercial está diseñada para darte el control.</p>
                    </div>
                </div>

                <div className="space-y-4 text-slate-600">
                    <p>
                        Como agente comercial de AQG, tienes la flexibilidad de <strong>aplicar los descuentos que consideres apropiados</strong> para cada presupuesto directamente en la pantalla de resumen.
                    </p>
                    <p>
                        Los descuentos se aplican por <strong>familia de producto</strong> (ej: SOFTUM, CLASSIC, KITS) y se reflejarán inmediatamente en el precio final de la oferta.
                    </p>
                    <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <p className="font-semibold text-teal-800">¿Cómo funciona?</p>
                        <p className="text-sm text-teal-700 mt-1">Al crear un presupuesto, en el paso final de "Resumen", encontrarás una nueva sección para introducir el porcentaje de descuento para cada línea de producto que hayas incluido.</p>
                    </div>
                    <p>
                        Esta herramienta te permite adaptar cada oferta a las necesidades específicas del cliente y a las condiciones particulares de cada negociación, dándote un mayor poder de cierre.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommercialConditionsPage;