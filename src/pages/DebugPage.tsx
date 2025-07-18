import { useState } from 'react';
import { api } from '@/services/api';

export const DebugPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const testDailyReport = async () => {
    setLogs(prev => [...prev, 'Testing daily report...']);
    try {
      const isProxy = window.location.hostname.includes('vercel.app');
      setLogs(prev => [...prev, `Using proxy: ${isProxy}`]);
      setLogs(prev => [...prev, `Host: ${window.location.hostname}`]);
      
      const data = await api.getDailyReport();
      setLogs(prev => [...prev, 'Success!', JSON.stringify(data, null, 2)]);
    } catch (error: any) {
      setLogs(prev => [...prev, `Error: ${error.message}`, error.stack || '']);
    }
  };
  
  const testHealthCheck = async () => {
    setLogs(prev => [...prev, 'Testing health check...']);
    try {
      let url;
      if (window.location.hostname.includes('vercel.app')) {
        url = '/api/proxy?path=/health';
      } else {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        url = `${apiUrl}/health`;
      }
      setLogs(prev => [...prev, `Health URL: ${url}`]);
      const response = await fetch(url);
      const data = await response.json();
      setLogs(prev => [...prev, 'Health check success!', JSON.stringify(data)]);
    } catch (error: any) {
      setLogs(prev => [...prev, `Health check error: ${error.message}`]);
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