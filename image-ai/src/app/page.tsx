import { auth } from '@/auth';
import { protectServer } from '@/features/auth/utils';

export default async function Home() {
  protectServer();
  
  return (
    <div>
     You are logged in
    </div>
  );
}
