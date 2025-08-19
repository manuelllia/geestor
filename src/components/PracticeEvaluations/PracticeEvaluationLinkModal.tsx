
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface PracticeEvaluationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkGenerated: () => void;
}

export default function PracticeEvaluationLinkModal({ 
  isOpen, 
  onClose, 
  onLinkGenerated 
}: PracticeEvaluationLinkModalProps) {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [formData, setFormData] = useState({
    tutorName: '',
    tutorEmail: '',
    studentName: '',
    workCenter: '',
    expirationDays: '30'
  });

  const generateUniqueToken = (): string => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}`;
  };

  const generateEvaluationLink = async () => {
    if (!formData.tutorName || !formData.studentName || !formData.workCenter) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsGenerating(true);

    try {
      const token = generateUniqueToken();
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + parseInt(formData.expirationDays));

      // Crear registro en Firebase
      const linkData = {
        token,
        tutorName: formData.tutorName,
        tutorEmail: formData.tutorEmail,
        studentName: formData.studentName,
        workCenter: formData.workCenter,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expirationDate),
        isUsed: false,
        isActive: true
      };

      await addDoc(collection(db, 'Gestión de Talento', 'valoracion-practicas', 'Enlaces'), linkData);

      const link = `${window.location.origin}/valoracion-practicas/${token}`;
      setGeneratedLink(link);

      toast.success('Enlace generado correctamente', {
        description: 'El enlace ha sido creado y está listo para compartir'
      });

      onLinkGenerated();
    } catch (error) {
      console.error('Error generando enlace:', error);
      toast.error('Error al generar el enlace', {
        description: 'Hubo un problema al crear el enlace. Intenta de nuevo.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const openInNewTab = () => {
    window.open(generatedLink, '_blank');
  };

  const resetForm = () => {
    setFormData({
      tutorName: '',
      tutorEmail: '',
      studentName: '',
      workCenter: '',
      expirationDays: '30'
    });
    setGeneratedLink('');
    setLinkCopied(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Enlace de Valoración</DialogTitle>
          <DialogDescription>
            Crea un enlace personalizado para que el tutor complete la valoración de prácticas
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tutorName">Nombre del Tutor *</Label>
              <Input
                id="tutorName"
                value={formData.tutorName}
                onChange={(e) => setFormData(prev => ({ ...prev, tutorName: e.target.value }))}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tutorEmail">Email del Tutor (Opcional)</Label>
              <Input
                id="tutorEmail"
                type="email"
                value={formData.tutorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, tutorEmail: e.target.value }))}
                placeholder="tutor@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Nombre del Estudiante *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                placeholder="Ej: María García"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workCenter">Centro de Trabajo *</Label>
              <Input
                id="workCenter"
                value={formData.workCenter}
                onChange={(e) => setFormData(prev => ({ ...prev, workCenter: e.target.value }))}
                placeholder="Ej: Hospital Universitario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDays">Días de Vigencia</Label>
              <Input
                id="expirationDays"
                type="number"
                min="1"
                max="365"
                value={formData.expirationDays}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDays: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={generateEvaluationLink} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? 'Generando...' : 'Generar Enlace'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✅ Enlace generado exitosamente
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Enlace de evaluación:</div>
                    <div className="text-sm break-all font-mono bg-white dark:bg-gray-900 p-2 rounded border">
                      {generatedLink}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openInNewTab}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <div>• Tutor: {formData.tutorName}</div>
                    <div>• Estudiante: {formData.studentName}</div>
                    <div>• Centro: {formData.workCenter}</div>
                    <div>• Válido por {formData.expirationDays} días</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Generar Otro
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
