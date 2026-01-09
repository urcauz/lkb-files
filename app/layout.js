import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Anda Files',
  description: 'Private content (Gooning material)',

  openGraph: {
    title: 'Anda Files',
    description: 'Private content (Gooning material)',
    url: 'https://lkb-files.vercel.app/', 
    siteName: 'Anda Files',
    images: [
      {
        url: 'https://cdn.discordapp.com/attachments/1449763506311135305/1459246251160899838/Untitled_design_2.png?ex=69629479&is=696142f9&hm=0c416809e52a2f59ea9d5d930052620a350a2a2e3113a15f5ff4a5077c5d0ee2&',
        width: 1200,
        height: 630,
        alt: 'Anda Files Cover',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Anda Files',
    description: 'Private content (Gooning material)',
    images: [
      'https://cdn.discordapp.com/attachments/1449763506311135305/1459246251160899838/Untitled_design_2.png?ex=69629479&is=696142f9&hm=0c416809e52a2f59ea9d5d930052620a350a2a2e3113a15f5ff4a5077c5d0ee2&',
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="noise-texture" />
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  )
}