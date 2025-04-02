
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AnimalSearch from './pages/animals/AnimalSearch';
import AnimalForm from './pages/animals/AnimalForm';
import AnimalDetails from './pages/animals/AnimalDetails';
import VaccinationReminders from './pages/vaccinations/VaccinationReminders';
import InventoryManagement from './pages/inventory/InventoryManagement';
import DogsList from './pages/animals/DogsList';
import CatsList from './pages/animals/CatsList';
import BirdsList from './pages/animals/BirdsList';
import MedicalHistory from './pages/MedicalHistory';
import Records from './pages/Records';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/new" element={
            <ProtectedRoute>
              <AppLayout><AnimalForm /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/:id/edit" element={
            <ProtectedRoute>
              <AppLayout><AnimalForm /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/search" element={
            <ProtectedRoute>
              <AppLayout><AnimalSearch /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/:id" element={
            <ProtectedRoute>
              <AppLayout><AnimalDetails /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/dogs" element={
            <ProtectedRoute>
              <AppLayout><DogsList /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/cats" element={
            <ProtectedRoute>
              <AppLayout><CatsList /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/animals/birds" element={
            <ProtectedRoute>
              <AppLayout><BirdsList /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/vaccinations" element={
            <ProtectedRoute>
              <AppLayout><VaccinationReminders /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <AppLayout><InventoryManagement /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute>
              <AppLayout><Records /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/medical-history" element={
            <ProtectedRoute>
              <AppLayout><MedicalHistory /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
