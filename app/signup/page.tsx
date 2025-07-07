'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '../firebase/config';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      
      if (res) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        // Redirect to dashboard after successful registration
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const res = await signInWithGoogle();
      console.log({ res });
      
      if (res) {
        // Redirect to dashboard after successful Google sign up
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
          <h1>Join StudyTogether</h1>
          <p>Create your account and start studying with others</p>
        </div>

        <form className={styles.form} onSubmit={handleSignUp}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              placeholder="Enter your full name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <input type="checkbox" required />
              <span>I agree to the <Link href="#" className={styles.link}>Terms of Service</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link></span>
            </label>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading || googleLoading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.socialButtons}>
          <button 
            className={styles.socialBtn}
            onClick={handleGoogleSignUp}
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
            Already have an account? {' '}
            <Link href="/signin" className={styles.authLink}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 