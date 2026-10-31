import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { AboutPage } from '@/features/about/AboutPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { HomePage } from '@/features/home/HomePage'
import { MapPage } from '@/features/map/MapPage'
import { PlaceholderPage } from '@/features/PlaceholderPage'
import { SourcesPage } from '@/features/sources/SourcesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'about', element: <AboutPage /> },
      
      {
        
        path:  '*',
        element: <PlaceholderPage title="404" description="Sayfa bulunamadı." />,
      },
    ],
  },
])