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
import { Shield, Smartphone, Key, QrCode, Check, X, Mail, AlertTriangle } from 'lucide-react';

interface MFAEnrollment {
  id: string;
  status: 'confirmed' | 'pending';
  type: 'sms' | 'push-notification' | 'otp';
  name?: string;
  phone_number?: string;
}

interface MFAFactor {
  id: string;
  type: 'sms' | 'totp' | 'push';
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
      name: 'Authenticator App',
      description: 'Use apps like Google Authenticator or Authy'
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
        setFactors(prevFactors => 
          prevFactors.map(factor => {
            const enrollment = data.enrollments?.find((e: MFAEnrollment) => 
              (e.type === 'sms' && factor.type === 'sms') ||
              (e.type === 'otp' && factor.type === 'totp')
            );
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
      } else if (factorType === 'totp') {
        const response = await fetch('/api/mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'totp' })
        });

        if (response.ok) {
          const data = await response.json();
          let enrollmentUrl = data.ticket?.ticket_url || '';
          
          // Add enrollment hint for TOTP to direct user to authenticator app enrollment
          if (enrollmentUrl && !enrollmentUrl.includes('enrollment_hint')) {
            const separator = enrollmentUrl.includes('?') ? '&' : '?';
            enrollmentUrl += `${separator}enrollment_hint=totp`;
          }
          
          setEnrollmentData({
            ...enrollmentData,
            qrCode: enrollmentUrl,
            secret: 'Use QR code or follow enrollment URL'
          });
          setVerificationStep('verify');
        } else {
          const error = await response.json();
          toast({
            title: "Enrollment failed",
            description: error.details || "Failed to start TOTP enrollment",
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
      case 'totp': return <Key className="w-5 h-5" />;
      case 'push': return <Shield className="w-5 h-5" />;
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
                    {factor.enabled ? (
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
                            
                            {factor.type === 'totp' && verificationStep === 'setup' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="inline-block p-4 bg-white border rounded-lg">
                                    <QrCode className="w-32 h-32 mx-auto text-muted-foreground" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Scan this QR code with your authenticator app
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Manual Setup Key</Label>
                                  <Input 
                                    value={enrollmentData.secret} 
                                    readOnly 
                                    className="font-mono text-sm"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Use this key if you cannot scan the QR code
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {factor.type === 'totp' && verificationStep === 'verify' && (
                              <div className="space-y-2">
                                <Label htmlFor="totp-code">Verification Code</Label>
                                <Input
                                  id="totp-code"
                                  placeholder="Enter 6-digit code"
                                  value={enrollmentData.verificationCode}
                                  onChange={(e) => setEnrollmentData({
                                    ...enrollmentData,
                                    verificationCode: e.target.value
                                  })}
                                />
                                <p className="text-sm text-muted-foreground">
                                  Enter the code from your authenticator app
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <DialogFooter>
                            {verificationStep === 'setup' ? (
                              <Button 
                                onClick={() => handleEnrollFactor(factor.type)}
                                disabled={loading || (factor.type === 'sms' && !enrollmentData.phoneNumber)}
                              >
                                {loading ? 'Processing...' : (factor.type === 'sms' ? 'Verify Phone via SMS' : 'Continue')}
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