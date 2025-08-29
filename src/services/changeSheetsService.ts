import { v4 as uuidv4 } from 'uuid';

let changeSheets: ChangeSheetRecord[] = [
  {
    id: uuidv4(),
    title: 'Implementación de nueva funcionalidad',
    type: 'Funcional',
    priority: 'Alta',
    requesterName: 'Juan',
    requesterLastName: 'Pérez',
    requestDate: new Date('2024-01-20'),
    status: 'Pendiente',
    description: 'Desarrollo de un nuevo módulo para mejorar la experiencia del usuario.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Corrección de error en el sistema de pagos',
    type: 'Técnico',
    priority: 'Media',
    requesterName: 'María',
    requesterLastName: 'Gómez',
    requestDate: new Date('2024-02-10'),
    status: 'En curso',
    description: 'Se detectó un error que impide procesar correctamente los pagos. Se requiere solución urgente.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Mejora de rendimiento en la base de datos',
    type: 'Técnico',
    priority: 'Baja',
    requesterName: 'Carlos',
    requesterLastName: 'Rodríguez',
    requestDate: new Date('2024-03-01'),
    status: 'Completado',
    description: 'Se propone optimizar las consultas a la base de datos para reducir los tiempos de respuesta.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export interface ChangeSheetRecord {
  id: string;
  title: string;
  type: string;
  priority: 'Alta' | 'Media' | 'Baja';
  requesterName: string;
  requesterLastName: string;
  requestDate: Date;
  status: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getChangeSheets = (): Promise<ChangeSheetRecord[]> => {
  return Promise.resolve(changeSheets);
};

export const createChangeSheet = (changeSheet: Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChangeSheetRecord> => {
  const newChangeSheet: ChangeSheetRecord = {
    id: uuidv4(),
    ...changeSheet,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  changeSheets = [...changeSheets, newChangeSheet];
  return Promise.resolve(newChangeSheet);
};

export const getChangeSheetById = (id: string): Promise<ChangeSheetRecord | undefined> => {
  const changeSheet = changeSheets.find((sheet) => sheet.id === id);
  return Promise.resolve(changeSheet);
};

export const updateChangeSheet = (id: string, updates: Partial<ChangeSheetRecord>): Promise<ChangeSheetRecord | undefined> => {
  changeSheets = changeSheets.map((sheet) => (sheet.id === id ? { ...sheet, ...updates, updatedAt: new Date() } : sheet));
  const updatedSheet = changeSheets.find((sheet) => sheet.id === id);
  return Promise.resolve(updatedSheet);
};

export const deleteChangeSheet = (id: string): Promise<boolean> => {
  changeSheets = changeSheets.filter((sheet) => sheet.id !== id);
  return Promise.resolve(true);
};

export const duplicateChangeSheet = (id: string): Promise<ChangeSheetRecord | undefined> => {
  const originalSheet = changeSheets.find((sheet) => sheet.id === id);
  if (!originalSheet) {
    return Promise.resolve(undefined);
  }

  const duplicatedSheet: ChangeSheetRecord = {
    ...originalSheet,
    id: uuidv4(),
    title: `${originalSheet.title} (Copia)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  changeSheets = [...changeSheets, duplicatedSheet];
  return Promise.resolve(duplicatedSheet);
};

export const importChangeSheets = (sheets: Omit<ChangeSheetRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ success: number; errors: string[] }> => {
  let successCount = 0;
  const errors: string[] = [];

  sheets.forEach((sheet) => {
    try {
      const newChangeSheet: ChangeSheetRecord = {
        id: uuidv4(),
        ...sheet,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      changeSheets = [...changeSheets, newChangeSheet];
      successCount++;
    } catch (error: any) {
      errors.push(`Error importing sheet: ${error.message}`);
    }
  });

  return Promise.resolve({ success: successCount, errors });
};
