import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Shield, Users, Truck, CreditCard, User } from 'lucide-react';
import { HeroButtons, CTAButton, FooterSignup } from '@/components/HomeClient';

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;

  const features = [
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Advanced security with Auth0 authentication and encrypted payment processing"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50. Same-day delivery available in select areas"
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "30-day hassle-free returns on all products with instant refunds"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our customer service team is always here to help with your questions"
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">ConsumerAuth</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Welcome, {user.name}!</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href="/api/auth/logout">Logout</a>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button asChild variant="ghost" size="sm">
                    <a href="/api/auth/login">Sign In</a>
                  </Button>
                  <CTAButton variant="default" size="sm" text="Join Now" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Shop with Confidence
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing products with secure authentication powered by Auth0.
            Your privacy and security are our top priorities.
          </p>
          <HeroButtons />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold tracking-tight mb-4">Why Choose ConsumerAuth?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern security standards and user experience in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-semibold">ConsumerAuth</h4>
              </div>
              <p className="text-muted-foreground">
                Secure ecommerce platform powered by Auth0 authentication
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Products</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Categories</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                {user ? (
                  <>
                    <li><Link href="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link></li>
                    <li><a href="/api/auth/logout" className="text-muted-foreground hover:text-foreground">Logout</a></li>
                  </>
                ) : (
                  <>
                    <li><a href="/api/auth/login" className="text-muted-foreground hover:text-foreground">Sign In</a></li>
                    <li><FooterSignup /></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 ConsumerAuth. All rights reserved. Powered by Auth0.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}