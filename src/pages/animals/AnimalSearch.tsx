
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Dog, Cat, Bird, Calendar, File, Clipboard, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnimals } from '@/hooks/use-animals';
import { AnimalType } from '@/types/database.types';

const AnimalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const { animals, isLoading, error } = useAnimals(undefined, searchQuery, searchBy);
  
  const handleSearch = () => {
    // The useAnimals hook will automatically update based on the searchQuery and searchBy
    console.log('Searching with query:', searchQuery, 'by:', searchBy);
  };

  const getAnimalIcon = (type: AnimalType) => {
    switch (type) {
      case 'dog':
        return <Dog className="h-5 w-5 text-amber-500" />;
      case 'cat':
        return <Cat className="h-5 w-5 text-green-500" />;
      case 'bird':
        return <Bird className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Search Records</h1>
        <p className="text-muted-foreground">Find patient records quickly by name, chip number, or owner.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
          <CardDescription>Enter the patient information to search</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="name" onValueChange={(value) => setSearchBy(value)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="name">By Name</TabsTrigger>
              <TabsTrigger value="chip">By Chip No.</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Input
                placeholder={`Search by ${searchBy === 'name' ? 'animal name' : searchBy === 'chip' ? 'chip number' : 'owner name'}`}
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
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>Found {animals.length} {animals.length === 1 ? 'result' : 'results'}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Loading animals...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>{error}</p>
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found. Try a different search.</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              variants={listVariants}
              initial="initial"
              animate="animate"
            >
              {animals.map((animal) => (
                <motion.div 
                  key={animal.id}
                  variants={itemVariants}
                >
                  <Link to={`/animals/${animal.id}`}>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-primary/30 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          {getAnimalIcon(animal.type)}
                        </div>
                        <div>
                          <p className="font-medium">{animal.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{animal.type} • {animal.breed}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-6">
                        {animal.chipNo && (
                          <div className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{animal.chipNo}</span>
                          </div>
                        )}
                        {animal.owner && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{animal.owner.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{animal.owner?.name || 'Unknown Owner'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalSearch;
