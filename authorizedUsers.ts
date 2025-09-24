import type { StoredUser } from './types';

// ==================================================================================
// LISTA DE USUARIOS INICIAL (SEED DATA)
// ==================================================================================
// Este archivo funciona como una lista inicial para "sembrar" la base de datos de
// usuarios en el navegador la primera vez que se carga la aplicación.
//
// Una vez que la aplicación se ha ejecutado, los usuarios se gestionan directamente
// en el almacenamiento del navegador (localStorage). Los cambios hechos aquí no
// afectarán a las cuentas existentes.
// ==================================================================================

export const authorizedUsers: StoredUser[] = [
    {
        companyName: 'AQG Bathrooms (Admin)',
        email: 'admin@aqg.com',
        password: 'adminpassword',
        logo: undefined,
        preparedBy: 'Equipo AQG',
        discounts: {
            showerTrays: 10,
            terrazzoShowerTrays: 15,
            countertops: 12,
            classicSpecialCondition: 'Consultar condiciones especiales para pedidos > 10 unidades.'
        }
    },
];