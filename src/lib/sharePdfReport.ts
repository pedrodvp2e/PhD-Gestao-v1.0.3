import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Renderiza um elemento HTML (o card de relatório) como um PDF de uma
 * página. Versão web (sem Capacitor) do mesmo recurso do app mobile.
 */
export async function shareElementAsPdf(
  element: HTMLElement,
  fileName: string,
  shareTitle: string,
  shareText?: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  const pdfDataUri = pdf.output('datauristring');

  const blob = await (await fetch(pdfDataUri)).blob();
  const file = new File([blob], fileName, { type: 'application/pdf' });

  const nav = navigator as Navigator & {
    canShare?: (data?: { files?: File[] }) => boolean;
    share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
  };

  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    await nav.share({ title: shareTitle, text: shareText, files: [file] });
    return;
  }

  const link = document.createElement('a');
  link.href = pdfDataUri;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
