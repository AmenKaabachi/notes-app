'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'
import { User, LogOut, Settings } from 'lucide-react'
import UseAnimations from 'react-useanimations'
import settings2 from 'react-useanimations/lib/settings2'
import { logout } from '@/lib/logout'

export function UserDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Enhanced logout function using the utility
  const handleLogout = async () => {
    setIsOpen(false)
    await logout({
      redirect: true,
      callbackUrl: '/login',
      clearStorage: true
    })
  }

  if (!session?.user) return null

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center space-x-3 p-3 glass-effect rounded-2xl hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 border border-white/20 dark:border-gray-700/50 group">
          <Avatar.Root className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Avatar.Fallback className="text-white text-sm font-bold">
              {session.user.name?.[0] || session.user.email?.[0] || 'U'}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {session.user.name || session.user.email}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] glass-effect rounded-2xl p-3 shadow-2xl border border-white/20 dark:border-gray-700/50 animate-slide-up backdrop-blur-sm z-50"
          sideOffset={8}
        >
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {session.user.name || 'User'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {session.user.email}
            </p>
          </div>

          <DropdownMenu.Item className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 group">
            <User className="h-4 w-4 group-hover:text-purple-500" />
            <span>Profile</span>
          </DropdownMenu.Item>
          
          <DropdownMenu.Item 
            className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 group"
            onClick={() => window.location.href = '/settings'}
          >
            <UseAnimations 
              animation={settings2} 
              size={16} 
              strokeColor="currentColor"
            />
            <span>Settings</span>
          </DropdownMenu.Item>
          
          <DropdownMenu.Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />
          
          <DropdownMenu.Item
            className="flex items-center space-x-3 px-3 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer transition-all duration-200 group"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
