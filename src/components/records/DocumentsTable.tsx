
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DocumentItem from './DocumentItem';

interface DocumentsTableProps {
  documents: any[];
  isLoading: boolean;
  error: string | null;
  downloadDocument: (record: any) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ 
  documents, 
  isLoading, 
  error, 
  downloadDocument 
}) => {
  const listVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No records found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <motion.div 
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="contents"
          >
            {documents.map((record) => (
              <DocumentItem 
                key={record.id} 
                record={record} 
                downloadDocument={downloadDocument} 
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
