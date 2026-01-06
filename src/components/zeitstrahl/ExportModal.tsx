'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ExportOptions } from '@/lib/export/exportUtils';
import { getEstimatedFileSize, getRecommendedDimensions } from '@/lib/export/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  timelineElement: HTMLElement | null;
}

const FORMAT_OPTIONS = [
  { value: 'png', label: 'PNG (Bild)' },
  { value: 'svg', label: 'SVG (Vektorgrafik)' },
  { value: 'pdf', label: 'PDF (Dokument)' },
  { value: 'json', label: 'JSON (Daten)' },
];

const QUALITY_OPTIONS = [
  { value: '0.6', label: 'Niedrig (kleinere Dateigröße)' },
  { value: '0.8', label: 'Mittel' },
  { value: '0.95', label: 'Hoch (empfohlen)' },
  { value: '1.0', label: 'Maximum (größte Dateigröße)' },
];

const SCALE_OPTIONS = [
  { value: '1', label: '1x (Standard)' },
  { value: '2', label: '2x (Retina/HD)' },
  { value: '3', label: '3x (Ultra HD)' },
];

const ORIENTATION_OPTIONS = [
  { value: 'landscape', label: 'Querformat' },
  { value: 'portrait', label: 'Hochformat' },
];

export function ExportModal({ isOpen, onClose, onExport, timelineElement }: ExportModalProps) {
  const [format, setFormat] = useState<ExportOptions['format']>('png');
  const [quality, setQuality] = useState(0.95);
  const [scale, setScale] = useState(2);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isExporting, setIsExporting] = useState(false);

  // Get recommended dimensions
  const recommendedDimensions = timelineElement
    ? getRecommendedDimensions(timelineElement)
    : { width: 1920, height: 1080 };

  const width = customWidth ? parseInt(customWidth) : recommendedDimensions.width;
  const height = customHeight ? parseInt(customHeight) : recommendedDimensions.height;

  const estimatedSize = getEstimatedFileSize(width, height, format);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const options: ExportOptions = {
        format,
        quality,
        width: customWidth ? parseInt(customWidth) : undefined,
        height: customHeight ? parseInt(customHeight) : undefined,
        backgroundColor,
        scale,
        orientation,
      };

      await onExport(options);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
    }
  }, [
    format,
    quality,
    scale,
    orientation,
    customWidth,
    customHeight,
    backgroundColor,
    onExport,
    onClose,
  ]);

  const handleFormatChange = useCallback((value: string) => {
    setFormat(value as ExportOptions['format']);
  }, []);

  const handleQualityChange = useCallback((value: string) => {
    setQuality(parseFloat(value));
  }, []);

  const handleScaleChange = useCallback((value: string) => {
    setScale(parseInt(value));
  }, []);

  const handleOrientationChange = useCallback((value: string) => {
    setOrientation(value as 'portrait' | 'landscape');
  }, []);

  const showImageOptions = format === 'png' || format === 'pdf';
  const showSvgOptions = format === 'svg';
  const showPdfOptions = format === 'pdf';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zeitstrahl exportieren">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Export-Format *</label>
          <Select
            value={format}
            onChange={handleFormatChange}
            options={FORMAT_OPTIONS}
          />
        </div>

        {/* Format-specific options */}
        {showImageOptions && (
          <>
            {/* Quality */}
            <div>
              <label className="mb-2 block text-sm font-medium">Qualität</label>
              <Select
                value={quality.toString()}
                onChange={handleQualityChange}
                options={QUALITY_OPTIONS}
              />
            </div>

            {/* Scale */}
            <div>
              <label className="mb-2 block text-sm font-medium">Auflösung</label>
              <Select
                value={scale.toString()}
                onChange={handleScaleChange}
                options={SCALE_OPTIONS}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Höhere Auflösung = bessere Qualität, aber größere Datei
              </p>
            </div>

            {/* Background Color */}
            <div>
              <label className="mb-2 block text-sm font-medium">Hintergrundfarbe</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </>
        )}

        {showPdfOptions && (
          <div>
            <label className="mb-2 block text-sm font-medium">Ausrichtung</label>
            <Select
              value={orientation}
              onChange={handleOrientationChange}
              options={ORIENTATION_OPTIONS}
            />
          </div>
        )}

        {(showImageOptions || showSvgOptions) && (
          <>
            {/* Custom Dimensions */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Benutzerdefinierte Größe (optional)
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={recommendedDimensions.width.toString()}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Breite (px)</p>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={recommendedDimensions.height.toString()}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Höhe (px)</p>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Empfohlen: {recommendedDimensions.width} × {recommendedDimensions.height} px
              </p>
            </div>
          </>
        )}

        {/* File Info */}
        <div className="rounded-md bg-muted p-4">
          <h4 className="mb-2 text-sm font-medium">Export-Informationen</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>Format:</strong> {FORMAT_OPTIONS.find((o) => o.value === format)?.label}
            </p>
            {(showImageOptions || showSvgOptions) && (
              <p>
                <strong>Größe:</strong> {width} × {height} px
              </p>
            )}
            <p>
              <strong>Geschätzte Dateigröße:</strong> {estimatedSize}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Abbrechen
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exportiere...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exportieren
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
