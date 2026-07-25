import React, { useState, useEffect } from 'react';
import { ResumeData } from './types/cv';
import { initialEmptyData, sampleResumeData } from './utils/initialData';
import { saveResumeData, loadResumeData, clearResumeData, exportResumeToJson } from './utils/helpers';
import { Header } from './components/Header';
import { DocumentView } from './components/DocumentView/DocumentView';

export const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = loadResumeData();
    return saved || initialEmptyData;
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Offline status listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save on data change
  useEffect(() => {
    saveResumeData(data);
  }, [data]);

  const handleDataChange = (newData: ResumeData) => {
    setData(newData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    saveResumeData(data);
  };

  const handleLoadSample = () => {
    if (window.confirm('¿Cargar datos de ejemplo de la Hoja de Vida? Esto actualizará la información del documento.')) {
      setData(sampleResumeData);
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Desea limpiar todo el documento? Esta acción vaciará los campos.')) {
      clearResumeData();
      setData(initialEmptyData);
    }
  };

  const handleExportJson = () => {
    exportResumeToJson(data);
  };

  const handleImportJson = (json: any) => {
    if (json && json.personalData) {
      setData(json);
      saveResumeData(json);
    } else {
      alert('Formato de datos no compatible.');
    }
  };

  return (
    <div className="app-wrapper">
      <Header
        onPrint={handlePrint}
        onSave={handleSave}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        isOffline={isOffline}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      <main className="main-workspace doc-only">
        <div className="doc-zoom-wrapper" style={{ '--doc-zoom': zoomLevel } as React.CSSProperties}>
          <DocumentView data={data} onChange={handleDataChange} />
        </div>
      </main>
    </div>
  );
};

export default App;
