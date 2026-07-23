// Utilitários de Canvas reaproveitados pelas ferramentas de Imagens.
// Todo o processamento acontece no navegador — nenhuma imagem é enviada a servidor.

export function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.src = url;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem."))),
      type,
      quality
    );
  });
}

export function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  drawFn?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador.");
  if (drawFn) {
    drawFn(ctx, width, height);
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }
  return canvas;
}

export const MIME_LABELS: Record<string, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Recorte central + redimensionamento para preencher exatamente o tamanho
// alvo, igual a "object-fit: cover" do CSS. Usado pelas ferramentas de
// Redes Sociais para adaptar qualquer imagem a um formato fixo sem distorcer.
export function coverCropCanvas(img: HTMLImageElement, targetW: number, targetH: number): HTMLCanvasElement {
  const targetRatio = targetW / targetH;
  const sourceRatio = img.naturalWidth / img.naturalHeight;

  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

  if (sourceRatio > targetRatio) {
    // imagem mais "larga" que o alvo: corta as laterais
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // imagem mais "alta" que o alvo: corta topo/base
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador.");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
  return canvas;
}
