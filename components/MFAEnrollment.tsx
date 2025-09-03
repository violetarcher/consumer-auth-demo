'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Smartphone, Key, QrCode, Check, X, Mail, AlertTriangle, Fingerprint } from 'lucide-react';

interface MFAEnrollment {
  id: string;
  status: 'confirmed' | 'pending';
  type: 'sms' | 'push-notification' | 'otp';
  name?: string;
  phone_number?: string;
}

interface MFAFactor {
  id: string;
  type: 'sms' | 'totp' | 'totp-otp' | 'push' | 'webauthn' | 'reset-mfa';
  enabled: boolean;
  verified: boolean;
  name: string;
  description: string;
}

interface MFAEnrollmentProps {
  user?: any;
}

export function MFAEnrollment({ user }: MFAEnrollmentProps = {}) {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<MFAEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [verifyPhoneLoading, setVerifyPhoneLoading] = useState(false);
  const [resetMfaLoading, setResetMfaLoading] = useState(false);
  const [factors, setFactors] = useState<MFAFactor[]>([
    {
      id: 'sms',
      type: 'sms',
      enabled: false,
      verified: false,
      name: 'SMS Phone Verification',
      description: 'Secure your account with SMS codes sent to your phone'
    },
    {
      id: 'totp',
      type: 'totp',
      enabled: false,
      verified: false,
      name: 'Authenticator App - Auth0 Guardian w/ Push',
      description: 'Use the Guardian app for push notifications and TOTP codes'
    },
    {
      id: 'totp-otp',
      type: 'totp-otp',
      enabled: false,
      verified: false,
      name: 'TOTP Authenticator',
      description: 'Use apps like Google Authenticator or Authy for time-based codes'
    },
    {
      id: 'additional-mfa',
      type: 'webauthn',
      enabled: false,
      verified: false,
      name: 'Enroll an MFA Factor',
      description: 'Add additional multi-factor authentication options to your account'
    },
    {
      id: 'reset-mfa',
      type: 'reset-mfa',
      enabled: false,
      verified: false,
      name: 'Reset MFA',
      description: 'Remove all MFA enrollments and start over'
    }
  ]);

  const [enrollmentData, setEnrollmentData] = useState({
    phoneNumber: '',
    verificationCode: '',
    qrCode: '',
    secret: ''
  });

  const [enrollingFactor, setEnrollingFactor] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'setup' | 'verify'>('setup');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/mfa');
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments || []);
        
        // Update factors based on actual enrollments
        const hasAnyEnrollments = data.enrollments && data.enrollments.length > 0;
        
        setFactors(prevFactors => 
          prevFactors.map(factor => {
            const enrollment = data.enrollments?.find((e: MFAEnrollment) => 
              (e.type === 'sms' && factor.type === 'sms') ||
              (e.type === 'otp' && factor.type === 'totp')
            );
            
            // Always show Reset MFA option
            if (factor.type === 'reset-mfa') {
              return {
                ...factor,
                enabled: true,
                verified: false
              };
            }
            
            return {
              ...factor,
              enabled: !!enrollment && enrollment.status === 'confirmed',
              verified: !!enrollment && enrollment.status === 'confirmed'
            };
          })
        );
      }
    } catch (error) {
      console.error('Error fetching MFA enrollments:', error);
    }
  };

  const handleEnrollFactor = async (factorType: string) => {
    setLoading(true);
    setEnrollingFactor(factorType);
    setVerificationStep('setup');

    try {
      if (factorType === 'sms') {
        // For SMS, we need to collect phone number for step-up challenge
        if (!enrollmentData.phoneNumber) {
          toast({
            title: "Phone number required",
            description: "Please enter your phone number to verify it via SMS.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Use step-up challenge instead of direct enrollment
        const response = await fetch('/api/step-up-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phoneNumber: enrollmentData.phoneNumber,
            type: 'sms'
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Step-up challenge result:', result);
          
          if (result.redirectRequired && result.challengeUrl) {
            toast({
              title: "SMS Verification Started",
              description: "You'll be redirected to complete SMS verification. This will verify your phone number.",
            });
            
            // Redirect to step-up challenge (forces MFA)
            window.location.href = result.challengeUrl;
          } else {
            toast({
              title: "Challenge initiated",
              description: result.message || "SMS verification challenge started.",
            });
          }
          
          // Close the modal
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
        } else {
          const error = await response.json();
          toast({
            title: "Challenge failed",
            description: error.details || error.error || "Failed to start SMS verification challenge",
            variant: "destructive"
          });
        }
      } else if (factorType === 'webauthn') {
        // Create WebAuthn enrollment ticket
        const response = await fetch('/api/webauthn-enrollment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: 'initiate' })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.enrollmentUrl) {
            toast({
              title: "MFA Enrollment Started",
              description: "Redirecting to Guardian to enroll additional MFA factors...",
            });
            
            // Redirect to Guardian enrollment
            window.location.href = data.enrollmentUrl;
          } else {
            toast({
              title: "Enrollment ticket created",
              description: data.message || "MFA enrollment ticket created successfully.",
            });
          }
          
          // Close the modal
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
        } else {
          const error = await response.json();
          toast({
            title: "MFA enrollment failed",
            description: error.details || error.error || "Failed to create MFA enrollment ticket",
            variant: "destructive"
          });
        }
      } else if (factorType === 'totp') {
        const response = await fetch('/api/mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'totp' })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('TOTP enrollment response data:', data);
          
          // The ticket URL could be at different paths depending on API response
          let enrollmentUrl = data.ticket?.data?.ticket_url || data.ticket?.ticket_url || data.ticket_url || '';
          
          console.log('Extracted enrollment URL:', enrollmentUrl);
          
          if (enrollmentUrl) {
            // Domain replacement if needed
            if (enrollmentUrl.includes('login.consumerauth.com')) {
              enrollmentUrl = enrollmentUrl.replace('login.consumerauth.com', 'archfaktor.us.auth0.com');
            }
            
            console.log('Final enrollment URL after domain replacement:', enrollmentUrl);
            
            toast({
              title: "TOTP Enrollment Started",
              description: "Redirecting to Guardian to set up your authenticator app...",
            });
            
            // Redirect to Guardian enrollment page
            window.location.href = enrollmentUrl;
          } else {
            console.warn('No enrollment URL found in response:', data);
            toast({
              title: "Enrollment ticket created",
              description: data.message || "TOTP enrollment ticket created successfully.",
            });
          }
          
          // Close the modal
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
        } else {
          const error = await response.json();
          toast({
            title: "TOTP enrollment failed",
            description: error.details || "Failed to create TOTP enrollment ticket",
            variant: "destructive"
          });
        }
      } else if (factorType === 'totp-otp') {
        const response = await fetch('/api/mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'totp-otp' })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('TOTP-OTP enrollment response data:', data);
          
          // The ticket URL could be at different paths depending on API response
          let enrollmentUrl = data.ticket?.data?.ticket_url || data.ticket?.ticket_url || data.ticket_url || '';
          
          console.log('Extracted enrollment URL:', enrollmentUrl);
          
          if (enrollmentUrl) {
            // Domain replacement if needed
            if (enrollmentUrl.includes('login.consumerauth.com')) {
              enrollmentUrl = enrollmentUrl.replace('login.consumerauth.com', 'archfaktor.us.auth0.com');
            }
            
            console.log('Final enrollment URL after domain replacement:', enrollmentUrl);
            
            toast({
              title: "TOTP Enrollment Started",
              description: "Redirecting to Guardian to set up your authenticator app...",
            });
            
            // Redirect to Guardian enrollment page
            window.location.href = enrollmentUrl;
          } else {
            console.warn('No enrollment URL found in response:', data);
            toast({
              title: "Enrollment ticket created",
              description: data.message || "TOTP enrollment ticket created successfully.",
            });
          }
          
          // Close the modal
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
        } else {
          const error = await response.json();
          toast({
            title: "TOTP enrollment failed",
            description: error.details || error.error || "Failed to create TOTP enrollment ticket",
            variant: "destructive"
          });
        }
      } else if (factorType === 'reset-mfa') {
        const response = await fetch('/api/mfa-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        if (response.ok) {
          const data = await response.json();
          console.log('MFA reset response:', data);
          
          toast({
            title: "MFA Reset Successful",
            description: "All MFA enrollments have been removed. You can now set up new factors.",
          });
          
          // Refresh enrollments to reflect the reset
          fetchEnrollments();
          
          // Close the modal
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
        } else {
          const error = await response.json();
          toast({
            title: "MFA reset failed",
            description: error.details || error.error || "Failed to reset MFA enrollments",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFactor = async (factorType: string) => {
    // For now, just refresh enrollments to check status
    await fetchEnrollments();
    
    toast({
      title: "Status updated",
      description: "MFA enrollment status has been refreshed.",
    });
    
    setEnrollingFactor(null);
    setVerificationStep('setup');
    setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
  };

  const handleSendEmailVerification = async () => {
    setEmailVerificationLoading(true);
    
    try {
      const response = await fetch('/api/email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast({
          title: "Email verification sent",
          description: "Please check your email for the verification link.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Failed to send email",
          description: error.details || "Failed to send email verification link",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const handleResetMfa = async () => {
    if (!window.confirm('Are you sure you want to reset your SMS MFA? This will remove your phone verification and all MFA enrollments. You will need to set them up again.')) {
      return;
    }

    setResetMfaLoading(true);
    
    try {
      const response = await fetch('/api/mfa-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "MFA Reset Successful",
          description: result.message || "Your MFA has been reset. You can now set up MFA again.",
        });
        
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        const error = await response.json();
        toast({
          title: "MFA Reset Failed",
          description: error.details || error.error || "Failed to reset MFA",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResetMfaLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifyPhoneLoading(true);
    
    try {
      const response = await fetch('/api/mfa-enrollment-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: 'sms' })
      });

      if (response.ok) {
        toast({
          title: "Phone verification completed",
          description: "Your phone number has been verified successfully.",
        });
        // Refresh page to show updated verification status
        window.location.reload();
      } else {
        const error = await response.json();
        toast({
          title: "Verification failed",
          description: error.error || "Please ensure you completed SMS MFA enrollment first.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVerifyPhoneLoading(false);
    }
  };

  const handleResetMFA = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/mfa-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        toast({
          title: "MFA Reset Successful",
          description: "All MFA enrollments have been removed. Refreshing page...",
        });
        
        // Refresh the page to reflect the changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.json();
        toast({
          title: "MFA reset failed",
          description: error.details || error.error || "Failed to reset MFA enrollments",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisableFactor = async (factorType: string) => {
    const enrollment = enrollments.find(e => 
      (e.type === 'sms' && factorType === 'sms') ||
      (e.type === 'otp' && factorType === 'totp')
    );

    if (!enrollment) {
      toast({
        title: "Error",
        description: "No enrollment found to disable.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/mfa?id=${enrollment.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchEnrollments(); // Refresh enrollments
        toast({
          title: "Factor disabled",
          description: `${factorType.toUpperCase()} authentication has been disabled.`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Disable failed",
          description: error.details || "Failed to disable MFA factor",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Smartphone className="w-5 h-5" />;
      case 'webauthn': return <Shield className="w-5 h-5" />;
      case 'totp': return <Key className="w-5 h-5" />;
      case 'totp-otp': return <QrCode className="w-5 h-5" />;
      case 'push': return <Shield className="w-5 h-5" />;
      case 'reset-mfa': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add extra security to your account with additional authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email Verification Section */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className={`w-5 h-5 ${user?.email_verified ? 'text-green-600' : 'text-blue-600'}`} />
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.email_verified 
                        ? 'Your email address is verified' 
                        : 'Verify your email address to secure your account'}
                    </p>
                  </div>
                </div>
                {user?.email_verified ? (
                  <Badge variant="default" className="bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button 
                    onClick={handleSendEmailVerification}
                    disabled={emailVerificationLoading}
                    size="sm"
                  >
                    {emailVerificationLoading ? 'Sending...' : 'Send Verification Email'}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Phone Number Section - Show if verified OR if unverified but has step-up metadata (pending completion) */}
            {user?.phone_number && user.phone_number.trim() !== '' && (user?.phone_verified || user?.user_metadata?.step_up_challenge_started) ? (
              <div className={`p-4 border rounded-lg ${
                user.phone_verified 
                  ? 'bg-muted/30' 
                  : 'border-2 border-orange-200 bg-orange-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className={`w-5 h-5 ${
                      user.phone_verified ? 'text-green-600' : 'text-orange-600'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        user.phone_verified ? '' : 'text-orange-800'
                      }`}>
                        Phone Number
                      </h4>
                      <p className={`text-sm ${
                        user.phone_verified 
                          ? 'text-muted-foreground' 
                          : 'text-orange-600'
                      }`}>
                        {user.phone_verified 
                          ? `Your phone number ${user.phone_number} is verified and secured with MFA`
                          : `Your phone (${user.phone_number}) is set but not verified. Complete MFA enrollment to verify.`
                        }
                      </p>
                    </div>
                  </div>
                  {user.phone_verified ? (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Button 
                      onClick={handleVerifyPhone}
                      disabled={verifyPhoneLoading}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {verifyPhoneLoading ? 'Verifying...' : 'Complete Verification'}
                    </Button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Reset MFA Section - Show if phone is verified */}
            {user?.phone_verified && (
              <>
                <Separator />
                <div className="p-4 border rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <div>
                        <h4 className="font-medium text-destructive">Reset SMS MFA</h4>
                        <p className="text-sm text-muted-foreground">
                          Remove your current phone verification and MFA enrollment. You&apos;ll need to set it up again.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleResetMfa}
                      disabled={resetMfaLoading}
                    >
                      {resetMfaLoading ? 'Resetting...' : 'Reset MFA'}
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Legacy Phone Verification Completion Section - Remove this block if new section above works */}
            {false && user?.phone_number && !user?.phone_verified && (
              <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-800">Complete Phone Verification</h4>
                      <p className="text-sm text-orange-600">
                        Your phone ({user.phone_number}) is set but not verified. Complete MFA enrollment to verify.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleVerifyPhone}
                    disabled={verifyPhoneLoading}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {verifyPhoneLoading ? 'Verifying...' : 'Complete Verification'}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
            {factors
              .filter(factor => {
                // Hide SMS factor if user's phone is already verified
                if (factor.type === 'sms' && user?.phone_verified) {
                  return false;
                }
                // Always show all factors including Reset MFA
                return true;
              })
              .map((factor) => (
              <div key={factor.id}>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFactorIcon(factor.type)}
                    <div>
                      <h4 className="font-medium">{factor.name}</h4>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {factor.type === 'reset-mfa' ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleResetMFA()}
                        disabled={loading}
                      >
                        {loading ? 'Resetting...' : 'Reset'}
                      </Button>
                    ) : factor.enabled ? (
                      <>
                        <Badge variant="default" className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Enabled
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisableFactor(factor.type)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Disable'}
                        </Button>
                      </>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={loading}>
                            {loading ? 'Processing...' : 'Setup'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getFactorIcon(factor.type)}
                              Setup {factor.name}
                            </DialogTitle>
                            <DialogDescription>
                              {factor.description}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {factor.type === 'sms' && verificationStep === 'setup' && (
                              <div className="space-y-2">
                                <Label htmlFor="sms-phone">Phone Number</Label>
                                <Input
                                  id="sms-phone"
                                  type="tel"
                                  placeholder="+1 (555) 123-4567"
                                  value={enrollmentData.phoneNumber}
                                  onChange={(e) => setEnrollmentData({
                                    ...enrollmentData,
                                    phoneNumber: e.target.value
                                  })}
                                />
                                <p className="text-sm text-muted-foreground">
                                  Enter your phone number to verify it via SMS step-up authentication.
                                </p>
                              </div>
                            )}
                            
                            {factor.type === 'sms' && verificationStep === 'verify' && (
                              <div className="space-y-2">
                                <Label htmlFor="sms-code">Verification Code</Label>
                                <Input
                                  id="sms-code"
                                  placeholder="Enter 6-digit code"
                                  value={enrollmentData.verificationCode}
                                  onChange={(e) => setEnrollmentData({
                                    ...enrollmentData,
                                    verificationCode: e.target.value
                                  })}
                                />
                                <p className="text-sm text-muted-foreground">
                                  Enter the code sent to your phone
                                </p>
                              </div>
                            )}
                            
                            {factor.type === 'webauthn' && verificationStep === 'setup' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="inline-block p-6 bg-blue-50 border border-blue-200 rounded-lg">
                                    <Shield className="w-16 h-16 mx-auto text-blue-600" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-3">
                                    Click "Enroll MFA Factor" to access additional authentication options
                                  </p>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> This will redirect you to Guardian where you can choose from available MFA factors like biometrics, security keys, or authenticator apps.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {factor.type === 'totp' && verificationStep === 'setup' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="inline-block p-6 bg-green-50 border border-green-200 rounded-lg">
                                    <Key className="w-16 h-16 mx-auto text-green-600" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-3">
                                    Click "Setup Authenticator App" to access the enrollment screen
                                  </p>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> You'll be redirected to Guardian where you can scan the QR code with your authenticator app.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {factor.type === 'totp-otp' && verificationStep === 'setup' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="inline-block p-6 bg-purple-50 border border-purple-200 rounded-lg">
                                    <QrCode className="w-16 h-16 mx-auto text-purple-600" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-3">
                                    Click "Setup Authenticator App" to get started
                                  </p>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> You'll be redirected to Guardian to scan a QR code with apps like Google Authenticator or Authy.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {factor.type === 'reset-mfa' && verificationStep === 'setup' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="inline-block p-6 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertTriangle className="w-16 h-16 mx-auto text-red-600" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-3">
                                    This will remove all MFA enrollments from your account
                                  </p>
                                </div>
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm text-red-800">
                                    <strong>Warning:</strong> This action cannot be undone. You will need to set up MFA again from scratch.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <DialogFooter>
                            {verificationStep === 'setup' ? (
                              <Button 
                                onClick={() => handleEnrollFactor(factor.type)}
                                disabled={loading || (factor.type === 'sms' && !enrollmentData.phoneNumber)}
                                variant={factor.type === 'reset-mfa' ? 'destructive' : 'default'}
                              >
                                {loading ? 'Processing...' : (
                                  factor.type === 'sms' ? 'Verify Phone via SMS' :
                                  factor.type === 'webauthn' ? 'Enroll MFA Factor' :
                                  factor.type === 'totp' ? 'Setup Guardian App' :
                                  factor.type === 'totp-otp' ? 'Setup Authenticator App' :
                                  factor.type === 'reset-mfa' ? 'Reset All MFA' :
                                  'Continue'
                                )}
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleVerifyFactor(factor.type)}
                                disabled={loading}
                              >
                                {loading ? 'Processing...' : 'Refresh Status'}
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                {factor !== factors[factors.length - 1] && <Separator />}
              </div>
            ))}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}