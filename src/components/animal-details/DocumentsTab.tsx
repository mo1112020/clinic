
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileText, 
  FileUp, 
  Loader2 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Document } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface DocumentsTabProps {
  documents: Document[];
  animalId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, animalId }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handleFileUpload = async () => {
    if (!file || !documentName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a document name and select a file.',
        variant: 'destructive',
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${animalId}/${Date.now()}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('animal_documents')
        .upload(fileName, file);
        
      if (storageError) throw storageError;
      
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          animal_id: animalId,
          name: documentName,
          date: new Date().toISOString(),
          type: file.type.split('/')[1].toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: storageData.path
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: 'Document uploaded',
        description: 'The document has been successfully uploaded.',
      });
      
      setUploadDialogOpen(false);
      setDocumentName('');
      setFile(null);
      
      window.location.reload();
      
    } catch (err) {
      console.error('Error uploading document:', err);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents & Files</CardTitle>
          <CardDescription>Upload and manage patient documents</CardDescription>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document to the patient's file. Accepted formats: PDF, JPG, PNG.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Document Name</Label>
                <Input 
                  id="filename" 
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleFileUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found for this animal.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • {format(new Date(doc.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <FileUp className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
