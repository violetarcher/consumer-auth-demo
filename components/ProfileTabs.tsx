'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Shield, Settings, Activity, Key, LogOut, ShoppingCart } from 'lucide-react';
import { ReactNode } from 'react';

interface ProfileTabsProps {
  defaultValue: string;
  children: ReactNode;
}

export function ProfileTabs({ defaultValue, children }: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.replace(`/profile?${params.toString()}`);
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {children}
    </Tabs>
  );
}