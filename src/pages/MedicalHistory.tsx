
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Dog, Cat, Bird, Calendar, FileText, Pill, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Mock data for medical history
const mockMedicalHistory = [
  { id: '1', patientName: 'Max', patientType: 'dog', owner: 'John Smith', date: '2023-11-15', procedure: 'Vaccination', details: 'Annual rabies vaccine', veterinarian: 'Dr. Sarah Johnson' },
  { id: '2', patientName: 'Luna', patientType: 'cat', owner: 'Emma Watson', date: '2023-11-10', procedure: 'Check-up', details: 'Regular health check', veterinarian: 'Dr. Michael Brown' },
  { id: '3', patientName: 'Charlie', patientType: 'dog', owner: 'Michael Brown', date: '2023-11-05', procedure: 'Surgery', details: 'Tooth extraction', veterinarian: 'Dr. Sarah Johnson' },
  { id: '4', patientName: 'Bella', patientType: 'bird', owner: 'Sophia Miller', date: '2023-11-01', procedure: 'Wing clipping', details: 'Regular wing maintenance', veterinarian: 'Dr. James Wilson' },
  { id: '5', patientName: 'Cooper', patientType: 'dog', owner: 'James Wilson', date: '2023-10-28', procedure: 'Vaccination', details: 'Distemper vaccine', veterinarian: 'Dr. Sarah Johnson' },
  { id: '6', patientName: 'Lucy', patientType: 'cat', owner: 'Olivia Moore', date: '2023-10-25', procedure: 'Deworming', details: 'Regular parasite control', veterinarian: 'Dr. Michael Brown' },
  { id: '7', patientName: 'Rocky', patientType: 'dog', owner: 'David Johnson', date: '2023-10-20', procedure: 'X-ray', details: 'Hip examination', veterinarian: 'Dr. James Wilson' },
  { id: '8', patientName: 'Milo', patientType: 'cat', owner: 'Emily Davis', date: '2023-10-18', procedure: 'Blood test', details: 'Annual blood work', veterinarian: 'Dr. Sarah Johnson' },
];

const MedicalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [filteredHistory, setFilteredHistory] = useState(mockMedicalHistory);
  
  const handleSearch = () => {
    let filtered = mockMedicalHistory;
    
    // Filter by animal type if not "all"
    if (currentTab !== 'all') {
      filtered = filtered.filter(record => record.patientType === currentTab);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.veterinarian.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredHistory(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    let filtered = mockMedicalHistory;
    
    // Filter by animal type if not "all"
    if (value !== 'all') {
      filtered = filtered.filter(record => record.patientType === value);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.veterinarian.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredHistory(filtered);
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Medical History</h1>
        <p className="text-muted-foreground">View and search through all medical procedures and visits.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Search Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
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
            
            <div className="flex gap-2">
              <Input
                placeholder="Search by patient, owner, procedure, or veterinarian"
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
          <CardTitle>
            <div className="flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-primary" />
              Medical Records
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No medical records found. Try a different search.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Veterinarian</TableHead>
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
                    {filteredHistory.map((record) => (
                      <motion.div 
                        key={record.id}
                        variants={itemVariants}
                        className="contents"
                      >
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getAnimalIcon(record.patientType)}
                              <span>{record.patientName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{record.owner}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{record.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-muted-foreground" />
                              <span>{record.procedure}</span>
                            </div>
                          </TableCell>
                          <TableCell>{record.details}</TableCell>
                          <TableCell>{record.veterinarian}</TableCell>
                          <TableCell>
                            <Link to={`/animals/${record.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Patient Details
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

export default MedicalHistory;
