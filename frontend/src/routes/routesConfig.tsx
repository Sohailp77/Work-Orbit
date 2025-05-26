import { Landing } from '../pages/Landing';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import {Dashboard} from '../pages/Dashboard';
import {NotFound} from "../pages/NotFound";
import TeamList from '../pages/TeamList';
import TaskList from '../pages/TasksList';

import { GuesLayout } from '../layout/GuesLayout';
import { MainLayout } from '../layout/MainLayout';
import {JSX} from "react";

interface AppRoute {
    path: string;
    element: JSX.Element;
    layout?: React.FC<{ children: React.ReactNode }>;
    auth?: boolean;
}

export const routesConfig: AppRoute[] = [
    {
        path: '/',
        element: <Landing />,
        layout: GuesLayout,
        auth: false,
    },
    {
        path: '/login',
        element: <Login />,
        layout: GuesLayout,
        auth: false,
    },
    {
        path: '/register',
        element: <Register />,
        layout: GuesLayout,
        auth: false,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        layout: MainLayout,
        auth: true,
    },
    {
        path: '/Teams',
        element: <TeamList/>,
        layout: GuesLayout,
        auth: false,
    },
    {
        path: '/display-board/:teamId',
        element: <TaskList />,
        layout: GuesLayout,
        auth: false,
    },
    {
        path: '*',
        element: <NotFound />, // a simple 404 page
        layout: GuesLayout,
        auth: false,
    }

];
