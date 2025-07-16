import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;
