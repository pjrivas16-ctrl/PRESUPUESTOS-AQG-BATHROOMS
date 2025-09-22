import React from 'react';
import type { User } from '../types';

interface PromotionsPageProps {
    user: User;
    onActivatePromotion: (promoId: string) => void;
}

const PromotionsPage: React.FC<PromotionsPageProps> = ({ user, onActivatePromotion }) => {
    
    const welcomePromo = {
        id: 'new_client_promo',
        title: 'Oferta de Bienvenida',
        description: 'Activa tu promoción para nuevos clientes y disfruta de un 50% + 25% de descuento adicional en todos tus pedidos durante 2 meses.',
        durationDays: 60,
    };
    
    const userPromo = user.promotion;
    const PROMO_DURATION_MS = welcomePromo.durationDays * 24 * 60 * 60 * 1000;

    let promoStatus: 'available' | 'active' | 'expired' = 'available';
    let expirationDate: Date | null = null;
    
    if (userPromo && userPromo.id === welcomePromo.id) {
        const activationTime = userPromo.activationTimestamp;
        const expiryTime = activationTime + PROMO_DURATION_MS;
        expirationDate = new Date(expiryTime);
        
        if (Date.now() < expiryTime) {
            promoStatus = 'active';
        } else {
            promoStatus = 'expired';
        }
    }

    const renderContent = () => {
        switch (promoStatus) {
            case 'active':
                return (
                    <>
                        <p className="text-slate-500 mb-4 max-w-md mx-auto">
                            ¡Tu promoción de bienvenida está activa! Disfruta de tus descuentos.
                        </p>
                        <div className="bg-teal-100 border border-teal-200 text-teal-800 p-4 rounded-lg mb-8">
                            <p className="font-semibold">Válida hasta:</p>
                            <p className="text-lg">{expirationDate?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </>
                );
            case 'expired':
                 return (
                    <>
                        <p className="text-slate-500 mb-4 max-w-md mx-auto">
                           Tu promoción de bienvenida ha finalizado.
                        </p>
                        <div className="bg-slate-100 border border-slate-200 text-slate-600 p-4 rounded-lg mb-8">
                            <p className="font-semibold">Expiró el:</p>
                            <p className="text-lg">{expirationDate?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </>
                );
            case 'available':
            default:
                return (
                     <>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">{welcomePromo.description}</p>
                        <button
                            onClick={() => onActivatePromotion(welcomePromo.id)}
                            className="px-8 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Activar Promoción
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-white p-10 md:p-12 rounded-2xl shadow-lg border border-slate-200/80 max-w-2xl w-full">
                <div className="w-20 h-20 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">{welcomePromo.title}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default PromotionsPage;