import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  return id;
}
