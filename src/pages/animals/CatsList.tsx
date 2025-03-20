
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Cat, Calendar, File, Clipboard, Phone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCats, CatListItem } from '@/services/animals/get-cats';
import { useToast } from '@/hooks/use-toast';

const CatsList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [cats, setCats] = useState<CatListItem[]>([]);
  const [filteredCats, setFilteredCats] = useState<CatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch cats from the database
  const fetchCats = async () => {
    setIsLoading(true);
    try {
      const fetchedCats = await getCats();
      setCats(fetchedCats);
      setFilteredCats(fetchedCats);
    } catch (error) {
      console.error('Error fetching cats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cats from the database',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCats();
  }, []);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCats(cats);
      return;
    }
    
    const filtered = cats.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.chipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.breed.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCats(filtered);
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cats</h1>
        <p className="text-muted-foreground">List of all registered cats at Canki Vet Clinic.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Cats</CardTitle>
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
            <Button 
              variant="outline" 
              onClick={fetchCats} 
              disabled={isLoading} 
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Cat className="h-5 w-5 mr-2 text-green-500" />
              Cats Registry
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg">Loading cats...</span>
            </div>
          ) : filteredCats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cats found. Try a different search or create a new cat.</p>
              <Link to="/animals/new">
                <Button className="mt-4">
                  Create New Cat
                </Button>
              </Link>
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
                    {filteredCats.map((cat) => (
                      <motion.div 
                        key={cat.id}
                        variants={itemVariants}
                        className="contents"
                      >
                        <TableRow>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell>{cat.breed}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clipboard className="h-4 w-4 text-muted-foreground" />
                              <span>{cat.chipNo || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{cat.owner}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{cat.ownerPhone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{cat.lastVisit || 'No visits'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link to={`/animals/${cat.id}`}>
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

export default CatsList;
