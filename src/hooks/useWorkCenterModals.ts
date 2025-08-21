
import { useState } from 'react';

export const useWorkCenterModals = () => {
  const [isWorkCenterModalOpen, setIsWorkCenterModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const openWorkCenterModal = () => setIsWorkCenterModalOpen(true);
  const closeWorkCenterModal = () => setIsWorkCenterModalOpen(false);
  
  const openContractModal = () => setIsContractModalOpen(true);
  const closeContractModal = () => setIsContractModalOpen(false);

  return {
    isWorkCenterModalOpen,
    isContractModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
    openContractModal,
    closeContractModal
  };
};
