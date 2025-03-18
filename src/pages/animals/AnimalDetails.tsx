import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Edit, 
  Phone, 
  Mail, 
  Dog, 
  Cat, 
  Bird, 
  FileText, 
  Upload, 
  Calendar, 
  Clipboard, 
  Activity, 
  FileUp, 
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useAnimalDetails } from '@/hooks/use-animal-details';
import { deleteAnimal } from '@/services/animal-service';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const { animal, owner, vaccinations, medicalHistory, documents, isLoading, error } = useAnimalDetails(id!);
  
  const getAnimalIcon = () => {
    if (!animal) return null;
    
    switch (animal.type) {
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

  const handleFileUpload = async () => {
    if (!file || !documentName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a document name and select a file.',
        variant: 'destructive',
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${Date.now()}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('animal_documents')
        .upload(fileName, file);
        
      if (storageError) throw storageError;
      
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          animal_id: id,
          name: documentName,
          date: new Date().toISOString(),
          type: file.type.split('/')[1].toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: storageData.path
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: 'Document uploaded',
        description: 'The document has been successfully uploaded.',
      });
      
      setUploadDialogOpen(false);
      setDocumentName('');
      setFile(null);
      
      window.location.reload();
      
    } catch (err) {
      console.error('Error uploading document:', err);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAnimal = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await deleteAnimal(id);
      
      toast({
        title: 'Animal deleted',
        description: 'The patient has been successfully removed from the system.',
      });
      
      navigate('/animals/search');
    } catch (err) {
      console.error('Error deleting animal:', err);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading animal details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !animal) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">Error loading animal details</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{animal.name}</h1>
          <p className="text-muted-foreground capitalize">{animal.type} • {animal.breed}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/animals/${id}/edit`}>
            <Button className="btn-primary">
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          </Link>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {animal.name}'s record from the system.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAnimal();
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <p className="font-medium capitalize">{animal.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Breed</p>
                <p className="font-medium">{animal.breed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="font-medium">{animal.age || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Microchip Number</p>
                {animal.chipNo ? (
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{animal.chipNo}</p>
                  </div>
                ) : (
                  <p className="font-medium text-muted-foreground">Not registered</p>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-lg font-medium mb-3">Health Notes</h3>
              <div className="bg-muted/40 p-4 rounded-lg">
                <p className="text-sm">{animal.healthNotes || 'No health notes available.'}</p>
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
                  <p className="font-medium">{format(new Date(animal.created_at), 'MMMM d, yyyy')}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                  </div>
                  <p className="font-medium">{animal.last_visit ? format(new Date(animal.last_visit), 'MMMM d, yyyy') : 'No visits recorded'}</p>
                </div>
                {animal.next_appointment && (
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-primary">Next Appointment</p>
                    </div>
                    <p className="font-medium text-primary">{format(new Date(animal.next_appointment), 'MMMM d, yyyy')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {owner && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-1"
                >
                  <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
                  <p className="font-medium">{owner.name}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="space-y-1"
                >
                  <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                  <p className="font-medium">{owner.id_number}</p>
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
                    <p className="font-medium">{owner.phone}</p>
                  </div>
                </motion.div>
                {owner.email && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="space-y-1"
                  >
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{owner.email}</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Contact Owner
            </Button>
          </CardFooter>
        </Card>
      </div>
      
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
              {vaccinations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No vaccination records found for this animal.</p>
                </div>
              ) : (
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
                              : `Scheduled for ${format(new Date(vax.next_due), 'MMMM d, yyyy')}`}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Next due: <span className="text-primary">{format(new Date(vax.next_due), 'MMMM d, yyyy')}</span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
              {medicalHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No medical history found for this animal.</p>
                </div>
              ) : (
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
              )}
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
                      <Input 
                        id="filename" 
                        placeholder="Enter document name"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input 
                        id="file" 
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleFileUpload} disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No documents found for this animal.</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalDetails;
