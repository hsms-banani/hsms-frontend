// src/app/debug/page.tsx - Create this file to test your API
'use client';

import React, { useState, useEffect } from 'react';

const DebugPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDjangoConnectivity = async () => {
    setLoading(true);
    setTestResults([]);
    
    const baseUrls = [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      process.env.NEXT_PUBLIC_API_BASE_URL,
      process.env.NEXT_PUBLIC_API_URL
    ].filter(Boolean) as string[];

    addLog('🚀 Starting comprehensive Django API tests...');
    
    for (const baseUrl of baseUrls) {
      addLog(`\n🔍 Testing base URL: ${baseUrl}`);
      
      // Test 1: Basic Django connectivity
      try {
        const response = await fetch(`${baseUrl}/admin/login/`, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        addLog(`✅ Django server connectivity: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ Django server connectivity failed: ${error}`);
        continue; // Skip other tests if basic connectivity fails
      }

      // Test 2: About app root
      try {
        const response = await fetch(`${baseUrl}/about/`);
        addLog(`📡 /about/ endpoint: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ /about/ failed: ${error}`);
      }

      // Test 3: API root
      try {
        const response = await fetch(`${baseUrl}/about/api/`);
        addLog(`🎯 /about/api/ endpoint: ${response.status} ${response.statusText}`);
      } catch (error) {
        addLog(`❌ /about/api/ failed: ${error}`);
      }

      // Test 4: Featured complete endpoint (THE MAIN ONE)
      try {
        const response = await fetch(`${baseUrl}/about/api/featured/complete/`);
        addLog(`🏆 Featured complete endpoint: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          addLog(`📄 Content-Type: ${contentType}`);
          
          if (contentType?.includes('application/json')) {
            const data = await response.json();
            addLog(`📦 Response keys: ${Object.keys(data).join(', ')}`);
            addLog(`🎭 Rector message present: ${!!data.rector_message}`);
            addLog(`📊 Success flag: ${data.success}`);
            
            if (data.rector_message) {
              addLog(`👤 Rector name: ${data.rector_message.name || 'N/A'}`);
              addLog(`🏢 Rector position: ${data.rector_message.position || 'N/A'}`);
              addLog(`💬 Quote present: ${!!data.rector_message.quote}`);
              addLog(`📝 Paragraph 1 length: ${data.rector_message.message_paragraph_1?.length || 0}`);
              addLog(`📝 Paragraph 2 length: ${data.rector_message.message_paragraph_2?.length || 0}`);
              
              if (data.rector_message.quote) {
                addLog(`💬 Quote preview: "${data.rector_message.quote.substring(0, 50)}..."`);
              }
              if (data.rector_message.message_paragraph_1) {
                addLog(`📝 Paragraph 1 preview: "${data.rector_message.message_paragraph_1.substring(0, 50)}..."`);
              }
            }
            
            if (data.debug) {
              addLog(`🐛 Debug info: ${JSON.stringify(data.debug, null, 2)}`);
            }
            
            addLog(`🏫 Departments count: ${data.departments?.length || 0}`);
            addLog(`📚 Formation steps count: ${data.formation_steps?.length || 0}`);
            addLog(`🏢 Committees/Offices count: ${data.committees_offices?.length || 0}`);
            
          } else {
            const text = await response.text();
            addLog(`⚠️ Non-JSON response received`);
            addLog(`📄 Response preview: ${text.substring(0, 200)}...`);
          }
        } else {
          // Try to get error details
          try {
            const errorText = await response.text();
            addLog(`❌ Error response: ${errorText.substring(0, 300)}...`);
          } catch {
            addLog(`❌ Could not read error response`);
          }
        }
      } catch (error) {
        addLog(`❌ Featured complete endpoint failed: ${error}`);
      }

      // Test 5: Rector message endpoint
      try {
        const response = await fetch(`${baseUrl}/about/api/rector-message/`);
        addLog(`👤 Rector message endpoint: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          addLog(`👤 Rector endpoint data keys: ${Object.keys(data).join(', ')}`);
        }
      } catch (error) {
        addLog(`❌ Rector message endpoint failed: ${error}`);
      }

      addLog(`✅ Completed tests for ${baseUrl}\n`);
    }
    
    setLoading(false);
    addLog('🏁 All Django API tests completed!');
    addLog('\n📋 Summary:');
    addLog('If you see "Rector message present: true" above, your backend is working correctly.');
    addLog('If not, check Django admin to ensure rector message data exists and is marked as active.');
  };

  const testFrontendHook = async () => {
    setLoading(true);
    setTestResults([]);
    
    addLog('⚛️ Testing frontend hook directly...');
    
    try {
      // Import and test the hook logic directly
      const { useFeaturedSection } = await import('@/hooks/useFeaturedSection');
      addLog('✅ Hook import successful');
      
      // We can't directly test the hook here, but we can test the same logic
      const apiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/about/api/featured/complete/';
      addLog(`🎯 Testing hook API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-cache',
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog('✅ Hook-style fetch successful');
        addLog(`📦 Data structure: ${JSON.stringify(Object.keys(data), null, 2)}`);
        
        if (data.rector_message) {
          addLog('✅ Rector message found in hook test');
          addLog(`👤 Name: ${data.rector_message.name}`);
        } else {
          addLog('❌ No rector message in hook test');
        }
      } else {
        addLog(`❌ Hook-style fetch failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      addLog(`❌ Frontend hook test failed: ${error}`);
    }
    
    setLoading(false);
    addLog('🏁 Frontend hook test completed!');
  };

  const checkDatabaseData = async () => {
    setLoading(true);
    setTestResults([]);
    
    addLog('🗄️ Checking database data through API...');
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    try {
      // Test individual endpoints to see what's in the database
      const endpoints = [
        '/about/api/featured/section/',
        '/about/api/featured/rector-message-drf/',
        '/about/api/featured/departments/',
        '/about/api/featured/formation-steps/',
        '/about/api/featured/committees-offices/',
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${baseUrl}${endpoint}`);
          addLog(`📊 ${endpoint}: ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const data = await response.json();
            addLog(`📊 ${endpoint} data count: ${Array.isArray(data) ? data.length : 'Not an array'}`);
          }
        } catch (error) {
          addLog(`❌ ${endpoint} failed: ${error}`);
        }
      }
      
    } catch (error) {
      addLog(`❌ Database check failed: ${error}`);
    }
    
    setLoading(false);
    addLog('🏁 Database data check completed!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Django API Debug Center</h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Environment Variables</h2>
            <div className="text-sm text-blue-800 font-mono">
              <div>NEXT_PUBLIC_API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}</div>
              <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</div>
              <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={testDjangoConnectivity}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : '🔍 Test Django API Endpoints'}
            </button>
            
            <button
              onClick={testFrontendHook}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
            >
              {loading ? 'Testing...' : '⚛️ Test Frontend Hook Logic'}
            </button>
            
            <button
              onClick={checkDatabaseData}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
            >
              {loading ? 'Testing...' : '🗄️ Check Database Data'}
            </button>
            
            <button
              onClick={() => setTestResults([])}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 ml-4"
            >
              🧹 Clear Results
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">
                👋 Click a test button above to start debugging your Django API connection...
                <br /><br />
                💡 <strong>Quick troubleshooting tips:</strong>
                <br />• Make sure Django server is running: <code className="text-yellow-400">python manage.py runserver</code>
                <br />• Check your .env.local file has the correct API URL
                <br />• Verify rector message data exists in Django admin
                <br />• Check Django logs for backend errors
              </div>
            ) : (
              <div>
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1 whitespace-pre-wrap">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">🎯 What to look for:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>✅ <strong>Django server connectivity</strong> - Should return status 200 or 302</li>
              <li>✅ <strong>Featured complete endpoint</strong> - Should return status 200</li>
              <li>✅ <strong>Rector message present: true</strong> - Your data is loaded correctly</li>
              <li>✅ <strong>Paragraph lengths > 0</strong> - Your rector message content exists</li>
              <li>❌ If any test fails, check the error message for specific guidance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;