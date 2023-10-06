import './globals.css'
import Navbar from '@/components/Navbar'
import { AppProvider } from '@/contexts/AppContext'
import { Toaster } from 'react-hot-toast'
import ReduxProvider from '@/store/provider'

export const metadata = {
  title: 'Videocean',
  description: 'Watch video with Vidify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className='w-screen h-screen flex flex-col'>
        <ReduxProvider>
          <AppProvider>
            <Navbar />
            {children}
            <Toaster />
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
