import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="flex justify-between h-16 items-center px-4">
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Hexs
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/app/dashboard">
            <Button variant="ghost" className="text-foreground">
              Launch App
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
} 