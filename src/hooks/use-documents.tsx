
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
import { generateAnimalRecordPdf } from '@/services/documents/generate-pdf';
import { useAnimalDetails } from '@/hooks/use-animal-details';

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

  const downloadDocument = async (document: any) => {
    if (document.isVirtualRecord && document.animalId) {
      // If this is a virtual health record, generate PDF
      await generatePdfForAnimal(document.animalId, document.patientName);
      return;
    }
    
    if (!document.fileUrl) {
      toast({
        title: 'Download failed',
        description: 'Document URL not available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create an anchor element for download
      const link = document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.filename || 'document';
      
      // For Safari compatibility
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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

  const generatePdfForAnimal = async (animalId: string, patientName?: string) => {
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we prepare your document...',
      });

      // Use the hook to get animal details
      const { animal, owner, vaccinations, medicalHistory } = useAnimalDetails(animalId);
      
      if (!animal || !owner) {
        throw new Error('Could not fetch animal or owner information');
      }
      
      const pdfDataUrl = await generateAnimalRecordPdf({
        animal,
        owner,
        vaccinations: vaccinations || [],
        medicalRecords: medicalHistory || [],
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
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF: ' + (error.message || 'Please try again.'),
        variant: 'destructive',
      });
    }
  };

  return { documents, isLoading, error, downloadDocument, generatePdfForAnimal };
}
