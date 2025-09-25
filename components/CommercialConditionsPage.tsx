import React from 'react';
import type { User } from '../types';

interface CommercialConditionsPageProps {
    user: User;
}

const CommercialConditionsPage: React.FC<CommercialConditionsPageProps> = ({ user }) => {
    
    const { discounts } = user;

    const discountItems = [
        { label: 'Dto. Platos de Ducha', value: discounts?.showerTrays },
        { label: 'Dto. Platos de Ducha de Terrazo', value: discounts?.terrazzoShowerTrays },
        { label: 'Dto. Encimeras y Lavabos', value: discounts?.countertops },
    ];
    
    const hasDiscounts = discountItems.some(item => item.value !== undefined) || discounts?.classicSpecialCondition;

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Tus Condiciones Comerciales</h2>
            <p className="text-slate-500 mb-8">Aquí puedes consultar los descuentos y condiciones especiales aplicables a tu cuenta.</p>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l-1 1-1-1H6a3 3 0 010-6h1l1 1 1-1h1zm5 0a3 3 0 110 6h-1l-1 1-1-1h-1a3 3 0 010-6h1l1 1 1-1h1z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Resumen de Descuentos</h3>
                        <p className="text-sm text-slate-500">Estos son los descuentos base para cada familia de productos.</p>
                    </div>
                </div>

                {hasDiscounts ? (
                    <div className="space-y-4">
                        {discountItems.map(item => item.value !== undefined && (
                            <div key={item.label} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700">{item.label}:</span>
                                <span className="text-lg font-bold text-teal-600">{item.value}%</span>
                            </div>
                        ))}

                        {discounts?.classicSpecialCondition && (
                            <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">Condiciones Especiales</h4>
                                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <p className="font-semibold text-indigo-800">Colección CLASSIC:</p>
                                    <p className="text-sm text-indigo-700 mt-1">{discounts.classicSpecialCondition}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-500">No tienes condiciones comerciales especiales asignadas.</p>
                        <p className="text-sm text-slate-400 mt-2">Contacta con administración para más detalles.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommercialConditionsPage;
