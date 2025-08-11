
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

interface FileUploadBoxProps {
  title: string;
  description: string;
  file: File | null;
  onFileUpload: (file: File) => void;
  onFileRemove: () => void;
  accept: string;
  isLoading?: boolean;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  title,
  description,
  file,
  onFileUpload,
  onFileRemove,
  accept,
  isLoading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0].type === 'application/pdf') {
      onFileUpload(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const truncateFileName = (fileName: string, maxLength: number = 25) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4) + '...';
    return `${truncatedName}.${extension}`;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6 h-full">
        <div className="text-center h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            {description}
          </p>
          
          {file ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 w-full max-w-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-green-700 dark:text-green-300 text-sm">
                      Archivo cargado
                    </p>
                    <p 
                      className="text-green-600 dark:text-green-400 text-xs truncate"
                      title={file.name}
                    >
                      {truncateFileName(file.name)}
                    </p>
                    <p className="text-green-500 text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFileRemove}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`flex-1 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!isLoading) {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = accept;
                  input.addEventListener('change', (e) => {
                    const target = e.target as HTMLInputElement;
                    const selectedFile = target.files?.[0];
                    if (selectedFile) {
                      onFileUpload(selectedFile);
                    }
                  });
                  input.click();
                }
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                )}
                <FileText className="w-8 h-8 text-blue-500 mb-3" />
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {isLoading ? 'Procesando...' : 'Arrastra tu archivo PDF aquí'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  o haz clic para seleccionar
                </p>
                {!isLoading && (
                  <Button variant="outline" size="sm">
                    Seleccionar PDF
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadBox;
