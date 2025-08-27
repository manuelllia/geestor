import { collection, doc, getDoc, setDoc, addDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface PropertyData {
  [key: string]: any;
}

export interface SheetSelection {
  sheetName: string;
  selected: boolean;
}

export interface PropertyCounts {
  active: number;
  inactive: number;
  total: number;
  totalRooms: number;
}

export interface AnnualCostData {
  totalCost: number;
  byProvince: { [province: string]: number };
}

export interface ProvinceActivityData {
  [province: string]: {
    count: number;
    percentage: number;
    activeProperties: number;
    inactiveProperties: number;
  };
}

export const checkRealEstateDocument = async (): Promise<boolean> => {
  try {
    const realEstateDocRef = doc(db, "Gestión de Talento", "Gestión Inmuebles");
    const realEstateDoc = await getDoc(realEstateDocRef);
    return realEstateDoc.exists();
  } catch (error) {
    console.error('Error al verificar documento de Gestión Inmuebles:', error);
    return false;
  }
};

export const createRealEstateDocument = async (): Promise<void> => {
  try {
    const realEstateDocRef = doc(db, "Gestión de Talento", "Gestión Inmuebles");
    await setDoc(realEstateDocRef, {
      createdAt: Timestamp.now(),
      description: "Documento principal para gestión de inmuebles",
      lastUpdated: Timestamp.now()
    });
    console.log('Documento de Gestión Inmuebles creado exitosamente');
  } catch (error) {
    console.error('Error al crear documento de Gestión Inmuebles:', error);
    throw error;
  }
};

export const insertPropertyData = async (
  data: PropertyData[], 
  sheetName: string
): Promise<void> => {
  try {
    const subcollectionRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", sheetName);
    
    const insertPromises = data.map(async (row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).filter(([key, value]) => value != null && value !== '')
      );
      
      const docData = {
        ...cleanedRow,
        originalSheet: sheetName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      return addDoc(subcollectionRef, docData);
    });

    await Promise.all(insertPromises);
    console.log(`${data.length} registros insertados en la hoja: ${sheetName}`);
  } catch (error) {
    console.error(`Error al insertar datos de la hoja ${sheetName}:`, error);
    throw error;
  }
};

// Nueva función para crear un registro individual
export const createPropertyRecord = async (
  data: PropertyData,
  sheetName: string
): Promise<string> => {
  try {
    const subcollectionRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", sheetName);
    
    const docData = {
      ...data,
      originalSheet: sheetName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(subcollectionRef, docData);
    console.log(`Registro creado con ID: ${docRef.id} en la hoja: ${sheetName}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error al crear registro en ${sheetName}:`, error);
    throw error;
  }
};

// Nueva función para actualizar un registro
export const updatePropertyRecord = async (
  recordId: string,
  data: PropertyData,
  sheetName: string
): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "Gestión Inmuebles", sheetName, recordId);
    
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
    console.log(`Registro ${recordId} actualizado en la hoja: ${sheetName}`);
  } catch (error) {
    console.error(`Error al actualizar registro ${recordId} en ${sheetName}:`, error);
    throw error;
  }
};

// Nueva función para eliminar un registro
export const deletePropertyRecord = async (
  recordId: string,
  sheetName: string
): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "Gestión Inmuebles", sheetName, recordId);
    await deleteDoc(docRef);
    console.log(`Registro ${recordId} eliminado de la hoja: ${sheetName}`);
  } catch (error) {
    console.error(`Error al eliminar registro ${recordId} de ${sheetName}:`, error);
    throw error;
  }
};

export const addRealEstateProperty = async (propertyData: PropertyData): Promise<string> => {
  try {
    // Determine which collection to use based on property status
    const isActive = propertyData.status === 'Activo' || propertyData['ESTADO'] === 'Activo';
    const collectionName = isActive ? "PISOS ACTIVOS" : "BAJA PISOS";
    
    const subcollectionRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", collectionName);
    
    const docData = {
      ...propertyData,
      originalSheet: collectionName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(subcollectionRef, docData);
    console.log(`Nueva propiedad creada con ID: ${docRef.id} en ${collectionName}`);
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar nueva propiedad:', error);
    throw error;
  }
};

export const getPropertyCounts = async (): Promise<PropertyCounts> => {
  try {
    // Obtener pisos activos
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    const activeCount = activePisosSnapshot.size;

    // Calcular total de habitaciones usando el campo HABIT
    let totalRooms = 0;
    activePisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Buscar específicamente el campo HABIT
      if (data['HABIT'] !== undefined && data['HABIT'] !== null && data['HABIT'] !== '') {
        const habitValue = String(data['HABIT']).trim();
        
        // Extraer solo el número antes del "+" si existe
        const roomMatch = habitValue.match(/^(\d+)/);
        if (roomMatch) {
          const roomCount = parseInt(roomMatch[1]);
          if (!isNaN(roomCount) && roomCount > 0) {
            totalRooms += roomCount;
          }
        }
      }
    });

    // Obtener pisos de baja
    const bajaPisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "BAJA PISOS");
    const bajaPisosSnapshot = await getDocs(bajaPisosRef);
    const inactiveCount = bajaPisosSnapshot.size;

    const totalCount = activeCount + inactiveCount;

    console.log(`Conteos de propiedades: Activos: ${activeCount}, Inactivos: ${inactiveCount}, Total: ${totalCount}, Habitaciones: ${totalRooms}`);
    
    return { 
      active: activeCount, 
      inactive: inactiveCount, 
      total: totalCount,
      totalRooms: totalRooms
    };
  } catch (error) {
    console.error('Error al obtener conteos de propiedades:', error);
    return { active: 0, inactive: 0, total: 0, totalRooms: 0 };
  }
};

// Función auxiliar para normalizar nombres de provincias
const normalizeProvinceName = (province: string): string => {
  if (!province || typeof province !== 'string') return 'Sin especificar';
  
  // Convertir a mayúsculas y limpiar espacios
  let normalized = province.trim().toUpperCase();
  
  // Mapeo de variaciones comunes a nombres estándar
  const provinceMap: { [key: string]: string } = {
    'MADRID': 'Madrid',
    'BARCELONA': 'Barcelona',
    'VALENCIA': 'Valencia',
    'SEVILLA': 'Sevilla',
    'MALAGA': 'Málaga',
    'MÁLAGA': 'Málaga',
    'BILBAO': 'Vizcaya',
    'VIZCAYA': 'Vizcaya',
    'BIZKAIA': 'Vizcaya',
    'GUIPUZCOA': 'Guipúzcoa',
    'GIPUZKOA': 'Guipúzcoa',
    'ALAVA': 'Álava',
    'ARABA': 'Álava',
    'LA CORUÑA': 'A Coruña',
    'A CORUÑA': 'A Coruña',
    'CORUÑA': 'A Coruña',
    'PONTEVEDRA': 'Pontevedra',
    'LUGO': 'Lugo',
    'OURENSE': 'Ourense',
    'ORENSE': 'Ourense',
    'ASTURIAS': 'Asturias',
    'CANTABRIA': 'Cantabria'
  };
  
  // Si existe un mapeo específico, usarlo
  if (provinceMap[normalized]) {
    return provinceMap[normalized];
  }
  
  // Si contiene múltiples provincias separadas por espacios, tomar solo la primera
  const words = normalized.split(/\s+/);
  if (words.length > 1) {
    // Buscar si alguna palabra es una provincia conocida
    for (const word of words) {
      if (provinceMap[word]) {
        return provinceMap[word];
      }
    }
    // Si no encuentra coincidencia, tomar la primera palabra y capitalizarla
    return words[0].charAt(0) + words[0].slice(1).toLowerCase();
  }
  
  // Capitalizar la primera letra
  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
};

export const getAnnualCostData = async (): Promise<AnnualCostData> => {
  try {
    // Obtener datos de pisos activos
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    
    // Obtener datos de pisos de baja
    const bajaPisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "BAJA PISOS");
    const bajaPisosSnapshot = await getDocs(bajaPisosRef);
    
    let totalCost = 0;
    const byProvince: { [province: string]: number } = {};

    // Procesar pisos activos
    activePisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Buscar el campo de coste anual (puede tener diferentes nombres)
      const costFields = ['COSTE ANUAL', 'Coste Anual', 'coste_anual', 'COSTE_ANUAL', 'coste anual'];
      let annualCost = 0;
      
      for (const field of costFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          const cost = parseFloat(String(data[field]).replace(/[^\d.-]/g, ''));
          if (!isNaN(cost)) {
            annualCost = cost;
            break;
          }
        }
      }

      if (annualCost > 0) {
        totalCost += annualCost;
        
        // Buscar el campo de provincia
        const provinceFields = ['PROVINCIA', 'Provincia', 'provincia', 'PROV'];
        let province = 'Sin especificar';
        
        for (const field of provinceFields) {
          if (data[field] && String(data[field]).trim() !== '') {
            province = normalizeProvinceName(String(data[field]));
            break;
          }
        }

        if (!byProvince[province]) {
          byProvince[province] = 0;
        }
        byProvince[province] += annualCost;
      }
    });

    // Procesar pisos de baja
    bajaPisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      const costFields = ['COSTE ANUAL', 'Coste Anual', 'coste_anual', 'COSTE_ANUAL', 'coste anual'];
      let annualCost = 0;
      
      for (const field of costFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          const cost = parseFloat(String(data[field]).replace(/[^\d.-]/g, ''));
          if (!isNaN(cost)) {
            annualCost = cost;
            break;
          }
        }
      }

      if (annualCost > 0) {
        totalCost += annualCost;
        
        const provinceFields = ['PROVINCIA', 'Provincia', 'provincia', 'PROV'];
        let province = 'Sin especificar';
        
        for (const field of provinceFields) {
          if (data[field] && String(data[field]).trim() !== '') {
            province = normalizeProvinceName(String(data[field]));
            break;
          }
        }

        if (!byProvince[province]) {
          byProvince[province] = 0;
        }
        byProvince[province] += annualCost;
      }
    });

    console.log(`Datos de coste anual: Total: ${totalCost}, Por provincia:`, byProvince);
    
    return { totalCost, byProvince };
  } catch (error) {
    console.error('Error al obtener datos de coste anual:', error);
    return { totalCost: 0, byProvince: {} };
  }
};

export const getProvinceActivityData = async (): Promise<ProvinceActivityData> => {
  try {
    // Obtener pisos activos
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    
    // Obtener pisos de baja
    const bajaPisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "BAJA PISOS");
    const bajaPisosSnapshot = await getDocs(bajaPisosRef);
    
    const provinceCount: { [province: string]: { active: number; inactive: number } } = {};
    let totalProperties = 0;

    // Procesar pisos activos
    activePisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      const provinceFields = ['PROVINCIA', 'Provincia', 'provincia', 'PROV'];
      let province = 'Sin especificar';
      
      for (const field of provinceFields) {
        if (data[field] && String(data[field]).trim() !== '') {
          province = normalizeProvinceName(String(data[field]));
          break;
        }
      }

      if (!provinceCount[province]) {
        provinceCount[province] = { active: 0, inactive: 0 };
      }
      provinceCount[province].active++;
      totalProperties++;
    });

    // Procesar pisos de baja
    bajaPisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      const provinceFields = ['PROVINCIA', 'Provincia', 'provincia', 'PROV'];
      let province = 'Sin especificar';
      
      for (const field of provinceFields) {
        if (data[field] && String(data[field]).trim() !== '') {
          province = normalizeProvinceName(String(data[field]));
          break;
        }
      }

      if (!provinceCount[province]) {
        provinceCount[province] = { active: 0, inactive: 0 };
      }
      provinceCount[province].inactive++;
      totalProperties++;
    });

    // Calcular datos finales
    const activityData: ProvinceActivityData = {};
    Object.keys(provinceCount).forEach(province => {
      const total = provinceCount[province].active + provinceCount[province].inactive;
      activityData[province] = {
        count: total,
        percentage: totalProperties > 0 ? (total / totalProperties) * 100 : 0,
        activeProperties: provinceCount[province].active,
        inactiveProperties: provinceCount[province].inactive
      };
    });

    console.log(`Datos de actividad por provincia:`, activityData);
    
    return activityData;
  } catch (error) {
    console.error('Error al obtener datos de actividad por provincia:', error);
    return {};
  }
};

export const getAvailableSheets = async (): Promise<string[]> => {
  try {
    const realEstateDocRef = doc(db, "Gestión de Talento", "Gestión Inmuebles");
    const realEstateDoc = await getDoc(realEstateDocRef);
    
    if (!realEstateDoc.exists()) {
      return [];
    }

    // Obtener todas las subcolecciones
    // Nota: En Firestore no podemos listar subcolecciones directamente desde el cliente
    // Por ahora retornamos las hojas conocidas
    const knownSheets = ["PISOS ACTIVOS", "BAJA PISOS", "TABLA DINÁMICA"];
    const existingSheets = [];
    
    for (const sheetName of knownSheets) {
      const sheetRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", sheetName);
      const sheetSnapshot = await getDocs(sheetRef);
      if (sheetSnapshot.size > 0) {
        existingSheets.push(sheetName);
      }
    }
    
    return existingSheets;
  } catch (error) {
    console.error('Error al obtener hojas disponibles:', error);
    return [];
  }
};

export const getSheetData = async (sheetName: string): Promise<PropertyData[]> => {
  try {
    const sheetRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", sheetName);
    const sheetSnapshot = await getDocs(sheetRef);
    
    const data: PropertyData[] = [];
    sheetSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Datos obtenidos de ${sheetName}:`, data.length, 'registros');
    return data;
  } catch (error) {
    console.error(`Error al obtener datos de ${sheetName}:`, error);
    return [];
  }
};

export const getRealEstateProperties = async (): Promise<PropertyData[]> => {
  try {
    const properties: PropertyData[] = [];
    
    // Obtener datos de pisos activos
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    
    activePisosSnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
        status: 'Activo',
        source: 'PISOS ACTIVOS'
      });
    });

    // Obtener datos de pisos de baja
    const bajaPisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "BAJA PISOS");
    const bajaPisosSnapshot = await getDocs(bajaPisosRef);
    
    bajaPisosSnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
        status: 'Inactivo',
        source: 'BAJA PISOS'
      });
    });

    console.log(`Total properties retrieved: ${properties.length}`);
    return properties;
  } catch (error) {
    console.error('Error getting real estate properties:', error);
    throw error;
  }
};
