import React from 'react';

interface PromotionBannerProps {
    expirationDate: Date;
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ expirationDate }) => {
    return (
        <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-900 p-4 rounded-r-lg mb-8 animate-fade-in shadow-md" role="alert">
            <div className="flex items-center">
                <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold">¡Oferta de Bienvenida activa!</p>
                    <p className="text-sm">
                        Se está aplicando un <strong>50% + 25% de descuento</strong> en este presupuesto.
                        Válida hasta el {expirationDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} o hasta alcanzar 3000€ de facturación.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromotionBanner;