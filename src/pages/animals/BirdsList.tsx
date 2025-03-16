
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Bird, Calendar, File, Clipboard, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnimals } from '@/hooks/use-animals';

const BirdsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queryToSearch, setQueryToSearch] = useState('');
  
  // Use the custom hook to fetch birds data from Supabase
  const { animals: birds, isLoading, error } = useAnimals('bird', queryToSearch);
  
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Birds</h1>
        <p className="text-muted-foreground">List of all registered birds at Canki Vet Clinic.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Birds</CardTitle>
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
              <Bird className="h-5 w-5 mr-2 text-purple-500" />
              Birds Registry
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading birds...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading birds: {error}</p>
            </div>
          ) : birds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No birds found. Try a different search.</p>
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
                  <motion.div 
                    variants={listVariants}
                    initial="initial"
                    animate="animate"
                    className="contents"
                  >
                    {birds.map((bird) => (
                      <motion.div 
                        key={bird.id}
                        variants={itemVariants}
                        className="contents"
                      >
                        <TableRow>
                          <TableCell className="font-medium">{bird.name}</TableCell>
                          <TableCell>{bird.breed}</TableCell>
                          <TableCell>
                            {bird.chipNo && (
                              <div className="flex items-center gap-2">
                                <Clipboard className="h-4 w-4 text-muted-foreground" />
                                <span>{bird.chipNo}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{bird.owners?.name || 'N/A'}</TableCell>
                          <TableCell>
                            {bird.owners?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{bird.owners.phone}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {bird.last_visit && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{bird.last_visit}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link to={`/animals/${bird.id}`}>
                              <Button variant="outline" size="sm">
                                <File className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      </motion.div>
                    ))}
                  </motion.div>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BirdsList;
