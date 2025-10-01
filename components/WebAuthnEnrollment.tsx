'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, Fingerprint } from 'lucide-react';

interface WebAuthnEnrollmentProps {
  user?: any;
}

export function WebAuthnEnrollment({ user }: WebAuthnEnrollmentProps = {}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleEnrollWebAuthn = async () => {
    setLoading(true);

    try {
      // Create MFA enrollment ticket
      console.log('Creating WebAuthn enrollment ticket...');
      const response = await fetch('/api/mfa-any-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'initiate'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to create enrollment ticket');
      }

      const data = await response.json();
      
      if (data.enrollmentUrl) {
        console.log('WebAuthn enrollment ticket created, redirecting to Guardian...');
        toast({
          title: "Redirecting to enrollment",
          description: "Taking you to complete WebAuthn enrollment...",
        });
        // Redirect to Guardian enrollment page
        window.location.href = data.enrollmentUrl;
      } else {
        throw new Error('No enrollment URL received from server');
      }

    } catch (error) {
      console.error('WebAuthn enrollment error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll WebAuthn';

      toast({
        title: "WebAuthn enrollment failed",
        description: errorMessage,
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
          <Shield className="w-5 h-5" />
          WebAuthn Biometric MFA
        </CardTitle>
        <CardDescription>
          Use biometric authentication or security keys as a multi-factor authentication method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* WebAuthn Enrollment Section */}
          <div className="p-4 border rounded-lg border-2 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Biometric MFA
                  </h4>
                  <p className="text-sm text-green-600">
                    Add biometric authentication as an MFA factor
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={handleEnrollWebAuthn}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating ticket...
                  </>
                ) : (
                  'Enroll WebAuthn'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}