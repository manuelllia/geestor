
import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploadBoxProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  fileType: string;
  acceptedFormats: string;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  onFileUpload,
  uploadedFile,
  fileType,
  acceptedFormats
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Solo se permiten archivos PDF');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : uploadedFile 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="space-y-3">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <p className="text-green-700 dark:text-green-300 font-medium">
                Archivo {fileType} cargado
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                {uploadedFile.name}
              </p>
              <p className="text-green-500 dark:text-green-500 text-xs">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {isDragOver ? (
              <Upload className="w-12 h-12 text-blue-500 mx-auto" />
            ) : (
              <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            )}
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Subir archivo {fileType}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionar
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                Solo archivos PDF • Máximo 50MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadBox;
