'use client';

import Link from 'next/link';
import styles from './auth.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Welcome to StudyTogether</h1>
          <p>Connect, learn, and grow with fellow students around the world</p>
        </div>

        <div className={styles.landingContent}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⏰</span>
              <h3>Study Timer</h3>
              <p>Stay focused with our Pomodoro timer</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎯</span>
              <h3>Goal Tracking</h3>
              <p>Set and achieve your study goals</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💬</span>
              <h3>Study Groups</h3>
              <p>Join chat rooms and study together</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏆</span>
              <h3>Leaderboards</h3>
              <p>Compete and stay motivated</p>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link href="/signup" className={styles.primaryBtn}>
              Get Started - Sign Up
            </Link>
            <Link href="/signin" className={styles.secondaryBtn}>
              Already have an account? Sign In
            </Link>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Join thousands of students already studying together!</p>
          <div className={styles.stats}>
            <span>📚 50k+ Study Sessions</span>
            <span>👥 10k+ Students</span>
            <span>🌍 100+ Countries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
