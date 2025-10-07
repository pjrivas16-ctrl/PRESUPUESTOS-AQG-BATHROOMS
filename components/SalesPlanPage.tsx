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
        {children && (
            <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-lg mt-auto space-y-2">
                {children}
            </div>
        )}
    </div>
);

const SpearheadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const DocumentChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


const SalesPlanPage: React.FC = () => {
    const planComercialUrl = 'https://www.dropbox.com/scl/fi/7z5otjvlqbr05v2gdil6k/PLAN-COMERCIAL-2026.pdf?rlkey=jahdk555aawt74mm31w12rbwg&st=yr61q3bq&dl=0';

    return (
        <div className="animate-fade-in h-full p-4 md:p-8 overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Plan de Ventas 2026</h2>
            <p className="text-slate-500 mb-6">Estrategias y herramientas clave para alcanzar nuestros objetivos comerciales.</p>
            
            <div className="flex flex-col gap-6">
                <InfoCard
                    title="CLASSIC: Nuestra Punta de Lanza"
                    description="La colección CLASSIC es nuestra herramienta estratégica para la captación de nuevos clientes. Su precio está minimizado al máximo, casi a coste, para convertirlo en un producto de reclamo irresistible en el mercado."
                    icon={<SpearheadIcon />}
                >
                    <p className="text-sm font-semibold text-slate-600">El Objetivo:</p>
                    <p className="text-sm">
                        No es generar un gran margen con CLASSIC, sino utilizarlo como la puerta de entrada a nuevos clientes. Es el producto perfecto para romper barreras de precio, demostrar nuestra calidad y servicio, y establecer una relación de confianza.
                    </p>
                    <p className="text-sm font-semibold text-slate-600 mt-3">Tu Misión:</p>
                    <p className="text-sm">
                        Utiliza el CLASSIC para conseguir la primera venta. Una vez dentro, tu labor es presentar el resto de nuestro porfolio (SOFTUM, LUXE, acabados TECH, etc.), donde reside el verdadero valor y margen para todos. CLASSIC abre la puerta; tu profesionalidad vende la solución completa.
                    </p>
                </InfoCard>

                <InfoCard
                    title="Plan Comercial 2026"
                    description="Descarga el documento oficial con el plan comercial detallado para el año 2026. Incluye objetivos, estrategias de mercado, análisis de competencia y el plan de acción para todo el equipo."
                    icon={<DocumentChartBarIcon />}
                >
                     <a
                        href={planComercialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-center text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Descargar Plan Comercial
                    </a>
                </InfoCard>
            </div>
        </div>
    );
};

export default SalesPlanPage;