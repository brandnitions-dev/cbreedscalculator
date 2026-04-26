import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as Record<string, unknown> | undefined)?.role;
  if (!session?.user || role !== 'ADMIN') return null;
  return session;
}

