import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Shooketh – AI bot fine-tuned on Shakespeare's literary works",
  description:
    "Shooketh is an AI bot built with the Vercel AI SDK and fine-tuned on Shakespeare's literary works."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ChakraProvider>
        {children}
        </ChakraProvider>
        <Analytics />
      </body>
    </html>
  )
}
