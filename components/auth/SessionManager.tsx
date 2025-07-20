'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, Globe, X, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SessionData {
  id: string;
  sessionToken: string;
  deviceInfo: string;
  location: string;
  lastActivity: string;
  createdAt: string;
  isCurrent: boolean;
}

interface SessionsResponse {
  sessions: SessionData[];
  total: number;
}

export function SessionManager() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions');
      if (response.ok) {
        const data: SessionsResponse = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    } finally {
      setRevoking(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    setRevoking('all');
    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ revokeAll: true }),
      });

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.isCurrent));
      }
    } catch (error) {
      console.error('Error revoking sessions:', error);
    } finally {
      setRevoking(null);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    // In a real app, you'd parse user agent to detect device type
    // For now, we'll use a generic icon
    return <Monitor className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Active Sessions
          </h3>
        </div>
        {sessions.length > 1 && (
          <Button
            onClick={revokeAllOtherSessions}
            disabled={revoking === 'all'}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
          >
            {revoking === 'all' ? 'Revoking...' : 'Revoke All Others'}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              session.isCurrent
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getDeviceIcon('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.isCurrent ? 'Current Session' : session.deviceInfo}
                  </p>
                  {session.isCurrent && (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.location} • Token: {session.sessionToken}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Created {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  {' • '}
                  Last active {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}
                </p>
              </div>
            </div>

            {!session.isCurrent && (
              <Button
                onClick={() => revokeSession(session.id)}
                disabled={revoking === session.id}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                {revoking === session.id ? (
                  <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No active sessions found</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Sessions are automatically cleaned up when they expire. 
          You can revoke sessions from untrusted devices for better security.
        </p>
      </div>
    </div>
  );
}
