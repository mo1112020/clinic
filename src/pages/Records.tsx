
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents';
import SearchRecordsForm from '@/components/records/SearchRecordsForm';
import DocumentsTable from '@/components/records/DocumentsTable';
import { useToast } from '@/hooks/use-toast';
import { generateAnimalRecordPdf } from '@/services/documents/generate-pdf';
import { useAnimalDetails } from '@/hooks/use-animal-details';

const Records = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  // Use the custom hook to fetch documents from Supabase
  const { documents, isLoading, error, downloadDocument } = useDocuments(
    currentTab !== 'all' ? currentTab : undefined, 
    categoryFilter !== 'all' ? categoryFilter : undefined, 
    searchQuery
  );
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  const handleSearch = () => {
    // The useDocuments hook will handle the search based on the parameters
    console.log('Searching with:', { searchQuery, categoryFilter, currentTab });
  };
  
  const handleTabChange = (value: string) => {
    console.log('Changing tab to:', value);
    setCurrentTab(value);
  };

  const handleGeneratePdf = async (animalId: string) => {
    setGeneratingPdf(true);
    
    try {
      // Using the animal details hook to get all needed data
      const { animal, owner, vaccinations, medicalHistory } = await useAnimalDetails(animalId).refetch();
      
      if (!animal || !owner) {
        throw new Error('Could not fetch animal or owner information');
      }
      
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we prepare your document...',
      });

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
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Get unique categories for the filter
  const categories = ['all'];
  
  // Only add categories that actually exist in the documents
  const uniqueCategories = Array.from(new Set(documents.map(doc => doc.category)));
  categories.push(...uniqueCategories.filter(cat => cat && cat !== 'all'));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Patient Records</h1>
        <p className="text-muted-foreground">View and download all patient documents and files.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Records</CardTitle>
          <CardDescription>Find patient documents by name, type, or category</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchRecordsForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            currentTab={currentTab}
            handleTabChange={handleTabChange}
            handleSearch={handleSearch}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Document Records
            </div>
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading documents...' : 
             error ? 'Error loading documents' : 
             `Showing ${documents.length} document${documents.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentsTable 
            documents={documents} 
            isLoading={isLoading} 
            error={error} 
            downloadDocument={downloadDocument} 
            generatePdf={handleGeneratePdf}
            generatingPdf={generatingPdf}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Records;
