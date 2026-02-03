import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg md:left-auto md:right-4 md:w-80">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Install KCET Coded</h3>
              <p className="text-xs text-white/80 mt-1">
                Get quick access with our app
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-3 flex gap-2">
          <Button
            onClick={installApp}
            size="sm"
            className="bg-white text-blue-600 hover:bg-white/90 flex-1 text-xs font-medium"
          >
            <Download className="h-3 w-3 mr-1" />
            Install App
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/20 text-xs"
            onClick={() => setIsDismissed(true)}
          >
            Maybe Later
          </Button>
        </div>
        
        <div className="mt-2 flex items-center gap-4 text-xs text-white/70">
          <div className="flex items-center gap-1">
            <Smartphone className="h-3 w-3" />
            Mobile
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            Desktop
          </div>
        </div>
      </div>
    </Card>
  );
}
