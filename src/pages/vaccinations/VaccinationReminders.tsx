
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, Dog, Cat, Bird, Send } from 'lucide-react';
import { format, isFuture, isPast, isToday, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Mock data
const vaccinationReminders = [
  // Upcoming
  { id: 1, animalName: 'Max', animalType: 'dog', ownerName: 'John Smith', ownerPhone: '123-456-7890', vaccineName: 'Rabies Vaccine', date: '2023-10-25' },
  { id: 2, animalName: 'Luna', animalType: 'cat', ownerName: 'Emma Watson', ownerPhone: '098-765-4321', vaccineName: 'Feline Distemper', date: '2023-10-26' },
  { id: 3, animalName: 'Charlie', animalType: 'dog', ownerName: 'Michael Brown', ownerPhone: '555-123-4567', vaccineName: 'Bordetella', date: '2023-10-30' },
  { id: 4, animalName: 'Bella', animalType: 'bird', ownerName: 'Sophia Miller', ownerPhone: '777-888-9999', vaccineName: 'Polyomavirus', date: '2023-11-05' },
  { id: 5, animalName: 'Cooper', animalType: 'dog', ownerName: 'James Wilson', ownerPhone: '111-222-3333', vaccineName: 'Lyme Disease', date: '2023-11-10' },
  
  // Today
  { id: 6, animalName: 'Lucy', animalType: 'cat', ownerName: 'Olivia Moore', ownerPhone: '444-555-6666', vaccineName: 'FVRCP Vaccine', date: '2023-10-22' },
  { id: 7, animalName: 'Ruby', animalType: 'bird', ownerName: 'William Taylor', ownerPhone: '999-888-7777', vaccineName: 'Avian Pox', date: '2023-10-22' },
  
  // Overdue
  { id: 8, animalName: 'Oscar', animalType: 'cat', ownerName: 'Thomas Anderson', ownerPhone: '222-333-4444', vaccineName: 'FeLV Vaccine', date: '2023-10-15' },
  { id: 9, animalName: 'Milo', animalType: 'dog', ownerName: 'Rebecca Johnson', ownerPhone: '666-777-8888', vaccineName: 'Canine Influenza', date: '2023-10-10' },
  { id: 10, animalName: 'Lily', animalType: 'bird', ownerName: 'Daniel White', ownerPhone: '333-444-5555', vaccineName: "Pacheco's Disease", date: '2023-10-05' }
];

const VaccinationReminders = () => {
  const today = new Date();
  
  const [sendingReminders, setSendingReminders] = useState<number[]>([]);
  
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
  
  const getReminderStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'overdue';
    if (isFuture(date) && date <= addDays(today, 7)) return 'upcoming';
    return 'scheduled';
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
  
  const filteredReminders = (filter: string) => {
    return vaccinationReminders.filter(reminder => {
      const status = getReminderStatus(reminder.date);
      
      if (filter === 'today' && status === 'today') return true;
      if (filter === 'upcoming' && status === 'upcoming') return true;
      if (filter === 'overdue' && status === 'overdue') return true;
      if (filter === 'all') return true;
      
      return false;
    });
  };
  
  const handleSendReminder = (id: number) => {
    setSendingReminders(prev => [...prev, id]);
    
    // Simulate sending message
    setTimeout(() => {
      setSendingReminders(prev => prev.filter(reminderId => reminderId !== id));
      
      toast({
        title: "Reminder sent",
        description: "The vaccination reminder has been sent to the owner.",
      });
    }, 1500);
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
      
      <Tabs defaultValue="upcoming">
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
                  {filteredReminders(tabValue).length} {filteredReminders(tabValue).length === 1 ? 'reminder' : 'reminders'} {
                    tabValue === 'today' ? 'scheduled for today' :
                    tabValue === 'upcoming' ? 'in the next 7 days' :
                    tabValue === 'overdue' ? 'past due' : 'in total'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReminders(tabValue).length === 0 ? (
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
                    {filteredReminders(tabValue).map((reminder, index) => {
                      const status = getReminderStatus(reminder.date);
                      
                      return (
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
                                  <Badge className={getStatusColor(status)}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                                onClick={() => handleSendReminder(reminder.id)}
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
                      );
                    })}
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
