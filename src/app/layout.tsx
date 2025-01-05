import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"
import { Web3Provider } from "@/src/providers/Web3Provider"
import AccountSwitcher from '@/src/components/dev/AccountSwitcher'
import { Suspense } from 'react'
import StorageInitializer from '@/src/components/providers/StorageInitializer'
import CozeTestTool from '@/src/components/dev/CozeTestTool'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Translation DAO",
  description: "Decentralized Translation Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <StorageInitializer />
        <Web3Provider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              </div>
            </main>
            <Footer />
          </div>
          <AccountSwitcher />
          {process.env.NODE_ENV === 'development' && <CozeTestTool />}
        </Web3Provider>
      </body>
    </html>
  )
}