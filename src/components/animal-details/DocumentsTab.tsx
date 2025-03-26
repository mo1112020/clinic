
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, File, FileText as FileTextIcon, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Document } from '@/types/database.types';
import { useAnimalDetails } from '@/hooks/use-animal-details';
import { useToast } from '@/hooks/use-toast';
import { generateAnimalRecordPdf } from '@/services/documents/generate-pdf';

interface DocumentsTabProps {
  documents: Document[];
  animalId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, animalId }) => {
  const { animal, owner, vaccinations, medicalHistory } = useAnimalDetails(animalId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleGeneratePdf = async () => {
    if (!animal || !owner) return;
    
    setIsGenerating(true);
    try {
      const pdfDataUrl = await generateAnimalRecordPdf({
        animal,
        owner,
        vaccinations,
        medicalRecords: medicalHistory,
        title: `Medical Record - ${animal.name}`
      });
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${animal.name.replace(/\s+/g, '_')}_medical_record.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'PDF Generated',
        description: 'Medical record PDF has been generated and downloaded.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
      // Open the URL in a new tab
      window.open(doc.url, '_blank');
      
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents & Files</CardTitle>
          <CardDescription>Manage patient documents and files</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGeneratePdf} disabled={isGenerating}>
            <FileTextIcon className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
          <Button className="btn-primary">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
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
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleGeneratePdf}
                    disabled={isGenerating}
                  >
                    <FileDown className="h-4 w-4 mr-1" />
                    {isGenerating ? 'Generating...' : 'PDF'}
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
