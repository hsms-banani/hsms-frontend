// src/hooks/useFeaturedSection.ts - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';

interface FeaturedSectionData {
  title: string;
  subtitle: string;
}

interface RectorMessage {
  id: number;
  name: string;
  position: string;
  image_url: string | null;
  quote: string;
  message_paragraph_1: string;
  message_paragraph_2: string;
}

interface DepartmentFeature {
  id: number;
  title: string;
  order: number;
}

interface AcademicDepartment {
  id: number;
  name: string;
  display_name: string;
  image_url: string | null;
  description: string;
  link_url: string;
  features: DepartmentFeature[];
}

interface FormationStep {
  id: number;
  step_number: number;
  title: string;
  description: string;
}

interface CommitteeOffice {
  id: number;
  title: string;
  description: string;
  icon: string;
  link_url: string;
}

interface FeaturedSectionResponse {
  section_info: FeaturedSectionData | null;
  rector_message: RectorMessage | null;
  departments: AcademicDepartment[];
  formation_steps: FormationStep[];
  committees_offices: CommitteeOffice[];
  success?: boolean;
  debug?: any;
}

interface UseFeaturedSectionReturn {
  data: FeaturedSectionResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFeaturedSection = (): UseFeaturedSectionReturn => {
  const [data, setData] = useState<FeaturedSectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getApiUrl = (): string => {
    // Priority order for API base URL
    const baseUrl = 
      process.env.NEXT_PUBLIC_API_BASE_URL || 
      process.env.NEXT_PUBLIC_API_URL || 
      'http://localhost:8000';
    
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/about/api/featured/complete/`;
  };

  const testConnectivity = async (baseUrl: string): Promise<boolean> => {
    try {
      // Test basic Django server connectivity
      const testResponse = await fetch(`${baseUrl}/admin/login/`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return testResponse.status === 200 || testResponse.status === 302;
    } catch {
      return false;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      const baseUrl = apiUrl.replace('/about/api/featured/complete/', '');
      
      console.group('🔍 API Fetch Debug - Enhanced Version');
      console.log('🌐 Environment Variables:', {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NODE_ENV: process.env.NODE_ENV
      });
      console.log('📍 Final API URL:', apiUrl);
      console.log('🏠 Base URL:', baseUrl);
      console.groupEnd();
      
      // Test basic connectivity first
      console.log('🔄 Testing Django server connectivity...');
      const isConnected = await testConnectivity(baseUrl);
      
      if (!isConnected) {
        throw new Error(`Cannot connect to Django server at ${baseUrl}. Make sure the server is running with: python manage.py runserver`);
      }
      
      console.log('✅ Django server is reachable');
      
      // Main API request
      console.log('🎯 Making API request...');
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-cache',
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
      
      console.group('📡 Response Analysis');
      console.log('📊 Status:', response.status, response.statusText);
      console.log('🔗 URL:', response.url);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
      console.groupEnd();
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.error('❌ Error response body:', responseText);
          
          // Check for common Django error patterns
          if (responseText.includes('DisallowedHost')) {
            errorMessage = 'Django ALLOWED_HOSTS configuration error. Add your frontend URL to ALLOWED_HOSTS in settings.py';
          } else if (responseText.includes('CSRF')) {
            errorMessage = 'CSRF token error. Check CSRF_TRUSTED_ORIGINS in Django settings.py';
          } else if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {
            errorMessage = `Django returned HTML error page (${response.status}). Check Django logs and URL configuration.`;
          } else if (responseText.includes('Not Found')) {
            errorMessage = 'API endpoint not found. Check Django URLs configuration in apps/about/urls.py';
          } else {
            // Try to parse JSON error
            try {
              const errorJson = JSON.parse(responseText);
              errorMessage = errorJson.detail || errorJson.error || errorJson.message || errorMessage;
            } catch {
              errorMessage = responseText.length > 200 ? 
                `${responseText.substring(0, 200)}...` : 
                responseText || errorMessage;
            }
          }
        } catch (textError) {
          console.error('❌ Could not read error response:', textError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Validate content type
      const contentType = response.headers.get('content-type');
      console.log('📄 Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('⚠️ Expected JSON but received:', contentType);
        console.error('📄 Response preview:', responseText.substring(0, 300));
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}. Django may be returning an error page.`);
      }
      
      // Parse JSON response
      const result = await response.json();
      
      console.group('✅ Successful Response');
      console.log('📦 Response structure:', {
        section_info: !!result.section_info,
        rector_message: !!result.rector_message,
        departments_count: result.departments?.length || 0,
        formation_steps_count: result.formation_steps?.length || 0,
        committees_offices_count: result.committees_offices?.length || 0,
        success: result.success,
        has_debug_info: !!result.debug
      });
      
      if (result.debug) {
        console.log('🐛 Debug info from backend:', result.debug);
      }
      
      if (result.rector_message) {
        console.log('👤 Rector Message Details:', {
          name: result.rector_message.name,
          position: result.rector_message.position,
          has_image: !!result.rector_message.image_url,
          has_quote: !!result.rector_message.quote,
          quote_length: result.rector_message.quote?.length || 0,
          paragraph_1_length: result.rector_message.message_paragraph_1?.length || 0,
          paragraph_2_length: result.rector_message.message_paragraph_2?.length || 0,
        });
        
        // Log first 100 characters of each paragraph for debugging
        if (result.rector_message.message_paragraph_1) {
          console.log('📝 Paragraph 1 preview:', result.rector_message.message_paragraph_1.substring(0, 100) + '...');
        }
        if (result.rector_message.message_paragraph_2) {
          console.log('📝 Paragraph 2 preview:', result.rector_message.message_paragraph_2.substring(0, 100) + '...');
        }
      } else {
        console.warn('⚠️ No rector_message in response');
        console.log('🔍 Response keys:', Object.keys(result));
      }
      console.groupEnd();
      
      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response structure: expected object');
      }
      
      // Set the data
      setData(result);
      console.log('✅ Data successfully set in state');
      
    } catch (err) {
      let errorMessage = 'Unknown error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Add specific error handling for common issues
        if (err.message.includes('fetch')) {
          errorMessage = `Network error: ${err.message}. Check if Django server is running on the correct port.`;
        } else if (err.message.includes('AbortError') || err.message.includes('timeout')) {
          errorMessage = 'Request timeout. Django server may be slow or unresponsive.';
        }
      } else {
        errorMessage = String(err);
      }
      
      console.group('❌ API Fetch Error');
      console.error('🚨 Error details:', err);
      console.error('📝 Final error message:', errorMessage);
      console.error('🔧 Troubleshooting checklist:');
      console.error('  1. Is Django server running? (python manage.py runserver)');
      console.error('  2. Is the URL correct? Check NEXT_PUBLIC_API_BASE_URL in .env.local');
      console.error('  3. Are Django URLs configured correctly? Check apps/about/urls.py');
      console.error('  4. Are CORS settings configured? Check CORS_ALLOWED_ORIGINS in settings.py');
      console.error('  5. Check Django server logs for backend errors');
      console.error('  6. Is the rector message data created in Django admin?');
      console.groupEnd();
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useFeaturedSection hook initializing...');
    fetchData();
  }, []);

  const refetch = () => {
    console.log('🔄 Manual refetch triggered...');
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Export types for use in components
export type {
  FeaturedSectionData,
  RectorMessage,
  AcademicDepartment,
  FormationStep,
  CommitteeOffice,
  FeaturedSectionResponse
};