import html2canvas from 'html2canvas-pro';

/**
 * Renderiza um elemento HTML como imagem PNG e usa a Web Share API do
 * navegador quando disponível; caso contrário, baixa a imagem direto
 * para o dispositivo. Versão web (sem Capacitor) do mesmo recurso do
 * app mobile.
 */
export async function shareElementAsImage(
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

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], fileName, { type: 'image/png' });

  const nav = navigator as Navigator & {
    canShare?: (data?: { files?: File[] }) => boolean;
    share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
  };

  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    await nav.share({ title: shareTitle, text: shareText, files: [file] });
    return;
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
