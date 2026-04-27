'use client';

import { Download, FileImage } from 'lucide-react';
import { useCallback } from 'react';

interface ExportSVGButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
}

type ExportFormat = 'svg' | 'png';

function inlineComputedStyles(source: Element, target: Element) {
  const computed = window.getComputedStyle(source);
  let cssText = '';
  for (let i = 0; i < computed.length; i += 1) {
    const prop = computed.item(i);
    cssText += `${prop}:${computed.getPropertyValue(prop)};`;
  }
  target.setAttribute('style', cssText);

  Array.from(source.children).forEach((sourceChild, index) => {
    const targetChild = target.children[index];
    if (targetChild) inlineComputedStyles(sourceChild, targetChild);
  });
}

function serializeCardToSvg(targetId: string) {
    const container = document.getElementById(targetId);
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    const clone = container.cloneNode(true) as HTMLElement;

    clone.querySelectorAll('[data-export-ignore="true"]').forEach(node => node.remove());
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    clone.style.width = `${width}px`;
    clone.style.minHeight = `${height}px`;
    inlineComputedStyles(container, clone);

    const html = new XMLSerializer().serializeToString(clone);
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
      `<foreignObject width="100%" height="100%">${html}</foreignObject>`,
      '</svg>',
    ].join('');

    return { svg, width, height };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportCard(targetId: string, filename: string, format: ExportFormat) {
  const result = serializeCardToSvg(targetId);
  if (!result) return;

  if (format === 'svg') {
    downloadBlob(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' }), `${filename}.svg`);
    return;
  }

  const svgUrl = URL.createObjectURL(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.decoding = 'async';
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not render PNG export'));
    });
    image.src = svgUrl;
    await loaded;

    const scale = Math.max(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.width = result.width * scale;
    canvas.height = result.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, `${filename}.png`);
    }, 'image/png');
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function ExportSVGButton({ targetId, filename = 'chart', className }: ExportSVGButtonProps) {
  const handleExport = useCallback(() => {
    void exportCard(targetId, filename, 'svg');
  }, [targetId, filename]);

  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-xs text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors ${className || ''}`}
      title="Export as SVG"
    >
      <Download size={12} />
      SVG
    </button>
  );
}

export function ExportCardActions({ targetId, filename = 'card', className }: ExportSVGButtonProps) {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`} data-export-ignore="true">
      <button
        onClick={() => void exportCard(targetId, filename, 'svg')}
        className="flex items-center gap-1.5 px-2 py-1 rounded-xs text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
        title="Export card as SVG"
      >
        <Download size={12} />
        SVG
      </button>
      <button
        onClick={() => void exportCard(targetId, filename, 'png')}
        className="flex items-center gap-1.5 px-2 py-1 rounded-xs text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
        title="Export card as PNG"
      >
        <FileImage size={12} />
        PNG
      </button>
    </div>
  );
}
