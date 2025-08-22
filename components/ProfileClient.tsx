'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MFAEnrollment } from '@/components/MFAEnrollment';
import { UserSessions } from '@/components/UserSessions';
import { UserMetadata } from '@/components/UserMetadata';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfileClientProps {
  user: any;
}

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
}

function TokensSection({ user }: { user: any }) {
  const [accessToken, setAccessToken] = useState<string>('');
  const [idToken, setIdToken] = useState<string>('');
  const [decodedAccessToken, setDecodedAccessToken] = useState<DecodedToken | null>(null);
  const [decodedIdToken, setDecodedIdToken] = useState<DecodedToken | null>(null);
  const [showRawTokens, setShowRawTokens] = useState(false);
  const { toast } = useToast();

  const decodeJWT = (token: string): DecodedToken | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      return { header, payload, signature };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const formatTokenPayload = (payload: any) => {
    return JSON.stringify(payload, null, 2);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            setDecodedAccessToken(decodeJWT(data.accessToken));
          }
          if (data.idToken) {
            setIdToken(data.idToken);
            setDecodedIdToken(decodeJWT(data.idToken));
          }
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
      }
    };

    if (user) {
      getTokens();
    }
  }, [user]);

  const renderTokenCard = (
    title: string,
    description: string,
    rawToken: string,
    decodedToken: DecodedToken | null
  ) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              {decodedToken && (
                <Badge variant="secondary">
                  {decodedToken.header?.alg || 'JWT'}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRawTokens(!showRawTokens)}
            >
              {showRawTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showRawTokens ? 'Show Decoded' : 'Show Raw'}
            </Button>
            {rawToken && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(rawToken, title)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!rawToken ? (
          <div className="text-muted-foreground text-center py-8">
            Token not available
          </div>
        ) : showRawTokens ? (
          <Textarea 
            value={rawToken} 
            readOnly 
            className="font-mono text-xs min-h-32"
          />
        ) : decodedToken ? (
          <Tabs defaultValue="payload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="header" className="mt-4">
              <Textarea 
                value={formatTokenPayload(decodedToken.header)} 
                readOnly 
                className="font-mono text-xs min-h-32"
              />
            </TabsContent>
            <TabsContent value="payload" className="mt-4">
              <Textarea 
                value={formatTokenPayload(decodedToken.payload)} 
                readOnly 
                className="font-mono text-xs min-h-64"
              />
              <div className="mt-4 space-y-2">
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {decodedToken.payload.iss && (
                    <div>
                      <strong>Issuer:</strong> {decodedToken.payload.iss}
                    </div>
                  )}
                  {decodedToken.payload.aud && (
                    <div>
                      <strong>Audience:</strong> {Array.isArray(decodedToken.payload.aud) 
                        ? decodedToken.payload.aud.join(', ') 
                        : decodedToken.payload.aud}
                    </div>
                  )}
                  {decodedToken.payload.exp && (
                    <div>
                      <strong>Expires:</strong> {new Date(decodedToken.payload.exp * 1000).toLocaleString()}
                    </div>
                  )}
                  {decodedToken.payload.iat && (
                    <div>
                      <strong>Issued:</strong> {new Date(decodedToken.payload.iat * 1000).toLocaleString()}
                    </div>
                  )}
                  {decodedToken.payload.sub && (
                    <div>
                      <strong>Subject:</strong> {decodedToken.payload.sub}
                    </div>
                  )}
                  {decodedToken.payload.scope && (
                    <div className="col-span-2">
                      <strong>Scopes:</strong> {decodedToken.payload.scope}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="signature" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-mono text-xs break-all">
                    {decodedToken.signature}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  The signature is used to verify that the token hasn't been tampered with. 
                  It's created using the header, payload, and a secret key.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-destructive text-center py-8">
            Invalid token format
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {renderTokenCard(
        'Access Token',
        'JWT token for API authentication and authorization',
        accessToken,
        decodedAccessToken
      )}
      
      {renderTokenCard(
        'ID Token',
        'JWT token containing user identity information and claims',
        idToken,
        decodedIdToken
      )}
    </>
  );
}

export function ProfileClient({ user }: ProfileClientProps) {
  return (
    <>
      {/* Tokens Tab */}
      <TabsContent value="tokens" className="space-y-6">
        <TokensSection user={user} />
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security" className="space-y-6">
        <MFAEnrollment user={user} />
      </TabsContent>

      {/* Sessions Tab */}
      <TabsContent value="sessions" className="space-y-6">
        <UserSessions />
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences" className="space-y-6">
        <UserMetadata user={user} />
      </TabsContent>
    </>
  );
}