import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { HomePage } from '../modules/home/pages/HomePage';
import { AboutPage } from '../modules/about/pages/AboutPage';
import { MembersPage } from '../modules/members/pages/MembersPage';

// Placeholder temporal hasta que tengamos el componente de membresías
const MembershipsPage = () => <div className="p-4">Módulo de Membresías en construcción</div>;

export function AppRouter() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/memberships" element={<MembershipsPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Route>
        </Routes>
    );
}
