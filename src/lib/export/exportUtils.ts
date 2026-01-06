import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Zeitstrahl } from '@/types';

// ============================================
// Export Types
// ============================================

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json';
  quality?: number; // 0-1 for PNG/JPEG
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number; // DPI scaling factor
  orientation?: 'portrait' | 'landscape';
}

// ============================================
// PNG Export
// ============================================

/**
 * Export timeline as PNG image
 */
export async function exportAsPNG(
  element: HTMLElement,
  filename: string,
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const {
    quality = 0.95,
    width,
    height,
    backgroundColor = '#ffffff',
    scale = 2, // 2x for retina displays
  } = options;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale,
      width,
      height,
      logging: false,
      useCORS: true,
    });

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Failed to create PNG blob');
        }

        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      },
      'image/png',
      quality
    );
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error('PNG Export fehlgeschlagen');
  }
}

// ============================================
// SVG Export
// ============================================

/**
 * Export timeline as SVG
 */
export function exportAsSVG(
  svgElement: SVGSVGElement,
  filename: string,
  options: Partial<ExportOptions> = {}
): void {
  try {
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

    // Set dimensions if provided
    if (options.width) {
      clonedSvg.setAttribute('width', options.width.toString());
    }
    if (options.height) {
      clonedSvg.setAttribute('height', options.height.toString());
    }

    // Set background color if provided
    if (options.backgroundColor) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', options.backgroundColor);
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);
    }

    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);

    // Add XML declaration and DOCTYPE
    const fullSvgString = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;

    // Create blob and download
    const blob = new Blob([fullSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.svg`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('SVG export failed:', error);
    throw new Error('SVG Export fehlgeschlagen');
  }
}

// ============================================
// PDF Export
// ============================================

/**
 * Export timeline as PDF
 */
export async function exportAsPDF(
  element: HTMLElement,
  filename: string,
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const {
    orientation = 'landscape',
    backgroundColor = '#ffffff',
    scale = 2,
  } = options;

  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale,
      logging: false,
      useCORS: true,
    });

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [imgWidth, imgHeight],
      compress: true,
    });

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('PDF Export fehlgeschlagen');
  }
}

// ============================================
// JSON Export (already implemented in timelineStorage)
// ============================================

/**
 * Export timeline as JSON
 */
export function exportAsJSON(zeitstrahl: Zeitstrahl, filename: string): void {
  const json = JSON.stringify(zeitstrahl, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

// ============================================
// Main Export Function
// ============================================

/**
 * Export timeline in specified format
 */
export async function exportTimeline(
  zeitstrahl: Zeitstrahl,
  element: HTMLElement | SVGSVGElement,
  options: ExportOptions
): Promise<void> {
  const filename = zeitstrahl.titel.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  switch (options.format) {
    case 'png':
      if (element instanceof HTMLElement) {
        await exportAsPNG(element, filename, options);
      } else {
        throw new Error('PNG export requires HTMLElement');
      }
      break;

    case 'svg':
      if (element instanceof SVGSVGElement) {
        exportAsSVG(element, filename, options);
      } else {
        throw new Error('SVG export requires SVGSVGElement');
      }
      break;

    case 'pdf':
      if (element instanceof HTMLElement) {
        await exportAsPDF(element, filename, options);
      } else {
        throw new Error('PDF export requires HTMLElement');
      }
      break;

    case 'json':
      exportAsJSON(zeitstrahl, filename);
      break;

    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get recommended export dimensions based on timeline size
 */
export function getRecommendedDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
  };
}

/**
 * Get file size estimate for export
 */
export function getEstimatedFileSize(
  width: number,
  height: number,
  format: ExportOptions['format']
): string {
  const pixels = width * height;

  switch (format) {
    case 'png':
      // Rough estimate: ~4 bytes per pixel for PNG
      return formatBytes(pixels * 4);

    case 'svg':
      // SVG size varies greatly, rough estimate
      return formatBytes(pixels * 0.5);

    case 'pdf':
      // PDF with JPEG compression
      return formatBytes(pixels * 0.5);

    case 'json':
      // Rough estimate based on typical timeline data
      return formatBytes(50000); // ~50KB average

    default:
      return 'Unknown';
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
