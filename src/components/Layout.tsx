
import React from 'react';
import Header from './Header';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ApiKeyProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-border py-6 bg-card">
          <div className="container-custom text-center text-sm text-muted-foreground">
            <p>Movie Mind: Magic Match &copy; {new Date().getFullYear()}</p>
            <p className="mt-1">Powered by IMDb API and Google Gemini</p>
          </div>
        </footer>
      </div>
    </ApiKeyProvider>
  );
};

export default Layout;
