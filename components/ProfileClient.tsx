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
      console.log('Attempting to decode token:', {
        hasToken: !!token,
        tokenType: typeof token,
        tokenLength: token?.length,
        tokenPreview: token?.substring(0, 50) + '...'
      });

      if (!token || typeof token !== 'string') {
        console.warn('Invalid token: not a string or empty');
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT format: expected 3 parts, got', parts.length, 'Parts:', parts.map(p => p.length));
        return null;
      }

      // Convert from URL-safe base64 to standard base64 and add padding
      const base64UrlDecode = (str: string) => {
        // Replace URL-safe characters with standard base64 characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        const missing = str.length % 4;
        if (missing) {
          str += '='.repeat(4 - missing);
        }
        
        return str;
      };

      const header = JSON.parse(atob(base64UrlDecode(parts[0])));
      const payload = JSON.parse(atob(base64UrlDecode(parts[1])));
      const signature = parts[2];

      console.log('Successfully decoded token:', { header, payloadKeys: Object.keys(payload) });

      return { header, payload, signature };
    } catch (error) {
      console.error('Error decoding JWT:', error, 'Token preview:', token?.substring(0, 50) + '...');
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
        ) : rawToken ? (
          <div className="text-muted-foreground text-center py-8">
            <div className="font-medium mb-2">Unable to decode token</div>
            <div className="text-sm">
              This token may not be in valid JWT format or may be corrupted.
            </div>
            {showRawTokens && (
              <div className="mt-4 p-3 bg-muted rounded font-mono text-xs break-all">
                {rawToken}
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8">
            No token available
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

function ShoppingCartSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
        <CardDescription>
          Your saved items and cart information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-muted-foreground/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-sm mb-4">
            Start shopping to add items to your cart
          </p>
          <Button asChild>
            <a href="/">Browse Products</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileClient({ user }: ProfileClientProps) {
  return (
    <>
      {/* Cart Tab */}
      <TabsContent value="cart" className="space-y-6">
        <ShoppingCartSection />
      </TabsContent>

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