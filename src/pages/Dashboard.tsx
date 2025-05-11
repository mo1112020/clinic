
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog, Cat, Bird, ShoppingCart, Activity, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { t } = useLanguage();
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };

  // If data is loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t('loadingDashboard')}</p>
      </div>
    );
  }

  // If there was an error, show an error state
  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">{t('errorLoadingDashboard')}</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : t('failedToLoad')}
        </p>
      </div>
    );
  }

  const statCards = [
    { title: t('totalPatients'), value: stats?.totalPatients.toString() || "0", icon: Activity, color: "bg-blue-500", link: "/animals/search" },
    { title: t('dogs'), value: stats?.dogs.toString() || "0", icon: Dog, color: "bg-amber-500", link: "/animals/dogs" },
    { title: t('cats'), value: stats?.cats.toString() || "0", icon: Cat, color: "bg-green-500", link: "/animals/cats" },
    { title: t('birds'), value: stats?.birds.toString() || "0", icon: Bird, color: "bg-purple-500", link: "/animals/birds" },
  ];
  
  const actionCards = [
    { title: t('addNewPatient'), description: t('registerNewAnimal'), icon: Dog, color: "bg-canki", link: "/animals/new" },
    { title: t('upcomingVaccinations'), description: t('viewScheduledReminders'), icon: Calendar, color: "bg-amber-500", link: "/vaccinations" },
    { title: t('inventoryManagement'), description: t('checkStockLevels'), icon: ShoppingCart, color: "bg-emerald-500", link: "/inventory" },
    { title: t('recentActivity'), description: t('viewLatestActivity'), icon: Clock, color: "bg-purple-500", link: "/animals/search" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('manageClinicOperations')}</p>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={index}
          >
            <Link to={card.link}>
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                      <p className="text-3xl font-bold">{card.value}</p>
                    </div>
                    <div className={cn("p-2 rounded-full", card.color)}>
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index + 4}
            >
              <Link to={card.link}>
                <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={cn("p-2 w-fit rounded-full mb-4", card.color)}>
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Recent Patients */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('recentPatients')}</h2>
        <Card>
          <CardHeader>
            <CardTitle>{t('latestVisits')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.recentPatients.length ? (
                stats.recentPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    custom={index + 8}
                  >
                    <Link to={`/animals/${patient.id}`}>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            patient.animalType === "dog" ? "bg-amber-500" : 
                            patient.animalType === "cat" ? "bg-green-500" : "bg-purple-500"
                          )}>
                            {patient.animalType === "dog" ? <Dog className="h-4 w-4 text-white" /> : 
                             patient.animalType === "cat" ? <Cat className="h-4 w-4 text-white" /> : 
                             <Bird className="h-4 w-4 text-white" />}
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.ownerName}</p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(patient.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>{t('noRecentPatients')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
