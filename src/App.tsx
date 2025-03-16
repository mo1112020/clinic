import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AnimalSearch from './pages/animals/AnimalSearch';
import AnimalForm from './pages/animals/AnimalForm';
import AnimalDetails from './pages/animals/AnimalDetails';
import VaccinationReminders from './pages/vaccinations/VaccinationReminders';
import InventoryManagement from './pages/inventory/InventoryManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/animals/new" element={<AppLayout><AnimalForm /></AppLayout>} />
      <Route path="/animals/search" element={<AppLayout><AnimalSearch /></AppLayout>} />
      <Route path="/animals/:id" element={<AppLayout><AnimalDetails /></AppLayout>} />
      <Route path="/animals/dogs" element={<AppLayout><h1>Dogs List</h1></AppLayout>} />
      <Route path="/animals/cats" element={<AppLayout><h1>Cats List</h1></AppLayout>} />
      <Route path="/animals/birds" element={<AppLayout><h1>Birds List</h1></AppLayout>} />
      <Route path="/vaccinations" element={<AppLayout><VaccinationReminders /></AppLayout>} />
      <Route path="/inventory" element={<AppLayout><InventoryManagement /></AppLayout>} />
      <Route path="/records" element={<AppLayout><h1>Records</h1></AppLayout>} />
      <Route path="/medical-history" element={<AppLayout><h1>Medical History</h1></AppLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
