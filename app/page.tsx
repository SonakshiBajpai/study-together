"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import StudyGoalsContent from "./goals/page";
import {
  Home,
  Users,
  Target,
  MessageSquare,
  BarChart2,
  Trophy,
  Volume2,
  VolumeX,
  Clock,
  Pause,
  Play,
  Plus,
  Check,
  Maximize,
  Image,
  X,
  Info,
  User,
  BookOpen,
  Leaf,
  CloudRain,
  Flame,
  Library,
  RefreshCw,
  Expand,
  Coffee,
  Menu,
} from "lucide-react";

//interfaces
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

interface ButtonProps {
  icon: React.ReactNode;
  label: string;
  time?: string;
  count?: string;
  active: boolean;
  onClick?: () => void;
}

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  tooltip?: string;
}

interface TimerCardProps {
  active: boolean;
  setActiveTab: (tab: string) => void;
  updateTimerToggle?: (toggleFn: () => void) => void;
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  timerMuted: boolean;
  setTimerMuted: React.Dispatch<React.SetStateAction<boolean>>;
  onTakeBreak: () => void;
}

interface GoalsCardProps {
  active: boolean;
  setActiveTab: (tab: string) => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  openGoals: number;
  setOpenGoals: React.Dispatch<React.SetStateAction<number>>;
  completedGoals: number;
  setCompletedGoals: React.Dispatch<React.SetStateAction<number>>;
}

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

interface MainContentProps {
  activeModal: string | null;
  toggleModal: (modalName: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startBreakTimer: () => void;
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
}

interface TopBarProps {
  toggleModal: (modalName: string) => void;
  activeModal: string | null;
  toggleFullscreen: () => void;
  timerState: TimerState;
  goalsCount: {
    open: number;
    completed: number;
  };
}

interface BackgroundProps {
  selectedBackground: string;
}

interface StatsModalProps {
  closeModal: () => void;
  totalStudyTime: number;
  goalsCount: {
    open: number;
    completed: number;
  };
}

interface BackgroundModalProps {
  closeModal: () => void;
  setSelectedBackground: (background: string) => void;
  selectedBackground: string;
}

interface BreakTimerModalProps {
  closeModal: () => void;
  breakTime: number;
}

interface BackgroundItem {
  id: string;
  category: string;
  thumbnail: string;
  name: string;
}

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

interface TimerState {
  time: number;
  isRunning: boolean;
  initialTime?: number;
}

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  studyTime: number;
  goals: number;
  streak: number;
  points: number;
  badge: string;
  level: string;
}

interface LeaderboardData {
  [category: string]: {
    [timeframe: string]: LeaderboardUser[];
  };
}

export default function StudyApp() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("timer");
  const [currentRoute, setCurrentRoute] = useState<string>("solostudy");
  const [breakTime, setBreakTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>({
    time: 3000,
    isRunning: false,
    initialTime: 3000,
  });
  const [wasTimerRunningBeforeBreak, setWasTimerRunningBeforeBreak] =
    useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigationEvent = (event: CustomEvent) => {
      setCurrentRoute(event.detail);
      setMobileNavOpen(false);
    };

    window.addEventListener('navigate-to-route', handleNavigationEvent as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-route', handleNavigationEvent as EventListener);
    };
  }, []);

  const toggleModal = (modalName: string) => {
    if (activeModal === modalName) {
      setActiveModal(null);
    } else {
      setActiveModal(modalName);
      setMobileNavOpen(false);
    }
  };

  const startBreakTimer = () => {
    setWasTimerRunningBeforeBreak(timerState.isRunning);
    setTimerState((prev) => ({ ...prev, isRunning: false }));
    setBreakTime(0);
    setActiveModal("break");

    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
    }

    breakIntervalRef.current = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);
  };

  const endBreakTimer = () => {
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
    }
    setActiveModal(null);
    if (wasTimerRunningBeforeBreak) {
      setTimerState((prev) => ({ ...prev, isRunning: true }));
    }
  };

  useEffect(() => {
    return () => {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="flex h-screen w-screen overflow-hidden relative text-gray-100 font-sans">
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-900/80 text-white backdrop-blur-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden md:block">
          <Sidebar
            currentRoute={currentRoute}
            setCurrentRoute={setCurrentRoute}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
        </div>

        <div
          className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 transition-transform duration-300 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                  />
                </svg>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-800 text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <MobileNavItem
                icon={<Home size={22} />}
                label="Dashboard"
                active={currentRoute === "dashboard"}
                onClick={() => {
                  setCurrentRoute("dashboard");
                  setMobileNavOpen(false);
                }}
              />
              <MobileNavItem
                icon={<Users size={22} />}
                label="Solo Study"
                active={currentRoute === "solostudy"}
                onClick={() => {
                  setCurrentRoute("solostudy");
                  setMobileNavOpen(false);
                }}
              />
              <MobileNavItem
                icon={<Target size={22} />}
                label="Study Goals"
                active={currentRoute === "studygoals"}
                onClick={() => {
                  setCurrentRoute("studygoals");
                  setMobileNavOpen(false);
                }}
              />
              <MobileNavItem
                icon={<MessageSquare size={22} />}
                label="Chat Rooms"
                active={currentRoute === "chatrooms"}
                onClick={() => {
                  setCurrentRoute("chatrooms");
                  setMobileNavOpen(false);
                }}
              />
              <MobileNavItem
                icon={<BarChart2 size={22} />}
                label="Study Stats"
                active={currentRoute === "studystats"}
                onClick={() => {
                  setCurrentRoute("studystats");
                  setMobileNavOpen(false);
                }}
              />
              <MobileNavItem
                icon={<Trophy size={22} />}
                label="Leaderboard"
                active={currentRoute === "leaderboard"}
                onClick={() => {
                  setCurrentRoute("leaderboard");
                  setMobileNavOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        {currentRoute === "solostudy" ? (
          <MainContent
            activeModal={activeModal}
            toggleModal={toggleModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            startBreakTimer={startBreakTimer}
            timerState={timerState}
            setTimerState={setTimerState}
          />
        ) : currentRoute === "studygoals" ? (
          <StudyGoalsContent />
        ) : (
          <PlaceholderContent route={currentRoute} />
        )}

        {activeModal === "break" && (
          <BreakTimerModal closeModal={endBreakTimer} breakTime={breakTime} />
        )}
      </div>
    </>
  );
}

// Mobile Nav Item
function MobileNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-center p-4 rounded-lg ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          : "bg-gray-800/50 text-gray-300"
      } cursor-pointer transition-all duration-300`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <div className="font-medium">{label}</div>
      {label === "Chat Rooms" && (
        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}

function PlaceholderContent({ route }: { route: string }) {
  if (route === "dashboard") {
    return <DashboardContent />;
  }
  
  if (route === "leaderboard") {
    return <LeaderboardContent />;
  }
  
  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
          #{route}
        </h1>
        <p className="text-gray-400">This page is under construction</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    studyTime: 127,
    goalsCompleted: 23,
    streak: 5,
    rank: 1842
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 relative overflow-hidden h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/originals/64/ff/aa/64ffaa8061d3643b563785e95f040705.gif"
          alt="Anime Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-purple-900/50 to-indigo-900/60"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-lg border-b border-pink-800/30 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {getGreeting()}, Dream! 🌸
              </h1>
              <p className="text-pink-200/80 mt-1 text-base">
                Ready to blossom into your best self today?
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-pink-200">
                {formatTime(currentTime)}
              </div>
              <div className="text-pink-300/80 text-sm">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Centered and Compact */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-4">
          <div className="max-w-5xl mx-auto text-center w-full">
            {/* Main Hero Message */}
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-4 leading-tight">
                Your Study Journey Awaits
              </h2>
              <p className="text-lg md:text-xl text-pink-100/90 max-w-2xl mx-auto leading-relaxed">
                Like cherry blossoms that bloom with patience and time, your goals flourish with consistent effort.
              </p>
            </div>

            {/* Compact Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-lg rounded-xl p-4 border border-pink-800/30 hover:border-pink-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-2xl font-bold text-pink-200">{stats.studyTime}h</div>
                <div className="text-pink-300/80 text-xs uppercase tracking-wide">Study Time</div>
                <div className="mt-1 text-xs text-pink-400">This month</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-xl p-4 border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-2xl font-bold text-purple-200">{stats.goalsCompleted}</div>
                <div className="text-purple-300/80 text-xs uppercase tracking-wide">Goals Done</div>
                <div className="mt-1 text-xs text-purple-400">Total completed</div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 backdrop-blur-lg rounded-xl p-4 border border-indigo-800/30 hover:border-indigo-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-2xl font-bold text-indigo-200">{stats.streak}</div>
                <div className="text-indigo-300/80 text-xs uppercase tracking-wide">Day Streak</div>
                <div className="mt-1 text-xs text-indigo-400">Keep it going!</div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 backdrop-blur-lg rounded-xl p-4 border border-cyan-800/30 hover:border-cyan-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-2xl font-bold text-cyan-200">#{stats.rank}</div>
                <div className="text-cyan-300/80 text-xs uppercase tracking-wide">Rank</div>
                <div className="mt-1 text-xs text-cyan-400">Global leaderboard</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate-to-route', { detail: 'solostudy' });
                  window.dispatchEvent(event);
                }}
                className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 rounded-full font-semibold text-white text-base transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play size={18} />
                  Start Study Session
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </button>
              
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate-to-route', { detail: 'studygoals' });
                  window.dispatchEvent(event);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 hover:border-white/50 rounded-full font-semibold text-white text-base transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Target size={18} />
                Review Goals
              </button>
            </div>

            {/* Compact Motivational Quote */}
            <div className="bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-lg rounded-xl p-6 border border-pink-800/30 max-w-xl mx-auto">
              <div className="text-lg font-light text-pink-100 italic mb-2">
                "Every expert was once a beginner."
              </div>
              <div className="text-pink-300/80 text-sm">
                — Robin Sharma
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Stats Bar */}
        <div className="bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-lg border-t border-pink-800/30 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-pink-200">785 users studying</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-300" />
                <span className="text-purple-200">Peak: 2-4 PM</span>
              </div>
            </div>
            <div className="text-indigo-200">
              Next reminder in 25 min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Weekly");
  const [selectedCategory, setSelectedCategory] = useState("Study Time");
  
  // Mock leaderboard data
  const leaderboardData: LeaderboardData = {
    "Study Time": {
      "Weekly": [
        { rank: 1, username: "StudyNinja", avatar: "🥷", studyTime: 47.5, goals: 28, streak: 12, points: 2847, badge: "🏆", level: "Expert" },
        { rank: 2, username: "FocusMaster", avatar: "🧠", studyTime: 45.2, goals: 25, streak: 9, points: 2652, badge: "🥈", level: "Expert" },
        { rank: 3, username: "BookWorm", avatar: "📚", studyTime: 42.8, goals: 31, streak: 15, points: 2438, badge: "🥉", level: "Expert" },
        { rank: 4, username: "ZenLearner", avatar: "🧘", studyTime: 40.1, goals: 22, streak: 7, points: 2301, badge: "⭐", level: "Advanced" },
        { rank: 5, username: "CramQueen", avatar: "👑", studyTime: 38.7, goals: 29, streak: 11, points: 2189, badge: "⭐", level: "Advanced" },
        { rank: 6, username: "DeepThinker", avatar: "💭", studyTime: 36.3, goals: 19, streak: 5, points: 2087, badge: "⭐", level: "Advanced" },
        { rank: 7, username: "FlashCardHero", avatar: "⚡", studyTime: 34.9, goals: 26, streak: 8, points: 1954, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "StudyBuddy", avatar: "🤝", studyTime: 32.5, goals: 17, streak: 4, points: 1823, badge: "⭐", level: "Intermediate" },
        { rank: 9, username: "NightOwl", avatar: "🦉", studyTime: 30.2, goals: 21, streak: 6, points: 1697, badge: "⭐", level: "Intermediate" },
        { rank: 10, username: "EarlyBird", avatar: "🐦", studyTime: 28.8, goals: 24, streak: 10, points: 1589, badge: "⭐", level: "Intermediate" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 12.7, goals: 8, streak: 2, points: 542, badge: "🔰", level: "Beginner" }
      ],
      "Monthly": [
        { rank: 1, username: "StudyNinja", avatar: "🥷", studyTime: 189.3, goals: 112, streak: 28, points: 11847, badge: "🏆", level: "Expert" },
        { rank: 2, username: "BookWorm", avatar: "📚", studyTime: 176.5, goals: 124, streak: 31, points: 10952, badge: "🥈", level: "Expert" },
        { rank: 3, username: "FocusMaster", avatar: "🧠", studyTime: 171.8, goals: 98, streak: 22, points: 10438, badge: "🥉", level: "Expert" },
        { rank: 4, username: "CramQueen", avatar: "👑", studyTime: 158.2, goals: 116, streak: 25, points: 9789, badge: "⭐", level: "Expert" },
        { rank: 5, username: "ZenLearner", avatar: "🧘", studyTime: 152.7, goals: 89, streak: 18, points: 9301, badge: "⭐", level: "Advanced" },
        { rank: 6, username: "FlashCardHero", avatar: "⚡", studyTime: 147.1, goals: 104, streak: 21, points: 8954, badge: "⭐", level: "Advanced" },
        { rank: 7, username: "DeepThinker", avatar: "💭", studyTime: 142.8, goals: 76, streak: 14, points: 8687, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "NightOwl", avatar: "🦉", studyTime: 138.9, goals: 93, streak: 19, points: 8423, badge: "⭐", level: "Advanced" },
        { rank: 9, username: "StudyBuddy", avatar: "🤝", studyTime: 134.2, goals: 81, streak: 12, points: 8089, badge: "⭐", level: "Intermediate" },
        { rank: 10, username: "EarlyBird", avatar: "🐦", studyTime: 129.7, goals: 88, streak: 23, points: 7854, badge: "⭐", level: "Intermediate" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 48.3, goals: 23, streak: 5, points: 2342, badge: "🔰", level: "Beginner" }
      ]
    },
    "Goals Completed": {
      "Weekly": [
        { rank: 1, username: "BookWorm", avatar: "📚", studyTime: 42.8, goals: 31, streak: 15, points: 2438, badge: "🏆", level: "Expert" },
        { rank: 2, username: "CramQueen", avatar: "👑", studyTime: 38.7, goals: 29, streak: 11, points: 2189, badge: "🥈", level: "Advanced" },
        { rank: 3, username: "StudyNinja", avatar: "🥷", studyTime: 47.5, goals: 28, streak: 12, points: 2847, badge: "🥉", level: "Expert" },
        { rank: 4, username: "FlashCardHero", avatar: "⚡", studyTime: 34.9, goals: 26, streak: 8, points: 1954, badge: "⭐", level: "Advanced" },
        { rank: 5, username: "FocusMaster", avatar: "🧠", studyTime: 45.2, goals: 25, streak: 9, points: 2652, badge: "⭐", level: "Expert" },
        { rank: 6, username: "EarlyBird", avatar: "🐦", studyTime: 28.8, goals: 24, streak: 10, points: 1589, badge: "⭐", level: "Intermediate" },
        { rank: 7, username: "ZenLearner", avatar: "🧘", studyTime: 40.1, goals: 22, streak: 7, points: 2301, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "NightOwl", avatar: "🦉", studyTime: 30.2, goals: 21, streak: 6, points: 1697, badge: "⭐", level: "Intermediate" },
        { rank: 9, username: "DeepThinker", avatar: "💭", studyTime: 36.3, goals: 19, streak: 5, points: 2087, badge: "⭐", level: "Advanced" },
        { rank: 10, username: "StudyBuddy", avatar: "🤝", studyTime: 32.5, goals: 17, streak: 4, points: 1823, badge: "⭐", level: "Intermediate" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 12.7, goals: 8, streak: 2, points: 542, badge: "🔰", level: "Beginner" }
      ],
      "Monthly": [
        { rank: 1, username: "BookWorm", avatar: "📚", studyTime: 176.5, goals: 124, streak: 31, points: 10952, badge: "🏆", level: "Expert" },
        { rank: 2, username: "CramQueen", avatar: "👑", studyTime: 158.2, goals: 116, streak: 25, points: 9789, badge: "🥈", level: "Expert" },
        { rank: 3, username: "StudyNinja", avatar: "🥷", studyTime: 189.3, goals: 112, streak: 28, points: 11847, badge: "🥉", level: "Expert" },
        { rank: 4, username: "FlashCardHero", avatar: "⚡", studyTime: 147.1, goals: 104, streak: 21, points: 8954, badge: "⭐", level: "Advanced" },
        { rank: 5, username: "FocusMaster", avatar: "🧠", studyTime: 171.8, goals: 98, streak: 22, points: 10438, badge: "⭐", level: "Expert" },
        { rank: 6, username: "NightOwl", avatar: "🦉", studyTime: 138.9, goals: 93, streak: 19, points: 8423, badge: "⭐", level: "Advanced" },
        { rank: 7, username: "ZenLearner", avatar: "🧘", studyTime: 152.7, goals: 89, streak: 18, points: 9301, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "EarlyBird", avatar: "🐦", studyTime: 129.7, goals: 88, streak: 23, points: 7854, badge: "⭐", level: "Intermediate" },
        { rank: 9, username: "StudyBuddy", avatar: "🤝", studyTime: 134.2, goals: 81, streak: 12, points: 8089, badge: "⭐", level: "Intermediate" },
        { rank: 10, username: "DeepThinker", avatar: "💭", studyTime: 142.8, goals: 76, streak: 14, points: 8687, badge: "⭐", level: "Advanced" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 48.3, goals: 23, streak: 5, points: 2342, badge: "🔰", level: "Beginner" }
      ]
    },
    "Study Streak": {
      "Weekly": [
        { rank: 1, username: "BookWorm", avatar: "📚", studyTime: 42.8, goals: 31, streak: 15, points: 2438, badge: "🏆", level: "Expert" },
        { rank: 2, username: "StudyNinja", avatar: "🥷", studyTime: 47.5, goals: 28, streak: 12, points: 2847, badge: "🥈", level: "Expert" },
        { rank: 3, username: "CramQueen", avatar: "👑", studyTime: 38.7, goals: 29, streak: 11, points: 2189, badge: "🥉", level: "Advanced" },
        { rank: 4, username: "EarlyBird", avatar: "🐦", studyTime: 28.8, goals: 24, streak: 10, points: 1589, badge: "⭐", level: "Intermediate" },
        { rank: 5, username: "FocusMaster", avatar: "🧠", studyTime: 45.2, goals: 25, streak: 9, points: 2652, badge: "⭐", level: "Expert" },
        { rank: 6, username: "FlashCardHero", avatar: "⚡", studyTime: 34.9, goals: 26, streak: 8, points: 1954, badge: "⭐", level: "Advanced" },
        { rank: 7, username: "ZenLearner", avatar: "🧘", studyTime: 40.1, goals: 22, streak: 7, points: 2301, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "NightOwl", avatar: "🦉", studyTime: 30.2, goals: 21, streak: 6, points: 1697, badge: "⭐", level: "Intermediate" },
        { rank: 9, username: "DeepThinker", avatar: "💭", studyTime: 36.3, goals: 19, streak: 5, points: 2087, badge: "⭐", level: "Advanced" },
        { rank: 10, username: "StudyBuddy", avatar: "🤝", studyTime: 32.5, goals: 17, streak: 4, points: 1823, badge: "⭐", level: "Intermediate" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 12.7, goals: 8, streak: 2, points: 542, badge: "🔰", level: "Beginner" }
      ],
      "Monthly": [
        { rank: 1, username: "BookWorm", avatar: "📚", studyTime: 176.5, goals: 124, streak: 31, points: 10952, badge: "🏆", level: "Expert" },
        { rank: 2, username: "StudyNinja", avatar: "🥷", studyTime: 189.3, goals: 112, streak: 28, points: 11847, badge: "🥈", level: "Expert" },
        { rank: 3, username: "CramQueen", avatar: "👑", studyTime: 158.2, goals: 116, streak: 25, points: 9789, badge: "🥉", level: "Expert" },
        { rank: 4, username: "EarlyBird", avatar: "🐦", studyTime: 129.7, goals: 88, streak: 23, points: 7854, badge: "⭐", level: "Intermediate" },
        { rank: 5, username: "FocusMaster", avatar: "🧠", studyTime: 171.8, goals: 98, streak: 22, points: 10438, badge: "⭐", level: "Expert" },
        { rank: 6, username: "FlashCardHero", avatar: "⚡", studyTime: 147.1, goals: 104, streak: 21, points: 8954, badge: "⭐", level: "Advanced" },
        { rank: 7, username: "NightOwl", avatar: "🦉", studyTime: 138.9, goals: 93, streak: 19, points: 8423, badge: "⭐", level: "Advanced" },
        { rank: 8, username: "ZenLearner", avatar: "🧘", studyTime: 152.7, goals: 89, streak: 18, points: 9301, badge: "⭐", level: "Advanced" },
        { rank: 9, username: "DeepThinker", avatar: "💭", studyTime: 142.8, goals: 76, streak: 14, points: 8687, badge: "⭐", level: "Advanced" },
        { rank: 10, username: "StudyBuddy", avatar: "🤝", studyTime: 134.2, goals: 81, streak: 12, points: 8089, badge: "⭐", level: "Intermediate" },
        { rank: 1842, username: "You", avatar: "😊", studyTime: 48.3, goals: 23, streak: 5, points: 2342, badge: "🔰", level: "Beginner" }
      ]
    }
  };

  const currentData = leaderboardData[selectedCategory]?.[selectedTimeframe] || [];
  const userRank = currentData.find(user => user.username === "You");
  const topUsers = currentData.filter(user => user.username !== "You").slice(0, 10);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-amber-600 to-amber-800";
    return "from-indigo-400 to-purple-600";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "from-red-500 to-pink-600";
      case "Advanced": return "from-purple-500 to-indigo-600";
      case "Intermediate": return "from-blue-500 to-cyan-600";
      case "Beginner": return "from-green-500 to-emerald-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="flex-1 bg-gray-900 overflow-hidden h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-lg border-b border-indigo-800/30 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-purple-300 to-pink-300 bg-clip-text text-transparent flex items-center gap-2">
                <Trophy size={28} className="text-yellow-400" />
                Leaderboard
              </h1>
              <p className="text-indigo-200/80 mt-1">
                Compete with fellow students and climb the ranks!
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 bg-gray-800/80 border border-indigo-700/50 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="Weekly">This Week</option>
                <option value="Monthly">This Month</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800/80 border border-indigo-700/50 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="Study Time">Study Time</option>
                <option value="Goals Completed">Goals Completed</option>
                <option value="Study Streak">Study Streak</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Top 3 Podium */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-6 text-center">🏆 Top Champions 🏆</h2>
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {topUsers.slice(0, 3).map((user, index) => {
                const actualRank = index + 1;
                const podiumOrder = [1, 0, 2]; // Second place (index 1), First place (index 0), Third place (index 2)
                const height = actualRank === 1 ? "h-32" : actualRank === 2 ? "h-28" : "h-24";
                
                return (
                  <div key={user.username} className={`flex flex-col items-center ${actualRank === 1 ? 'order-2' : actualRank === 2 ? 'order-1' : 'order-3'}`}>
                    <div className={`bg-gradient-to-br ${getRankColor(actualRank)} rounded-full p-1 mb-3 shadow-lg`}>
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                    </div>
                    <div className={`bg-gradient-to-t ${getRankColor(actualRank)} ${height} w-20 rounded-t-lg flex flex-col items-center justify-start pt-2 shadow-lg`}>
                      <div className="text-white font-bold text-2xl">{user.badge}</div>
                      <div className="text-white text-xs font-bold mt-1">#{actualRank}</div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-bold text-white text-sm">{user.username}</div>
                      <div className="text-xs text-gray-300">
                        {selectedCategory === "Study Time" ? `${user.studyTime}h` : 
                         selectedCategory === "Goals Completed" ? `${user.goals} goals` : 
                         `${user.streak} days`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <BarChart2 size={18} className="text-indigo-400" />
                    Rankings - {selectedCategory} ({selectedTimeframe})
                  </h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {topUsers.map((user) => (
                    <div key={user.username} className="flex items-center p-4 border-b border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(user.rank)} flex items-center justify-center text-white font-bold text-sm mr-4 shadow-md`}>
                        {user.rank}
                      </div>
                      
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-lg mr-4 shadow-md">
                        {user.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{user.username}</span>
                          <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getLevelColor(user.level)} text-white shadow-sm`}>
                            {user.level}
                          </span>
                          <span className="text-lg">{user.badge}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.studyTime}h studied • {user.goals} goals • {user.streak} day streak
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-indigo-300">
                          {selectedCategory === "Study Time" ? `${user.studyTime}h` : 
                           selectedCategory === "Goals Completed" ? user.goals : 
                           `${user.streak} days`}
                        </div>
                        <div className="text-sm text-gray-400">{user.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Rank */}
              {userRank && (
                <div className="mt-4 bg-gradient-to-r from-indigo-800/60 to-purple-800/60 backdrop-blur-lg rounded-xl border border-indigo-600/50 p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-4">
                      {userRank.rank}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-lg mr-4">
                      {userRank.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{userRank.username} (You)</span>
                        <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getLevelColor(userRank.level)} text-white`}>
                          {userRank.level}
                        </span>
                        <span className="text-lg">{userRank.badge}</span>
                      </div>
                      <div className="text-sm text-indigo-200">
                        {userRank.studyTime}h studied • {userRank.goals} goals • {userRank.streak} day streak
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-indigo-300">
                        {selectedCategory === "Study Time" ? `${userRank.studyTime}h` : 
                         selectedCategory === "Goals Completed" ? userRank.goals : 
                         `${userRank.streak} days`}
                      </div>
                      <div className="text-sm text-indigo-300">{userRank.points} pts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Side Stats */}
            <div className="space-y-6">
              {/* Competition Stats */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Flame size={18} className="text-orange-400" />
                  Competition Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Participants</span>
                    <span className="font-bold text-white">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active This Week</span>
                    <span className="font-bold text-emerald-400">1,923</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Study Time</span>
                    <span className="font-bold text-indigo-400">18.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Top Streak</span>
                    <span className="font-bold text-yellow-400">47 days</span>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <User size={18} className="text-purple-400" />
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Current Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getLevelColor("Beginner")} text-white`}>
                        Beginner
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">12h more to reach Intermediate</div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3">
                    <div className="text-sm text-gray-300 mb-2">Points to next rank:</div>
                    <div className="text-2xl font-bold text-indigo-400">58 pts</div>
                    <div className="text-xs text-gray-400">Complete 3 more goals this week!</div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-400" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className="text-sm font-medium text-white">First Streak</div>
                      <div className="text-xs text-gray-400">Complete 2 days in a row</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg">
                    <span className="text-2xl">📚</span>
                    <div>
                      <div className="text-sm font-medium text-white">Goal Crusher</div>
                      <div className="text-xs text-gray-400">Complete 5 goals</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-700/20 rounded-lg opacity-50">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <div className="text-sm font-medium text-gray-400">Time Master</div>
                      <div className="text-xs text-gray-500">Study for 25 hours (13h left)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  currentRoute,
  setCurrentRoute,
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <div
      className={`$${
        sidebarCollapsed ? "w-12" : "w-20"
      } bg-gray-900 bg-opacity-90 h-full flex flex-col items-center py-6 z-10 shadow-xl backdrop-blur-md border-r border-gray-800 transition-all duration-300`}
    >
      <div className="w-12 h-12 mb-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          />
        </svg>
      </div>

      <NavItem
        icon={<Home size={22} />}
        label="Dashboard"
        active={currentRoute === "dashboard"}
        onClick={() => setCurrentRoute("dashboard")}
        collapsed={sidebarCollapsed}
      />
      <NavItem
        icon={<Users size={22} />}
        label="Solo Study"
        active={currentRoute === "solostudy"}
        onClick={() => setCurrentRoute("solostudy")}
        collapsed={sidebarCollapsed}
      />
      <NavItem
        icon={<Target size={22} />}
        label="Study Goals"
        active={currentRoute === "studygoals"}
        onClick={() => setCurrentRoute("studygoals")}
        collapsed={sidebarCollapsed}
      />
      <NavItem
        icon={<MessageSquare size={22} />}
        label="Chat Rooms"
        active={currentRoute === "chatrooms"}
        onClick={() => setCurrentRoute("chatrooms")}
        collapsed={sidebarCollapsed}
      />
      <NavItem
        icon={<BarChart2 size={22} />}
        label="Study Stats"
        active={currentRoute === "studystats"}
        onClick={() => setCurrentRoute("studystats")}
        collapsed={sidebarCollapsed}
      />
      <NavItem
        icon={<Trophy size={22} />}
        label="Leaderboard"
        active={currentRoute === "leaderboard"}
        onClick={() => setCurrentRoute("leaderboard")}
        collapsed={sidebarCollapsed}
      />
      <div className="mt-auto mb-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-4 relative ${
        active ? "text-white" : "text-gray-500"
      } cursor-pointer hover:text-gray-300 transition-all duration-300 group`}
      onClick={onClick}
    >
      {active && (
        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-md"></div>
      )}
      <div className="mb-1 transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      {!collapsed && <div className="text-xs font-medium">{label}</div>}
      {label === "Chat Rooms" && !collapsed && (
        <div className="absolute top-3 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}

function MainContent({
  activeModal,
  toggleModal,
  activeTab,
  setActiveTab,
  startBreakTimer,
  timerState,
  setTimerState,
}: MainContentProps) {
  const [selectedBackground, setSelectedBackground] = useState("anime-night");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [timerMuted, setTimerMuted] = useState(false);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, text: "Clean my desk before study session", completed: true },
  ]);
  const [openGoals, setOpenGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(1);

  const timerToggleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!activeModal && e.code === "Space") {
        e.preventDefault();
        timerToggleRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeModal]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let studyTimeInterval: NodeJS.Timeout | null = null;

    if (timerState.isRunning) {
      studyTimeInterval = setInterval(() => {
        setTotalStudyTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (studyTimeInterval) {
        clearInterval(studyTimeInterval);
      }
    };
  }, [timerState.isRunning]);

  const updateTimerToggle = (toggleFn: () => void) => {
    timerToggleRef.current = toggleFn;
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <Background selectedBackground={selectedBackground} />
      <TopBar
        toggleModal={toggleModal}
        activeModal={activeModal}
        toggleFullscreen={toggleFullscreen}
        timerState={timerState}
        goalsCount={{ open: openGoals, completed: completedGoals }}
      />

      <div className="absolute md:top-32 top-24 left-4 right-4 md:left-8 md:right-8 z-20 flex flex-col md:flex-row items-center md:justify-between gap-5">
        <TimerCard
          active={activeTab === "timer"}
          setActiveTab={setActiveTab}
          updateTimerToggle={updateTimerToggle}
          timerState={timerState}
          setTimerState={setTimerState}
          timerMuted={timerMuted}
          setTimerMuted={setTimerMuted}
          onTakeBreak={startBreakTimer}
        />
        <GoalsCard
          active={activeTab === "goals"}
          setActiveTab={setActiveTab}
          goals={goals}
          setGoals={setGoals}
          openGoals={openGoals}
          setOpenGoals={setOpenGoals}
          completedGoals={completedGoals}
          setCompletedGoals={setCompletedGoals}
        />
      </div>

      <BottomBar />

      {/* Modals */}
      {activeModal === "stats" && (
        <StatsModal
          closeModal={() => toggleModal("stats")}
          totalStudyTime={totalStudyTime}
          goalsCount={{ open: openGoals, completed: completedGoals }}
        />
      )}

      {activeModal === "background" && (
        <BackgroundModal
          closeModal={() => toggleModal("background")}
          setSelectedBackground={setSelectedBackground}
          selectedBackground={selectedBackground}
        />
      )}
    </div>
  );
}

function Background({ selectedBackground }: BackgroundProps) {
  interface BackgroundTypes {
    [key: string]: {
      url: string;
      description: string;
      overlay?: string;
    };
  }

  const backgrounds: BackgroundTypes = {
    "anime-night": {
      url: "https://images.unsplash.com/photo-1613487957484-32c977a8bd62?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Japanese street with cherry blossoms",
      overlay: "bg-gradient-to-t from-purple-900/20 to-indigo-900/20",
    },
    "anime-room": {
      url: "https://images.unsplash.com/photo-1693034433366-57fbb0286641?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Cozy anime style bedroom",
      overlay: "bg-gradient-to-t from-amber-900/20 to-blue-900/20",
    },
    library: {
      url: "https://images.unsplash.com/photo-1729932989176-6d905172c123?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Cozy library interior",
      overlay: "bg-gradient-to-t from-amber-900/20 to-gray-900/20",
    },
    nature: {
      url: "https://images.unsplash.com/photo-1556066138-cfac27159329?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Cherry blossom landscape",
      overlay: "bg-gradient-to-t from-pink-900/20 to-sky-900/20",
    },
    cafe: {
      url: "https://images.unsplash.com/photo-1731758832047-8363e8eed735?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Anime style street café",
      overlay: "bg-gradient-to-t from-orange-900/20 to-teal-900/20",
    },
    city: {
      url: "https://images.unsplash.com/photo-1580920459139-68dcb30f70fe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Anime city skyline",
      overlay: "bg-gradient-to-t from-blue-900/20 to-gray-900/20",
    },
    forest: {
      url: "https://images.unsplash.com/photo-1580484094517-4e9aad23e673?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Anime forest scene",
      overlay: "bg-gradient-to-t from-green-900/20 to-emerald-900/20",
    },
    space: {
      url: "https://images.unsplash.com/photo-1616403503565-de3e91c7d0f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Space scene",
      overlay: "bg-gradient-to-t from-indigo-900/20 to-violet-900/20",
    },
  };

  const bg = selectedBackground
    ? backgrounds[selectedBackground]
    : backgrounds["anime-night"];

  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: `url('${bg.url}')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      {bg.overlay && (
        <div className={`absolute inset-0 ${bg.overlay} opacity-60`}></div>
      )}
    </div>
  );
}

function TopBar({
  toggleModal,
  activeModal,
  toggleFullscreen,
  timerState,
  goalsCount,
}: TopBarProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-4 md:top-8 right-4 md:right-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 z-20">
      <div className="hidden md:flex space-x-3">
        <Button
          icon={<Clock size={16} />}
          label="Personal timer"
          time={formatTime(timerState.time)}
          active={timerState.isRunning}
          onClick={() => {}}
        />
        <Button
          icon={<Target size={16} />}
          label="Session goals"
          count={`${goalsCount.completed}/${
            goalsCount.open + goalsCount.completed
          }`}
          active={false}
          onClick={() => {}}
        />
      </div>
      <div className="flex space-x-2 justify-end">
        <IconButton
          icon={<Image size={20} />}
          active={activeModal === "background"}
          onClick={() => toggleModal("background")}
          tooltip="Background"
        />
        <IconButton
          icon={<BarChart2 size={20} />}
          active={activeModal === "stats"}
          onClick={() => toggleModal("stats")}
          tooltip="Stats"
        />
        <IconButton
          icon={<Expand size={20} />}
          onClick={toggleFullscreen}
          active={false}
          tooltip="Fullscreen"
        />
      </div>
    </div>
  );
}

function Button({ icon, label, time, count, active, onClick }: ButtonProps) {
  return (
    <div
      className={`flex items-center px-4 py-2 rounded-md ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
          : "bg-gray-900/80 text-white"
      } backdrop-blur-lg cursor-pointer hover:bg-opacity-100 transition-all duration-300`}
      onClick={onClick}
    >
      <div className="mr-2">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
      {time && <div className="ml-2 text-sm font-mono">{time}</div>}
      {count && <div className="ml-2 text-sm font-mono">{count}</div>}
    </div>
  );
}

function IconButton({
  icon,
  onClick,
  active = false,
  tooltip,
}: IconButtonProps) {
  return (
    <div className="relative group">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-md ${
          active
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-900/30"
            : "bg-gray-900/80 hover:bg-gray-800"
        } text-white cursor-pointer transition-all duration-300 backdrop-blur-lg transform group-hover:scale-105`}
        onClick={onClick}
      >
        {icon}
      </div>
      {tooltip && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function TimerCard({
  active,
  setActiveTab,
  updateTimerToggle,
  timerState,
  setTimerState,
  timerMuted,
  setTimerMuted,
  onTakeBreak,
}: TimerCardProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
    );
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          if (prev.time <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            if (!timerMuted && audioRef.current) {
              audioRef.current
                .play()
                .catch((e) => console.error("Error playing timer sound:", e));
            }
            return { ...prev, isRunning: false };
          }
          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerMuted]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  useEffect(() => {
    if (updateTimerToggle) {
      updateTimerToggle(toggleTimer);
    }
  }, [updateTimerToggle]);

  const resetTimer = () => {
    setTimerState((prev) => ({
      time: prev.initialTime || 3000,
      isRunning: false,
      initialTime: prev.initialTime || 3000,
    }));

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setCustomTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerState({
      time: seconds,
      isRunning: false,
      initialTime: seconds,
    });
    setShowTimerSettings(false);
  };

  const toggleMute = () => {
    setTimerMuted(!timerMuted);

    if (!timerMuted && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (active) {
      setActiveTab("timer");
    }
  }, [active, setActiveTab]);

  return (
    <div className="w-full md:w-80 bg-gray-900/80 backdrop-blur-lg rounded-xl p-5 text-white shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-800 hover:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock size={18} className="mr-2 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide">
            Personal timer
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            onClick={() => setShowTimerSettings(!showTimerSettings)}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div
            onClick={toggleMute}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
          >
            {timerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </div>
        </div>
      </div>

      {showTimerSettings && (
        <div className="mb-4 bg-gray-800/80 p-3 rounded-lg animate-fadeIn">
          <div className="text-sm mb-2 text-gray-300">Timer duration:</div>
          <div className="grid grid-cols-3 gap-2">
            {[25, 30, 45, 50, 60, 90].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setCustomTimer(minutes)}
                className={`py-1.5 rounded text-sm ${
                  (timerState.initialTime || 3000) === minutes * 60
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "bg-gray-700 hover:bg-gray-600"
                } transition-colors duration-200`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center py-6">
        <div className="text-5xl font-mono font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {formatTime(timerState.time)}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-2">
        <button
          className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg hover:shadow-purple-900/20 transform hover:scale-105"
          onClick={resetTimer}
        >
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </button>
        <button
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transform hover:scale-105 ${
            timerState.isRunning
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-900/30"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-900/30"
          }`}
          onClick={toggleTimer}
        >
          {timerState.isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      <button
        onClick={onTakeBreak}
        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg flex items-center justify-center"
      >
        <Coffee size={16} className="mr-2" />
        Take a Break
      </button>

      <div className="text-xs text-gray-400 text-center mt-4 bg-gray-800/60 py-1.5 rounded-md">
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs font-semibold shadow-inner">
          space
        </kbd>{" "}
        to {timerState.isRunning ? "pause" : "start"}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

function GoalsCard({
  active,
  setActiveTab,
  goals,
  setGoals,
  openGoals,
  setOpenGoals,
  completedGoals,
  setCompletedGoals,
}: GoalsCardProps) {
  const [newGoal, setNewGoal] = useState("");

  const addGoal = () => {
    if (newGoal.trim() !== "") {
      const goal: Goal = {
        id: Date.now(),
        text: newGoal,
        completed: false,
      };
      setGoals([...goals, goal]);
      setNewGoal("");
      setOpenGoals(openGoals + 1);
    }
  };

  const toggleGoal = (id: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const newCompleted = !goal.completed;
        if (newCompleted) {
          setOpenGoals(openGoals - 1);
          setCompletedGoals(completedGoals + 1);
        } else {
          setOpenGoals(openGoals + 1);
          setCompletedGoals(completedGoals - 1);
        }
        return { ...goal, completed: newCompleted };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  useEffect(() => {
    if (active) {
      setActiveTab("goals");
    }
  }, [active, setActiveTab]);

  return (
    <div className="w-full md:w-80 bg-gray-900/80 backdrop-blur-lg rounded-xl p-5 text-white shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-800 hover:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target size={18} className="mr-2 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide">
            Session goals
          </span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center bg-gray-800/80 rounded-lg overflow-hidden shadow-inner">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            placeholder="Add a new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addGoal()}
          />
          <button
            className="w-12 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            onClick={addGoal}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 flex flex-col items-center py-2 bg-gray-800/60 rounded-l-lg">
          <div className="text-2xl text-indigo-400 font-bold">{openGoals}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Open
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center py-2 bg-gray-800/60 rounded-r-lg">
          <div className="text-2xl text-emerald-400 font-bold">
            {completedGoals}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Completed
          </div>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-0 max-h-64">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              goal.completed
                ? "bg-emerald-900/30 hover:bg-emerald-900/40"
                : "bg-gray-800/60 hover:bg-gray-800/80"
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 transition-all duration-300 ${
                goal.completed
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                  : "border border-gray-500 hover:border-white"
              }`}
            >
              {goal.completed && <Check size={14} className="text-gray-900" />}
            </div>
            <div
              className={`text-sm ${
                goal.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {goal.text}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>
    </div>
  );
}

function BottomBar() {
  const [studyingUsers, setStudyingUsers] = useState(785);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2;
      setStudyingUsers((prev) => Math.max(700, Math.min(900, prev + change)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
        <span className="text-white font-bold mr-1">{studyingUsers}</span>
        <span className="text-gray-400 text-sm hidden sm:inline">
          users solo studying
        </span>
        <span className="text-gray-400 text-sm sm:hidden">studying</span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
        <span className="text-gray-400 text-sm">Focused Study App</span>
      </div>
    </div>
  );
}

function BreakTimerModal({ closeModal, breakTime }: BreakTimerModalProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-96 bg-gray-900/95 rounded-xl shadow-2xl text-white z-30 border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-amber-900/50 to-orange-900/50">
          <div className="flex items-center space-x-2">
            <Coffee size={18} className="text-amber-400" />
            <span className="font-medium">Break Time</span>
          </div>
          <div className="flex space-x-2">
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="text-gray-300 mb-2">You've been on break for:</div>
            <div className="text-6xl font-mono font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {formatTime(breakTime)}
            </div>
          </div>

          <div className="w-full bg-gray-800 h-1.5 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((breakTime / 600) * 100, 100)}%` }}
            ></div>
          </div>

          <div className="text-center mb-6 text-sm text-gray-400">
            Taking regular breaks improves productivity and focus.
            <br />
            Remember to stretch and rest your eyes.
          </div>

          <button
            onClick={closeModal}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg"
          >
            Resume Studying
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsModal({
  closeModal,
  totalStudyTime,
  goalsCount,
}: StatsModalProps) {
  const [timeframe, setTimeframe] = useState("This month");
  const [rank, setRank] = useState(89818);

  const formatStudyTime = () => {
    const hours = Math.floor(totalStudyTime / 3600);
    const minutes = Math.floor((totalStudyTime % 3600) / 60);
    return `${hours}.${minutes.toString().padStart(2, "0")}`;
  };

  const monthlyProgress = Math.min((totalStudyTime / 600) * 100, 100);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-96 bg-gray-900/95 rounded-xl shadow-2xl text-white z-30 border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div className="flex items-center space-x-2">
            <BarChart2 size={18} className="text-indigo-400" />
            <span className="font-medium">Study stats</span>
          </div>
          <div className="flex space-x-2">
            <Info
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
            />
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="relative mb-6">
            <select
              className="w-full py-2.5 px-4 bg-gray-800/80 rounded-lg text-white appearance-none cursor-pointer border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option>This month</option>
              <option>This week</option>
              <option>Today</option>
              <option>All time</option>
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-lg p-4 mb-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Study time</div>
                <div className="text-xl font-bold">{formatStudyTime()} h</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-lg p-4 mb-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">
                  Current monthly level
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-2"></div>
                  <span className="text-gray-300">Member (0-10h)</span>
                </div>
              </div>
            </div>

            <div className="w-full h-2 bg-gray-700 rounded-full mt-2 mb-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>

            <div className="text-sm">
              <span className="text-white">
                {(10 - parseFloat(formatStudyTime())).toFixed(1)} hours left
                until:{" "}
              </span>
              <span className="text-purple-400">Entry (10h-60h)</span>
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <div className="mb-2">All goals</div>

            <div className="flex">
              <div className="w-1/2 flex flex-col items-center py-3 border-r border-gray-700">
                <div className="text-3xl text-indigo-400">
                  {goalsCount.open}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                  Open Goals
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-center py-3">
                <div className="text-3xl text-emerald-400">
                  {goalsCount.completed}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                  Completed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Leaderboard rank</div>
                <div className="text-xl font-bold">#{rank}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundModal({
  closeModal,
  setSelectedBackground,
  selectedBackground,
}: BackgroundModalProps) {
  const backgrounds: BackgroundItem[] = [
    {
      id: "anime-night",
      category: "anime",
      name: "Night Street",
      thumbnail:
        "https://images.unsplash.com/photo-1613487957484-32c977a8bd62?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "anime-room",
      category: "anime",
      name: "Cozy Room",
      thumbnail:
        "https://images.unsplash.com/photo-1693034433366-57fbb0286641?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "library",
      category: "study",
      name: "Library",
      thumbnail:
        "https://images.unsplash.com/photo-1729932989176-6d905172c123?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "nature",
      category: "nature",
      name: "Cherry Blossoms",
      thumbnail:
        "https://images.unsplash.com/photo-1556066138-cfac27159329?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "cafe",
      category: "cafe",
      name: "Street Café",
      thumbnail:
        "https://images.unsplash.com/photo-1731758832047-8363e8eed735?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "city",
      category: "city",
      name: "City Skyline",
      thumbnail:
        "https://images.unsplash.com/photo-1580920459139-68dcb30f70fe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "forest",
      category: "nature",
      name: "Forest",
      thumbnail:
        "https://images.unsplash.com/photo-1580484094517-4e9aad23e673?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "space",
      category: "abstract",
      name: "Space",
      thumbnail:
        "https://images.unsplash.com/photo-1616403503565-de3e91c7d0f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const categories: CategoryItem[] = [
    { id: "all", label: "All", icon: "✨" },
    { id: "anime", label: "Anime", icon: "🎌" },
    { id: "nature", label: "Nature", icon: "🌿" },
    { id: "city", label: "City", icon: "🏙️" },
    { id: "cafe", label: "Cafe", icon: "☕" },
    { id: "study", label: "Study", icon: "📚" },
    { id: "abstract", label: "Abstract", icon: "🎨" },
  ];

  const filteredBackgrounds =
    activeCategory === "all"
      ? backgrounds
      : backgrounds.filter((bg) => bg.category === activeCategory);

  const handleBackgroundSelect = (bgId: string) => {
    setSelectedBackground(bgId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-96 bg-gray-900/95 rounded-xl shadow-2xl text-white z-30 border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div className="flex items-center space-x-2">
            <Image size={18} className="text-indigo-400" />
            <span className="font-medium">Background Selection</span>
          </div>
          <div className="flex space-x-3">
            <RefreshCw
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={() => {
                const randomIndex = Math.floor(
                  Math.random() * backgrounds.length
                );
                setSelectedBackground(backgrounds[randomIndex].id);
              }}
            />
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-5">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="mr-1.5">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {filteredBackgrounds.map((bg) => (
              <div
                key={bg.id}
                className={`group cursor-pointer rounded-lg overflow-hidden relative transition-all duration-300 transform ${
                  selectedBackground === bg.id
                    ? "ring-2 ring-indigo-500 scale-100"
                    : "hover:scale-105"
                }`}
                onClick={() => handleBackgroundSelect(bg.id)}
              >
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  <img
                    src={bg.thumbnail}
                    alt={bg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-xs font-medium text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {bg.name}
                  </div>
                </div>
                {selectedBackground === bg.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40"
            onClick={closeModal}
          >
            Apply Background
          </button>
        </div>
      </div>
    </div>
  );
}