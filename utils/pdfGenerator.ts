import type { SavedQuote, User, QuoteItem, PriceDetails } from '../types';
import { VAT_RATE } from '../constants';
// import { aqgLogoB64 } from '../assets'; // Logo removed
import { calculatePriceDetails as calculatePriceDetailsUtil } from './priceUtils';

// Helper to format the description of a quote item for the PDF table
const formatItemDescription = (item: QuoteItem): string => {
    if (item.productLine === 'KITS') {
        let desc = `${item.kitProduct?.name || 'Kit'}`;
        if (item.kitProduct?.id === 'kit-pintura' || item.kitProduct?.id === 'kit-reparacion') {
            desc += `\nColor: ${item.color?.name || `RAL ${item.ralCode}`}`;
        }
        if (item.invoiceReference) {
            desc += `\nRef. Factura: ${item.invoiceReference}`;
        }
        return desc;
    }

    let desc = `${item.productLine} - ${item.model?.name}\n`;
    desc += `Medidas: ${item.width}x${item.length}cm`;
    if (item.cutWidth && item.cutLength) {
        desc += ` (Corte a ${item.cutWidth}x${item.cutLength}cm)`;
    }
    desc += `\nColor: ${item.color?.name || `RAL ${item.ralCode}`}`;

    if (item.extras && item.extras.length > 0) {
        const extrasList = item.extras.map(e => {
            if (e.id === 'bitono' && item.bitonoColor) return `Tapa bitono: ${item.bitonoColor.name}`;
            return e.name;
        }).join(', ');
        desc += `\nExtras: ${extrasList}`;
    }
     if (item.productLine === 'STRUCT DETAIL' && item.structFrames) {
        desc += `\nMarcos: ${item.structFrames}`;
    }

    return desc;
};

// Main PDF Generation Function
export default async function generatePdf(
    quote: SavedQuote, 
    user: User,
    appliedDiscounts: { [key: string]: number }
): Promise<Blob> {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let cursorY = 20;

    // --- 1. HEADER ---
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(13, 148, 136); // Teal-600
    doc.text('AQG Bathrooms', margin, 25);
    doc.setTextColor(0, 0, 0); // Reset color

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('PRESUPUESTO', pageWidth - margin, 25, { align: 'right' });
    
    cursorY = 40;

    // --- 2. QUOTE & CLIENT INFO ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Salesperson Info from Settings
    doc.setFont(undefined, 'bold');
    doc.text(user.fiscalName || user.companyName, margin, cursorY);
    doc.setFont(undefined, 'normal');
    if (user.preparedBy) {
         doc.text(`Comercial: ${user.preparedBy}`, margin, cursorY + 5);
    }
    if (user.sucursal) {
         doc.text(`Sucursal: ${user.sucursal}`, margin, cursorY + 10);
    }
    
    // Quote & Client Info
    const quoteId = quote.id.replace(/quote_c_/g, '');
    const quoteDate = new Date(quote.timestamp).toLocaleDateString('es-ES');
    doc.text(`Nº Presupuesto: ${quoteId}`, pageWidth - margin, cursorY, { align: 'right' });
    doc.text(`Fecha: ${quoteDate}`, pageWidth - margin, cursorY + 5, { align: 'right' });
    doc.text(`Válido por 30 días`, pageWidth - margin, cursorY + 10, { align: 'right' });
    
    cursorY += 25;
    
    doc.setFont(undefined, 'bold');
    doc.text('Preparado para:', margin, cursorY);
    doc.setFont(undefined, 'normal');
    doc.text(quote.fiscalName || quote.customerName || 'Cliente sin especificar', margin, cursorY + 5);
    if(quote.sucursal) doc.text(`Sucursal: ${quote.sucursal}`, margin, cursorY + 10);
    if(quote.deliveryAddress) doc.text(`Dirección de entrega: ${quote.deliveryAddress}`, margin, cursorY + 15);
    
    cursorY += (quote.deliveryAddress ? 25 : 20);

    // --- 3. ITEMS TABLE ---
    const tableBody = quote.quoteItems.map(item => {
        const priceDetails = calculatePriceDetailsUtil(item, appliedDiscounts, user);
        const singleItemPvp = priceDetails.basePrice / item.quantity;
        
        return [
            formatItemDescription(item),
            item.quantity.toString(),
            singleItemPvp.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
            priceDetails.basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
            `${priceDetails.discountPercent.toFixed(2)}%`,
            priceDetails.discountedPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        ];
    });

    doc.autoTable({
        startY: cursorY,
        head: [['Descripción', 'Cant.', 'PVP/ud', 'Total PVP', 'Dto.', 'Base Imp.']],
        body: tableBody,
        theme: 'striped',
        headStyles: {
            fillColor: [13, 148, 136], // Teal-600
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            cellPadding: 2.5,
            fontSize: 9,
            valign: 'middle'
        },
        columnStyles: {
            0: { cellWidth: 70 }, // Description
            1: { halign: 'center' }, // Quantity
            2: { halign: 'right' }, // PVP/ud
            3: { halign: 'right' }, // Total PVP
            4: { halign: 'center' }, // Discount
            5: { halign: 'right' }, // Base
        },
        didDrawPage: (data: any) => {
            // Redefine cursorY for new pages
            cursorY = data.cursor.y;
        }
    });

    cursorY = (doc as any).lastAutoTable.finalY + 10;
    
    // --- 4. TOTALS ---
    const pvpTotal = quote.pvpTotalPrice || 0;
    const discountedTotal = quote.totalPrice / (1 + VAT_RATE);
    const vatAmount = quote.totalPrice - discountedTotal;
    const totalDiscountAmount = pvpTotal - discountedTotal;

    const totalsX = pageWidth - 60;
    doc.setFontSize(10);
    doc.text('Subtotal (PVP):', totalsX, cursorY, { align: 'left' });
    doc.text(pvpTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), pageWidth - margin, cursorY, { align: 'right' });
    
    cursorY += 6;
    doc.text('Descuentos:', totalsX, cursorY, { align: 'left' });
    doc.text(`- ${totalDiscountAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`, pageWidth - margin, cursorY, { align: 'right' });

    cursorY += 6;
    doc.setFont(undefined, 'bold');
    doc.text('Base Imponible:', totalsX, cursorY, { align: 'left' });
    doc.text(discountedTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), pageWidth - margin, cursorY, { align: 'right' });

    cursorY += 6;
    doc.setFont(undefined, 'normal');
    doc.text(`IVA (${(VAT_RATE * 100).toFixed(0)}%):`, totalsX, cursorY, { align: 'left' });
    doc.text(vatAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), pageWidth - margin, cursorY, { align: 'right' });

    cursorY += 8;
    doc.setDrawColor(13, 148, 136); // Teal-600
    doc.setLineWidth(0.5);
    doc.line(totalsX - 5, cursorY, pageWidth - margin, cursorY);
    
    cursorY += 6;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', totalsX, cursorY, { align: 'left' });
    doc.setTextColor(13, 148, 136); // Teal-600
    doc.text(quote.totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), pageWidth - margin, cursorY, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // --- 5. FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(150);
    const footerText = `Presupuesto preparado por ${user.preparedBy || user.companyName}.`;
    doc.text(footerText, margin, pageHeight - 10);
    
    return doc.output('blob');
}