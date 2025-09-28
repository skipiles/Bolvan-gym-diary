import type { RouteObject } from 'react-router-dom'
import Layout from '@/widgets/AppLayout'
import Water from '@pages/Water/Water'
import Workout from '@pages/Workout/Workout'
import type { ReactNode } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import WaterDropIcon from '@mui/icons-material/WaterDrop'

export const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
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
}

export const navigationItems: NavigationItem[] = [
  { path: '/water', title: 'Water', icon: <WaterDropIcon /> },
  { path: '/workout', title: 'Workout', icon: <FitnessCenterIcon /> },
]
