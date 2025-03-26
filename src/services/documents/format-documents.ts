
interface Animal {
  id: string;
  name: string;
  animal_type: string;
  breed: string;
  chip_number?: string;
  health_notes?: string;
  owner_id: string;
  owners?: {
    id: string;
    full_name: string;
    phone_number: string;
  };
}

interface MedicalFile {
  id: string;
  file_name?: string;
  file_type?: string;
  file_url?: string;
  uploaded_at?: string;
  animals?: Animal;
}

export function filterAnimalsByType(animals: Animal[], animalType?: string): Animal[] {
  if (!animalType || animalType === 'all') {
    return animals;
  }
  
  return animals.filter(animal => 
    animal.animal_type && animal.animal_type.toLowerCase() === animalType.toLowerCase()
  );
}

export function filterAnimalsBySearchQuery(animals: Animal[], searchQuery?: string): Animal[] {
  if (!searchQuery) {
    return animals;
  }
  
  const lowerQuery = searchQuery.toLowerCase();
  return animals.filter(animal => 
    (animal.name && animal.name.toLowerCase().includes(lowerQuery)) || 
    (animal.owners?.full_name && animal.owners.full_name.toLowerCase().includes(lowerQuery))
  );
}

export function formatHealthRecords(animals: Animal[]): any[] {
  return animals.map(animal => ({
    id: `health-${animal.id}`,
    filename: `Health Records - ${animal.name}`,
    patientName: animal.name,
    patientType: animal.animal_type,
    owner: animal.owners?.full_name || 'Unknown',
    date: new Date().toISOString(),
    category: 'Health Record',
    fileSize: 'N/A',
    animalId: animal.id,
    healthNotes: animal.health_notes,
    isVirtualRecord: true
  }));
}

export function filterMedicalFilesByAnimalType(files: MedicalFile[], animalType?: string): MedicalFile[] {
  if (!animalType || animalType === 'all') {
    return files;
  }
  
  return files.filter(doc => {
    if (!doc.animals) return false;
    return doc.animals.animal_type.toLowerCase() === animalType.toLowerCase();
  });
}

export function filterMedicalFilesBySearchQuery(files: MedicalFile[], searchQuery?: string): MedicalFile[] {
  if (!searchQuery) {
    return files;
  }
  
  const lowerQuery = searchQuery.toLowerCase();
  return files.filter(doc => {
    if (!doc.animals) return false;
    
    return (
      doc.animals.name.toLowerCase().includes(lowerQuery) ||
      (doc.animals.owners?.full_name && doc.animals.owners.full_name.toLowerCase().includes(lowerQuery)) ||
      (doc.file_name && doc.file_name.toLowerCase().includes(lowerQuery))
    );
  });
}

export function formatMedicalFiles(files: MedicalFile[]): any[] {
  return files.map(doc => {
    if (!doc.animals) {
      return {
        id: doc.id,
        filename: doc.file_name || 'Unknown file',
        patientName: 'Unknown',
        patientType: 'unknown',
        owner: 'Unknown',
        date: doc.uploaded_at || new Date().toISOString(),
        category: doc.file_type || 'Other',
        fileSize: '1 MB',
        fileUrl: doc.file_url,
        isActualFile: true
      };
    }
    
    return {
      id: doc.id,
      filename: doc.file_name || 'Unknown file',
      patientName: doc.animals.name,
      patientType: doc.animals.animal_type,
      owner: doc.animals.owners?.full_name || 'Unknown',
      date: doc.uploaded_at || new Date().toISOString(),
      category: doc.file_type || 'Other',
      fileSize: '1 MB',
      fileUrl: doc.file_url,
      animalId: doc.animals.id,
      healthNotes: doc.animals.health_notes,
      isActualFile: true
    };
  });
}
