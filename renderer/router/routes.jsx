import { HomePage } from '../modules/home/pages/HomePage';
import { AboutPage } from '../modules/about/pages/AboutPage';

export const routes = [
    {
        path: '/',
        element: <HomePage />,
        protected: false,
    },
    {
        path: '/about',
        element: <AboutPage />,
        protected: false,
    },
];
