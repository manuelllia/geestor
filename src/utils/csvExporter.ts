
import Papa from 'papaparse';

// Define a generic interface for exportable records
interface ExportableRecord {
  [key: string]: any;
}

export const exportToCSV = <T extends ExportableRecord>(
  data: T[],
  filename: string,
  customHeaders?: Partial<Record<keyof T, string>>
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first item or use custom headers
  const firstItem = data[0];
  const headers = customHeaders 
    ? Object.keys(customHeaders) as Array<keyof T>
    : Object.keys(firstItem) as Array<keyof T>;

  // Transform data for CSV export
  const csvData = data.map(item => {
    const transformedItem: Record<string, any> = {};
    
    headers.forEach(key => {
      const value = item[key];
      
      // Handle different value types
      if (value === null || value === undefined) {
        transformedItem[customHeaders?.[key] || String(key)] = '';
      } else if (value instanceof Date || (typeof value === 'object' && value !== null && value.constructor === Date)) {
        transformedItem[customHeaders?.[key] || String(key)] = (value as Date).toISOString().split('T')[0];
      } else if (typeof value === 'object' && value !== null) {
        transformedItem[customHeaders?.[key] || String(key)] = JSON.stringify(value);
      } else {
        transformedItem[customHeaders?.[key] || String(key)] = String(value);
      }
    });
    
    return transformedItem;
  });

  // Generate CSV
  const csv = Papa.unparse(csvData);
  
  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export a CSVExporter class for backward compatibility
export class CSVExporter {
  static exportToCSV<T extends ExportableRecord>(
    data: T[],
    headers: Partial<Record<keyof T, string>>,
    options: { filename: string }
  ): void {
    exportToCSV(data, options.filename, headers);
  }
}

export default exportToCSV;
