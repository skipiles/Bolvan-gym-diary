import type { RouteObject } from 'react-router-dom'
import Layout from '@/widgets/AppLayout'
import Water from '@pages/Water/Water'
import Workout from '@pages/Workout/Workout'
import Home from '@pages/Home/Home'
import { Login } from '@pages/Auth/Login'
import { Register } from '@pages/Auth/Register'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import HomeIcon from '@mui/icons-material/Home'

export const routesConfig: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/water',
        element: <Water />,
      },
      {
        path: '/workout',
        element: <Workout />,
      },
    ],
  },
]

export type NavigationItem = {
  path: string
  title: string
  icon?: ReactNode
  disabled?: boolean
  activeColor?: string
}

export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    title: 'Home',
    icon: <HomeIcon />,
    activeColor: '#8E8E93',
  },
  {
    path: '/water',
    title: 'Water',
    icon: <WaterDropIcon />,
    activeColor: '#007AFF',
  },
  {
    path: '/workout',
    title: 'Workout',
    icon: <FitnessCenterIcon />,
    activeColor: '#FF3B30',
  },
]
