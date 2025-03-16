
export type AnimalType = 'dog' | 'cat' | 'bird';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  chipNo?: string;
  age?: string;
  healthNotes?: string;
  owner_id: string;
  created_at: string;
  last_visit?: string;
  next_appointment?: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  id_number: string;
}

export interface Vaccination {
  id: string;
  animal_id: string;
  name: string;
  date: string;
  next_due: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export interface MedicalRecord {
  id: string;
  animal_id: string;
  date: string;
  description: string;
  notes: string;
}

export interface Document {
  id: string;
  animal_id: string;
  name: string;
  date: string;
  type: string;
  size: string;
  url?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'vaccine' | 'medication' | 'supplies' | 'food';
  stock: number;
  price: number;
  sold: number;
  reorder_level: number;
}
