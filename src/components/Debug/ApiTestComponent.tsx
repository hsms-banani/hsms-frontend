// src/components/debug/ApiTestComponent.tsx
'use client';

import React, { useState } from 'react';

export const ApiTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testApiEndpoints = async () => {
    setLoading(true);
    setTestResults([]);
    
    const baseUrls = [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      process.env.NEXT_PUBLIC_API_BASE_URL,
      process.env.NEXT_PUBLIC_API_URL
    ].filter(Boolean);

    addLog('🚀 Starting API connectivity tests...');
    
    for (const baseUrl of baseUrls) {
      addLog(`\n🔍 Testing base URL: ${baseUrl}`);
      
      // Test 1: Basic connectivity
      try {
        const response = await fetch(`${baseUrl}/admin/`, { method: 'HEAD' });
        addLog(`✅ Basic connectivity: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ Basic connectivity failed: ${error}`);
        continue;
      }

      // Test 2: API root
      try {
        const response = await fetch(`${baseUrl}/about/`);
        addLog(`📡 /about/ endpoint: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ /about/ failed: ${error}`);
      }

      // Test 3: API endpoint
      try {
        const response = await fetch(`${baseUrl}/about/api/`);
        addLog(`🎯 /about/api/ endpoint: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ /about/api/ failed: ${error}`);
      }

      // Test 4: Featured complete endpoint
      try {
        const response = await fetch(`${baseUrl}/about/api/featured/complete/`);
        addLog(`🏆 /about/api/featured/complete/ endpoint: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          addLog(`📄 Content-Type: ${contentType}`);
          
          if (contentType?.includes('application/json')) {
            const data = await response.json();
            addLog(`📦 Response data keys: ${Object.keys(data).join(', ')}`);
            addLog(`👤 Rector message present: ${!!data.rector_message}`);
            if (data.rector_message) {
              addLog(`👤 Rector name: ${data.rector_message.name}`);
              addLog(`💬 Quote present: ${!!data.rector_message.quote}`);
              addLog(`📝 Paragraph 1 present: ${!!data.rector_message.message_paragraph_1}`);
            }
          } else {
            const text = await response.text();
            addLog(`⚠️ Non-JSON response: ${text.substring(0, 100)}...`);
          }
        }
      } catch (error) {
        addLog(`❌ /about/api/featured/complete/ failed: ${error}`);
      }

      addLog(`\n✅ Completed tests for ${baseUrl}`);
    }
    
    setLoading(false);
    addLog('\n🏁 All tests completed!');
  };

  const testDjangoServer = async () => {
    setLoading(true);
    setTestResults([]);
    
    addLog('🐍 Testing Django server status...');
    
    const baseUrl = 'http://localhost:8000';
    
    try {
      // Test Django admin
      const adminResponse = await fetch(`${baseUrl}/admin/login/`);
      addLog(`🔐 Django Admin: ${adminResponse.status} ${adminResponse.statusText}`);
      
      // Test if server is running Django
      const headers = Object.fromEntries(adminResponse.headers.entries());
      addLog(`🏷️ Server headers: ${JSON.stringify(headers, null, 2)}`);
      
      if (headers.server) {
        addLog(`🖥️ Server type: ${headers.server}`);
      }
      
    } catch (error) {
      addLog(`❌ Django server test failed: ${error}`);
      addLog('💡 Make sure Django server is running: python manage.py runserver');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API Debug Tools</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testApiEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Endpoints'}
        </button>
        
        <button
          onClick={testDjangoServer}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Django Server'}
        </button>
        
        <button
          onClick={() => setTestResults([])}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        <div className="mb-2 text-gray-300">
          Environment Info:
          <br />
          NEXT_PUBLIC_API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}
          <br />
          NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}
          <br />
          NODE_ENV: {process.env.NODE_ENV || 'undefined'}
        </div>
        
        <hr className="border-gray-700 mb-2" />
        
        {testResults.length === 0 ? (
          <div className="text-gray-500">Click a test button to start debugging...</div>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};