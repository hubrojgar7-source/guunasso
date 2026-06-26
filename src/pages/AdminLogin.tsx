import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tractor, Wheat, Sprout } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (username === 'goverment' && password === 'Goverment@123') {
      const adminEmail = 'goverment@gunaso.com';
      
      try {
        // Try to login first
        try {
          const userCredential = await login(adminEmail, password);
          
          // Verify/Update admin role just in case
          const userRef = doc(db, 'users', userCredential.user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists() || userDoc.data().userType !== 'admin') {
             await setDoc(userRef, {
               displayName: 'Government Admin',
               email: adminEmail,
               photoURL: '/placeholder.svg',
               handle: '@gov_admin',
               userType: 'admin', // critical
               followers: [],
               following: [],
               followersCount: 0,
               followingCount: 0,
               updatedAt: new Date()
             }, { merge: true });
          }
          
          toast.success('Admin login successful!');
          navigate('/dashboard');
        } catch (loginError: any) {
          // If user doesn't exist, create it
          if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/invalid-credential') {
             try {
               await signup(adminEmail, password, 'admin' as any); // using any because signup typed to 'farmer'|'user'
               
               // Update userType manually to be sure
               import('@/lib/firebase').then(async ({ auth, db }) => {
                 if (auth.currentUser) {
                    await setDoc(doc(db, 'users', auth.currentUser.uid), {
                       displayName: 'Government Admin',
                       email: adminEmail,
                       photoURL: '/placeholder.svg',
                       handle: '@gov_admin',
                       userType: 'admin',
                       followers: [],
                       following: [],
                       followersCount: 0,
                       followingCount: 0,
                       createdAt: new Date(),
                       updatedAt: new Date()
                    }, { merge: true });
                 }
               });

               toast.success('Admin portal initialized and logged in!');
               navigate('/dashboard');
             } catch (signupError: any) {
               toast.error('Failed to initialize admin account: ' + signupError.message);
             }
          } else {
             toast.error('Login failed: ' + loginError.message);
          }
        }
      } catch (error: any) {
        toast.error('An error occurred during admin login.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Invalid admin credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center relative overflow-hidden shadow-md">
             <Tractor className="w-8 h-8 text-white absolute" />
             <Wheat className="w-5 h-5 text-white absolute bottom-1 right-1" />
             <Sprout className="w-4 h-4 text-white absolute top-1 right-1" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Government Portal</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Sign in to access administrative and civic polling tools.</p>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="h-12 bg-gray-50 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 bg-gray-50 border-gray-200"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
           <button onClick={() => navigate('/login')} className="text-sm text-gray-400 hover:text-gray-600">
             Return to standard login
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
