
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
        
        // Get all animals first
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

        console.log('Animals data fetched:', animalsData);
        
        // Filter animals if needed
        let filteredAnimals = animalsData || [];
        if (animalType && animalType !== 'all') {
          filteredAnimals = filteredAnimals.filter(animal => 
            animal.animal_type && animal.animal_type.toLowerCase() === animalType.toLowerCase()
          );
        }
        
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredAnimals = filteredAnimals.filter(animal => 
            (animal.name && animal.name.toLowerCase().includes(lowerQuery)) || 
            (animal.owners?.full_name && animal.owners.full_name.toLowerCase().includes(lowerQuery))
          );
        }
        
        console.log('Filtered animals:', filteredAnimals);

        // Get medical files separately
        let medicalFilesQuery = supabase
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

        if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'Health Record') {
          medicalFilesQuery = medicalFilesQuery.eq('file_type', categoryFilter);
        }
        
        const { data: filesData, error: filesError } = await medicalFilesQuery;

        if (filesError) {
          console.error('Error fetching medical files:', filesError);
          throw filesError;
        }
        
        console.log('Medical files data:', filesData || []);
        
        // Format the documents
        let formattedDocuments: any[] = [];

        // 1. Add health records for all animals
        filteredAnimals.forEach(animal => {
          formattedDocuments.push({
            id: `health-${animal.id}`,
            filename: `Health Records - ${animal.name}`,
            patientName: animal.name,
            patientType: animal.animal_type,
            owner: animal.owners?.full_name || 'Unknown',
            date: new Date().toISOString(),
            category: 'Health Record',
            fileSize: 'N/A',
            animalId: animal.id,
            healthNotes: animal.health_notes,
            isVirtualRecord: true
          });
        });

        // 2. Add actual medical files
        if (filesData && filesData.length > 0) {
          const fileDocuments = filesData
            .filter(doc => {
              // Apply additional filtering based on animal type if necessary
              if (animalType && animalType !== 'all' && doc.animals) {
                return doc.animals.animal_type.toLowerCase() === animalType.toLowerCase();
              }
              return true;
            })
            .filter(doc => {
              // Apply additional filtering based on search query if necessary
              if (searchQuery && doc.animals) {
                const lowerQuery = searchQuery.toLowerCase();
                return (
                  doc.animals.name.toLowerCase().includes(lowerQuery) ||
                  (doc.animals.owners?.full_name && doc.animals.owners.full_name.toLowerCase().includes(lowerQuery)) ||
                  (doc.file_name && doc.file_name.toLowerCase().includes(lowerQuery))
                );
              }
              return true;
            })
            .map(doc => {
              if (!doc.animals) {
                return {
                  id: doc.id,
                  filename: doc.file_name || 'Unknown file',
                  patientName: 'Unknown',
                  patientType: 'unknown',
                  owner: 'Unknown',
                  date: doc.uploaded_at || new Date().toISOString(),
                  category: doc.file_type || 'Other',
                  fileSize: '1 MB',
                  fileUrl: doc.file_url,
                  isActualFile: true
                };
              }
              
              return {
                id: doc.id,
                filename: doc.file_name || 'Unknown file',
                patientName: doc.animals.name,
                patientType: doc.animals.animal_type,
                owner: doc.animals.owners?.full_name || 'Unknown',
                date: doc.uploaded_at || new Date().toISOString(),
                category: doc.file_type || 'Other',
                fileSize: '1 MB',
                fileUrl: doc.file_url,
                animalId: doc.animals.id,
                healthNotes: doc.animals.health_notes,
                isActualFile: true
              };
            });
            
          formattedDocuments = [...formattedDocuments, ...fileDocuments];
        }

        console.log('Formatted documents:', formattedDocuments);
        setDocuments(formattedDocuments);
      } catch (err: any) {
        console.error('Error in useDocuments hook:', err);
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
