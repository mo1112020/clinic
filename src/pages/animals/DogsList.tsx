
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Dog, Calendar, File, Clipboard, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnimals } from '@/hooks/use-animals';
import { format } from 'date-fns';

const DogsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queryToSearch, setQueryToSearch] = useState('');
  
  // Use the custom hook to fetch dogs data from Supabase
  const { animals: dogs, isLoading, error } = useAnimals('dog', queryToSearch);
  
  const handleSearch = () => {
    setQueryToSearch(searchQuery);
  };

  const listVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dogs</h1>
        <p className="text-muted-foreground">List of all registered dogs at Canki Vet Clinic.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Dogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, breed, chip number, or owner"
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="btn-primary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Dog className="h-5 w-5 mr-2 text-amber-500" />
              Dogs Registry
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading dogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading dogs: {error}</p>
            </div>
          ) : dogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No dogs found. Try a different search.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Chip No.</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dogs.map((dog) => (
                    <TableRow key={dog.id}>
                      <TableCell className="font-medium">{dog.name}</TableCell>
                      <TableCell>{dog.breed}</TableCell>
                      <TableCell>
                        {dog.chipNo && (
                          <div className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4 text-muted-foreground" />
                            <span>{dog.chipNo}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{dog.owner?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {dog.owner?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{dog.owner.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {dog.last_visit && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(dog.last_visit), 'yyyy-MM-dd')}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/animals/${dog.id}`}>
                          <Button variant="outline" size="sm">
                            <File className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DogsList;
