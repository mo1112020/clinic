
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell } from 'lucide-react';
import { useVaccinations } from '@/hooks/use-vaccinations';
import { VaccinationReminderCard, VaccinationReminderItem } from '@/components/vaccinations/VaccinationReminderCard';
import { VaccinationLoadingState } from '@/components/vaccinations/VaccinationLoadingState';
import { VaccinationEmptyState } from '@/components/vaccinations/VaccinationEmptyState';

const VaccinationReminders = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'all'>('upcoming');
  
  // Use the custom hook to fetch vaccination data
  const { vaccinations, isLoading, error, sendingReminders, sendReminder } = useVaccinations(activeTab);
  
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
                  <VaccinationLoadingState />
                ) : error ? (
                  <div className="text-center py-10 text-destructive">
                    <p>Error loading reminders: {error}</p>
                  </div>
                ) : vaccinations.length === 0 ? (
                  <VaccinationEmptyState tabValue={tabValue} />
                ) : (
                  <div className="space-y-4">
                    {vaccinations.map((reminder: VaccinationReminderItem, index: number) => (
                      <VaccinationReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        index={index}
                        isSending={sendingReminders.includes(reminder.id)}
                        onSendReminder={sendReminder}
                      />
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
