import { getCurrentUser } from '@/lib/db';
import { redirect } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden bg-bg-dark">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-ghost opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <RegisterForm />
    </div>
  );
}
