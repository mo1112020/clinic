
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Document } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

interface DocumentsTabProps {
  documents: Document[];
  animalId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, animalId }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownloadDocument = async (doc: Document) => {
    if (!doc.url) {
      toast({
        title: 'Download Failed',
        description: 'Document URL not available.',
        variant: 'destructive',
      });
      return;
    }
    
    setDownloadingId(doc.id);
    try {
      // Create an anchor element for downloading
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name || 'document';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download Started',
        description: `Downloading ${doc.name}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Documents & Files</CardTitle>
          <CardDescription>Patient documents and files</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found for this animal.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="bg-muted p-2 rounded">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{doc.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Uploaded on {format(new Date(doc.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadDocument(doc)}
                    disabled={downloadingId === doc.id}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {downloadingId === doc.id ? 'Downloading...' : 'Download'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
