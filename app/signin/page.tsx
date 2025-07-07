'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '../firebase/config';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      
      if (res) {
        setEmail('');
        setPassword('');
        // Redirect to dashboard after successful authentication
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      console.log({ res });
      
      if (res) {
        // Redirect to dashboard after successful Google sign in
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your study journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSignIn}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {(error || googleError) && (
            <div className={styles.errorMessage}>
              Error: {error?.message || googleError?.message}
            </div>
          )}

          <div className={styles.formOptions}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link href="#" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading || googleLoading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.socialButtons}>
          <button 
            className={styles.socialBtn}
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            <span>📧</span> {googleLoading ? 'Loading...' : 'Continue with Google'}
          </button>
          <button className={styles.socialBtn} disabled>
            <span>🔵</span> Continue with Facebook
          </button>
        </div>

        <div className={styles.footer}>
          <p>
            Don't have an account? {' '}
            <Link href="/signup" className={styles.authLink}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 