import { useEffect, useState } from 'react';
import { webappApi } from '@/services/webapp-api';

export const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');
  const [newAuthResult, setNewAuthResult] = useState<string>('');
  
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      const info = {
        available: true,
        initData: tg.initData,
        initDataUnsafe: tg.initDataUnsafe,
        user: tg.initDataUnsafe?.user,
        authDate: tg.initDataUnsafe?.auth_date,
        hash: tg.initDataUnsafe?.hash,
        queryParams: new URLSearchParams({
          user_id: tg.initDataUnsafe?.user?.id?.toString() || '',
          auth_date: tg.initDataUnsafe?.auth_date?.toString() || '',
          hash: tg.initDataUnsafe?.hash || '',
          first_name: tg.initDataUnsafe?.user?.first_name || '',
          username: tg.initDataUnsafe?.user?.username || ''
        }).toString()
      };
      setDebugInfo(info);
    } else {
      setDebugInfo({ available: false });
    }
  }, []);
  
  const testAPI = async () => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user) {
      setTestResult('No Telegram data available');
      return;
    }
    
    const params = new URLSearchParams({
      user_id: tg.initDataUnsafe.user.id.toString(),
      auth_date: tg.initDataUnsafe.auth_date.toString(),
      hash: tg.initDataUnsafe.hash || '',
    });
    
    if (tg.initDataUnsafe.user.first_name) {
      params.append('first_name', tg.initDataUnsafe.user.first_name);
    }
    if (tg.initDataUnsafe.user.last_name) {
      params.append('last_name', tg.initDataUnsafe.user.last_name);
    }
    if (tg.initDataUnsafe.user.username) {
      params.append('username', tg.initDataUnsafe.user.username);
    }
    
    const url = `https://api.getsenso.app/api/v1/bot/daily?${params.toString()}`;
    setTestResult(`Testing: ${url}\n\nParams:\n${params.toString()}`);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTestResult(prev => prev + `\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setTestResult(prev => prev + `\n\nError: ${error.message}`);
    }
  };
  
  const testNewAuth = async () => {
    setNewAuthResult('Testing new auth endpoint...');
    
    try {
      const result = await webappApi.testAuth();
      setNewAuthResult(`Success!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      setNewAuthResult(`Error: ${error.message}`);
    }
  };
  
  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}>
      <h2>Debug Auth Info</h2>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      
      <button 
        onClick={() => {
          const text = JSON.stringify(debugInfo, null, 2);
          navigator.clipboard.writeText(text);
          alert('Copied to clipboard!');
        }}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#007AFF', 
          color: 'white', 
          border: 'none',
          borderRadius: '5px',
          marginRight: '10px'
        }}
      >
        Copy Debug Info
      </button>
      
      <button 
        onClick={testAPI}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#28a745', 
          color: 'white', 
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Test API Call
      </button>
      
      {testResult && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '5px' }}>
          <h3>Test Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{testResult}</pre>
        </div>
      )}
      
      <button 
        onClick={testNewAuth}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#dc3545', 
          color: 'white', 
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Test NEW Auth Method
      </button>
      
      {newAuthResult && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '5px' }}>
          <h3>New Auth Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{newAuthResult}</pre>
        </div>
      )}
    </div>
  );
};