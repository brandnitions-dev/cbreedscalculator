'use client';

import { Download } from 'lucide-react';
import { useCallback } from 'react';

interface ExportSVGButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
}

export function ExportSVGButton({ targetId, filename = 'chart', className }: ExportSVGButtonProps) {
  const handleExport = useCallback(() => {
    const container = document.getElementById(targetId);
    if (!container) return;

    // Get computed styles
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--surface-card-solid').trim() || '#0f1423';
    const textColor = computedStyle.getPropertyValue('--text-primary').trim() || '#f1f5f9';
    const mutedColor = computedStyle.getPropertyValue('--text-muted').trim() || '#475569';

    // Create SVG
    const width = container.offsetWidth;
    const height = container.offsetHeight + 20;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svgContent += `<rect width="100%" height="100%" fill="${bgColor}" rx="12"/>`;
    
    // Parse the container content
    const bars = container.querySelectorAll('[role="img"], .h-3, .h-1\\.5');
    let yOffset = 20;

    // Handle composition bar (horizontal stacked bar)
    const compBar = container.querySelector('.h-3.rounded-full');
    if (compBar) {
      const segments = compBar.querySelectorAll('div');
      let xOffset = 10;
      segments.forEach((seg) => {
        const style = seg.getAttribute('style') || '';
        const widthMatch = style.match(/width:\s*([\d.]+)%/);
        const bgMatch = style.match(/background:\s*([^;]+)/);
        if (widthMatch && bgMatch) {
          const segWidth = (parseFloat(widthMatch[1]) / 100) * (width - 20);
          svgContent += `<rect x="${xOffset}" y="${yOffset}" width="${segWidth}" height="12" fill="${bgMatch[1]}" rx="6"/>`;
          xOffset += segWidth;
        }
      });
      yOffset += 30;
    }

    // Handle legend
    const legend = container.querySelector('.flex.flex-wrap');
    if (legend) {
      const items = legend.querySelectorAll('.flex.items-center');
      let xPos = 10;
      items.forEach((item) => {
        const dot = item.querySelector('.rounded-full');
        const text = item.textContent?.trim() || '';
        const color = dot?.getAttribute('style')?.match(/background:\s*([^;]+)/)?.[1] || '#888';
        
        svgContent += `<circle cx="${xPos + 4}" cy="${yOffset + 6}" r="4" fill="${color}"/>`;
        svgContent += `<text x="${xPos + 12}" y="${yOffset + 10}" fill="${mutedColor}" font-size="11" font-family="Inter, sans-serif">${text}</text>`;
        xPos += text.length * 6 + 30;
        if (xPos > width - 50) {
          xPos = 10;
          yOffset += 16;
        }
      });
      yOffset += 20;
    }

    // Handle ratio bars
    const ratioItems = container.querySelectorAll('.space-y-1\\.5 > div');
    ratioItems.forEach((item) => {
      const dot = item.querySelector('.rounded-full');
      const nameEl = item.querySelector('.truncate');
      const mlEl = item.querySelectorAll('span')[1];
      const pctEl = item.querySelectorAll('span')[2];
      
      const color = dot?.getAttribute('style')?.match(/background:\s*([^;]+)/)?.[1] || '#888';
      const name = nameEl?.textContent?.trim() || '';
      const ml = mlEl?.textContent?.trim() || '';
      const pct = pctEl?.textContent?.trim() || '';
      
      const bar = item.querySelector('.h-full.rounded-full');
      const barWidth = bar?.getAttribute('style')?.match(/width:\s*([\d.]+)%/)?.[1] || '0';
      
      svgContent += `<circle cx="14" cy="${yOffset + 8}" r="4" fill="${color}"/>`;
      svgContent += `<text x="24" y="${yOffset + 12}" fill="${textColor}" font-size="12" font-family="Inter, sans-serif">${name}</text>`;
      svgContent += `<rect x="140" y="${yOffset + 4}" width="${(parseFloat(barWidth) / 100) * 120}" height="8" fill="${color}" rx="4"/>`;
      svgContent += `<text x="${width - 80}" y="${yOffset + 12}" fill="${mutedColor}" font-size="11" font-family="Inter, sans-serif" text-anchor="end">${ml}</text>`;
      svgContent += `<text x="${width - 20}" y="${yOffset + 12}" fill="${mutedColor}" font-size="11" font-family="Inter, sans-serif" text-anchor="end">${pct}</text>`;
      yOffset += 20;
    });

    // Handle benefit bars
    const benefitItems = container.querySelectorAll('.space-y-2 > div');
    benefitItems.forEach((item) => {
      const nameEl = item.querySelector('.text-text-secondary');
      const bar = item.querySelector('.h-2\\.5');
      
      if (nameEl && bar) {
        const name = nameEl.textContent?.trim() || '';
        const barStyle = bar.getAttribute('style') || '';
        const widthMatch = barStyle.match(/width:\s*([\d.]+)%/);
        const colorMatch = barStyle.match(/background:\s*([^;]+)/);
        
        if (widthMatch && colorMatch) {
          svgContent += `<text x="10" y="${yOffset + 12}" fill="${textColor}" font-size="12" font-family="Inter, sans-serif">${name}</text>`;
          svgContent += `<rect x="120" y="${yOffset + 4}" width="${(parseFloat(widthMatch[1]) / 100) * (width - 140)}" height="10" fill="${colorMatch[1]}" rx="5"/>`;
          yOffset += 24;
        }
      }
    });

    svgContent += '</svg>';

    // Download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
