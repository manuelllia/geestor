
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

export const ResponsiveTable = React.forwardRef<
  HTMLDivElement,
  ResponsiveTableProps
>(({ children, className, minWidth = "800px", ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("w-full overflow-x-auto border rounded-md", className)}
    {...props}
  >
    <div style={{ minWidth }} className="w-full">
      {children}
    </div>
    {/* Indicador de scroll en móvil */}
    <div className="block sm:hidden text-center py-2 text-xs text-muted-foreground border-t">
      ← Desliza horizontalmente para ver más →
    </div>
  </div>
));

ResponsiveTable.displayName = "ResponsiveTable";

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
