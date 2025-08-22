import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Shield, Settings, Activity, Key } from 'lucide-react';
import { ProfileClient } from '@/components/ProfileClient';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/api/auth/login');
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings, security preferences, and view authentication details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                  <CardDescription className="truncate">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.sub?.split('|')[1]?.slice(0, 8)}...
                  </Badge>
                </div>
                {user.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Verified</span>
                    <Badge variant={user.email_verified ? "default" : "destructive"}>
                      {user.email_verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone Verified</span>
                  <Badge variant={
                    (user.phone_number && user.phone_number_verified) || 
                    user.user_metadata?.phone_verified_via_mfa 
                      ? "default" : "destructive"
                  }>
                    {(user.phone_number && user.phone_number_verified) || 
                     user.user_metadata?.phone_verified_via_mfa 
                       ? "Yes" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <Badge variant="outline">
                    {user.sub?.split('|')[0]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Overview
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

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Your basic profile information from Auth0
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={user.name || ''} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email || ''} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input id="nickname" value={user.nickname || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="sub">Subject Identifier</Label>
                    <Input id="sub" value={user.sub || ''} readOnly className="font-mono text-sm" />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="last-updated">Last Updated</Label>
                    <Input 
                      id="last-updated" 
                      value={user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'} 
                      readOnly 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client-side components */}
            <ProfileClient user={user} />
          </Tabs>
        </div>
      </div>
      
      <div className="mt-8">
        <Button asChild>
          <a href="/">← Back to Home</a>
        </Button>
      </div>
    </div>
  );
}