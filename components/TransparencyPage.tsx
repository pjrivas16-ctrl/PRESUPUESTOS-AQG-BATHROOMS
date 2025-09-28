import React from 'react';

const InfoCard: React.FC<{ title: string; description: string; icon: React.ReactNode; children?: React.ReactNode; }> = ({ title, description, icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-left">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
               {icon}
            </div>
            <div>
                 <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
            </div>
        </div>
        <p className="flex-grow text-slate-500 mb-4 text-sm">{description}</p>
        <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-lg mt-auto space-y-2">
            {children}
        </div>
    </div>
);

// Icons
const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l10-10m-10 0a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm10 10a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
    </svg>
);
const DocumentIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const TransparencyPage: React.FC = () => {
    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Transparencia</h2>
            <p className="text-slate-500 mb-6">Información clara y directa sobre tus comisiones y las condiciones de nuestra colaboración.</p>
            
            <div className="flex flex-col gap-6">
                <InfoCard
                    title="Tabla de Comisiones"
                    description="Tabla de comisiones aplicable según el descuento ofrecido al cliente final."
                    icon={<PercentIcon />}
                >
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 40%</span> <span className="font-bold text-teal-600">10% Comisión</span></div>
                        <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 45%</span> <span className="font-bold text-teal-600">8% Comisión</span></div>
                        <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 50%</span> <span className="font-bold text-teal-600">7% Comisión</span></div>
                        
                        <div className="pt-2 mt-2 border-t border-slate-300/50">
                            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 55%</span> <span className="font-bold text-teal-600">6% Comisión</span></div>
                            <p className="text-xs text-slate-500 pl-2">↳ Máximo en encimeras, lavabos y terrazos.</p>
                        </div>
                        
                        <div className="pt-2 mt-2 border-t border-slate-300/50">
                            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 60%</span> <span className="font-bold text-teal-600">5% Comisión</span></div>
                            <p className="text-xs text-slate-500 pl-2">↳ Máximo para platos de ducha a medida.</p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-300/50">
                            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 65% CLASSIC</span> <span className="font-bold text-teal-600">5% Comisión</span></div>
                            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Descuento 70% CLASSIC</span> <span className="font-bold text-teal-600">4% Comisión</span></div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-300/50">
                            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-600">Netos Especiales</span> <span className="font-bold text-teal-600">3% Comisión</span></div>
                            <p className="text-xs text-slate-500 pl-2">↳ Referido a netos especiales o descuentos mayores del 70%.</p>
                        </div>
                    </div>
                </InfoCard>

                <InfoCard
                    title="Condiciones de Colaboración"
                    description="Resumen de las condiciones clave que rigen nuestra colaboración profesional."
                    icon={<DocumentIcon />}
                >
                    <p className="text-sm"><span className="font-semibold text-slate-600">Liquidación de comisiones:</span> Mensual, sobre todas las ventas.</p>
                    <p className="text-sm"><span className="font-semibold text-slate-600">Objetivos:</span> Deben cumplirse los marcados por la dirección comercial. El no alcanzar las ventas mínimas establecidas para la zona asignada puede ser motivo de rescisión de la colaboración.</p>
                    <p className="text-sm"><span className="font-semibold text-slate-600">Incompatibilidad:</span> La representación de AQG es incompatible con otras marcas que vendan producto homólogo.</p>
                </InfoCard>

                <InfoCard
                    title="Comisiones: Promociones"
                    description="Detalle de las comisiones para ofertas de captación. Estas comisiones se aplican sobre las ventas generadas a través de estas promociones."
                    icon={<PercentIcon />}
                >
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-600">Promo Bienvenida (50%+25%)</span> 
                        <span className="font-bold text-teal-600">8% Comisión</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-600">Promo Expositor + 2 Platos</span> 
                        <span className="font-bold text-teal-600">10% Comisión</span>
                    </div>
                    <div className="text-sm pt-2 mt-2 border-t border-slate-300">
                        <p className="font-semibold text-slate-600">Nota sobre combinación:</p>
                        <p className="text-xs text-slate-500">Si un cliente nuevo adquiere la <strong>Promo de Bienvenida y también la Promo Expositor</strong>, la comisión para ambas ventas será del <strong className="font-bold text-teal-600">10%</strong>.</p>
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

export default TransparencyPage;