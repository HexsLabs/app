import { useState } from 'react';
import { createUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface UserAuthProps {
  onUserCreated: (userId: number) => void;
}

export function UserAuth({ onUserCreated }: UserAuthProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid address',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);

    try {
      const response = await createUser(address);
      
      if (response.user) {
        toast({
          title: 'Success!',
          description: `User created with ID: ${response.user}`,
        });
        
        // Store user ID in local storage for persistence
        localStorage.setItem('userId', response.user.toString());
        
        // Notify parent component
        onUserCreated(response.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
      <h2 className="text-2xl font-semibold mb-6">Login / Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="address">Wallet Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your wallet address"
            className="mt-1"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Login / Register'}
        </Button>
      </form>
    </div>
  );
} 