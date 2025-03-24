
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents';
import SearchRecordsForm from '@/components/records/SearchRecordsForm';
import DocumentsTable from '@/components/records/DocumentsTable';
import { useToast } from '@/hooks/use-toast';

const Records = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  
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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Records;
