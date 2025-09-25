import React from 'react';

// A more generic card component to handle different types of resources
const ResourceCard: React.FC<{
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    icon: React.ReactNode;
    disabled?: boolean;
}> = ({ title, description, buttonText, onClick, icon, disabled = false }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">{title}</h3>
        <p className="flex-grow text-slate-500 mb-6 text-sm">{description}</p>
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full mt-auto px-6 py-2.5 font-semibold text-white rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
            ${disabled 
                ? 'bg-slate-400 cursor-not-allowed focus:ring-slate-300' 
                : 'bg-teal-600 hover:shadow-lg transform hover:scale-105 focus:ring-teal-500'}`}
        >
            {buttonText}
        </button>
    </div>
);

// Icons
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const MaintenanceGuidesPage: React.FC = () => {
    
    const showerTrayGuideUrl = 'https://www.dropbox.com/scl/fi/hem0jemc8hwwmp8jpv5rt/Guia-de-instalaci-n-platos-de-ducha-ES-EN.pdf?rlkey=q8qvp59tkxv35r0eytpvakq44&st=elqn0fju&dl=0';
    const countertopGuideUrl = 'https://www.dropbox.com/scl/fi/hn23b3zqodh6zicvkkn5a/Gu-a-de-instalaci-n-y-mantenimiento-de-encimeras.pdf?rlkey=yjypmncjg5dl5xa7y0aonevvb&st=y3ahmt4g&dl=0';
    const videoUrl = 'https://youtu.be/k7PxlTtmS5w';

    return (
        <div className="animate-fade-in h-full">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Descargas</h2>
            <p className="text-slate-500 mb-8">Descarga nuestros catálogos, guías de instalación y otros documentos de interés.</p>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ResourceCard
                    title="Platos de Ducha"
                    description="Guía completa para la instalación y el cuidado de nuestros platos de ducha de resina con cargas minerales."
                    onClick={() => window.open(showerTrayGuideUrl, '_blank')}
                    buttonText="Descargar Guía"
                    icon={<DownloadIcon />}
                />
                <ResourceCard
                    title="Encimeras"
                    description="Instrucciones detalladas para la instalación y el mantenimiento de las encimeras de resina AQG."
                    onClick={() => window.open(countertopGuideUrl, '_blank')}
                    buttonText="Descargar Guía"
                    icon={<DownloadIcon />}
                />
                <ResourceCard
                    title="Video Presentación"
                    description="Conoce nuestra empresa, nuestros valores y nuestro proceso de fabricación en este video de presentación."
                    onClick={() => window.open(videoUrl, '_blank')}
                    buttonText="Ver Video"
                    icon={<VideoIcon />}
                />
                 <ResourceCard
                    title="Catálogo General"
                    description="Descarga nuestro catálogo general con todas las colecciones, productos y tarifa de precios incluida. Próximamente disponible."
                    onClick={() => {}}
                    buttonText="Próximamente"
                    icon={<DownloadIcon />}
                    disabled={true}
                />
            </div>
        </div>
    );
};

export default MaintenanceGuidesPage;