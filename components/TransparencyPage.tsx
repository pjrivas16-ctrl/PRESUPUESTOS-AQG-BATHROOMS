import React from 'react';

const InfoCard: React.FC<{ title: string; description: string; icon: React.ReactNode; children?: React.ReactNode; }> = ({ title, description, icon, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-left">
        <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
               {icon}
            </div>
            <div>
                 <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h3>
            </div>
        </div>
        <p className="flex-grow text-slate-500 mb-6 text-sm">{description}</p>
        <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-lg mt-auto space-y-2">
            {children}
        </div>
    </div>
);

// Icons
const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l10-10m-10 0a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm10 10a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
    </svg>
);
const DocumentIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const TransparencyPage: React.FC = () => {
    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Transparencia</h2>
            <p className="text-slate-500 mb-8">Información clara y directa sobre tus comisiones y las condiciones de nuestra colaboración.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoCard
                    title="Comisiones: Platos de Ducha"
                    description="Tabla de comisiones aplicable a las familias de platos de ducha según el descuento ofrecido al cliente final."
                    icon={<PercentIcon />}
                >
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Dto. 0% a 30%</span> <span className="font-bold text-teal-600">10% Comisión</span></div>
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Dto. 31% a 40%</span> <span className="font-bold text-teal-600">8% Comisión</span></div>
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Dto. 41% a 50%</span> <span className="font-bold text-teal-600">5% Comisión</span></div>
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Dto. > 50%</span> <span className="font-bold text-red-600">0% Comisión</span></div>
                </InfoCard>
                <InfoCard
                    title="Comisiones: Otros"
                    description="Comisiones fijas para el resto de familias de producto, independientemente del descuento aplicado."
                    icon={<PercentIcon />}
                >
                     <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Encimeras y Muebles</span> <span className="font-bold text-teal-600">8% Comisión</span></div>
                     <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Mamparas</span> <span className="font-bold text-teal-600">5% Comisión</span></div>
                </InfoCard>

                <InfoCard
                    title="Condiciones de Colaboración Comercial"
                    description="Resumen de las condiciones comerciales clave que rigen nuestra colaboración profesional."
                    icon={<DocumentIcon />}
                >
                    <p className="text-sm"><span className="font-semibold text-slate-600">Liquidación:</span> Mensual, sobre todas las ventas.</p>
                    <p className="text-sm"><span className="font-semibold text-slate-600">Objetivos:</span> Deben cumplirse los marcados por la dirección comercial.</p>
                    <p className="text-sm"><span className="font-semibold text-slate-600">Incompatibilidad:</span> La representación de AQG es incompatible con otras marcas que vendan producto homólogo.</p>
                </InfoCard>

                <InfoCard
                    title="Comisiones: Promociones Especiales"
                    description="Comisiones aplicables a las promociones especiales ofrecidas para la captación y fidelización de clientes."
                    icon={<PercentIcon />}
                >
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Promo Bienvenida (50%+25%)</span> <span className="font-bold text-teal-600">8% Comisión</span></div>
                    <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Promo Expositor + 2 Platos</span> <span className="font-bold text-teal-600">10% Comisión</span></div>
                </InfoCard>
            </div>
        </div>
    );
};

export default TransparencyPage;