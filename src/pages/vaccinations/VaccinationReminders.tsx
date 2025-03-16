
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, Dog, Cat, Bird, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useVaccinations } from '@/hooks/use-vaccinations';

const VaccinationReminders = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'all'>('upcoming');
  
  // Use the custom hook to fetch vaccination data
  const { vaccinations, isLoading, error, sendingReminders, sendReminder } = useVaccinations(activeTab);
  
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today':
        return 'bg-amber-500 text-white';
      case 'overdue':
        return 'bg-destructive text-white';
      case 'upcoming':
        return 'bg-primary text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vaccination Reminders</h1>
        <p className="text-muted-foreground">Manage upcoming vaccinations and send reminders to pet owners.</p>
      </div>
      
      <Tabs defaultValue="upcoming" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        {['today', 'upcoming', 'overdue', 'all'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} Vaccinations
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Loading...' : 
                    `${vaccinations.length} ${vaccinations.length === 1 ? 'reminder' : 'reminders'} ${
                    tabValue === 'today' ? 'scheduled for today' :
                    tabValue === 'upcoming' ? 'in the next 7 days' :
                    tabValue === 'overdue' ? 'past due' : 'in total'
                  }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-muted-foreground">Loading vaccination reminders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-destructive">
                    <p>Error loading reminders: {error}</p>
                  </div>
                ) : vaccinations.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      {tabValue === 'today' ? 'No vaccinations scheduled for today.' :
                       tabValue === 'upcoming' ? 'No upcoming vaccinations in the next 7 days.' :
                       tabValue === 'overdue' ? 'No overdue vaccinations.' : 'No vaccination reminders found.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vaccinations.map((reminder, index) => (
                      <motion.div
                        key={reminder.id}
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        custom={index}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                              {getAnimalIcon(reminder.animalType)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{reminder.animalName}</p>
                                <Badge className={getStatusColor(reminder.status)}>
                                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{reminder.vaccineName}</p>
                            </div>
                          </div>
                          
                          <div className="sm:text-right">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Owner: </span>
                              <span className="font-medium">{reminder.ownerName}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Date: </span>
                              <span className="font-medium">{format(new Date(reminder.date), 'MMMM d, yyyy')}</span>
                            </p>
                          </div>
                          
                          <div>
                            <Button 
                              className="btn-primary w-full sm:w-auto"
                              onClick={() => sendReminder(reminder.id)}
                              disabled={sendingReminders.includes(reminder.id)}
                            >
                              {sendingReminders.includes(reminder.id) ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Sending...
                                </div>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Reminder
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default VaccinationReminders;
