
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Dog, Cat, Bird } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchRecordsFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
  currentTab: string;
  handleTabChange: (value: string) => void;
  handleSearch: () => void;
}

const SearchRecordsForm: React.FC<SearchRecordsFormProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories,
  currentTab,
  handleTabChange,
  handleSearch,
}) => {
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">All Animals</TabsTrigger>
        <TabsTrigger value="dog">
          <Dog className="h-4 w-4 mr-2" />
          Dogs
        </TabsTrigger>
        <TabsTrigger value="cat">
          <Cat className="h-4 w-4 mr-2" />
          Cats
        </TabsTrigger>
        <TabsTrigger value="bird">
          <Bird className="h-4 w-4 mr-2" />
          Birds
        </TabsTrigger>
      </TabsList>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by filename, patient, or owner"
            className="glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={handleSearch} className="btn-primary w-full">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Tabs>
  );
};

export default SearchRecordsForm;
