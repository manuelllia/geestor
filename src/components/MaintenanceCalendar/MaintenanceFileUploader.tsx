
import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { usePreferences } from '../../hooks/usePreferences';

interface MaintenanceFileUploaderProps {
  title: string;
  description: string;
  acceptedFormats: string;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  icon: React.ReactNode;
}

const MaintenanceFileUploader: React.FC<MaintenanceFileUploaderProps> = ({
  title,
  description,
  acceptedFormats,
  onFileUpload,
  isLoading,
  icon
}) => {
  const { preferences } = usePreferences();
  const { t } = useTranslation(preferences.language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.includes('spreadsheet') || file.type.includes('csv') || 
        file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="border-2 border-dashed transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }
            ${uploadedFile 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : ''
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats}
            onChange={handleFileChange}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-300">Procesando archivo...</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">
                  Archivo cargado correctamente
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadedFile.name}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Cambiar archivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('arrastraArchivo')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('formatosCsv')}
                </p>
              </div>
              <Button variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceFileUploader;
