
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents';
import SearchRecordsForm from '@/components/records/SearchRecordsForm';
import DocumentsTable from '@/components/records/DocumentsTable';

const Records = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const { documents, isLoading, error, downloadDocument } = useDocuments(
    currentTab !== 'all' ? currentTab : undefined, 
    categoryFilter !== 'all' ? categoryFilter : undefined, 
    searchQuery
  );
  
  const handleSearch = () => {
    // The useDocuments hook will handle the search based on the parameters
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  // Get unique categories for the filter
  const categories = ['all', ...Array.from(new Set(documents.map(record => record.category)))];

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
