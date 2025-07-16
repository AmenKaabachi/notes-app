'use client';

import { useState } from 'react';

export default function AccelerateTestPage() {
  const [testResult, setTestResult] = useState(null);
  const [sampleDataResult, setSampleDataResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-accelerate');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-accelerate/sample-data', {
        method: 'POST'
      });
      const data = await response.json();
      setSampleDataResult(data);
    } catch (error) {
      setSampleDataResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🚀 Prisma Accelerate Test
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Step 1: Test Connection
              </h2>
              <p className="text-gray-600">
                This will test your Prisma Accelerate connection and count existing records.
              </p>
              <button
                onClick={testConnection}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Step 2: Create Sample Data
              </h2>
              <p className="text-gray-600">
                This will create sample data to populate your database and trigger Accelerate.
              </p>
              <button
                onClick={createSampleData}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Sample Data'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {testResult && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {testResult.success ? '✅ Connection Test Result' : '❌ Connection Test Failed'}
                </h3>
                <pre className="bg-white p-4 rounded border overflow-auto text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}

            {sampleDataResult && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {sampleDataResult.success ? '✅ Sample Data Created' : '❌ Sample Data Failed'}
                </h3>
                <pre className="bg-white p-4 rounded border overflow-auto text-sm">
                  {JSON.stringify(sampleDataResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📝 Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>Click "Test Connection" to verify Prisma Accelerate is working</li>
              <li>Click "Create Sample Data" to populate your database</li>
              <li>After running these tests, refresh your Prisma Data Platform dashboard</li>
              <li>The dashboard should now show data instead of "Waiting for query"</li>
            </ol>
          </div>

          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🔗 Quick Links
            </h3>
            <div className="space-y-2">
              <a 
                href="https://console.prisma.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                → Open Prisma Data Platform Dashboard
              </a>
              <a 
                href="/api/test-accelerate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                → Test API Endpoint (JSON)
              </a>
              <a 
                href="/" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                → Go to Notes App
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
