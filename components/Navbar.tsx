"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User, Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthSession } from "@/lib/auth/hooks/useAuthSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, displayName, signOut, isLoading, accessToken } =
    useAuthSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Check if we're in the app section to display the menu toggle
  const isAppSection = pathname?.startsWith("/app") ?? false;

  if (!mounted || isLoading) {
    return null;
  }

  return (
    <nav className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex justify-between h-16 items-center px-6 max-w-[129rem] mx-auto">
        <div className="flex items-center gap-3">
          {isAppSection && onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={onMobileMenuToggle}
            >
              <Menu size={20} />
            </Button>
          )}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-300"
          >
            Aquanode
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-secondary/80 backdrop-blur-md border-border/40"
              >
                <DropdownMenuLabel className="text-foreground/90">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2 opacity-70" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin">
              <Button
                variant="secondary"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              >
                <span className="hidden sm:inline">Sign In</span>
                <User className="w-4 h-4 sm:hidden" />
              </Button>
            </Link>
          )}
          {/* <ConnectButton.Custom>
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
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          variant="outline"
                          className="flex items-center gap-2 border-border/40 hover:border-primary/30 hover:bg-primary/5"
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
                        className="flex items-center gap-2 border-border/40 hover:border-primary/30 hover:bg-primary/5"
                      >
                        {chain.hasIcon && (
                          <div className="w-4 h-4">
                            {chain.iconUrl && (
                              <Image
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                        )}
                        <span>{account.displayName}</span>
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </Button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom> */}
        </div>
      </div>
    </nav>
  );
}
