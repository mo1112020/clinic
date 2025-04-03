
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchAnimals, fetchMedicalFiles } from '@/services/documents/fetch-documents';
import { 
  filterAnimalsByType,
  filterAnimalsBySearchQuery,
  formatHealthRecords,
  filterMedicalFilesByAnimalType,
  filterMedicalFilesBySearchQuery,
  formatMedicalFiles
} from '@/services/documents/format-documents';

export function useDocuments(animalType?: string, categoryFilter?: string, searchQuery?: string) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndProcessDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching documents with filters:', { animalType, categoryFilter, searchQuery });
        
        // Fetch all animals and medical files
        const [animalsData, filesData] = await Promise.all([
          fetchAnimals(),
          fetchMedicalFiles(categoryFilter)
        ]);

        console.log('Animals data fetched:', animalsData);
        
        // Apply filters to animals
        const filteredAnimals = filterAnimalsBySearchQuery(
          filterAnimalsByType(animalsData, animalType),
          searchQuery
        );
        
        console.log('Filtered animals:', filteredAnimals);

        // Format documents array
        let formattedDocuments: any[] = [];

        // 1. Add health records for all animals
        if (categoryFilter === 'all' || categoryFilter === 'Health Record') {
          formattedDocuments = formatHealthRecords(filteredAnimals);
        }

        // 2. Add actual medical files with filtering
        if (filesData && filesData.length > 0) {
          const filteredFiles = filterMedicalFilesBySearchQuery(
            filterMedicalFilesByAnimalType(filesData, animalType),
            searchQuery
          );
          
          const fileDocuments = formatMedicalFiles(filteredFiles);
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

    fetchAndProcessDocuments();
  }, [animalType, categoryFilter, searchQuery, toast]);

  // Return only the necessary data for displaying documents
  return { documents, isLoading, error };
}
