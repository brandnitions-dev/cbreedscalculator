import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminIngredientLibrary from './ingredient-library';

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as Record<string, unknown> | undefined)?.role;
  if (!session?.user) redirect('/login');
  if (role !== 'ADMIN') redirect('/');

  return (
    <div className="page-content">
      <AdminIngredientLibrary />
    </div>
  );
}
