
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ 
  onClick, 
  label = "Añadir",
  disabled = false 
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="ml-2 h-8 px-2 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
    >
      <Plus className="h-3 w-3 mr-1" />
      {label}
    </Button>
  );
};

export default AddButton;
