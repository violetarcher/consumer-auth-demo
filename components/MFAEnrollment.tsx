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
import { Shield, Smartphone, Key, QrCode, Check, X, Mail } from 'lucide-react';

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
  const [showVerificationErrorDialog, setShowVerificationErrorDialog] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState('');
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
        // No need to collect phone number upfront - Auth0 will handle it
        const response = await fetch('/api/mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'sms'
            // No phoneNumber needed - Auth0 enrollment page will collect it
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('MFA enrollment result:', result);
          
          // The ticket might be wrapped in a response object
          const ticketData = result.ticket?.data || result.ticket;
          console.log('Ticket data:', ticketData);
          
          if (ticketData?.ticket_url) {
            // Replace custom domain with canonical Auth0 domain
            const baseUrl = 'https://archfaktor.us.auth0.com';
            // Clean up any extra quotes and replace domain
            const cleanUrl = ticketData.ticket_url.replace(/"/g, '');
            let correctedUrl = cleanUrl.replace(/https:\/\/[^\/]+/, baseUrl);
            
            // For SMS, try different hint parameters to force SMS enrollment
            if (factorType === 'sms') {
              const separator = correctedUrl.includes('?') ? '&' : '?';
              // Try multiple hint approaches that might work
              correctedUrl += `${separator}method=sms&authenticator=sms&enrollment_hint=sms`;
            }
            
            console.log('Original ticket URL:', ticketData.ticket_url);
            console.log('Cleaned URL:', cleanUrl);
            console.log('Corrected ticket URL with hint:', correctedUrl);
            
            toast({
              title: "SMS Enrollment Started",
              description: "Opening Auth0 enrollment page. Please select 'SMS' from the available options to complete your phone verification.",
            });
            // Open enrollment URL in new tab
            window.open(correctedUrl, '_blank');
          } else if (ticketData?.ticket_id) {
            // Sometimes ticket comes with just ticket_id, construct URL
            // Use the issuer base URL from environment
            const baseUrl = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL || 'https://archfaktor.us.auth0.com';
            const enrollmentUrl = `${baseUrl}/guardian/enrollment?ticket=${ticketData.ticket_id}`;
            toast({
              title: "Enrollment ticket created",
              description: "Opening Auth0 MFA enrollment page. Complete the setup there.",
            });
            window.open(enrollmentUrl, '_blank');
          } else {
            toast({
              title: "Enrollment started", 
              description: result.message || "MFA enrollment initiated successfully.",
            });
            console.log('No ticket_url or ticket_id found, full ticket data:', ticketData);
          }
          
          // Close the modal and refresh enrollments
          setEnrollingFactor(null);
          setVerificationStep('setup');
          setEnrollmentData({ phoneNumber: '', verificationCode: '', qrCode: '', secret: '' });
          await fetchEnrollments();
        } else {
          const error = await response.json();
          toast({
            title: "Enrollment failed",
            description: error.details || error.error || "Failed to start SMS enrollment",
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
        setVerificationErrorMessage(error.error || "You must complete SMS phone verification enrollment in Auth0 first. Please enroll in SMS MFA and complete the verification process before attempting to verify your phone number.");
        setShowVerificationErrorDialog(true);
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

  const handleVerificationErrorAcknowledge = async () => {
    setShowVerificationErrorDialog(false);
    // Start SMS enrollment process directly - no phone number needed upfront
    setLoading(true);
    setEnrollingFactor('sms');
    setVerificationStep('setup');
    
    try {
      const response = await fetch('/api/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'sms'
          // No phone number needed - Auth0 will collect it
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('MFA enrollment result:', result);
        
        const ticketData = result.ticket?.data || result.ticket;
        console.log('Ticket data:', ticketData);
        
        if (ticketData?.ticket_url) {
          let correctedUrl = ticketData.ticket_url;
          
          // Use canonical domain
          if (correctedUrl.includes('login.consumerauth.com')) {
            correctedUrl = correctedUrl.replace('login.consumerauth.com', 'archfaktor.us.auth0.com');
          }
          
          // Add enrollment hints
          if (correctedUrl.includes('archfaktor.us.auth0.com')) {
            const separator = correctedUrl.includes('?') ? '&' : '?';
            correctedUrl += `${separator}method=sms&authenticator=sms&enrollment_hint=sms`;
          }
          
          // Mark enrollment as completed since user is actively going through the process
          await fetch('/api/user-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              sms_enrollment_completed: true,
              enrollment_completion_timestamp: new Date().toISOString()
            })
          });
          
          toast({
            title: "SMS Enrollment Started",
            description: "Opening Auth0 enrollment page. You'll enter your phone number there.",
          });
          window.open(correctedUrl, '_blank');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Enrollment failed",
          description: error.details || "Failed to start SMS enrollment",
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

            {/* Phone Verification Completion Section */}
            {user?.user_metadata?.pending_phone_number && user?.user_metadata?.phone_verification_status !== 'verified' && (
              <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-800">Complete Phone Verification</h4>
                      <p className="text-sm text-orange-600">
                        You've enrolled in SMS MFA but your phone ({user.user_metadata.pending_phone_number}) isn't verified yet.
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
            {factors.map((factor) => (
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
                                <p className="text-sm text-gray-600">
                                  You'll enter your phone number on the Auth0 enrollment page.
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
                                    Use this key if you can't scan the QR code
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
                                disabled={loading}
                              >
                                {loading ? 'Processing...' : (factor.type === 'sms' ? 'Start SMS Enrollment' : 'Continue')}
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

      {/* Verification Error Dialog */}
      <Dialog open={showVerificationErrorDialog} onOpenChange={setShowVerificationErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <Smartphone className="w-5 h-5" />
              SMS Enrollment Required
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {verificationErrorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowVerificationErrorDialog(false)}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleVerificationErrorAcknowledge}
              className="bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
            >
              Complete SMS Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}