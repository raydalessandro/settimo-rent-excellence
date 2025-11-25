'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/features/auth';
import { useNewLeadsCount } from '@/lib/features/admin';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users, showBadge: true },
  { label: 'Preventivi', href: '/admin/preventivi', icon: FileText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Impostazioni', href: '/admin/impostazioni', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const { data: newLeadsCount } = useNewLeadsCount();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-bold text-lg">Rent Excellence</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.showBadge && newLeadsCount && newLeadsCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
                  {newLeadsCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Esci
        </Button>
        <Link href="/" className="block mt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 text-sm"
          >
            ← Torna al sito
          </Button>
        </Link>
      </div>
    </aside>
  );
}


