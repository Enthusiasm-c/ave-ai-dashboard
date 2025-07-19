import { useState } from 'react';
import { api } from '@/services/api';

export const DebugPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const testDailyReport = async () => {
    setLogs(prev => [...prev, 'Testing daily report...']);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      setLogs(prev => [...prev, `API URL: ${apiUrl}`]);
      
      const data = await api.getDailyReport();
      setLogs(prev => [...prev, 'Success!', JSON.stringify(data, null, 2)]);
    } catch (error: any) {
      setLogs(prev => [...prev, `Error: ${error.message}`, error.stack || '']);
    }
  };
  
  const testHealthCheck = async () => {
    setLogs(prev => [...prev, 'Testing health check...']);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${apiUrl}/health`;
      setLogs(prev => [...prev, `Health URL: ${url}`]);
      const response = await fetch(url);
      setLogs(prev => [...prev, `Response status: ${response.status}`]);
      setLogs(prev => [...prev, `Response ok: ${response.ok}`]);
      const text = await response.text();
      setLogs(prev => [...prev, `Response text: ${text}`]);
      
      try {
        const data = JSON.parse(text);
        setLogs(prev => [...prev, 'Health check success!', JSON.stringify(data)]);
      } catch (e) {
        setLogs(prev => [...prev, 'Failed to parse JSON']);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, `Health check error: ${error.message}`]);
      setLogs(prev => [...prev, `Error type: ${error.name}`]);
      setLogs(prev => [...prev, `Stack: ${error.stack}`]);
    }
  };
  
  const testProxy = async () => {
    setLogs(prev => [...prev, 'Testing proxy endpoint...']);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setLogs(prev => [...prev, 'Proxy test success!', JSON.stringify(data, null, 2)]);
    } catch (error: any) {
      setLogs(prev => [...prev, `Proxy test error: ${error.message}`]);
    }
  };

  const testDirectFetch = async () => {
    setLogs(prev => [...prev, 'Testing direct fetch...']);
    setLogs(prev => [...prev, `Current origin: ${window.location.origin}`]);
    setLogs(prev => [...prev, `Current protocol: ${window.location.protocol}`]);
    
    try {
      // Test with different modes
      setLogs(prev => [...prev, 'Trying with mode: cors...']);
      const response = await fetch('https://api.getsenso.app/health', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json',
        }
      });
      setLogs(prev => [...prev, `Direct fetch status: ${response.status}`]);
      
      if (response.ok) {
        const data = await response.json();
        setLogs(prev => [...prev, 'Direct fetch success!', JSON.stringify(data)]);
      } else {
        setLogs(prev => [...prev, `Direct fetch failed: ${response.statusText}`]);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, `Direct fetch error: ${error.message}`]);
      
      // Try no-cors mode
      try {
        setLogs(prev => [...prev, 'Trying with mode: no-cors...']);
        const response2 = await fetch('https://api.getsenso.app/health', {
          method: 'GET',
          mode: 'no-cors'
        });
        setLogs(prev => [...prev, `No-cors response type: ${response2.type}`]);
        setLogs(prev => [...prev, `No-cors response status: ${response2.status}`]);
      } catch (error2: any) {
        setLogs(prev => [...prev, `No-cors error: ${error2.message}`]);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testProxy} style={{ marginRight: '10px' }}>
          Test Proxy
        </button>
        <button onClick={testHealthCheck} style={{ marginRight: '10px' }}>
          Test Health Check
        </button>
        <button onClick={testDirectFetch} style={{ marginRight: '10px' }}>
          Test Direct Fetch
        </button>
        <button onClick={testDailyReport} style={{ marginRight: '10px' }}>
          Test Daily Report
        </button>
        <button onClick={() => setLogs([])}>
          Clear Logs
        </button>
      </div>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};