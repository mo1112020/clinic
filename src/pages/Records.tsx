
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Download, Filter, Calendar, Dog, Cat, Bird } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

// Mock data for records
const mockRecords = [
  { id: '1', filename: 'Max_Lab_Results.pdf', patientName: 'Max', patientType: 'dog', owner: 'John Smith', date: '2023-11-15', category: 'Lab Results', fileSize: '2.4 MB' },
  { id: '2', filename: 'Luna_X-Ray_Report.pdf', patientName: 'Luna', patientType: 'cat', owner: 'Emma Watson', date: '2023-11-10', category: 'X-Ray', fileSize: '5.6 MB' },
  { id: '3', filename: 'Charlie_Vaccine_Certificate.pdf', patientName: 'Charlie', patientType: 'dog', owner: 'Michael Brown', date: '2023-11-05', category: 'Vaccination', fileSize: '1.2 MB' },
  { id: '4', filename: 'Bella_Treatment_Plan.pdf', patientName: 'Bella', patientType: 'bird', owner: 'Sophia Miller', date: '2023-11-01', category: 'Treatment Plan', fileSize: '0.8 MB' },
  { id: '5', filename: 'Cooper_Surgery_Report.pdf', patientName: 'Cooper', patientType: 'dog', owner: 'James Wilson', date: '2023-10-28', category: 'Surgery', fileSize: '3.5 MB' },
  { id: '6', filename: 'Lucy_Prescription.pdf', patientName: 'Lucy', patientType: 'cat', owner: 'Olivia Moore', date: '2023-10-25', category: 'Prescription', fileSize: '0.5 MB' },
  { id: '7', filename: 'Rocky_Dental_Chart.pdf', patientName: 'Rocky', patientType: 'dog', owner: 'David Johnson', date: '2023-10-20', category: 'Dental', fileSize: '1.8 MB' },
  { id: '8', filename: 'Milo_Annual_Checkup.pdf', patientName: 'Milo', patientType: 'cat', owner: 'Emily Davis', date: '2023-10-18', category: 'Check-up', fileSize: '2.1 MB' },
];

const Records = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);
  
  const handleSearch = () => {
    let filtered = mockRecords;
    
    // Filter by animal type if not "all"
    if (currentTab !== 'all') {
      filtered = filtered.filter(record => record.patientType === currentTab);
    }
    
    // Filter by category if not "all"
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    let filtered = mockRecords;
    
    // Filter by animal type if not "all"
    if (value !== 'all') {
      filtered = filtered.filter(record => record.patientType === value);
    }
    
    // Filter by category if not "all"
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    
    let filtered = mockRecords;
    
    // Filter by animal type if not "all"
    if (currentTab !== 'all') {
      filtered = filtered.filter(record => record.patientType === currentTab);
    }
    
    // Filter by category if not "all"
    if (value !== 'all') {
      filtered = filtered.filter(record => record.category === value);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
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

  // Get unique categories for the filter
  const categories = ['all', ...Array.from(new Set(mockRecords.map(record => record.category)))];

  return (
    <div className="space-y-6">
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
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
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
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No records found. Try a different search.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
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
                    {filteredRecords.map((record) => (
                      <motion.div 
                        key={record.id}
                        variants={itemVariants}
                        className="contents"
                      >
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{record.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>
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
                          <TableCell>{record.category}</TableCell>
                          <TableCell>{record.fileSize}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
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

export default Records;
