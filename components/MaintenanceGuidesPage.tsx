import React from 'react';

// A more generic card component to handle different types of resources
const ResourceCard: React.FC<{
    title: string;
    description: React.ReactNode;
    actions: React.ReactNode;
    icon: React.ReactNode;
}> = ({ title, description, actions, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
        <div className="flex-grow text-slate-500 mb-4 text-sm">{description}</div>
        <div className="mt-auto flex flex-col gap-2">
            {actions}
        </div>
    </div>
);

// Icons
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const MaintenanceGuidesPage: React.FC = () => {
    
    const showerTrayGuideUrl = 'https://www.dropbox.com/scl/fi/hem0jemc8hwwmp8jpv5rt/Guia-de-instalaci-n-platos-de-ducha-ES-EN.pdf?rlkey=q8qvp59tkxv35r0eytpvakq44&st=elqn0fju&dl=0';
    const countertopGuideUrl = 'https://www.dropbox.com/scl/fi/hn23b3zqodh6zicvkkn5a/Gu-a-de-instalaci-n-y-mantenimiento-de-encimeras.pdf?rlkey=yjypmncjg5dl5xa7y0aonevvb&st=y3ahmt4g&dl=0';
    const promoNetosUrl = 'https://www.dropbox.com/scl/fi/70uk16dlxe8rawaf0idg7/PROMO-COMBI-AQG-2025.pdf?rlkey=fmpg2apppmt3n7vo723fbs1ok&st=o115mwmt&dl=0';
    const technicalSheetsUrl = 'https://www.dropbox.com/scl/fo/4ksaaabub0m25ixpus2cv/AEHKMko7CHfzytbLdVyrYXI?rlkey=wen76391vg197v1ey0kbg05st&st=9ljlb12n&dl=0';

    const Button: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
         <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full px-6 py-2.5 font-semibold text-white rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
            ${disabled 
                ? 'bg-slate-400 cursor-not-allowed focus:ring-slate-300' 
                : 'bg-teal-600 hover:shadow-lg transform hover:scale-105 focus:ring-teal-500'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Descargas</h2>
            <p className="text-slate-500 mb-6">Descarga nuestros catálogos, guías de instalación y otros documentos de interés.</p>
    
            <div className="flex flex-col gap-6">
                <ResourceCard
                    title="Platos de Ducha"
                    description="Guía completa para la instalación y el cuidado de nuestros platos de ducha de resina con cargas minerales."
                    icon={<DownloadIcon />}
                    actions={
                        <Button onClick={() => window.open(showerTrayGuideUrl, '_blank')}>
                            Descargar Guía
                        </Button>
                    }
                />
                <ResourceCard
                    title="Encimeras"
                    description="Instrucciones detalladas para la instalación y el mantenimiento de las encimeras de resina AQG."
                    icon={<DownloadIcon />}
                    actions={
                        <Button onClick={() => window.open(countertopGuideUrl, '_blank')}>
                            Descargar Guía
                        </Button>
                    }
                />
                 <ResourceCard
                    title="Catálogo General"
                    description="Descarga nuestro catálogo general con todas las colecciones, productos y tarifa de precios incluida. Próximamente disponible."
                    icon={<DownloadIcon />}
                    actions={
                        <Button disabled>
                            Próximamente
                        </Button>
                    }
                />
                <ResourceCard
                    title="Fichas Técnicas"
                    description="Descarga las fichas técnicas oficiales de AQG para obtener información detallada sobre las especificaciones de nuestros productos."
                    icon={<DownloadIcon />}
                    actions={
                        <Button onClick={() => window.open(technicalSheetsUrl, '_blank')}>
                            Descargar Fichas
                        </Button>
                    }
                />
                <ResourceCard
                    title="Promoción Conjunto Ducha"
                    description={
                        <>
                           <p>Descarga el folleto con la información y precios especiales para la promoción de plato de ducha más conjunto de grifería.</p>
                           <p className="font-semibold mt-2">Nota: Si la columna de ducha es en oro, el incremento es de 50€.</p>
                        </>
                    }
                    icon={<DownloadIcon />}
                    actions={
                        <Button onClick={() => window.open(promoNetosUrl, '_blank')}>
                            Descargar Promoción
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default MaintenanceGuidesPage;