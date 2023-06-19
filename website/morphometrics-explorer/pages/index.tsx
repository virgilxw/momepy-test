import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-[16] flex-col items-center justify-between p-24 ${inter.className}`}>

        <p>test</p>
    </main>
  )
}
