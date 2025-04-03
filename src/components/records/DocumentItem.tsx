
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { FileText, Calendar, Dog, Cat, Bird, Check } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DocumentItemProps {
  record: {
    id: string;
    filename: string;
    patientName: string;
    patientType: string;
    owner: string;
    date: string;
    category: string;
    fileSize: string;
    fileUrl?: string;
    healthNotes?: string;
    animalId?: string;
    isVirtualRecord?: boolean;
    isActualFile?: boolean;
  };
  downloadDocument: (record: any) => void;
  generatePdf?: (animalId: string) => void;
  variants: any;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ 
  record, 
  variants 
}) => {
  const getAnimalIcon = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'dog':
        return <Dog className="h-5 w-5 text-amber-500" />;
      case 'cat':
        return <Cat className="h-5 w-5 text-green-500" />;
      case 'bird':
        return <Bird className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  return (
    <motion.tr 
      variants={variants}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{record.filename}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getAnimalIcon(record.patientType)}
          <span>{record.patientName || 'Unknown'}</span>
        </div>
      </TableCell>
      <TableCell>{record.owner || 'Unknown'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(record.date)}</span>
        </div>
      </TableCell>
      <TableCell>{record.category || 'Other'}</TableCell>
      <TableCell>{record.fileSize || 'N/A'}</TableCell>
      <TableCell>
        {/* Cell is kept empty as requested */}
      </TableCell>
    </motion.tr>
  );
};

export default DocumentItem;
