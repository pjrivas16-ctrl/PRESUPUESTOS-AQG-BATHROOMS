import React from 'react';

const GuideCard: React.FC<{ title: string; description: string; onDownload: () => void; }> = ({ title, description, onDownload }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">{title}</h3>
        <p className="flex-grow text-slate-500 mb-6 text-sm">{description}</p>
        <button
            onClick={onDownload}
            className="w-full mt-auto px-6 py-2.5 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
            Descargar Guía
        </button>
    </div>
);


const MaintenanceGuidesPage: React.FC = () => {
    
    const showerTrayGuideUrl = 'https://www.dropbox.com/scl/fi/hem0jemc8hwwmp8jpv5rt/Guia-de-instalaci-n-platos-de-ducha-ES-EN.pdf?rlkey=q8qvp59tkxv35r0eytpvakq44&st=elqn0fju&dl=0';
    const countertopGuideUrl = 'https://www.dropbox.com/scl/fi/hn23b3zqodh6zicvkkn5a/Gu-a-de-instalaci-n-y-mantenimiento-de-encimeras.pdf?rlkey=yjypmncjg5dl5xa7y0aonevvb&st=y3ahmt4g&dl=0';

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Guías de Mantenimiento</h2>
            <p className="text-slate-500 mb-8">Descarga nuestras guías de instalación y mantenimiento para asegurar la longevidad y el correcto funcionamiento de tus productos AQG.</p>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GuideCard
                    title="Platos de Ducha"
                    description="Guía completa para la instalación y el cuidado de nuestros platos de ducha de resina con cargas minerales."
                    onDownload={() => window.open(showerTrayGuideUrl, '_blank')}
                />
                <GuideCard
                    title="Encimeras"
                    description="Instrucciones detalladas para la instalación y el mantenimiento de las encimeras de resina AQG."
                    onDownload={() => window.open(countertopGuideUrl, '_blank')}
                />
            </div>
        </div>
    );
};

export default MaintenanceGuidesPage;
