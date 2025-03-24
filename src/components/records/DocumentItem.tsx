
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Dog, Cat, Bird } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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
  };
  downloadDocument: (record: any) => void;
  variants: any;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ record, downloadDocument, variants }) => {
  const getAnimalIcon = (type: string) => {
    switch (type) {
      case 'dog':
        return <Dog className="h-5 w-5 text-amber-500" />;
      case 'cat':
        return <Cat className="h-5 w-5 text-green-500" />;
      case 'bird':
        return <Bird className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      variants={variants}
      className="contents"
    >
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{record.filename}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {getAnimalIcon(record.patientType)}
            <span>{record.patientName}</span>
          </div>
        </TableCell>
        <TableCell>{record.owner}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(record.date), 'yyyy-MM-dd')}</span>
          </div>
        </TableCell>
        <TableCell>{record.category}</TableCell>
        <TableCell>{record.fileSize}</TableCell>
        <TableCell>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => downloadDocument(record)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </TableCell>
      </TableRow>
    </motion.div>
  );
};

export default DocumentItem;
