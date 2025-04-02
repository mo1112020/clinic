
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Dog, Cat, Bird, Calendar, FileText, Pill, Stethoscope, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useMedicalHistory, MedicalHistoryRecord } from '@/hooks/use-medical-history';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const MedicalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { medicalHistory, isLoading, error } = useMedicalHistory(currentTab, searchQuery);
  const { t } = useLanguage();
  
  const handleSearch = () => {
    // The useMedicalHistory hook will handle the search based on current state
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const getAnimalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dog':
        return <Dog className="h-5 w-5 text-amber-500" />;
      case 'cat':
        return <Cat className="h-5 w-5 text-green-500" />;
      case 'bird':
        return <Bird className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
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

  // Format the date safely
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('medicalHistory')}</h1>
        <p className="text-muted-foreground">View and search through all medical procedures and visits.</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t('searchRecords')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">{t('all')} {t('animals')}</TabsTrigger>
              <TabsTrigger value="dog">
                <Dog className="h-4 w-4 mr-2" />
                {t('dogs')}
              </TabsTrigger>
              <TabsTrigger value="cat">
                <Cat className="h-4 w-4 mr-2" />
                {t('cats')}
              </TabsTrigger>
              <TabsTrigger value="bird">
                <Bird className="h-4 w-4 mr-2" />
                {t('birds')}
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
                {t('searchRecords')}
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
              {t('medicalRecords')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Loading medical records...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p className="text-destructive">{error}</p>
            </div>
          ) : medicalHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No medical records found. Try a different search.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('patient')}</TableHead>
                    <TableHead>{t('owner')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('procedure')}</TableHead>
                    <TableHead>{t('details')}</TableHead>
                    <TableHead>{t('veterinarian')}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalHistory.map((record) => (
                    <TableRow key={record.id}>
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
                          <span>{formatDate(record.date)}</span>
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
                        <Link to={`/animals/${record.animalId}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('patientDetails')}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
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
