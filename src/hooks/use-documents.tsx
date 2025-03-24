
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export function useDocuments(animalType?: string, categoryFilter?: string, searchQuery?: string) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This is a placeholder - in a real app, you would fetch from a medical_files table
        // Since we don't have many records in that table, we'll generate data based on vaccinations
        let query = supabase
          .from('vaccinations')
          .select(`
            *,
            animals (
              id,
              name,
              animal_type,
              owners (
                full_name
              )
            )
          `);

        if (animalType && animalType !== 'all') {
          query = query.eq('animals.animal_type', animalType);
        }

        if (searchQuery) {
          query = query.or(
            `animals.name.ilike.%${searchQuery}%,animals.owners.full_name.ilike.%${searchQuery}%,vaccine_name.ilike.%${searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform vaccination data into document records
        const formattedData = data.map(item => {
          const category = item.completed ? 'Vaccination Certificate' : 'Vaccination Schedule';
          
          // Skip if categoryFilter is set and doesn't match
          if (categoryFilter && categoryFilter !== 'all' && category !== categoryFilter) {
            return null;
          }
          
          return {
            id: item.id,
            filename: `${item.animals.name}_${item.vaccine_name.replace(/\s+/g, '_')}.pdf`,
            patientName: item.animals.name,
            patientType: item.animals.animal_type,
            owner: item.animals.owners.full_name,
            date: item.scheduled_date,
            category: category,
            fileSize: '0.5 MB',
            vaccinationData: item // Store the original data for PDF generation
          };
        }).filter(Boolean); // Remove null items

        setDocuments(formattedData);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
        toast({
          title: 'Error',
          description: 'Failed to load documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [animalType, categoryFilter, searchQuery, toast]);

  const downloadDocument = (document: any) => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF();
      
      // Add clinic header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 128, 128);
      pdf.text('CANKI VETERINARY CLINIC', 105, 20, { align: 'center' });
      
      // Add document type header
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(document.category, 105, 30, { align: 'center' });
      
      // Add basic information
      pdf.setFontSize(12);
      pdf.text(`Patient: ${document.patientName} (${document.patientType})`, 20, 45);
      pdf.text(`Owner: ${document.owner}`, 20, 52);
      pdf.text(`Date: ${format(new Date(document.date), 'MMMM d, yyyy')}`, 20, 59);
      
      // Add vaccination details
      pdf.setFontSize(14);
      pdf.text('Vaccination Details', 20, 75);
      
      // Create a table for vaccination details
      autoTable(pdf, {
        startY: 80,
        head: [['Vaccine', 'Scheduled Date', 'Status']],
        body: [
          [
            document.vaccinationData.vaccine_name,
            format(new Date(document.vaccinationData.scheduled_date), 'MMMM d, yyyy'),
            document.vaccinationData.completed ? 'Completed' : 'Scheduled'
          ]
        ],
      });
      
      // Add notes section
      pdf.setFontSize(14);
      pdf.text('Notes', 20, 120);
      pdf.setFontSize(12);
      pdf.text('This document serves as an official record of the vaccination details.', 20, 130);
      
      // Add footer with clinic information
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Canki Veterinary Clinic | 123 Pet Care Lane | Phone: (555) 123-4567', 105, 280, { align: 'center' });
      
      // Save the PDF
      pdf.save(document.filename);
      
      toast({
        title: 'Download Complete',
        description: `${document.filename} has been downloaded successfully.`,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { documents, isLoading, error, downloadDocument };
}
