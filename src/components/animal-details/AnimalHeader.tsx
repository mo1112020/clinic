
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Animal } from '@/types/database.types';

interface AnimalHeaderProps {
  animal: Animal;
  deleting: boolean;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAnimal: () => Promise<void>;
}

const AnimalHeader: React.FC<AnimalHeaderProps> = ({ 
  animal, 
  deleting, 
  deleteDialogOpen, 
  setDeleteDialogOpen, 
  handleDeleteAnimal 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{animal.name}</h1>
        <p className="text-muted-foreground capitalize">{animal.type} • {animal.breed}</p>
      </div>
      <div className="flex gap-2">
        <Link to={`/animals/${animal.id}/edit`}>
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
  );
};

export default AnimalHeader;
