
import { v4 as uuidv4 } from 'uuid';

export interface ChangeSheetRecord {
  id: string;
  title: string;
  type: string;
  priority: 'Alta' | 'Media' | 'Baja';
  requesterName: string;
  requesterLastName: string;
  requestDate: Date;
  status: string;
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  contractsManaged: string;
  currentPosition: string;
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  destinationCenter: string;
  contractsToManage: string;
  newPosition: string;
  newSupervisorName: string;
  newSupervisorLastName: string;
  startDate: Date | null;
  changeType: string;
  needs: string;
  currentCompany: string;
  companyChange: string;
  observations: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data storage (in a real app, this would be in a database)
let mockChangeSheets: ChangeSheetRecord[] = [];

export const getChangeSheets = async (): Promise<ChangeSheetRecord[]> => {
  try {
    return mockChangeSheets.map(sheet => ({
      ...sheet,
      requestDate: sheet.requestDate ? new Date(sheet.requestDate) : new Date(),
      startDate: sheet.startDate ? new Date(sheet.startDate) : null,
    }));
  } catch (error) {
    console.error('Error fetching change sheets:', error);
    return [];
  }
};

export const getChangeSheetById = async (id: string): Promise<ChangeSheetRecord | null> => {
  try {
    const sheet = mockChangeSheets.find(s => s.id === id);
    if (!sheet) return null;
    
    return {
      ...sheet,
      requestDate: sheet.requestDate ? new Date(sheet.requestDate) : new Date(),
      startDate: sheet.startDate ? new Date(sheet.startDate) : null,
    };
  } catch (error) {
    console.error('Error fetching change sheet by ID:', error);
    return null;
  }
};

export const createChangeSheet = async (values: Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChangeSheetRecord | null> => {
  try {
    const newSheet: ChangeSheetRecord = {
      ...values,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      requestDate: values.requestDate ? new Date(values.requestDate) : new Date(),
      startDate: values.startDate ? new Date(values.startDate) : null,
    };
    
    mockChangeSheets.push(newSheet);
    return newSheet;
  } catch (error) {
    console.error('Error creating change sheet:', error);
    return null;
  }
};

export const updateChangeSheet = async (id: string, values: Partial<Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ChangeSheetRecord | null> => {
  try {
    const index = mockChangeSheets.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    mockChangeSheets[index] = {
      ...mockChangeSheets[index],
      ...values,
      updatedAt: new Date(),
      requestDate: values.requestDate ? new Date(values.requestDate) : mockChangeSheets[index].requestDate,
      startDate: values.startDate ? new Date(values.startDate) : mockChangeSheets[index].startDate,
    };
    
    return mockChangeSheets[index];
  } catch (error) {
    console.error('Error updating change sheet:', error);
    return null;
  }
};

export const deleteChangeSheet = async (id: string): Promise<ChangeSheetRecord | null> => {
  try {
    const index = mockChangeSheets.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const deletedSheet = mockChangeSheets[index];
    mockChangeSheets.splice(index, 1);
    return deletedSheet;
  } catch (error) {
    console.error('Error deleting change sheet:', error);
    return null;
  }
};

export const duplicateChangeSheet = async (id: string): Promise<ChangeSheetRecord | null> => {
  try {
    const originalSheet = mockChangeSheets.find(s => s.id === id);
    if (!originalSheet) return null;
    
    const { id: originalId, ...dataToCopy } = originalSheet;
    const duplicatedSheet: ChangeSheetRecord = {
      ...dataToCopy,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockChangeSheets.push(duplicatedSheet);
    return duplicatedSheet;
  } catch (error) {
    console.error('Error duplicating change sheet:', error);
    return null;
  }
};

export const importChangeSheets = async (sheets: Partial<ChangeSheetRecord>[]): Promise<{ success: number; errors: string[] }> => {
  let successCount = 0;
  const errors: string[] = [];

  for (const sheet of sheets) {
    try {
      if (!sheet.title || !sheet.type || !sheet.priority || !sheet.requesterName || !sheet.requesterLastName || !sheet.status) {
        errors.push(`Faltan campos obligatorios en la hoja: ${sheet.title}`);
        continue;
      }

      const newSheet: ChangeSheetRecord = {
        id: uuidv4(),
        title: sheet.title,
        type: sheet.type,
        priority: sheet.priority,
        requesterName: sheet.requesterName,
        requesterLastName: sheet.requesterLastName,
        requestDate: sheet.requestDate ? new Date(sheet.requestDate) : new Date(),
        status: sheet.status,
        employeeName: sheet.employeeName || '',
        employeeLastName: sheet.employeeLastName || '',
        originCenter: sheet.originCenter || '',
        contractsManaged: sheet.contractsManaged || '',
        currentPosition: sheet.currentPosition || '',
        currentSupervisorName: sheet.currentSupervisorName || '',
        currentSupervisorLastName: sheet.currentSupervisorLastName || '',
        destinationCenter: sheet.destinationCenter || '',
        contractsToManage: sheet.contractsToManage || '',
        newPosition: sheet.newPosition || '',
        newSupervisorName: sheet.newSupervisorName || '',
        newSupervisorLastName: sheet.newSupervisorLastName || '',
        startDate: sheet.startDate ? new Date(sheet.startDate) : null,
        changeType: sheet.changeType || '',
        needs: sheet.needs || '',
        currentCompany: sheet.currentCompany || '',
        companyChange: sheet.companyChange || '',
        observations: sheet.observations || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockChangeSheets.push(newSheet);
      successCount++;
    } catch (error: any) {
      errors.push(`Error al importar hoja para ${sheet.title}: ${error.message}`);
    }
  }

  return { success: successCount, errors: errors };
};
