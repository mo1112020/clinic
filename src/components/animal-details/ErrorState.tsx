
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ErrorState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-20">
      <p className="text-destructive mb-4">Error loading animal details</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
};

export default ErrorState;
