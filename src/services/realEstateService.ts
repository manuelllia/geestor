import { collection, doc, getDoc, setDoc, addDoc, getDocs, Timestamp } from "firebase/firestore";
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

export const getAnnualCostData = async (): Promise<AnnualCostData> => {
  try {
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    
    let totalCost = 0;
    const byProvince: { [province: string]: number } = {};

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
            province = String(data[field]).trim();
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
    const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
    const activePisosSnapshot = await getDocs(activePisosRef);
    
    const provinceCount: { [province: string]: number } = {};
    let totalProperties = 0;

    activePisosSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Buscar el campo de provincia únicamente
      const provinceFields = ['PROVINCIA', 'Provincia', 'provincia', 'PROV'];
      let province = 'Sin especificar';
      
      for (const field of provinceFields) {
        if (data[field] && String(data[field]).trim() !== '') {
          province = String(data[field]).trim();
          break;
        }
      }

      if (!provinceCount[province]) {
        provinceCount[province] = 0;
      }
      provinceCount[province]++;
      totalProperties++;
    });

    // Calcular porcentajes
    const activityData: ProvinceActivityData = {};
    Object.keys(provinceCount).forEach(province => {
      activityData[province] = {
        count: provinceCount[province],
        percentage: totalProperties > 0 ? (provinceCount[province] / totalProperties) * 100 : 0
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
