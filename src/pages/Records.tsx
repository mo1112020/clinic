import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Info } from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents';
import SearchRecordsForm from '@/components/records/SearchRecordsForm';
import DocumentsTable from '@/components/records/DocumentsTable';
import { useToast } from '@/hooks/use-toast';

const Records = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  // Use the custom hook to fetch documents from Supabase
  const { documents, isLoading, error, downloadDocument, generatePdfForAnimal } = useDocuments(
    currentTab !== 'all' ? currentTab : undefined, 
    categoryFilter !== 'all' ? categoryFilter : undefined, 
    searchQuery
  );
  
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
      await generatePdfForAnimal(animalId);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Get unique categories for the filter
  const categories = ['all', 'Health Record'];
  
  // Only add categories that actually exist in the documents
  const uniqueCategories = Array.from(new Set(documents.filter(doc => doc.category && doc.category !== 'Health Record').map(doc => doc.category)));
  categories.push(...uniqueCategories.filter(cat => cat && cat !== 'all' && !categories.includes(cat)));

  console.log('Documents count in Records.tsx:', documents.length);

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
          {isLoading && (
            <div className="text-center py-2 text-muted-foreground text-sm mb-2">
              <div className="flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                <span>Loading records from the database...</span>
              </div>
            </div>
          )}
          
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
