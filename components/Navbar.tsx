"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex justify-between h-20 items-center px-4 max-w-[129rem] mx-auto">
        <div className="flex-shrink-0 pl-4">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Aquanode
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/app/dashboard">
            <Button variant="ghost" className="text-foreground">
              Launch App
            </Button>
          </Link>
          {mounted && (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                mounted: rainbowKitMounted,
              }) => {
                const ready = rainbowKitMounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      return (
                        <Button
                          onClick={openChainModal}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {chain.hasIcon && (
                            <div className="w-4 h-4">
                              {chain.iconUrl && (
                                <Image
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4"
                                />
                              )}
                            </div>
                          )}
                          <span>{account.displayName}</span>
                          {account.displayBalance ? ` (${account.displayBalance})` : ''}
                        </Button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
    </nav>
  );
} 