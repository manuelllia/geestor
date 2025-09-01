
export interface CSVExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
  dateFormat?: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
}

export class CSVExporter {
  static exportToCSV<T extends Record<string, any>>(
    data: T[],
    headers: Record<keyof T, string>,
    options: CSVExportOptions = {}
  ): void {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const {
      filename = 'export',
      includeTimestamp = true,
      dateFormat = 'dd/MM/yyyy'
    } = options;

    // Create headers row
    const headerKeys = Object.keys(headers) as (keyof T)[];
    const headerValues = headerKeys.map(key => headers[key]);
    const csvRows = [headerValues.join(',')];

    // Create data rows
    data.forEach(row => {
      const values = headerKeys.map(key => {
        let value = row[key];
        
        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        }
        
        if (value instanceof Date) {
          value = this.formatDate(value, dateFormat);
        }
        
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      });
      
      csvRows.push(values.join(','));
    });

    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const finalFilename = includeTimestamp
      ? `${filename}_${new Date().toISOString().split('T')[0]}.csv`
      : `${filename}.csv`;
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private static formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    switch (format) {
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString();
    }
  }
}
