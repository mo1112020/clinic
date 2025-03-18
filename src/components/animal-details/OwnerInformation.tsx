
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

interface OwnerInformationProps {
  owner: any;
}

const OwnerInformation: React.FC<OwnerInformationProps> = ({ owner }) => {
  if (!owner) return null;
  
  return (
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
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Phone className="mr-2 h-4 w-4" />
          Contact Owner
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OwnerInformation;
