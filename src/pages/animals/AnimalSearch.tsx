
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Dog, Cat, Bird, Calendar, File, Clipboard, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data
const mockAnimals = [
  { id: '1', name: 'Max', type: 'dog', breed: 'Labrador', chipNo: 'A12345', owner: 'John Smith', ownerPhone: '123-456-7890' },
  { id: '2', name: 'Luna', type: 'cat', breed: 'Persian', chipNo: 'B67890', owner: 'Emma Watson', ownerPhone: '098-765-4321' },
  { id: '3', name: 'Charlie', type: 'dog', breed: 'Golden Retriever', chipNo: 'C13579', owner: 'Michael Brown', ownerPhone: '555-123-4567' },
  { id: '4', name: 'Bella', type: 'bird', breed: 'Cockatiel', chipNo: 'D24680', owner: 'Sophia Miller', ownerPhone: '777-888-9999' },
  { id: '5', name: 'Cooper', type: 'dog', breed: 'Beagle', chipNo: 'E34567', owner: 'James Wilson', ownerPhone: '111-222-3333' },
  { id: '6', name: 'Lucy', type: 'cat', breed: 'Siamese', chipNo: 'F45678', owner: 'Olivia Moore', ownerPhone: '444-555-6666' },
];

const AnimalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [results, setResults] = useState(mockAnimals);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults(mockAnimals);
      return;
    }
    
    const filtered = mockAnimals.filter(animal => {
      const query = searchQuery.toLowerCase();
      if (searchBy === 'name') {
        return animal.name.toLowerCase().includes(query);
      } else if (searchBy === 'chip') {
        return animal.chipNo.toLowerCase().includes(query);
      } else if (searchBy === 'owner') {
        return animal.owner.toLowerCase().includes(query);
      }
      return false;
    });
    
    setResults(filtered);
  };

  const getAnimalIcon = (type: string) => {
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
          <CardDescription>Found {results.length} {results.length === 1 ? 'result' : 'results'}</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
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
              {results.map((animal) => (
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
                        <div className="flex items-center gap-2">
                          <Clipboard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{animal.chipNo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{animal.ownerPhone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{animal.owner}</span>
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
