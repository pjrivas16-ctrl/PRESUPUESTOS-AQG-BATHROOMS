import React from 'react';

const Card: React.FC<{ title: string; description: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, description, children, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-14 h-14 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
           {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
        <p className="flex-grow text-slate-500 mb-4 text-sm">{description}</p>
        <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3 rounded-lg text-center mt-auto space-y-3">
            {children}
        </div>
    </div>
);

const BuyingGroupsPage: React.FC = () => {
    
    const electrostocksUrl = 'https://www.dropbox.com/scl/fi/zekupqkqm4gl8li4v04sb/CONDICIONESCOMERCIALES-GRUPO-ELECTROSTOCKS.pdf?rlkey=hmzhofynm13tm4v1dsnkcmhi7&st=y29gx58i&dl=0';
    const materialBuildingUrl = 'https://www.dropbox.com/scl/fi/i8ssgpq6r8dlym6pi524g/CONDICIONES-COMERCIALES-MATERIAL-BUILDING.pdf?rlkey=xyy4cvg43e5u1tnrc90sk7nx6&st=bv5t8se3&dl=0';

    return (
        <div className="animate-fade-in h-full p-4 md:p-8 overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Grupos de Compra</h2>
            <p className="text-slate-500 mb-6">Aquí encontrarás las condiciones comerciales especiales pactadas con los diferentes grupos de compra.</p>
            
            <div className="flex flex-col gap-6">
                <Card
                    title="Condiciones Grupo Electrostocks"
                    description="Consulta y descarga las condiciones comerciales especiales pactadas con el grupo de compra Electrostocks."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <a
                        href={electrostocksUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Descargar Condiciones
                    </a>
                </Card>
                <Card
                    title="CONDICIONES grupo MATERIAL BUILDING"
                    description="Consulta y descarga las condiciones comerciales especiales pactadas con el grupo de compra MATERIAL BUILDING."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <a
                        href={materialBuildingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Descargar Condiciones
                    </a>
                </Card>
                <Card
                    title="Condiciones Grupo ISOLANA"
                    description="Consulta y descarga las condiciones comerciales especiales pactadas con el grupo de compra ISOLANA."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <button
                        disabled
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-white bg-slate-400 rounded-md cursor-not-allowed"
                    >
                        Próximamente
                    </button>
                </Card>
                <Card
                    title="Condiciones Grupo BACO"
                    description="Consulta y descarga las condiciones comerciales especiales pactadas con el grupo de compra BACO."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <button
                        disabled
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-white bg-slate-400 rounded-md cursor-not-allowed"
                    >
                        Próximamente
                    </button>
                </Card>
                <Card
                    title="Condiciones Grupo MATDECO"
                    description="Consulta y descarga las condiciones comerciales especiales pactadas con el grupo de compra MATDECO."
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                >
                    <button
                        disabled
                        className="inline-block w-full px-4 py-2 text-sm font-semibold text-white bg-slate-400 rounded-md cursor-not-allowed"
                    >
                        Próximamente
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default BuyingGroupsPage;