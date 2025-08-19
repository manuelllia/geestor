
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChangeSheetData } from "./changeSheetService";

export interface ChangeSheetRecord extends ChangeSheetData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export const getChangeSheets = async (): Promise<ChangeSheetRecord[]> => {
  try {
    console.log('Obteniendo hojas de cambio desde Firebase...');
    
    // Referencia a la colección anidada
    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    const q = query(changeSheetsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const changeSheets: ChangeSheetRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      changeSheets.push({
        id: doc.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        originCenter: data.originCenter || '',
        currentPosition: data.currentPosition || '',
        currentSupervisorName: data.currentSupervisorName || '',
        currentSupervisorLastName: data.currentSupervisorLastName || '',
        newPosition: data.newPosition || '',
        newSupervisorName: data.newSupervisorName || '',
        newSupervisorLastName: data.newSupervisorLastName || '',
        startDate: data.startDate ? data.startDate.toDate() : undefined,
        changeType: data.changeType || '',
        needs: data.needs || [],
        currentCompany: data.currentCompany || '',
        companyChange: data.companyChange || '',
        observations: data.observations || '',
        status: data.status || 'Pendiente',
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date()
      });
    });
    
    console.log('Hojas de cambio obtenidas:', changeSheets.length);
    return changeSheets;
  } catch (error) {
    console.error('Error al obtener hojas de cambio:', error);
    throw error;
  }
};

export const getChangeSheetById = async (id: string): Promise<ChangeSheetRecord | null> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        originCenter: data.originCenter || '',
        currentPosition: data.currentPosition || '',
        currentSupervisorName: data.currentSupervisorName || '',
        currentSupervisorLastName: data.currentSupervisorLastName || '',
        newPosition: data.newPosition || '',
        newSupervisorName: data.newSupervisorName || '',
        newSupervisorLastName: data.newSupervisorLastName || '',
        startDate: data.startDate ? data.startDate.toDate() : undefined,
        changeType: data.changeType || '',
        needs: data.needs || [],
        currentCompany: data.currentCompany || '',
        companyChange: data.companyChange || '',
        observations: data.observations || '',
        status: data.status || 'Pendiente',
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener hoja de cambio:', error);
    throw error;
  }
};

export const updateChangeSheetStatus = async (id: string, status: 'Pendiente' | 'Aprobado' | 'Rechazado'): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
    console.log('Estado de hoja de cambio actualizado:', id, status);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
};

export const updateChangeSheet = async (id: string, data: Partial<ChangeSheetData>): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    
    const updateData = {
      ...data,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
    console.log('Hoja de cambio actualizada:', id);
  } catch (error) {
    console.error('Error al actualizar hoja de cambio:', error);
    throw error;
  }
};

export const duplicateChangeSheet = async (originalId: string): Promise<string> => {
  try {
    const originalDoc = await getChangeSheetById(originalId);
    if (!originalDoc) {
      throw new Error('Documento original no encontrado');
    }

    // Crear copia sin el ID y fechas del original
    const duplicateData = {
      employeeName: originalDoc.employeeName,
      employeeLastName: originalDoc.employeeLastName,
      originCenter: originalDoc.originCenter,
      currentPosition: originalDoc.currentPosition,
      currentSupervisorName: originalDoc.currentSupervisorName,
      currentSupervisorLastName: originalDoc.currentSupervisorLastName,
      newPosition: originalDoc.newPosition,
      newSupervisorName: originalDoc.newSupervisorName,
      newSupervisorLastName: originalDoc.newSupervisorLastName,
      startDate: originalDoc.startDate,
      changeType: originalDoc.changeType,
      needs: originalDoc.needs,
      currentCompany: originalDoc.currentCompany,
      companyChange: originalDoc.companyChange,
      observations: originalDoc.observations + ' (Copia)',
      status: 'Pendiente' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    const docRef = await addDoc(changeSheetsRef, {
      ...duplicateData,
      startDate: duplicateData.startDate ? Timestamp.fromDate(duplicateData.startDate) : null
    });

    console.log('Hoja de cambio duplicada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al duplicar hoja de cambio:', error);
    throw error;
  }
};

export const deleteChangeSheet = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    await deleteDoc(docRef);
    console.log('Hoja de cambio eliminada:', id);
  } catch (error) {
    console.error('Error al eliminar hoja de cambio:', error);
    throw error;
  }
};

export const exportChangeSheetsToCSV = async (): Promise<void> => {
  try {
    const changeSheets = await getChangeSheets();
    
    if (changeSheets.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Definir las columnas del CSV
    const headers = [
      'ID',
      'Nombre Empleado',
      'Apellidos Empleado',
      'Centro Origen',
      'Posición Actual',
      'Nombre Supervisor Actual',
      'Apellidos Supervisor Actual',
      'Nueva Posición',
      'Nombre Nuevo Supervisor',
      'Apellidos Nuevo Supervisor',
      'Fecha Inicio',
      'Tipo de Cambio',
      'Necesidades',
      'Empresa Actual',
      'Cambio de Empresa',
      'Observaciones',
      'Estado',
      'Fecha Creación',
      'Última Actualización'
    ];

    // Convertir datos a formato CSV
    const csvContent = [
      headers.join(','),
      ...changeSheets.map(sheet => [
        sheet.id,
        `"${sheet.employeeName}"`,
        `"${sheet.employeeLastName}"`,
        `"${sheet.originCenter}"`,
        `"${sheet.currentPosition}"`,
        `"${sheet.currentSupervisorName}"`,
        `"${sheet.currentSupervisorLastName}"`,
        `"${sheet.newPosition}"`,
        `"${sheet.newSupervisorName}"`,
        `"${sheet.newSupervisorLastName}"`,
        sheet.startDate ? sheet.startDate.toLocaleDateString() : '',
        sheet.changeType === 'permanent' ? 'Permanente' : 'Temporal',
        `"${sheet.needs.join('; ')}"`,
        `"${sheet.currentCompany}"`,
        sheet.companyChange === 'yes' ? 'Sí' : 'No',
        `"${sheet.observations}"`,
        `"${sheet.status}"`,
        sheet.createdAt.toLocaleDateString(),
        sheet.updatedAt.toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hojas_cambio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('CSV exportado correctamente');
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
};
