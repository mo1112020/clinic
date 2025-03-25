
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
        
        // First, let's get a list of all animals to create records for them
        const { data: animalsData, error: animalsError } = await supabase
          .from('animals')
          .select(`
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
          `);

        if (animalsError) {
          console.error('Error fetching animals:', animalsError);
          throw animalsError;
        }

        // Now get any actual medical files from the database
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
        
        console.log('Executing query for medical files');
        const { data: filesData, error: filesError } = await query;

        if (filesError) {
          console.error('Error fetching medical files:', filesError);
          throw filesError;
        }
        
        console.log('Raw animals data:', animalsData);
        console.log('Raw medical files data:', filesData || []);

        // Generate documents from animals data if no actual medical files exist
        let formattedDocuments = [];

        // First add actual medical files if they exist
        if (filesData && filesData.length > 0) {
          const fileDocuments = filesData.map(doc => {
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
          
          formattedDocuments.push(...fileDocuments);
        }

        // Then create virtual placeholder records for all animals
        if (animalsData && animalsData.length > 0) {
          const animalDocuments = animalsData
            .filter(animal => {
              // Filter by animal type if specified
              if (animalType && animalType !== 'all') {
                return animal.animal_type.toLowerCase() === animalType.toLowerCase();
              }
              return true;
            })
            .filter(animal => {
              // Filter by search query if specified
              if (searchQuery) {
                const animalNameMatch = animal.name.toLowerCase().includes(searchQuery.toLowerCase());
                const ownerNameMatch = animal.owners?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
                return animalNameMatch || ownerNameMatch;
              }
              return true;
            })
            .map(animal => {
              return {
                id: `animal-${animal.id}`,
                filename: `Health Records - ${animal.name}`,
                patientName: animal.name,
                patientType: animal.animal_type,
                owner: animal.owners?.full_name || 'Unknown',
                date: new Date().toISOString(),
                category: 'Health Record',
                fileSize: 'N/A',
                animalId: animal.id,
                healthNotes: animal.health_notes
              };
            });

          // Add to formatted documents but avoid duplicates
          const existingAnimalIds = new Set(formattedDocuments.map(doc => doc.animalId));
          const uniqueAnimalDocuments = animalDocuments.filter(
            doc => !existingAnimalIds.has(doc.animalId)
          );
          
          formattedDocuments.push(...uniqueAnimalDocuments);
        }

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
