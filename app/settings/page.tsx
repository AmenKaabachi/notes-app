'use client';

import { useAuth } from '@/hooks/useAuth';
import { SessionManager } from '@/components/auth/SessionManager';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { Settings, Shield, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-gradient">
                ⚙️ Settings
              </h1>
            </div>
            
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {session.user?.name || 'Not set'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Security & Sessions
              </h2>
            </div>
            
            <SessionManager />
          </div>

          {/* Additional Settings Placeholder */}
          <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preferences
              </h2>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Additional preferences and settings will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
