
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Edit, Phone, Mail, Dog, Cat, Bird, FileText, Upload, Calendar, Clipboard, Activity, FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

// Mock data
const animalDetails = {
  id: '1',
  name: 'Max',
  type: 'dog',
  breed: 'Labrador Retriever',
  age: '3 years',
  chipNo: 'A12345',
  owner: 'John Smith',
  ownerId: 'JD1234567',
  ownerPhone: '123-456-7890',
  ownerEmail: 'john.smith@example.com',
  healthNotes: 'Allergic to certain foods. Prone to ear infections. Regular check-ups recommended.',
  registeredDate: '2021-03-15',
  lastVisit: '2023-09-10',
  nextAppointment: '2023-10-25',
};

const vaccinations = [
  { id: 1, name: 'Rabies Vaccine', date: '2023-03-15', nextDue: '2024-03-15', status: 'completed' },
  { id: 2, name: 'Distemper Vaccine', date: '2023-02-10', nextDue: '2024-02-10', status: 'completed' },
  { id: 3, name: 'Bordetella Vaccine', date: '2023-06-22', nextDue: '2023-12-22', status: 'upcoming' },
  { id: 4, name: 'Leptospirosis Vaccine', date: '2023-08-05', nextDue: '2024-08-05', status: 'completed' },
];

const medicalHistory = [
  { id: 1, date: '2023-09-10', description: 'Regular check-up', notes: 'Healthy overall. Weight: 28kg.' },
  { id: 2, date: '2023-06-22', description: 'Vaccination', notes: 'Bordetella vaccine administered. No adverse reactions.' },
  { id: 3, date: '2023-05-17', description: 'Minor ear infection', notes: 'Prescribed antibiotics for 7 days. Follow-up recommended.' },
  { id: 4, date: '2023-03-15', description: 'Vaccination', notes: 'Rabies vaccine administered. No adverse reactions.' },
  { id: 5, date: '2023-02-10', description: 'Vaccination', notes: 'Distemper vaccine administered. No adverse reactions.' },
];

const documents = [
  { id: 1, name: 'Initial Health Check.pdf', date: '2021-03-15', type: 'PDF', size: '1.2 MB' },
  { id: 2, name: 'Vaccination Certificate.pdf', date: '2023-03-15', type: 'PDF', size: '0.8 MB' },
  { id: 3, name: 'Lab Test Results.pdf', date: '2023-05-17', type: 'PDF', size: '2.5 MB' },
  { id: 4, name: 'X-Ray Image.jpg', date: '2023-05-17', type: 'Image', size: '3.1 MB' },
];

const AnimalDetails = () => {
  const { id } = useParams();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const getAnimalIcon = () => {
    switch (animalDetails.type) {
      case 'dog':
        return <Dog className="h-5 w-5" />;
      case 'cat':
        return <Cat className="h-5 w-5" />;
      case 'bird':
        return <Bird className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{animalDetails.name}</h1>
          <p className="text-muted-foreground capitalize">{animalDetails.type} • {animalDetails.breed}</p>
        </div>
        <Link to={`/animals/${id}/edit`}>
          <Button className="btn-primary">
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-muted p-2 rounded-full">
                {getAnimalIcon()}
              </div>
              <CardTitle>Patient Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Animal Type</p>
                <p className="font-medium capitalize">{animalDetails.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Breed</p>
                <p className="font-medium">{animalDetails.breed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="font-medium">{animalDetails.age}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Microchip Number</p>
                <div className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{animalDetails.chipNo}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-lg font-medium mb-3">Health Notes</h3>
              <div className="bg-muted/40 p-4 rounded-lg">
                <p className="text-sm">{animalDetails.healthNotes}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-3">Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                  </div>
                  <p className="font-medium">{format(new Date(animalDetails.registeredDate), 'MMMM d, yyyy')}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                  </div>
                  <p className="font-medium">{format(new Date(animalDetails.lastVisit), 'MMMM d, yyyy')}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-primary">Next Appointment</p>
                  </div>
                  <p className="font-medium text-primary">{format(new Date(animalDetails.nextAppointment), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        {/* Owner Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-1"
            >
              <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
              <p className="font-medium">{animalDetails.owner}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="space-y-1"
            >
              <p className="text-sm font-medium text-muted-foreground">ID Number</p>
              <p className="font-medium">{animalDetails.ownerId}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-1"
            >
              <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{animalDetails.ownerPhone}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="space-y-1"
            >
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{animalDetails.ownerEmail}</p>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Contact Owner
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Tabs for medical records, vaccinations, etc. */}
      <Tabs defaultValue="vaccinations" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vaccinations" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vaccination Records</CardTitle>
                <CardDescription>View and manage vaccination schedule</CardDescription>
              </div>
              <Button className="btn-primary">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Vaccination
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vaccinations.map((vax) => (
                  <motion.div
                    key={vax.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 md:mb-0">
                      <div>
                        <Badge variant={vax.status === 'completed' ? 'secondary' : 'default'} className="mb-2 md:mb-0">
                          {vax.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{vax.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {vax.status === 'completed' 
                            ? `Administered on ${format(new Date(vax.date), 'MMMM d, yyyy')}` 
                            : `Scheduled for ${format(new Date(vax.nextDue), 'MMMM d, yyyy')}`}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Next due: <span className="text-primary">{format(new Date(vax.nextDue), 'MMMM d, yyyy')}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Past conditions, treatments, and visits</CardDescription>
              </div>
              <Button className="btn-primary">
                <Activity className="mr-2 h-4 w-4" />
                Add New Entry
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalHistory.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
                    </div>
                    <p className="text-sm">{entry.notes}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents & Files</CardTitle>
                <CardDescription>Upload and manage patient documents</CardDescription>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                      Upload a document to the patient's file. Accepted formats: PDF, JPG, PNG.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="filename">Document Name</Label>
                      <Input id="filename" placeholder="Enter document name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input id="file" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={() => setUploadDialogOpen(false)}>
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • {format(new Date(doc.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <FileUp className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalDetails;
