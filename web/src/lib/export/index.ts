import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

export interface ExportOptions {
    /** Target width in pixels */
    width?: number;
    /** Target height in pixels */
    height?: number;
    /** Background color (default: white) */
    backgroundColor?: string;
    /** Quality for lossy formats 0-1 (default: 0.95) */
    quality?: number;
    /** Pixel ratio for high-DPI displays (default: 2) */
    pixelRatio?: number;
}

export interface PdfExportOptions extends ExportOptions {
    /** PDF orientation (default: landscape) */
    orientation?: "portrait" | "landscape";
    /** PDF page format (default: a4) */
    format?: "a4" | "a3" | "letter" | "legal";
    /** Title to display on PDF */
    title?: string;
}

const DEFAULT_OPTIONS: Required<ExportOptions> = {
    width: 1920,
    height: 1080,
    backgroundColor: "#ffffff",
    quality: 0.95,
    pixelRatio: 2,
};

const DEFAULT_PDF_OPTIONS: Required<PdfExportOptions> = {
    ...DEFAULT_OPTIONS,
    orientation: "landscape",
    format: "a4",
    title: "Timeline",
};

/**
 * Export a DOM element as PNG image
 */
export async function exportAsPng(
    element: HTMLElement,
    filename: string = "timeline.png",
    options: ExportOptions = {}
): Promise<Blob> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const dataUrl = await toPng(element, {
        backgroundColor: opts.backgroundColor,
        pixelRatio: opts.pixelRatio,
        quality: opts.quality,
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Trigger download
    downloadBlob(blob, filename);

    return blob;
}

/**
 * Export a DOM element as SVG image
 */
export async function exportAsSvg(
    element: HTMLElement,
    filename: string = "timeline.svg",
    options: ExportOptions = {}
): Promise<Blob> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const dataUrl = await toSvg(element, {
        backgroundColor: opts.backgroundColor,
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Trigger download
    downloadBlob(blob, filename);

    return blob;
}

/**
 * Export a DOM element as PDF document
 */
export async function exportAsPdf(
    element: HTMLElement,
    filename: string = "timeline.pdf",
    options: PdfExportOptions = {}
): Promise<Blob> {
    const opts = { ...DEFAULT_PDF_OPTIONS, ...options };

    // First, capture the element as a high-quality PNG
    const dataUrl = await toPng(element, {
        backgroundColor: opts.backgroundColor,
        pixelRatio: opts.pixelRatio,
        quality: opts.quality,
    });

    // Create PDF with specified orientation and format
    const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: "mm",
        format: opts.format,
    });

    // Get PDF page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title if provided
    if (opts.title) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text(opts.title, 10, 15);
    }

    // Calculate image dimensions to fit the page
    const marginX = 10;
    const marginTop = opts.title ? 25 : 10;
    const marginBottom = 15;
    const availableWidth = pageWidth - marginX * 2;
    const availableHeight = pageHeight - marginTop - marginBottom;

    // Get image dimensions from the captured element
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
    });

    const imgAspectRatio = img.width / img.height;
    const pageAspectRatio = availableWidth / availableHeight;

    let imgWidth: number;
    let imgHeight: number;

    if (imgAspectRatio > pageAspectRatio) {
        // Image is wider than available space
        imgWidth = availableWidth;
        imgHeight = availableWidth / imgAspectRatio;
    } else {
        // Image is taller than available space
        imgHeight = availableHeight;
        imgWidth = availableHeight * imgAspectRatio;
    }

    // Center the image horizontally
    const imgX = marginX + (availableWidth - imgWidth) / 2;

    // Add the image to PDF
    pdf.addImage(dataUrl, "PNG", imgX, marginTop, imgWidth, imgHeight);

    // Add footer with date
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    const dateStr = new Date().toLocaleDateString();
    pdf.text(`Generated on ${dateStr}`, pageWidth - 50, pageHeight - 5);

    // Convert to blob and download
    const pdfBlob = pdf.output("blob");
    downloadBlob(pdfBlob, filename);

    return pdfBlob;
}

/**
 * Helper function to trigger file download
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Helper to get the timeline capture element
 */
export function getTimelineElement(): HTMLElement | null {
    return document.getElementById("timeline-capture-area");
}

