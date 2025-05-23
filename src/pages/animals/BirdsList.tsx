
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Bird, Calendar, File, Clipboard, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnimals } from '@/hooks/use-animals';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const BirdsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queryToSearch, setQueryToSearch] = useState('');
  const { t } = useLanguage();
  
  // Use the custom hook to fetch birds data from Supabase
  const { animals: birds, isLoading, error } = useAnimals('bird', queryToSearch);
  
  const handleSearch = () => {
    setQueryToSearch(searchQuery);
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('birds')}</h1>
        <p className="text-muted-foreground">{t('registeredBirds')}</p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t('searchBirds')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={t('searchByNameBreed')}
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="btn-primary">
              <Search className="h-4 w-4 mr-2" />
              {t('search')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Bird className="h-5 w-5 mr-2 text-purple-500" />
              {t('birdsRegistry')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">{t('loadingBirds')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>{t('errorBirds')} {error}</p>
            </div>
          ) : birds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noBirds')}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('breed')}</TableHead>
                    <TableHead>{t('chipNo')}</TableHead>
                    <TableHead>{t('owner')}</TableHead>
                    <TableHead>{t('contact')}</TableHead>
                    <TableHead>{t('lastVisit')}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {birds.map((bird) => (
                    <TableRow key={bird.id}>
                      <TableCell className="font-medium">{bird.name}</TableCell>
                      <TableCell>{bird.breed}</TableCell>
                      <TableCell>
                        {bird.chipNo && (
                          <div className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4 text-muted-foreground" />
                            <span>{bird.chipNo}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{bird.owner?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {bird.owner?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{bird.owner.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {bird.last_visit && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(bird.last_visit), 'yyyy-MM-dd')}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/animals/${bird.id}`}>
                          <Button variant="outline" size="sm">
                            <File className="h-4 w-4 mr-2" />
                            {t('view')}
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

export default BirdsList;
