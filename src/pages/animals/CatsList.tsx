
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Cat, Calendar, File, Clipboard, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for cats
const mockCats = [
  { id: '2', name: 'Luna', type: 'cat', breed: 'Persian', chipNo: 'B67890', owner: 'Emma Watson', ownerPhone: '098-765-4321', lastVisit: '2023-11-03' },
  { id: '6', name: 'Lucy', type: 'cat', breed: 'Siamese', chipNo: 'F45678', owner: 'Olivia Moore', ownerPhone: '444-555-6666', lastVisit: '2023-10-18' },
  { id: '8', name: 'Milo', type: 'cat', breed: 'Maine Coon', chipNo: 'H12345', owner: 'Emily Davis', ownerPhone: '666-777-8888', lastVisit: '2023-11-05' },
  { id: '10', name: 'Oliver', type: 'cat', breed: 'Ragdoll', chipNo: 'J34567', owner: 'Sophia Miller', ownerPhone: '111-333-5555', lastVisit: '2023-10-25' },
  { id: '12', name: 'Bella', type: 'cat', breed: 'Scottish Fold', chipNo: 'L56789', owner: 'Linda Johnson', ownerPhone: '222-444-6666', lastVisit: '2023-11-12' },
];

const CatsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCats, setFilteredCats] = useState(mockCats);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCats(mockCats);
      return;
    }
    
    const filtered = mockCats.filter(cat => 
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
          {filteredCats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cats found. Try a different search.</p>
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
                              <span>{cat.chipNo}</span>
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
                              <span>{cat.lastVisit}</span>
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
