'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

interface SignupModalProps {
  children?: React.ReactNode;
}

export function SignupModal({ children }: SignupModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    birthdate: '',
    loyaltyProgram: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields (First Name, Last Name, Email)",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Store signup data in session/cookie
      const response = await fetch('/api/signup-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();

        toast({
          title: "Information saved",
          description: "Redirecting to complete your registration...",
        });

        // Redirect to Auth0 signup with email hint
        const signupUrl = `/api/auth/signup?login_hint=${encodeURIComponent(formData.email)}&screen_hint=signup`;
        window.location.href = signupUrl;
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save signup data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Network error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="lg" className="px-8">
            <UserPlus className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create Your Account
            </DialogTitle>
            <DialogDescription>
              Tell us about yourself to get started. We'll use this information to personalize your experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="12345"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                id="loyaltyProgram"
                name="loyaltyProgram"
                type="checkbox"
                checked={formData.loyaltyProgram}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <Label htmlFor="loyaltyProgram" className="cursor-pointer font-normal">
                  Join our Loyalty Program
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get exclusive rewards, early access to sales, and special member-only discounts.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue to Sign Up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
