import React from 'react';

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

const CommunicationsPage: React.FC = () => {
    
    const handleBizumClick = () => {
        alert("Que buena gente eres, pero que haces en este apartado, ponte a trabajar por Dios bendito");
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
                    title="Aportación Voluntaria"
                    description="Un pequeño gesto para ayudar a Pedro a cumplir su sueño de tener una casa en la playa. Totalmente opcional, claro."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m15-3V6a2.25 2.25 0 00-2.25-2.25H9.375a2.25 2.25 0 00-2.25 2.25v3" />
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
