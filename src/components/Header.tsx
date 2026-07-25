import React, { useRef } from 'react';
import { Printer, Save, FileSpreadsheet, Trash2, Download, Upload, WifiOff, ZoomIn, ZoomOut, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onPrint: () => void;
  onSave: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  onExportJson: () => void;
  onImportJson: (json: any) => void;
  isOffline: boolean;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
}

const ZOOM_OPTIONS = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.25, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];

export const Header: React.FC<Props> = ({
  onPrint,
  onSave,
  onLoadSample,
  onClear,
  onExportJson,
  onImportJson,
  isOffline,
  zoomLevel,
  onZoomChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveClick = () => {
    onSave();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1 },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportJson(json);
      } catch (err) {
        alert('El archivo JSON no es válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header no-print">
      <div className="brand">
        <img src="/escudo_colombia.svg" alt="Escudo de Colombia" className="brand-logo" />
        <div>
          <div className="brand-title">Formato Único Hoja de Vida</div>
          <div className="brand-subtitle">Persona Natural (DAFP Colombia)</div>
        </div>
        {isOffline && (
          <div className="pwa-badge ml-2" title="La app está funcionando 100% Offline">
            <WifiOff size={13} /> Offline (PWA)
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* Zoom Level Controls */}
        <div className="zoom-control-pill" title="Control de Zoom del documento">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.5, Number((zoomLevel - 0.1).toFixed(2))))}
            disabled={zoomLevel <= 0.5}
            className="zoom-btn"
            title="Reducir Zoom (Mínimo 50%)"
          >
            <ZoomOut size={14} />
          </button>
          <div className="zoom-select-wrapper">
            <select
              value={zoomLevel}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="zoom-select"
              title="Nivel de zoom del documento"
            >
              {ZOOM_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-white">
                  {Math.round(opt * 100)}%{opt === 1.5 ? ' (100% Vista)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="zoom-select-icon" />
          </div>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2.0, Number((zoomLevel + 0.1).toFixed(2))))}
            disabled={zoomLevel >= 2.0}
            className="zoom-btn"
            title="Aumentar Zoom (Máximo 200%)"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <button type="button" onClick={onLoadSample} className="btn btn-secondary text-xs" title="Cargar datos de prueba de la Hoja de Vida">
          <FileSpreadsheet size={15} /> Cargar Ejemplo
        </button>

        <button type="button" onClick={handleSaveClick} className="btn btn-secondary text-xs" title="Guardar borrador localmente">
          <Save size={15} /> Guardar
        </button>

        <button type="button" onClick={onExportJson} className="btn btn-outline text-xs" title="Exportar respaldo JSON">
          <Download size={15} /> Exportar JSON
        </button>

        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline text-xs" title="Importar respaldo JSON">
          <Upload size={15} /> Cargar JSON
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />

        <button type="button" onClick={onClear} className="btn btn-danger text-xs" title="Limpiar todo el documento">
          <Trash2 size={15} />
        </button>

        <button type="button" onClick={onPrint} className="btn btn-primary" title="Imprimir o guardar como PDF oficial">
          <Printer size={16} /> Imprimir / PDF
        </button>
      </div>
    </header>
  );
};
