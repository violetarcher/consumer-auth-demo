'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { SignupModal } from './SignupModal';

export function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <SignupModal>
        <Button size="lg" className="px-8">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Start Shopping
        </Button>
      </SignupModal>
      <Button variant="outline" size="lg" className="px-8">
        Learn More
      </Button>
    </div>
  );
}

interface CTAButtonProps {
  variant?: 'default' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  text?: string;
}

export function CTAButton({ variant = 'secondary', size = 'lg', text = 'Create Account' }: CTAButtonProps = {}) {
  return (
    <SignupModal>
      <Button size={size} variant={variant} className="px-8">
        {text}
      </Button>
    </SignupModal>
  );
}

export function FooterSignup() {
  return (
    <SignupModal>
      <span className="text-muted-foreground hover:text-foreground cursor-pointer">
        Create Account
      </span>
    </SignupModal>
  );
}
