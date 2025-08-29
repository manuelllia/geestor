import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Download, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { getChangeSheetById, deleteChangeSheet, ChangeSheetRecord } from '../../services/changeSheetsService';
import jsPDF from 'jspdf';

interface ChangeSheetDetailViewProps {
  sheetId: string;
  language: Language;
  onBack: () => void;
  onDelete?: () => void;
}

const ChangeSheetDetailView: React.FC<ChangeSheetDetailViewProps> = ({ 
  sheetId, 
  language, 
  onBack,
  onDelete 
}) => {
  const { t } = useTranslation(language);
  const [sheetData, setSheetData] = useState<ChangeSheetRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const data = await getChangeSheetById(sheetId);
        setSheetData(data);
      } catch (error) {
        console.error('Error al obtener datos de la hoja de cambio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteChangeSheet(sheetId);
      setShowDeleteModal(false);
      onDelete();
      // Redirigir a la página principal
      window.location.href = '/';
    } catch (error) {
      console.error('Error al eliminar hoja de cambio:', error);
      alert('Error al eliminar el registro');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!sheetData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hoja de Cambio de Empleado', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Información del empleado
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMACIÓN DEL EMPLEADO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${sheetData.employeeName} ${sheetData.employeeLastName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Centro de Origen: ${sheetData.originCenter}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Posición Actual: ${sheetData.currentPosition}`, 20, yPosition);
    yPosition += 15;

    // Supervisor actual
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUPERVISOR ACTUAL', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${sheetData.currentSupervisorName} ${sheetData.currentSupervisorLastName}`, 20, yPosition);
    yPosition += 15;

    // Nueva posición
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NUEVA POSICIÓN', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Posición: ${sheetData.newPosition}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Supervisor: ${sheetData.newSupervisorName} ${sheetData.newSupervisorLastName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Fecha de Inicio: ${sheetData.startDate ? sheetData.startDate.toLocaleDateString() : 'No especificada'}`, 20, yPosition);
    yPosition += 15;

    // Detalles del cambio
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALLES DEL CAMBIO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tipo de Cambio: ${sheetData.changeType === 'Permanente' ? 'Permanente' : 'Temporal'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Empresa Actual: ${sheetData.currentCompany}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Cambio de Empresa: ${sheetData.companyChange === 'Si' ? 'Sí' : 'No'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Estado: ${sheetData.status}`, 20, yPosition);
    yPosition += 15;

    // Necesidades
    if (sheetData.needs.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NECESIDADES', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      sheetData.needs.forEach(need => {
        pdf.text(`• ${need}`, 20, yPosition);
        yPosition += 8;
      });
      yPosition += 7;
    }

    // Observaciones
    if (sheetData.observations) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OBSERVACIONES', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const splitObservations = pdf.splitTextToSize(sheetData.observations, pageWidth - 40);
      pdf.text(splitObservations, 20, yPosition);
      yPosition += splitObservations.length * 6;
    }

    // Información de creación
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Creado: ${sheetData.createdAt.toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Última actualización: ${sheetData.updatedAt.toLocaleDateString()}`, 20, yPosition);

    // Descargar
    pdf.save(`Hoja_Cambio_${sheetData.employeeName}_${sheetData.employeeLastName}_${sheetData.id}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontró el registro</p>
        <Button onClick={onBack} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Aprobado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Detalles de Hoja de Cambio
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
          <Button onClick={() => setShowDeleteModal(true)} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Registro
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del empleado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información del Empleado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
              <p className="text-lg">{sheetData.employeeName} {sheetData.employeeLastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Centro de Origen</label>
              <p className="text-lg">{sheetData.originCenter}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Posición Actual</label>
              <p className="text-lg">{sheetData.currentPosition}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estado</label>
              <div className="mt-1">
                <Badge className={getStatusColor(sheetData.status)}>
                  {sheetData.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supervisor actual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Supervisor Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <p className="text-lg">{sheetData.currentSupervisorName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Apellidos</label>
              <p className="text-lg">{sheetData.currentSupervisorLastName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Nueva posición */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Nueva Posición
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Posición</label>
              <p className="text-lg">{sheetData.newPosition}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Nuevo Supervisor</label>
              <p className="text-lg">{sheetData.newSupervisorName} {sheetData.newSupervisorLastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Fecha de Inicio</label>
              <p className="text-lg">
                {sheetData.startDate ? sheetData.startDate.toLocaleDateString() : 'No especificada'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del cambio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Detalles del Cambio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Tipo de Cambio</label>
              <p className="text-lg">{sheetData.changeType === 'Permanente' ? 'Permanente' : 'Temporal'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Empresa Actual</label>
              <p className="text-lg">{sheetData.currentCompany}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Cambio de Empresa</label>
              <p className="text-lg">{sheetData.companyChange === 'Si' ? 'Sí' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Necesidades y observaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sheetData.needs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Necesidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sheetData.needs.map((need, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {sheetData.observations && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{sheetData.observations}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Información de fechas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información de Registro
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
            <p className="text-lg">{sheetData.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Última Actualización</label>
            <p className="text-lg">{sheetData.updatedAt.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta hoja de cambio? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Eliminando...</span>
                </div>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeSheetDetailView;
