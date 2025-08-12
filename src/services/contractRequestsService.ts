import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ContractRequestData {
  id?: string;
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate?: Date;
  expectedStartDate?: Date;
  salary: string;
  experience: string;
  qualifications: string[];
  status: string;
  observations: string;
}

// Function to save a contract request
export const saveContractRequest = async (contractRequest: ContractRequestData) => {
  try {
    const contractRequestsCollection = collection(db, 'contractRequests');
    await addDoc(contractRequestsCollection, contractRequest);
    console.log('Contract request saved successfully');
  } catch (error) {
    console.error('Error saving contract request:', error);
    throw error;
  }
};

// Function to retrieve contract requests
export const getContractRequests = async (): Promise<ContractRequestData[]> => {
  try {
    const contractRequestsCollection = collection(db, 'contractRequests');
    const q = query(contractRequestsCollection, orderBy('applicantName', 'asc'));
    const querySnapshot = await getDocs(q);
    const contractRequests: ContractRequestData[] = [];
    querySnapshot.forEach((doc) => {
      contractRequests.push({ id: doc.id, ...doc.data() } as ContractRequestData);
    });
    return contractRequests;
  } catch (error) {
    console.error('Error retrieving contract requests:', error);
    throw error;
  }
};

// Function to update a contract request
export const updateContractRequest = async (id: string, updates: Partial<ContractRequestData>) => {
  try {
    const contractRequestDoc = doc(db, 'contractRequests', id);
    await updateDoc(contractRequestDoc, updates);
    console.log(`Contract request with ID ${id} updated successfully`);
  } catch (error) {
    console.error(`Error updating contract request with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a contract request
export const deleteContractRequest = async (id: string) => {
  try {
    const contractRequestDoc = doc(db, 'contractRequests', id);
    await deleteDoc(contractRequestDoc);
    console.log(`Contract request with ID ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting contract request with ID ${id}:`, error);
    throw error;
  }
};
