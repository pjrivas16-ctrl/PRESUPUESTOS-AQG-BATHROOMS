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

const ContactCard: React.FC<{
    title: string;
    description: React.ReactNode;
    icon: React.ReactNode;
    actions: React.ReactNode;
}> = ({ title, description, icon, actions }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
            </div>
        </div>
        <div className="flex-grow text-slate-500 mb-6 text-sm">{description}</div>
        <div className="mt-auto flex flex-wrap justify-end gap-3">
            {actions}
        </div>
    </div>
);

interface CommunicationsPageProps {
    onPlanVisit: () => void;
}

const CommunicationsPage: React.FC<CommunicationsPageProps> = ({ onPlanVisit }) => {
    
    const videoUrl = 'https://youtu.be/k7PxlTtmS5w';
    
    const handleBizumClick = () => {
        alert("Pero que buena gente eres, pero qué haces en esta sección?...Ponte a trabajar por La Virgen del Amor hermoso.");
    };

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Comunicaciones</h2>
            <p className="text-slate-500 mb-6">Contacta con el departamento adecuado para agilizar tus gestiones.</p>
            
            <div className="flex flex-col gap-6">
                <ContactCard
                    title="Pedidos y Presupuestos"
                    description="Para consultas sobre el estado de pedidos, presupuestos, plazos de entrega o cualquier duda comercial, contacta con Sandra."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    }
                    actions={
                        <>
                            <a href="tel:865753000" className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                                Llamar a Fábrica (865753000)
                            </a>
                            <a href="mailto:sandra.martinez@aqgbathrooms.com" className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                                Enviar Email a Sandra
                            </a>
                        </>
                    }
                />

                <InfoCard
                    title="Tiempos de Expedición"
                    description="Consulta los plazos de entrega estimados para nuestros productos. Ten en cuenta que son días laborales y pueden variar según la demanda. Nuestra agencia de transporte oficial es TDN. Los tiempos indicados son de expedición desde fábrica; a esto hay que sumar el tiempo de tránsito de la agencia hasta el destino final."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                >
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between items-center"><span className="font-semibold">STOCK CLASSIC STANDARD WHITE:</span> <span className="font-bold text-teal-600 text-right">24/48 Horas*</span></li>
                        <li className="text-xs text-slate-500 pl-2">↳ *Excepto 210x100 y 220x100: 10 días laborales.</li>
                        <li className="flex justify-between items-center pt-1 border-t border-slate-200 mt-1"><span className="font-semibold">PLATOS A MEDIDA / CORTES:</span> <span className="font-bold text-teal-600">6 días lab.</span></li>
                        <li className="flex justify-between items-center"><span className="font-semibold">PANELES:</span> <span className="font-bold text-teal-600">6 días lab.</span></li>
                        <li className="flex justify-between items-center pt-1 border-t border-slate-200 mt-1"><span className="font-semibold">LAVABOS:</span> <span className="font-bold text-teal-600">10 días lab.</span></li>
                        <li className="flex justify-between items-center"><span className="font-semibold">PLATOS TECH:</span> <span className="font-bold text-teal-600">15 días lab.</span></li>
                        <li className="flex justify-between items-center"><span className="font-semibold">ENCIMERAS:</span> <span className="font-bold text-teal-600">20 días lab.</span></li>
                        <li className="flex justify-between items-center"><span className="font-semibold">PLATOS CUSTOM:</span> <span className="font-bold text-teal-600">20 días lab.</span></li>
                    </ul>
                </InfoCard>

                <ContactCard
                    title="Atención al Cliente (Incidencias)"
                    description={
                        <>
                            <p>Para reportar cualquier incidencia (roturas, defectos, etc.), contacta exclusivamente por email con Juanvi para asegurar un correcto registro y seguimiento.</p>
                            <p className="font-semibold mt-2">Por favor, sé explícito al reportar: adjunta fotografías, número de albarán y cualquier otro dato relevante.</p>
                            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-xs">
                                <p className="font-bold">¡MUY IMPORTANTE!</p>
                                <p>Recuerda a tus clientes que deben indicar claramente <strong className="underline">"PRODUCTO DETERIORADO"</strong> en el albarán de la agencia de transporte al momento de la entrega. La reclamación debe realizarse <strong className="underline">antes de 24 horas</strong>, de lo contrario, el seguro no se hará cargo de la incidencia.</p>
                            </div>
                        </>
                    }
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                    actions={
                        <a href="mailto:atencioncliente@aqgbathrooms.com" className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                            Reportar Incidencia por Email
                        </a>
                    }
                />

                <ContactCard
                    title="Visita a Fábrica"
                    description="Si estás pensando en conocer de primera mano nuestro proceso productivo, ¡estaremos encantados de recibirte! Planifica tu visita a nuestras instalaciones en Almoradi."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    }
                    actions={
                        <button onClick={onPlanVisit} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                            Cómo Llegar
                        </button>
                    }
                />

                <ContactCard
                    title="Video Presentación"
                    description="Conoce nuestra empresa, nuestros valores y nuestro proceso de fabricación en este video de presentación."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    actions={
                        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                            Ver Video
                        </a>
                    }
                />

                <ContactCard
                    title="Aportación Voluntaria"
                    description="Un pequeño gesto para ayudar a Pedro a cumplir su sueño de tener una casa en la playa. Totalmente opcional, claro."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25-2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m15-3V6a2.25 2.25 0 00-2.25-2.25H9.375a2.25 2.25 0 00-2.25 2.25v3" />
                        </svg>
                    }
                    actions={
                         <button onClick={handleBizumClick} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors">
                            Enviar Bizum a Pedro
                        </button>
                    }
                />
            </div>
        </div>
    );
};

export default CommunicationsPage;