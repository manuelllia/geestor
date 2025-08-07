
import React, { useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BidAnalyzerViewProps {
  language: Language;
}

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

const BidAnalyzerView: React.FC<BidAnalyzerViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [pcapFile, setPcapFile] = useState<UploadedFile | null>(null);
  const [pttFile, setPttFile] = useState<UploadedFile | null>(null);
  const [dragOver, setDragOver] = useState<'pcap' | 'ptt' | null>(null);
  
  const pcapInputRef = useRef<HTMLInputElement>(null);
  const pttInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      alert(language === 'es' ? 'Solo se permiten archivos PDF' : 'Only PDF files are allowed');
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert(language === 'es' ? 'El archivo no puede superar los 50MB' : 'File cannot exceed 50MB');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (file: File, type: 'pcap' | 'ptt') => {
    if (!validateFile(file)) return;
    
    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: formatFileSize(file.size)
    };
    
    if (type === 'pcap') {
      setPcapFile(uploadedFile);
    } else {
      setPttFile(uploadedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 'pcap' | 'ptt') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'pcap' | 'ptt') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pcap' | 'ptt') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const handleAnalyze = () => {
    console.log('Analyzing documents:', { pcapFile, pttFile });
    // Aquí implementarás la lógica de análisis
  };

  const renderUploadArea = (type: 'pcap' | 'ptt', file: UploadedFile | null, inputRef: React.RefObject<HTMLInputElement>) => {
    const isDraggedOver = dragOver === type;
    const fileTypeLabel = type === 'pcap' ? 'PCAP' : 'PTT';
    
    return (
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDraggedOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : file 
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
          }
        `}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, type)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleInputChange(e, type)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {file ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div>
                <p className="text-lg font-medium text-green-700 dark:text-green-400">
                  {language === 'es' ? 'Archivo cargado' : 'File uploaded'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {file.size}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <Upload className={`w-12 h-12 ${isDraggedOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <FileText className={`w-8 h-8 -ml-4 mt-4 ${isDraggedOver ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {language === 'es' ? `Subir archivo ${fileTypeLabel}` : `Upload ${fileTypeLabel} file`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {language === 'es' 
                    ? 'Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionar' 
                    : 'Drag and drop your PDF file here or click to select'
                  }
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {language === 'es' ? 'Máximo 50MB' : 'Maximum 50MB'}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
            {fileTypeLabel}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
          {language === 'es' ? 'Analizador de Licitaciones' : 'Bid Analyzer'}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {language === 'es' ? 'Documento PCAP' : 'PCAP Document'}
            </h2>
            {renderUploadArea('pcap', pcapFile, pcapInputRef)}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {language === 'es' ? 'Documento PTT' : 'PTT Document'}
            </h2>
            {renderUploadArea('ptt', pttFile, pttInputRef)}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={!pcapFile || !pttFile}
            className="px-8 py-3 text-lg"
          >
            {language === 'es' ? 'Analizar Documentos' : 'Analyze Documents'}
          </Button>
        </div>
        
        {(!pcapFile || !pttFile) && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            {language === 'es' 
              ? 'Sube ambos documentos para habilitar el análisis' 
              : 'Upload both documents to enable analysis'
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default BidAnalyzerView;
