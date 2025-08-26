'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, AlertTriangle, Fingerprint, Smartphone, Usb } from 'lucide-react';

interface WebAuthnEnrollmentProps {
  user?: any;
}

export function WebAuthnEnrollment({ user }: WebAuthnEnrollmentProps = {}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [webauthnEnabled, setWebAuthnEnabled] = useState(false);
  const [webauthnMethods, setWebAuthnMethods] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check user's current WebAuthn status on component mount and handle post-MFA enrollment
  useEffect(() => {
    const checkWebAuthnStatus = async () => {
      try {
        const response = await fetch('/api/webauthn-enrollment');
        if (response.ok) {
          const data = await response.json();
          setWebAuthnEnabled(data.hasWebAuthn);
          setWebAuthnMethods(data.methods || []);
        }
      } catch (error) {
        console.error('Failed to check WebAuthn status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    const checkForPendingWebAuthnEnrollment = () => {
      // Check if user has returned from step-up MFA and wants to enroll WebAuthn
      const urlParams = new URLSearchParams(window.location.search);
      const pendingWebAuthn = urlParams.get('enroll_webauthn');
      const hasMFAClaim = user?.['http://schemas.openid.net/pape/policies/2007/06/multi-factor'];
      
      // Debug logging
      console.log('Checking for pending WebAuthn enrollment:');
      console.log('- pendingWebAuthn parameter:', pendingWebAuthn);
      console.log('- hasMFAClaim:', hasMFAClaim);
      console.log('- webauthnEnabled:', webauthnEnabled);
      console.log('- All user claims:', Object.keys(user || {}));
      console.log('- Looking for MFA claims containing "multi":', Object.keys(user || {}).filter(key => key.includes('multi')));
      console.log('- Full user session:', user);
      
      if (pendingWebAuthn === 'true') {
        console.log('Found enroll_webauthn=true parameter');
        
        if (!hasMFAClaim) {
          console.log('User does not have MFA claim - trying enrollment anyway after step-up...');
          toast({
            title: "Attempting WebAuthn enrollment",
            description: "You completed MFA verification, attempting to enroll WebAuthn...",
          });
          
          // Clean up URL parameter first
          urlParams.delete('enroll_webauthn');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, '', newUrl);
          
          // Try enrollment anyway since user just completed step-up
          setTimeout(() => {
            handleEnrollWebAuthn();
          }, 1500);
          return;
        }
        
        if (webauthnEnabled) {
          console.log('WebAuthn already enabled, cleaning up URL...');
          urlParams.delete('enroll_webauthn');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, '', newUrl);
          return;
        }
        
        // User has returned from MFA challenge and now has MFA claim - proceed with enrollment
        console.log('All conditions met - proceeding with WebAuthn enrollment...');
        toast({
          title: "MFA Verified",
          description: "Proceeding with WebAuthn enrollment...",
        });
        
        // Clean up URL parameter
        urlParams.delete('enroll_webauthn');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', newUrl);
        
        // Automatically trigger WebAuthn enrollment
        setTimeout(() => {
          handleEnrollWebAuthn();
        }, 1500);
      }
    };

    if (user) {
      checkWebAuthnStatus();
      checkForPendingWebAuthnEnrollment();
    }
  }, [user, webauthnEnabled]);

  const handleEnrollWebAuthn = async () => {
    setLoading(true);
    setEnrolling(true);

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast({
          title: "WebAuthn not supported",
          description: "Your browser doesn't support WebAuthn. Please use a modern browser.",
          variant: "destructive"
        });
        return;
      }

      // Step 1: Initiate WebAuthn enrollment via Management API
      console.log('Initiating WebAuthn enrollment...');
      const initiateResponse = await fetch('/api/webauthn-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: 'initiate'
        })
      });

      if (!initiateResponse.ok) {
        const error = await initiateResponse.json();
        
        // Enhanced error logging for 403 responses
        if (initiateResponse.status === 403) {
          console.error('403 Forbidden error details:', error);
          console.log('User completed step-up MFA but still getting 403');
          console.log('This suggests the MFA claim is not properly set in the session');
          
          toast({
            title: "Additional WebAuthn enrollment not available",
            description: "WebAuthn enrollment as an additional MFA factor requires implementation of Auth0's MFA API. Currently only SMS MFA is supported for additional factors.",
            variant: "destructive"
          });
          return;
        }
        
        if (error.requiresStepUp) {
          // User needs to complete step-up MFA first
          toast({
            title: "MFA Verification Required",
            description: "Initiating MFA verification to enroll additional factors...",
          });
          
          // Call step-up MFA challenge endpoint with user's phone number
          try {
            // Get user's phone number for step-up challenge
            const phoneNumber = user?.phone_number || user?.user_metadata?.pending_phone_number;
            
            if (!phoneNumber) {
              throw new Error('No phone number found for MFA verification');
            }
            
            const stepUpResponse = await fetch('/api/step-up-challenge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phoneNumber })
            });
            
            if (stepUpResponse.ok) {
              const stepUpData = await stepUpResponse.json();
              if (stepUpData.challengeUrl) {
                // Add parameter to indicate WebAuthn enrollment is pending after MFA
                const challengeUrl = new URL(stepUpData.challengeUrl, window.location.origin);
                const returnTo = challengeUrl.searchParams.get('returnTo');
                if (returnTo) {
                  const returnUrl = new URL(returnTo, window.location.origin);
                  returnUrl.searchParams.set('enroll_webauthn', 'true');
                  challengeUrl.searchParams.set('returnTo', returnUrl.toString());
                }
                window.location.href = challengeUrl.toString();
                return;
              }
            }
            
            // Fallback error
            throw new Error('Failed to initiate step-up MFA challenge');
          } catch (stepUpError) {
            toast({
              title: "Step-up MFA Failed",
              description: "Unable to initiate MFA verification. Please try again.",
              variant: "destructive"
            });
          }
          return;
        }
        
        if (error.requiresManualEnrollment) {
          // Additional MFA enrollment not yet implemented
          toast({
            title: "Additional MFA Not Available",
            description: error.manualMessage || "Additional WebAuthn enrollment is not yet available.",
            variant: "destructive"
          });
          return;
        }
        
        throw new Error(error.details || error.error || 'Failed to initiate WebAuthn enrollment');
      }

      const responseData = await initiateResponse.json();
      
      if (responseData.enrollmentUrl) {
        console.log('WebAuthn enrollment ticket created, redirecting to Guardian enrollment page...');
        // Redirect to Guardian enrollment page
        window.location.href = responseData.enrollmentUrl;
      } else {
        throw new Error('No enrollment URL received from server');
      }

      setEnrolling(false);

    } catch (error) {
      console.error('WebAuthn enrollment error:', error);
      
      let errorMessage = 'Failed to enroll WebAuthn biometrics';
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError') || error.message.includes('NotSupported')) {
          errorMessage = 'WebAuthn enrollment was cancelled or is not supported on this device';
        } else if (error.message.includes('InvalidStateError')) {
          errorMessage = 'WebAuthn is already registered for this account on this device';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "WebAuthn enrollment failed",
        description: errorMessage,
        variant: "destructive"
      });

      setEnrolling(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWebAuthn = async (methodId: string) => {
    if (!window.confirm('Are you sure you want to remove this WebAuthn authenticator?')) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement WebAuthn removal via Management API
      toast({
        title: "Remove WebAuthn",
        description: "WebAuthn removal functionality will be implemented in the next update.",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Failed to remove WebAuthn",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthenticatorIcon = (type: string) => {
    switch (type) {
      case 'webauthn-platform':
        return <Smartphone className="w-5 h-5" />;
      case 'webauthn-roaming':
        return <Usb className="w-5 h-5" />;
      case 'webauthn':
        return <Fingerprint className="w-5 h-5" />;
      case 'oob':
        return <Fingerprint className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getAuthenticatorName = (type: string) => {
    switch (type) {
      case 'webauthn-platform':
        return 'Platform Authenticator (Built-in)';
      case 'webauthn-roaming':
        return 'Roaming Authenticator (External)';
      case 'webauthn':
        return 'WebAuthn Biometric Authentication';
      case 'oob':
        return 'Biometric Authentication';
      default:
        return 'WebAuthn Authenticator';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          WebAuthn Biometric MFA
        </CardTitle>
        <CardDescription>
          Use biometric authentication or security keys as a multi-factor authentication method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* WebAuthn Status Section */}
          <div className={`p-4 border rounded-lg ${
            webauthnEnabled 
              ? 'bg-muted/30' 
              : 'border-2 border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className={`w-5 h-5 ${
                  webauthnEnabled ? 'text-green-600' : 'text-green-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    webauthnEnabled ? '' : 'text-green-800'
                  }`}>
                    Biometric MFA
                  </h4>
                  <p className={`text-sm ${
                    webauthnEnabled 
                      ? 'text-muted-foreground' 
                      : user?.phone_verified ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {webauthnEnabled 
                      ? `${webauthnMethods.length} WebAuthn authenticator${webauthnMethods.length !== 1 ? 's' : ''} enrolled`
                      : user?.phone_verified 
                        ? 'Additional WebAuthn enrollment requires Auth0 MFA API implementation'
                        : 'Add biometric authentication as an MFA factor'
                    }
                  </p>
                </div>
              </div>
              {webauthnEnabled ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    {webauthnMethods.length} Enrolled
                  </Badge>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleEnrollWebAuthn}
                  disabled={loading || enrolling || user?.phone_verified}
                  className={user?.phone_verified ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                  title={user?.phone_verified ? "Additional WebAuthn enrollment not currently supported" : ""}
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Setting up...
                    </>
                  ) : user?.phone_verified ? (
                    'Not Available'
                  ) : (
                    'Enroll WebAuthn'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Enrolled Methods List */}
          {webauthnMethods.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Enrolled WebAuthn Methods:</h4>
              {webauthnMethods.map((method, index) => (
                <div key={method.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getAuthenticatorIcon(method.type)}
                    <div>
                      <p className="font-medium">{getAuthenticatorName(method.type)}</p>
                      <p className="text-sm text-muted-foreground">
                        Enrolled on {method.created_at ? new Date(method.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveWebAuthn(method.id)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}