// @ts-ignore
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeyContextType {
  geminiApiKey: string;
  omdbApiKey: string;
  setGeminiApiKey: (key: string) => void;
  setOmdbApiKey: (key: string) => void;
  isKeysSet: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [geminiApiKey, setGeminiApiKey] = useState<string>('AIzaSyC-OV82hkF4S1k_kHmh5NhsRYbpfVOmrIo');
  const [omdbApiKey, setOmdbApiKey] = useState<string>('dda68a62');
  
  useEffect(() => {
    // Load keys from localStorage if available
    const savedGeminiKey = localStorage.getItem('geminiApiKey');
    const savedOmdbKey = localStorage.getItem('omdbApiKey');
    
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedOmdbKey) setOmdbApiKey(savedOmdbKey);
  }, []);
  
  const handleSetGeminiApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('geminiApiKey', key);
  };
  
  const handleSetOmdbApiKey = (key: string) => {
    setOmdbApiKey(key);
    localStorage.setItem('omdbApiKey', key);
  };
  
  const isKeysSet = Boolean(geminiApiKey && omdbApiKey);
  
  return (
    <ApiKeyContext.Provider 
      value={{ 
        geminiApiKey, 
        omdbApiKey, 
        setGeminiApiKey: handleSetGeminiApiKey, 
        setOmdbApiKey: handleSetOmdbApiKey,
        isKeysSet
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider');
  }
  return context;
};
