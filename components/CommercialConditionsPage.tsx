import React from 'react';

// Fix: Changed the type of the 'icon' prop from JSX.Element to React.ReactNode to resolve a TypeScript namespace error.
const ToolCard: React.FC<{ title: string; description: string; details: string; icon: React.ReactNode; }> = ({ title, description, details, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-14 h-14 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
           {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
        <p className="flex-grow text-slate-500 mb-4 text-sm">{description}</p>
        <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3 rounded-lg text-center mt-auto">
            <p className="font-semibold text-xs">{details}</p>
        </div>
    </div>
);


const CommercialConditionsPage: React.FC = () => {
    
    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Promociones</h2>
            <p className="text-slate-500 mb-6">Aquí encontrarás las promociones y argumentos de venta activos que puedes ofrecer a tus clientes.</p>
            
            <div className="flex flex-col gap-6">
                {/* Card 1: Welcome Offer */}
                <ToolCard
                    title="Oferta de Bienvenida"
                    description="Dirigida a nuevos clientes o a la recuperación de clientes con más de un año de inactividad. Utiliza esta potente oferta para conseguir tu primera venta, abrir nuevas cuentas o reactivar clientes perdidos."
                    details="El argumento de venta es ofrecer en todos los productos un 50%+25% durante 2 meses ó hasta 5000 euros de compra, lo que antes ocurra."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    }
                />

                {/* Card 2: Display Stand Offer */}
                <ToolCard
                    title="Pack Expositor"
                    description="Ayuda a tus clientes a visualizar nuestros productos en su tienda. Ofrece el pack de expositor de muestras junto con dos platos de ducha a un precio especial."
                    details="Coste neto: 300€. Incluye expositor de platos + 2 platos de 160x70cm (acabado a elegir). ¡Una herramienta de venta clave para aumentar la visibilidad del producto en tienda!"
                     icon={
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                       </svg>
                    }
                />

                {/* Card 3: Shower System Offer */}
                <ToolCard
                    title="Promo Conjunto Monomando ó Termostático + Plato"
                    description="Ofrece a tus clientes una solución de ducha completa y de diseño a un precio inmejorable. Esta promoción combina nuestros platos de ducha más vendidos (Classic, Flat o Softum) con un sistema de grifería de alta calidad."
                    details="Argumento de venta: ¡Pack con precio sensacional! Informa a tu cliente que puede combinar un plato CLASSIC, FLAT o SOFTUM con una grifería monomando o termostática a un precio cerrado imbatible."
                     icon={
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                    }
                />

                 {/* Card 4: Showroom Amortization */}
                <ToolCard
                    title="Amortización de Exposición"
                    description="Facilita que tus clientes expongan producto AQG en su tienda. El cliente puede comprar el producto para su exposición y recupera la inversión con un descuento en sus futuros pedidos."
                    details="Argumento de venta: El cliente compra producto para su exposición y se le aplicará un 10% de descuento en todos sus pedidos hasta cubrir el coste del producto de exposición."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    }
                />
                
                {/* Card 5: Initial Stock */}
                <ToolCard
                    title="Implantación de Stock Inicial"
                    description="Facilita la incorporación de producto en el almacén de tu cliente con condiciones especiales para su stock inicial. Ideal para nuevos clientes o para introducir la colección CLASSIC y agilizar sus ventas."
                    details="Pedido mínimo 20/25 uds. de la colección CLASSIC (colores y medidas estándar combinables). Forma de pago: 3 meses de carencia inicial. Tras la carencia, el pago se fracciona en 3 ó 6 cuotas mensuales hasta liquidar el total. Condiciones sujetas a recurrencia de pedidos."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
};

export default CommercialConditionsPage;