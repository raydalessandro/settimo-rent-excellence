const fs = require('fs');
const path = require('path');

const content = `'use client';

import Link from 'next/link';
import { useAuth, useLogout } from '@/lib/features/auth';
import { useFavoritesCount } from '@/lib/features/user';
import { Button } from '@/components/ui/button';
import { Heart, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const { data: favoritesCount = 0 } = useFavoritesCount(user?.id || null);
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Rent4Business</span>
          <span className="text-sm text-muted-foreground">Excellence</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/offerte" className="text-sm font-medium transition-colors hover:text-primary">
            Offerte
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/preferiti" className="text-sm font-medium transition-colors hover:text-primary">
                Preferiti
              </Link>
              <Link href="/i-miei-preventivi" className="text-sm font-medium transition-colors hover:text-primary">
                I Miei Preventivi
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/preferiti" className="relative">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {favoritesCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button>Accedi</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
`;

const targetPath = path.join(__dirname, '..', 'components', 'layout', 'header.tsx');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('File written successfully to:', targetPath);


