import { useEffect, useState } from 'react';

export const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  
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
      
      // Send to server for logging
      fetch('https://api.getsenso.app/api/debug/log-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      }).catch(() => {});
    } else {
      setDebugInfo({ available: false });
    }
  }, []);
  
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
          borderRadius: '5px'
        }}
      >
        Copy Debug Info
      </button>
    </div>
  );
};