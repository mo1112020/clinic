
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog, Cat, Bird, ShoppingCart, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Dashboard = () => {
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

  const statCards = [
    { title: "Total Patients", value: "247", icon: Activity, color: "bg-blue-500", link: "/animals/search" },
    { title: "Dogs", value: "126", icon: Dog, color: "bg-amber-500", link: "/animals/dogs" },
    { title: "Cats", value: "98", icon: Cat, color: "bg-green-500", link: "/animals/cats" },
    { title: "Birds", value: "23", icon: Bird, color: "bg-purple-500", link: "/animals/birds" },
  ];
  
  const actionCards = [
    { title: "Add New Patient", description: "Register a new animal", icon: Dog, color: "bg-canki", link: "/animals/new" },
    { title: "Upcoming Vaccinations", description: "View scheduled reminders", icon: Calendar, color: "bg-amber-500", link: "/vaccinations" },
    { title: "Inventory Management", description: "Check stock levels", icon: ShoppingCart, color: "bg-emerald-500", link: "/inventory" },
    { title: "Recent Activity", description: "View latest clinic activity", icon: Clock, color: "bg-purple-500", link: "/medical-history" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your veterinary clinic operations.</p>
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
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
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
        <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
        <Card>
          <CardHeader>
            <CardTitle>Latest Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Max", owner: "John Smith", animal: "Dog", icon: Dog, date: "Today, 10:30 AM" },
                { name: "Luna", owner: "Emma Watson", animal: "Cat", icon: Cat, date: "Today, 09:15 AM" },
                { name: "Charlie", owner: "Michael Brown", animal: "Dog", icon: Dog, date: "Yesterday, 02:45 PM" },
                { name: "Bella", owner: "Sophia Miller", animal: "Bird", icon: Bird, date: "Yesterday, 11:20 AM" },
              ].map((patient, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  custom={index + 8}
                >
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        patient.animal === "Dog" ? "bg-amber-500" : 
                        patient.animal === "Cat" ? "bg-green-500" : "bg-purple-500"
                      )}>
                        <patient.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.owner}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{patient.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
