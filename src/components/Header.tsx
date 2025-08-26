import React from 'react'
import { Cog as Cow } from 'lucide-react'

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Cow className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>
    </header>
  )
}