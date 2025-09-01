// src/services/changeSheetsService.ts
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Asegúrate de que la ruta a tu archivo firebase.ts sea correcta
import { CSVExporter } from "../utils/csvExporter";

// --- Interfaz ChangeSheetRecord actualizada ---
// Esta interfaz representa cómo se manejan los datos en el cliente después de leer de Firestore.
// Los campos de fecha (createdAt, updatedAt, startDate) ya están convertidos a Date.
export interface ChangeSheetRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  originCenter: string; // ID del centro de trabajo de origen
  contractsManaged?: string; // ID del contrato que administra (opcional)
  currentPosition: string; // Puesto actual (ya resuelto de 'Otro')
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  destinationCenter: string; // Nuevo campo: ID del centro de trabajo de destino
  contractsToManage?: string; // Nuevo campo: ID del contrato a gestionar (opcional)
  newPosition: string; // Nuevo puesto (ya resuelto de 'Otro')
  newSupervisorName: string; // Nuevo campo agregado
  newSupervisorLastName: string; // Nuevo campo agregado
  startDate?: Date; // Fecha de inicio, convertida a Date (puede ser undefined si es null en DB)
  changeType: 'Permanente' | 'Temporal'; // Tipo de cambio
  needs: string[]; // Array de necesidades
  currentCompany: string; // Empresa actual (ya resuelto de 'OTRA')
  companyChange: 'Si' | 'No'; // Cambio de empresa
  observations: string; // Motivo y observaciones combinados

  createdAt: Date;
  updatedAt: Date;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

// --- Tipo auxiliar para el payload de actualización/creación de Firestore ---
// Esto define la estructura de datos que se enviará directamente a Firestore (Timestamp para fechas).
export type ChangeSheetFirestorePayload = Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'status'> & {
  startDate: Timestamp | null; // Acepta Timestamp o null para Firestore
  createdAt?: Timestamp; // Opcional, se añade al crear
  updatedAt?: Timestamp; // Opcional, se añade al crear/actualizar
  status?: 'Pendiente' | 'Aprobado' | 'Rechazado'; // Estado para creación/actualización
};

// --- Función para obtener todas las Hojas de Cambio ---
export const getChangeSheets = async (): Promise<ChangeSheetRecord[]> => {
  try {
    console.log('Obteniendo hojas de cambio desde Firebase...');
    
    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    const q = query(changeSheetsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const changeSheets: ChangeSheetRecord[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Validar y tipar correctamente los campos de tipo literal
      const changeType: 'Permanente' | 'Temporal' = (data.changeType === 'Permanente' || data.changeType === 'Temporal')
        ? data.changeType
        : 'Permanente'; // Valor por defecto si no es válido
      const companyChange: 'Si' | 'No' = (data.companyChange === 'Si' || data.companyChange === 'No')
        ? data.companyChange
        : 'No'; // Valor por defecto si no es válido
      const status: 'Pendiente' | 'Aprobado' | 'Rechazado' = (data.status === 'Pendiente' || data.status === 'Aprobado' || data.status === 'Rechazado')
        ? data.status
        : 'Pendiente'; // Valor por defecto si no es válido
      
      changeSheets.push({
        id: docSnap.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        originCenter: data.originCenter || '',
        contractsManaged: data.contractsManaged || '',
        currentPosition: data.currentPosition || '',
        currentSupervisorName: data.currentSupervisorName || '',
        currentSupervisorLastName: data.currentSupervisorLastName || '',
        destinationCenter: data.destinationCenter || '', // Nuevo campo
        contractsToManage: data.contractsToManage || '', // Nuevo campo
        newPosition: data.newPosition || '',
        newSupervisorName: data.newSupervisorName || '', // Nuevo campo agregado
        newSupervisorLastName: data.newSupervisorLastName || '', // Nuevo campo agregado
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : undefined, // Convierte Timestamp a Date
        changeType: changeType,
        needs: Array.isArray(data.needs) ? data.needs : [], // Asegura que 'needs' sea un array
        currentCompany: data.currentCompany || '',
        companyChange: companyChange,
        observations: data.observations || '',
        status: status,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      });
    });
    
    console.log('Hojas de cambio obtenidas:', changeSheets.length);
    return changeSheets;
  } catch (error) {
    console.error('Error al obtener hojas de cambio:', error);
    throw error;
  }
};

// --- Función para obtener una Hoja de Cambio por ID ---
export const getChangeSheetById = async (id: string): Promise<ChangeSheetRecord | null> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();

      const changeType: 'Permanente' | 'Temporal' = (data.changeType === 'Permanente' || data.changeType === 'Temporal')
        ? data.changeType
        : 'Permanente';
      const companyChange: 'Si' | 'No' = (data.companyChange === 'Si' || data.companyChange === 'No')
        ? data.companyChange
        : 'No';
      const status: 'Pendiente' | 'Aprobado' | 'Rechazado' = (data.status === 'Pendiente' || data.status === 'Aprobado' || data.status === 'Rechazado')
        ? data.status
        : 'Pendiente';

      return {
        id: docSnap.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        originCenter: data.originCenter || '',
        contractsManaged: data.contractsManaged || '',
        currentPosition: data.currentPosition || '',
        currentSupervisorName: data.currentSupervisorName || '',
        currentSupervisorLastName: data.currentSupervisorLastName || '',
        destinationCenter: data.destinationCenter || '', // Nuevo campo
        contractsToManage: data.contractsToManage || '', // Nuevo campo
        newPosition: data.newPosition || '',
        newSupervisorName: data.newSupervisorName || '', // Nuevo campo agregado
        newSupervisorLastName: data.newSupervisorLastName || '', // Nuevo campo agregado
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : undefined,
        changeType: changeType,
        needs: Array.isArray(data.needs) ? data.needs : [],
        currentCompany: data.currentCompany || '',
        companyChange: companyChange,
        observations: data.observations || '',
        status: status,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener hoja de cambio:', error);
    throw error;
  }
};

// --- Función para actualizar el estado de una Hoja de Cambio ---
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

// --- Función para actualizar una Hoja de Cambio existente ---
// Esta función espera los datos del lado del cliente, donde startDate es un objeto Date o null.
export const updateChangeSheet = async (id: string, data: Partial<Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>>): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    
    // Convertir startDate de Date a Timestamp si está presente
    const updateData: { [key: string]: any } = { ...data };
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? Timestamp.fromDate(data.startDate) : null;
    }
    updateData.updatedAt = Timestamp.now(); // Actualizar la marca de tiempo de modificación

    await updateDoc(docRef, updateData);
    console.log('Hoja de cambio actualizada:', id);
  } catch (error) {
    console.error('Error al actualizar hoja de cambio:', error);
    throw error;
  }
};

// --- Función para duplicar una Hoja de Cambio ---
export const duplicateChangeSheet = async (originalId: string): Promise<string> => {
  try {
    const originalDoc = await getChangeSheetById(originalId);
    if (!originalDoc) {
      throw new Error('Documento original no encontrado');
    }

    // Crear copia con los nuevos campos, y convertir Date a Timestamp para Firestore
    const duplicatePayload: ChangeSheetFirestorePayload = {
      employeeName: originalDoc.employeeName,
      employeeLastName: originalDoc.employeeLastName,
      originCenter: originalDoc.originCenter,
      contractsManaged: originalDoc.contractsManaged,
      currentPosition: originalDoc.currentPosition,
      currentSupervisorName: originalDoc.currentSupervisorName,
      currentSupervisorLastName: originalDoc.currentSupervisorLastName,
      destinationCenter: originalDoc.destinationCenter,
      contractsToManage: originalDoc.contractsToManage,
      newPosition: originalDoc.newPosition,
      newSupervisorName: originalDoc.newSupervisorName,
      newSupervisorLastName: originalDoc.newSupervisorLastName,
      startDate: originalDoc.startDate ? Timestamp.fromDate(originalDoc.startDate) : null,
      changeType: originalDoc.changeType,
      needs: originalDoc.needs,
      currentCompany: originalDoc.currentCompany,
      companyChange: originalDoc.companyChange,
      observations: originalDoc.observations + ' (Copia)',
      status: 'Pendiente', // El duplicado siempre comienza como Pendiente
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    const docRef = await addDoc(changeSheetsRef, duplicatePayload);

    console.log('Hoja de cambio duplicada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al duplicar hoja de cambio:', error);
    throw error;
  }
};

// --- Función para eliminar una Hoja de Cambio ---
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

// --- Función para exportar Hojas de Cambio a CSV ---
export const exportChangeSheetsToCSV = async (): Promise<void> => {
  try {
    const changeSheets = await getChangeSheets();
    
    if (changeSheets.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Definir las columnas del CSV (actualizadas a los nuevos campos)
    const headers = {
      id: 'ID',
      employeeName: 'Nombre Empleado',
      employeeLastName: 'Apellidos Empleado',
      originCenter: 'Centro Origen',
      contractsManaged: 'Contratos que Administra',
      currentPosition: 'Posición Actual',
      currentSupervisorName: 'Nombre Responsable Actual',
      currentSupervisorLastName: 'Apellidos Responsable Actual',
      destinationCenter: 'Centro Destino',
      contractsToManage: 'Contratos a Gestionar',
      newPosition: 'Nuevo Puesto',
      newSupervisorName: 'Nuevo Supervisor Nombre',
      newSupervisorLastName: 'Nuevo Supervisor Apellidos',
      startDate: 'Fecha Inicio',
      changeType: 'Tipo de Cambio',
      needs: 'Necesidades',
      currentCompany: 'Empresa Actual',
      companyChange: 'Cambio de Empresa',
      observations: 'Observaciones',
      status: 'Estado',
      createdAt: 'Fecha Creación',
      updatedAt: 'Última Actualización'
    };

    CSVExporter.exportToCSV(changeSheets, headers, {
      filename: 'hojas_cambio'
    });

    console.log('CSV exportado correctamente');
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
};

// --- Función para importar múltiples Hojas de Cambio ---
export const importChangeSheets = async (sheetsData: Partial<ChangeSheetRecord>[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  try {
    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    
    for (let i = 0; i < sheetsData.length; i++) {
      try {
        const sheetData = sheetsData[i];
        
        // Validar datos requeridos
        if (!sheetData.employeeName || !sheetData.employeeLastName) {
          results.errors.push(`Fila ${i + 1}: Nombre y apellido del empleado son requeridos`);
          continue;
        }

        // Crear payload para Firestore con los campos correctos
        const firestorePayload: ChangeSheetFirestorePayload = {
          employeeName: sheetData.employeeName || '',
          employeeLastName: sheetData.employeeLastName || '',
          originCenter: sheetData.originCenter || '',
          contractsManaged: sheetData.contractsManaged || '',
          currentPosition: sheetData.currentPosition || '',
          currentSupervisorName: sheetData.currentSupervisorName || '',
          currentSupervisorLastName: sheetData.currentSupervisorLastName || '',
          destinationCenter: sheetData.destinationCenter || '',
          contractsToManage: sheetData.contractsToManage || '',
          newPosition: sheetData.newPosition || '',
          newSupervisorName: sheetData.newSupervisorName || '',
          newSupervisorLastName: sheetData.newSupervisorLastName || '',
          startDate: sheetData.startDate ? Timestamp.fromDate(sheetData.startDate) : null,
          changeType: (sheetData.changeType === 'Permanente' || sheetData.changeType === 'Temporal') 
            ? sheetData.changeType 
            : 'Permanente',
          needs: Array.isArray(sheetData.needs) ? sheetData.needs : [],
          currentCompany: sheetData.currentCompany || '',
          companyChange: (sheetData.companyChange === 'Si' || sheetData.companyChange === 'No') 
            ? sheetData.companyChange 
            : 'No',
          observations: sheetData.observations || '',
          status: 'Pendiente', // Siempre empezar como Pendiente
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        await addDoc(changeSheetsRef, firestorePayload);
        results.success++;
        
      } catch (error) {
        console.error(`Error importing sheet ${i + 1}:`, error);
        results.errors.push(`Fila ${i + 1}: Error al importar - ${error}`);
      }
    }
    
    console.log(`Import completed: ${results.success} success, ${results.errors.length} errors`);
    return results;
    
  } catch (error) {
    console.error('Error in batch import:', error);
    results.errors.push(`Error general de importación: ${error}`);
    return results;
  }
};
