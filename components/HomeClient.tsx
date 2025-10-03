'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { SignupModal } from './SignupModal';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export function HeroButtons() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="px-8" disabled>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Loading...
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          Learn More
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {user ? (
        <Button size="lg" className="px-8" asChild>
          <Link href="/profile?tab=cart">
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart
          </Link>
        </Button>
      ) : (
        <SignupModal>
          <Button size="lg" className="px-8">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Start Shopping
          </Button>
        </SignupModal>
      )}
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
