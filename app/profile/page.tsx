import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { ProfileClient } from '@/components/ProfileClient';
import { ProfileTabs } from '@/components/ProfileTabs';
import { ManagementClient } from 'auth0';

async function getFreshUserData(userId: string) {
  try {
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      console.log('No M2M credentials - using session data only');
      return null;
    }

    console.log('Fetching fresh user data for:', userId);
    const management = new ManagementClient({
      domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
      clientId: process.env.AUTH0_M2M_CLIENT_ID!,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
    });

    const freshUser = await management.users.get({ id: userId });
    console.log('Fresh user data:', {
      phone_number: freshUser.data.phone_number,
      phone_verified: freshUser.data.phone_verified,
      phone_number_verified: freshUser.data.phone_number_verified,
      user_metadata: freshUser.data.user_metadata
    });
    return freshUser.data;
  } catch (error) {
    console.error('Error fetching fresh user data:', error);
    return null;
  }
}

interface ProfilePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getSession();
  
  if (!session) {
    redirect('/api/auth/login');
  }

  // Get the active tab from URL params, default to "overview"
  const activeTab = typeof searchParams.tab === 'string' ? searchParams.tab : 'overview';

  // Get fresh user data from Auth0 on page load
  const freshUserData = await getFreshUserData(session.user.sub!);
  
  // Merge session user with fresh Auth0 data, prioritizing fresh data for verification fields
  const user = freshUserData ? {
    ...session.user,
    phone_verified: freshUserData.phone_verified,
    phone_number_verified: freshUserData.phone_number_verified,
    phone_number: freshUserData.phone_number,
    user_metadata: freshUserData.user_metadata,
    email_verified: freshUserData.email_verified
  } : session.user;

  console.log('Final user data for profile:', {
    phone_number: user.phone_number,
    phone_verified: user.phone_verified,
    phone_number_verified: user.phone_number_verified,
    user_metadata_phone_verified: user.user_metadata?.phone_verified_via_mfa
  });

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
                    user.phone_number && user.phone_verified
                      ? "default" : "destructive"
                  }>
                    {user.phone_number && user.phone_verified
                       ? "Yes" : "No"}
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
          <ProfileTabs defaultValue={activeTab}>

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
          </ProfileTabs>
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