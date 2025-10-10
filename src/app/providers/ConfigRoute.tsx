import type { RouteObject } from 'react-router-dom'
import Layout from '@/widgets/AppLayout'
import Water from '@pages/Water/Water'
import Workout from '@pages/Workout/Workout'
import type { ReactNode } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Home } from '@/pages/Home'
import HomeIcon from '@mui/icons-material/Home'

export const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
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
  { path: '/', title: 'Home', icon: <HomeIcon />, activeColor: '#cd853f' },
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
    activeColor: '#ff6666',
  },
]
