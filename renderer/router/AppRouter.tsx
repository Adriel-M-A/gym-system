import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
// Importamos como JS si no estan migrados. allowJs lo permite.
// Una vez migremos esas paginas, esto funcionará igual.
import { HomePage } from '../modules/home/pages/HomePage';
import { AboutPage } from '../modules/about/pages/AboutPage';
import { MembersPage } from '../modules/members/pages/MembersPage';
import { MembershipsPage } from '../modules/memberships/pages/MembershipsPage';

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
