
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiKeys } from '@/contexts/ApiKeyContext';
import { toast } from 'sonner';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ isOpen, onClose }: ApiKeyModalProps) => {
  const { geminiApiKey, omdbApiKey, setGeminiApiKey, setOmdbApiKey, isKeysSet } = useApiKeys();
  const [geminiKey, setGeminiKey] = useState(geminiApiKey);
  const [omdbKey, setOmdbKey] = useState(omdbApiKey);

  const handleSave = () => {
    if (!geminiKey || !omdbKey) {
      toast.error('Please enter both API keys');
      return;
    }
    
    setGeminiApiKey(geminiKey);
    setOmdbApiKey(omdbKey);
    toast.success('API keys saved successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Keys</DialogTitle>
          <DialogDescription>
            Enter your API keys to use Movie Mind Magic Match.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
            <Input
              id="gemini-key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Get your key from <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="omdb-key">OMDb API Key</Label>
            <Input
              id="omdb-key"
              value={omdbKey}
              onChange={(e) => setOmdbKey(e.target.value)}
              placeholder="Enter your OMDb API key"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Get your key from <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noreferrer" className="text-primary hover:underline">OMDb API</a>
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
          <Button onClick={handleSave}>Save Keys</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
