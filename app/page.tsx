'use client';
// export const dynamic = 'force-client';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    return (
      window.location.replace('/dashboard')
    );
  return (
    <>
    </>
  );
}
