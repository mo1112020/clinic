
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDocuments(animalType?: string, categoryFilter?: string, searchQuery?: string) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching documents with filters:', { animalType, categoryFilter, searchQuery });
        
        // Here we're joining with the animals table to get animal information
        let query = supabase
          .from('medical_files')
          .select(`
            *,
            animals (
              id,
              name,
              animal_type,
              breed,
              chip_number,
              health_notes,
              owner_id,
              owners (
                id,
                full_name,
                phone_number
              )
            )
          `);

        if (animalType && animalType !== 'all') {
          query = query.eq('animals.animal_type', animalType);
        }

        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('file_type', categoryFilter);
        }

        if (searchQuery) {
          query = query.or(
            `file_name.ilike.%${searchQuery}%,animals.name.ilike.%${searchQuery}%,animals.owners.full_name.ilike.%${searchQuery}%`
          );
        }
        
        console.log('Executing query for documents');
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Error fetching documents:', fetchError);
          throw fetchError;
        }
        
        console.log('Raw document data:', data);

        if (!data || data.length === 0) {
          console.log('No documents found with the current filters');
          setDocuments([]);
          setIsLoading(false);
          return;
        }

        // Transform the data into a format suitable for the UI
        const formattedDocuments = data.map(doc => {
          // Check if animals data exists before accessing properties
          if (!doc.animals) {
            console.warn('Document missing animal reference:', doc);
            return {
              id: doc.id,
              filename: doc.file_name,
              patientName: 'Unknown',
              patientType: 'unknown',
              owner: 'Unknown',
              date: doc.uploaded_at,
              category: doc.file_type || 'Other',
              fileSize: '1 MB', // Placeholder
              fileUrl: doc.file_url
            };
          }

          return {
            id: doc.id,
            filename: doc.file_name,
            patientName: doc.animals.name,
            patientType: doc.animals.animal_type,
            owner: doc.animals.owners?.full_name || 'Unknown',
            date: doc.uploaded_at,
            category: doc.file_type || 'Other',
            fileSize: '1 MB', // Placeholder
            fileUrl: doc.file_url,
            animalId: doc.animals.id,
            healthNotes: doc.animals.health_notes
          };
        });

        console.log('Formatted documents:', formattedDocuments);
        setDocuments(formattedDocuments);
      } catch (err: any) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents: ' + (err.message || 'Unknown error'));
        toast({
          title: 'Error',
          description: 'Failed to load documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [animalType, categoryFilter, searchQuery, toast]);

  const downloadDocument = async (document: any) => {
    if (!document.fileUrl) {
      toast({
        title: 'Download failed',
        description: 'Document URL not available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // For this example, we'll simulate downloading by opening the URL in a new tab
      window.open(document.fileUrl, '_blank');
      
      toast({
        title: 'Download started',
        description: `Downloading ${document.filename}`,
      });
    } catch (err) {
      console.error('Error downloading document:', err);
      toast({
        title: 'Download failed',
        description: 'Failed to download document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { documents, isLoading, error, downloadDocument };
}
