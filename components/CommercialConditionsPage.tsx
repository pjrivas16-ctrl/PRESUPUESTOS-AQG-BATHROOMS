import React from 'react';

// Fix: Changed the type of the 'icon' prop from JSX.Element to React.ReactNode to resolve a TypeScript namespace error.
const ToolCard: React.FC<{ title: string; description: string; details: string; icon: React.ReactNode; }> = ({ title, description, details, icon }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-5">
           {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">{title}</h3>
        <p className="flex-grow text-slate-500 mb-6 text-sm">{description}</p>
        <div className="bg-slate-100 border border-slate-200 text-slate-700 p-4 rounded-lg text-center mt-auto">
            <p className="font-semibold text-sm">{details}</p>
        </div>
    </div>
);


const CommercialConditionsPage: React.FC = () => {
    
    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Herramientas Comerciales</h2>
            <p className="text-slate-500 mb-8">Aquí encontrarás las promociones y argumentos de venta activos que puedes ofrecer a tus clientes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card 1: Welcome Offer */}
                <ToolCard
                    title="Oferta de Bienvenida"
                    description="Ofrece a tus nuevos clientes un descuento de bienvenida para conseguir tu primera venta y abrir nuevas cuentas. Es nuestra mejor herramienta para captación."
                    details="Argumento de venta: Descuento equivalente a un 50% + 25%. Aplica un descuento similar en el resumen del presupuesto para reflejar esta oferta."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    }
                />

                {/* Card 2: Display Stand Offer */}
                <ToolCard
                    title="Pack Expositor"
                    description="Ayuda a tus clientes a visualizar nuestros productos en su tienda. Ofrece el pack de expositor de muestras junto con dos platos de ducha a un precio especial."
                    details="Oferta especial: Expositor de ruedas + 2 platos por 250€ (+IVA). Contacta con tu delegado para tramitar este tipo de pedido."
                     icon={
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                       </svg>
                    }
                />

                {/* Card 3: Shower System Offer */}
                <ToolCard
                    title="Conjunto Ducha Completo"
                    description="Incrementa el valor de tu venta ofreciendo un conjunto completo. Sugiere al cliente añadir un sistema de ducha (monomando o termostático) con un descuento especial."
                    details="Argumento de venta: Ofrece un descuento adicional en el plato al añadir la grifería al pedido. Consulta con tu delegado los modelos compatibles."
                     icon={
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                    }
                />
            </div>
        </div>
    );
};

export default CommercialConditionsPage;