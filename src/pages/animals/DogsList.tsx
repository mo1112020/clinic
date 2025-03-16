
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Dog, Calendar, File, Clipboard, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for dogs
const mockDogs = [
  { id: '1', name: 'Max', type: 'dog', breed: 'Labrador', chipNo: 'A12345', owner: 'John Smith', ownerPhone: '123-456-7890', lastVisit: '2023-10-15' },
  { id: '3', name: 'Charlie', type: 'dog', breed: 'Golden Retriever', chipNo: 'C13579', owner: 'Michael Brown', ownerPhone: '555-123-4567', lastVisit: '2023-09-22' },
  { id: '5', name: 'Cooper', type: 'dog', breed: 'Beagle', chipNo: 'E34567', owner: 'James Wilson', ownerPhone: '111-222-3333', lastVisit: '2023-10-05' },
  { id: '7', name: 'Rocky', type: 'dog', breed: 'German Shepherd', chipNo: 'G78901', owner: 'David Johnson', ownerPhone: '444-333-2222', lastVisit: '2023-11-10' },
  { id: '9', name: 'Buddy', type: 'dog', breed: 'Bulldog', chipNo: 'I23456', owner: 'Thomas Anderson', ownerPhone: '999-888-7777', lastVisit: '2023-10-28' },
];

const DogsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDogs, setFilteredDogs] = useState(mockDogs);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredDogs(mockDogs);
      return;
    }
    
    const filtered = mockDogs.filter(dog => 
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.chipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredDogs(filtered);
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
          {filteredDogs.length === 0 ? (
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
                  <motion.div 
                    variants={listVariants}
                    initial="initial"
                    animate="animate"
                    className="contents"
                  >
                    {filteredDogs.map((dog) => (
                      <motion.div 
                        key={dog.id}
                        variants={itemVariants}
                        className="contents"
                      >
                        <TableRow>
                          <TableCell className="font-medium">{dog.name}</TableCell>
                          <TableCell>{dog.breed}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clipboard className="h-4 w-4 text-muted-foreground" />
                              <span>{dog.chipNo}</span>
                            </div>
                          </TableCell>
                          <TableCell>{dog.owner}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{dog.ownerPhone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{dog.lastVisit}</span>
                            </div>
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

export default DogsList;
