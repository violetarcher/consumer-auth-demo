'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Key, Check, AlertTriangle, Fingerprint } from 'lucide-react';

interface PasskeyEnrollmentProps {
  user?: any;
}

export function PasskeyEnrollment({ user }: PasskeyEnrollmentProps = {}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passkeysEnabled, setPasskeysEnabled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check user's current passkey status on component mount
  useEffect(() => {
    const checkPasskeyStatus = async () => {
      try {
        const response = await fetch('/api/passkey-status');
        if (response.ok) {
          const data = await response.json();
          setPasskeysEnabled(data.hasPasskeys);
        }
      } catch (error) {
        console.error('Failed to check passkey status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (user) {
      checkPasskeyStatus();
    }
  }, [user]);

  const retryEnrollmentWithToken = async (accessToken: string) => {
    try {
      // Step 1: Initiate passkey enrollment with the external token
      console.log('Retrying passkey enrollment with external token...');
      const initiateResponse = await fetch('/api/passkey-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'initiate', externalToken: accessToken })
      });

      if (!initiateResponse.ok) {
        const error = await initiateResponse.json();
        throw new Error(error.details || error.error || 'Failed to initiate passkey enrollment');
      }

      const { authSession, publicKeyCreationOptions } = await initiateResponse.json();
      console.log('Passkey enrollment initiated with external token, creating credential...');

      // Continue with the rest of the enrollment process
      await completePasskeyEnrollment(authSession, publicKeyCreationOptions, accessToken);
    } catch (error) {
      console.error('Passkey enrollment retry error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll passkey';
      toast({
        title: "Passkey enrollment failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setEnrolling(false);
    }
  };

  const completePasskeyEnrollment = async (authSession: string, publicKeyCreationOptions: any, accessToken?: string) => {
    // Step 2: Create the passkey using WebAuthn API
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCreationOptions
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to create passkey credential');
    }

    // Step 3: Verify the enrollment with Auth0
    console.log('Verifying passkey enrollment...');
    const verifyResponse = await fetch('/api/passkey-enrollment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: 'verify',
        authSession,
        externalToken: accessToken,
        credential: {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          type: credential.type,
          response: {
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
          }
        }
      })
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json();
      throw new Error(error.details || error.error || 'Failed to verify passkey enrollment');
    }

    const result = await verifyResponse.json();
    console.log('Passkey enrollment completed successfully');

    toast({
      title: "Passkey enrolled successfully",
      description: "Your passkey has been registered and can now be used for authentication.",
    });
  };

  const handleEnrollPasskey = async () => {
    setLoading(true);
    setEnrolling(true);

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast({
          title: "Passkeys not supported",
          description: "Your browser doesn't support passkeys. Please use a modern browser.",
          variant: "destructive"
        });
        return;
      }

      // Step 1: Initiate passkey enrollment
      console.log('Initiating passkey enrollment...');
      const initiateResponse = await fetch('/api/passkey-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'initiate' })
      });

      if (!initiateResponse.ok) {
        const error = await initiateResponse.json();
        
        // Check if authorization is required for My Account API
        if (error.error === 'authorization_required' && error.authorizationUrl) {
          console.log('Authorization required for My Account API, opening popup...');
          
          // Open authorization in popup window
          const popup = window.open(
            error.authorizationUrl,
            'passkey-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
          );
          
          // Handle popup blocked or closed
          const checkClosed = setInterval(() => {
            if (popup?.closed) {
              clearInterval(checkClosed);
              window.removeEventListener('message', messageHandler);
              setLoading(false);
              setEnrolling(false);
              toast({
                title: "Authorization cancelled",
                description: "Passkey enrollment was cancelled.",
                variant: "destructive"
              });
            }
          }, 1000);

          // Listen for the authorization result
          const messageHandler = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'PASSKEY_AUTH_SUCCESS') {
              clearInterval(checkClosed);
              window.removeEventListener('message', messageHandler);
              // Retry the enrollment with the new token
              retryEnrollmentWithToken(event.data.accessToken);
            } else if (event.data.type === 'PASSKEY_AUTH_ERROR') {
              clearInterval(checkClosed);
              window.removeEventListener('message', messageHandler);
              throw new Error(`Authorization failed: ${event.data.description || event.data.error}`);
            }
          };
          
          window.addEventListener('message', messageHandler);
          
          return;
        }
        
        throw new Error(error.details || error.error || 'Failed to initiate passkey enrollment');
      }

      const { authSession, publicKeyCreationOptions } = await initiateResponse.json();
      console.log('Passkey enrollment initiated, creating credential...');

      // Step 2: Create the passkey using WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create passkey credential');
      }

      // Step 3: Verify the enrollment with Auth0
      console.log('Verifying passkey enrollment...');
      const verifyResponse = await fetch('/api/passkey-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'verify',
          authSession,
          credential: {
            id: credential.id,
            rawId: Array.from(new Uint8Array(credential.rawId)),
            type: credential.type,
            response: {
              clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
              attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
            }
          }
        })
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.details || error.error || 'Failed to verify passkey enrollment');
      }

      console.log('Passkey enrollment completed successfully');
      setPasskeysEnabled(true);
      
      toast({
        title: "Passkey enrolled successfully",
        description: "You can now use this device to sign in without a password.",
      });

      setEnrolling(false);

    } catch (error) {
      console.error('Passkey enrollment error:', error);
      
      let errorMessage = 'Failed to enroll passkey';
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError') || error.message.includes('NotSupported')) {
          errorMessage = 'Passkey enrollment was cancelled or is not supported on this device';
        } else if (error.message.includes('InvalidStateError')) {
          errorMessage = 'A passkey already exists for this account on this device';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Passkey enrollment failed",
        description: errorMessage,
        variant: "destructive"
      });

      setEnrolling(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePasskey = async () => {
    if (!window.confirm('Are you sure you want to remove your passkey? You will no longer be able to sign in with this device without a password.')) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement passkey removal via Management API
      toast({
        title: "Remove passkey",
        description: "Passkey removal functionality will be implemented in the next update.",
        variant: "default"
      });

      // For now, just update the UI state
      // setPasskeysEnabled(false);
      
    } catch (error) {
      toast({
        title: "Failed to remove passkey",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Passkey Authentication
        </CardTitle>
        <CardDescription>
          Sign in securely without passwords using your device's built-in authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Passkey Status Section */}
          <div className={`p-4 border rounded-lg ${
            passkeysEnabled 
              ? 'bg-muted/30' 
              : 'border-2 border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className={`w-5 h-5 ${
                  passkeysEnabled ? 'text-green-600' : 'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    passkeysEnabled ? '' : 'text-blue-800'
                  }`}>
                    Device Passkey
                  </h4>
                  <p className={`text-sm ${
                    passkeysEnabled 
                      ? 'text-muted-foreground' 
                      : 'text-blue-600'
                  }`}>
                    {passkeysEnabled 
                      ? 'You can sign in with your device biometrics or security key'
                      : 'Enable passwordless sign-in with your device biometrics or security key'
                    }
                  </p>
                </div>
              </div>
              {passkeysEnabled ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRemovePasskey}
                    disabled={loading}
                  >
                    {loading ? 'Removing...' : 'Remove'}
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Setting up...' : 'Setup Passkey'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Setup Passkey Authentication
                      </DialogTitle>
                      <DialogDescription>
                        Create a passkey to sign in securely without passwords
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Fingerprint className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">What is a passkey?</h4>
                            <p className="text-sm text-blue-600 mt-1">
                              A passkey uses your device's built-in security (Face ID, Touch ID, or Windows Hello) 
                              to sign you in quickly and securely without needing to remember passwords.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• A device with biometric authentication or security key</li>
                          <li>• Modern browser (Chrome, Firefox, Safari, Edge)</li>
                          <li>• Secure connection (HTTPS)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        onClick={handleEnrollPasskey}
                        disabled={loading || enrolling}
                        className="w-full"
                      >
                        {enrolling ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Setting up passkey...
                          </>
                        ) : (
                          'Create Passkey'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}