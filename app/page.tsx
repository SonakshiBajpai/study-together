"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Target,
  MessageSquare,
  BarChart2,
  Trophy,
  Clock,
  Pause,
  Play,
  Plus,
  Check,
  Image,
  X,
  User,
  BookOpen,
  RefreshCw,
  Expand,
  Coffee,
  Menu,
  GraduationCap,
  Send,
  Hash,
  Circle,
  Crown,
  Flame,
  Zap,
} from "lucide-react";

//interfaces
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  darkMode: boolean;
}

interface ButtonProps {
  icon: React.ReactNode;
  label: string;
  time?: string;
  count?: string;
  active: boolean;
  onClick?: () => void;
  darkMode: boolean;
}

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  tooltip?: string;
  darkMode: boolean;
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
  darkMode: boolean;
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
  darkMode: boolean;
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
  selectedBackground: string;
  setSelectedBackground: (background: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  openGoals: number;
  setOpenGoals: React.Dispatch<React.SetStateAction<number>>;
  completedGoals: number;
  setCompletedGoals: React.Dispatch<React.SetStateAction<number>>;
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
  darkMode: boolean;
  toggleDarkMode: () => void;
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
  darkMode: boolean;
}

interface BackgroundModalProps {
  closeModal: () => void;
  setSelectedBackground: (background: string) => void;
  selectedBackground: string;
  darkMode: boolean;
}

interface BreakTimerModalProps {
  closeModal: () => void;
  breakTime: number;
  darkMode: boolean;
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
}

interface TimerState {
  time: number;
  isRunning: boolean;
  initialTime?: number;
}

interface ChatroomContentProps {
  activeModal: string | null;
  toggleModal: (modalName: string) => void;
  startBreakTimer: () => void;
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  selectedBackground: string;
  setSelectedBackground: (background: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  openGoals: number;
  setOpenGoals: React.Dispatch<React.SetStateAction<number>>;
  completedGoals: number;
  setCompletedGoals: React.Dispatch<React.SetStateAction<number>>;
  chatMessages: { [key: string]: ChatMessage[] };
  setChatMessages: React.Dispatch<
    React.SetStateAction<{ [key: string]: ChatMessage[] }>
  >;
}

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

interface ChatMember {
  id: number;
  name: string;
  status: "online" | "offline";
  avatar?: string;
  role?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  messages: ChatMessage[];
  members: ChatMember[];
}

interface LeaderboardUser {
  id: number;
  name: string;
  studyHours: number;
  totalSessions: number;
  avatar: string;
  rank: number;
  streak: number;
  level: string;
  badge?: string;
}

interface LeaderboardContentProps {
  activeModal: string | null;
  toggleModal: (modalName: string) => void;
  startBreakTimer: () => void;
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  selectedBackground: string;
  setSelectedBackground: (background: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  openGoals: number;
  setOpenGoals: React.Dispatch<React.SetStateAction<number>>;
  completedGoals: number;
  setCompletedGoals: React.Dispatch<React.SetStateAction<number>>;
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
  const [selectedBackground, setSelectedBackground] = useState("anime-night");
  const [darkMode, setDarkMode] = useState(true);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, text: "Clean my desk before study session", completed: true },
  ]);
  const [openGoals, setOpenGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(1);

  const [chatMessages, setChatMessages] = useState<{
    [key: string]: ChatMessage[];
  }>({});

  useEffect(() => {
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewport = document.createElement("meta");
      viewport.name = "viewport";
      viewport.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(viewport);
    }

    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(fontLink);

    const style = document.createElement("style");
    style.textContent = `
      html, body, * {
        font-family: 'Poppins', sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (preconnect1.parentNode)
        preconnect1.parentNode.removeChild(preconnect1);
      if (preconnect2.parentNode)
        preconnect2.parentNode.removeChild(preconnect2);
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink);
      if (style.parentNode) style.parentNode.removeChild(style);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden relative ${
        darkMode ? "text-gray-100 bg-gray-900" : "text-gray-900 bg-gray-50"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {!mobileNavOpen && (
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              darkMode
                ? "bg-gray-900/80 text-white"
                : "bg-white/80 text-gray-900 border border-gray-200"
            } backdrop-blur-lg`}
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      <Sidebar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        darkMode={darkMode}
      />

      <div
        className={`md:hidden fixed inset-0 ${
          darkMode ? "bg-gray-900/95" : "bg-white/95"
        } backdrop-blur-md z-40 transition-transform duration-300 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-bold text-lg`}
                >
                  Studify
                </span>
                <span
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  Focus • Study • Achieve
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <MobileNavItem
              icon={<Users size={22} />}
              label="Solo Study"
              active={currentRoute === "solostudy"}
              onClick={() => {
                setCurrentRoute("solostudy");
                setMobileNavOpen(false);
              }}
              darkMode={darkMode}
            />
            <MobileNavItem
              icon={<MessageSquare size={22} />}
              label="Chat Rooms"
              active={currentRoute === "chatrooms"}
              onClick={() => {
                setCurrentRoute("chatrooms");
                setMobileNavOpen(false);
              }}
              darkMode={darkMode}
            />
            <MobileNavItem
              icon={<Trophy size={22} />}
              label="Leaderboard"
              active={currentRoute === "leaderboard"}
              onClick={() => {
                setCurrentRoute("leaderboard");
                setMobileNavOpen(false);
              }}
              darkMode={darkMode}
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
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          goals={goals}
          setGoals={setGoals}
          openGoals={openGoals}
          setOpenGoals={setOpenGoals}
          completedGoals={completedGoals}
          setCompletedGoals={setCompletedGoals}
        />
      ) : currentRoute === "chatrooms" ? (
        <ChatroomContent
          activeModal={activeModal}
          toggleModal={toggleModal}
          startBreakTimer={startBreakTimer}
          timerState={timerState}
          setTimerState={setTimerState}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          goals={goals}
          setGoals={setGoals}
          openGoals={openGoals}
          setOpenGoals={setOpenGoals}
          completedGoals={completedGoals}
          setCompletedGoals={setCompletedGoals}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      ) : currentRoute === "leaderboard" ? (
        <LeaderboardContent
          activeModal={activeModal}
          toggleModal={toggleModal}
          startBreakTimer={startBreakTimer}
          timerState={timerState}
          setTimerState={setTimerState}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          goals={goals}
          setGoals={setGoals}
          openGoals={openGoals}
          setOpenGoals={setOpenGoals}
          completedGoals={completedGoals}
          setCompletedGoals={setCompletedGoals}
        />
      ) : (
        <PlaceholderContent route={currentRoute} darkMode={darkMode} />
      )}

      {activeModal === "break" && (
        <BreakTimerModal
          closeModal={endBreakTimer}
          breakTime={breakTime}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// Mobile Nav Item
function MobileNavItem({
  icon,
  label,
  active,
  onClick,
  darkMode,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}) {
  return (
    <div
      className={`flex items-center p-4 rounded-lg ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          : darkMode
          ? "bg-gray-800/50 text-gray-300"
          : "bg-gray-100/80 text-gray-700"
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

function PlaceholderContent({
  route,
  darkMode,
}: {
  route: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`flex-1 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } flex items-center justify-center`}
    >
      <div className="text-center">
        <h1
          className={`${
            darkMode ? "text-gray-100" : "text-gray-900"
          } text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4`}
        >
          #{route}
        </h1>
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-600"
          } text-gray-400`}
        >
          This page is under construction
        </p>
      </div>
    </div>
  );
}

function Sidebar({
  currentRoute,
  setCurrentRoute,
  sidebarCollapsed,
  setSidebarCollapsed,
  darkMode,
}: {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
}) {
  const [forceCollapsed, setForceCollapsed] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1024) {
        setForceCollapsed(true);
      } else {
        setForceCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isCollapsed = forceCollapsed || sidebarCollapsed;
  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-64"} ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      } bg-opacity-90 h-full flex-col py-6 pb-12 z-10 shadow-xl backdrop-blur-md border-r transition-all duration-300 hidden md:flex`}
    >
      {/* Logo Section */}
      <div className={`${isCollapsed ? "px-3 mb-8" : "px-6 mb-10"}`}>
        <div
          className={`flex ${
            isCollapsed ? "justify-center" : "items-center space-x-3"
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-bold text-xl`}
              >
                StudyFocus
              </span>
              <span
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-xs`}
              >
                Focus • Study • Achieve
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Navigation Items */}
      <div className={`flex-1 ${isCollapsed ? "px-2" : "px-3"}`}>
        <NavItem
          icon={<Users size={22} />}
          label="Solo Study"
          active={currentRoute === "solostudy"}
          onClick={() => setCurrentRoute("solostudy")}
          collapsed={isCollapsed}
          darkMode={darkMode}
        />
        <NavItem
          icon={<MessageSquare size={22} />}
          label="Chat Rooms"
          active={currentRoute === "chatrooms"}
          onClick={() => setCurrentRoute("chatrooms")}
          collapsed={isCollapsed}
          darkMode={darkMode}
        />
        <NavItem
          icon={<Trophy size={22} />}
          label="Leaderboard"
          active={currentRoute === "leaderboard"}
          onClick={() => setCurrentRoute("leaderboard")}
          collapsed={isCollapsed}
          darkMode={darkMode}
        />
      </div>
      {/* Collapse Toggle */}
      <div className={`${isCollapsed ? "px-2" : "px-3"} mb-2`}>
        <button
          className={`w-full h-10 flex items-center justify-center rounded-md cursor-pointer ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          } transition-all duration-300`}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display:
              typeof window !== "undefined" &&
              window.innerWidth >= 768 &&
              window.innerWidth < 1024
                ? "none"
                : "block",
          }}
        >
          <div className="flex items-center justify-center w-full h-full">
            {isCollapsed ? (
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
          </div>
        </button>
      </div>
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          button[aria-label] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  collapsed,
  darkMode,
}: NavItemProps) {
  return (
    <div
      className={`w-full flex items-center ${
        collapsed ? "justify-center px-0 py-3 mb-3" : "px-3 py-4 mb-2"
      } rounded-lg relative ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
          : darkMode
          ? "text-gray-400 hover:text-white hover:bg-gray-800"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      } cursor-pointer transition-all duration-300 group`}
      onClick={onClick}
    >
      <div
        className={`transform group-hover:scale-110 transition-transform duration-200 ${
          collapsed ? "" : "mr-3"
        }`}
      >
        {icon}
      </div>
      {!collapsed && <div className="font-medium">{label}</div>}
      {label === "Chat Rooms" && !collapsed && (
        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      )}
      {label === "Chat Rooms" && collapsed && (
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 ${
            darkMode ? "border-gray-900" : "border-white"
          }`}
        ></div>
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
  selectedBackground,
  setSelectedBackground,
  darkMode,
  toggleDarkMode,
  goals,
  setGoals,
  openGoals,
  setOpenGoals,
  completedGoals,
  setCompletedGoals,
}: MainContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(7200);
  const [timerMuted, setTimerMuted] = useState(false);

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
    <div
      className={`flex-1 relative overflow-hidden md:overflow-hidden overflow-y-auto ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Background selectedBackground={selectedBackground} />
      <TopBar
        toggleModal={toggleModal}
        activeModal={activeModal}
        toggleFullscreen={toggleFullscreen}
        timerState={timerState}
        goalsCount={{ open: openGoals, completed: completedGoals }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="md:absolute md:top-32 md:left-8 md:right-8 md:bottom-16 pt-24 px-4 pb-16 md:p-0 z-20 flex flex-col md:flex-row items-center md:justify-between gap-5 min-h-full md:min-h-0">
        <TimerCard
          active={activeTab === "timer"}
          setActiveTab={setActiveTab}
          updateTimerToggle={updateTimerToggle}
          timerState={timerState}
          setTimerState={setTimerState}
          timerMuted={timerMuted}
          setTimerMuted={setTimerMuted}
          onTakeBreak={startBreakTimer}
          darkMode={darkMode}
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
          darkMode={darkMode}
        />
      </div>

      <BottomBar darkMode={darkMode} />

      {/* Modals */}
      {activeModal === "stats" && (
        <StatsModal
          closeModal={() => toggleModal("stats")}
          totalStudyTime={totalStudyTime}
          goalsCount={{ open: openGoals, completed: completedGoals }}
          darkMode={darkMode}
        />
      )}

      {activeModal === "background" && (
        <BackgroundModal
          closeModal={() => toggleModal("background")}
          setSelectedBackground={setSelectedBackground}
          selectedBackground={selectedBackground}
          darkMode={darkMode}
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
      className="fixed inset-0 bg-cover bg-center transition-all duration-1000 z-0"
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
  darkMode,
  toggleDarkMode,
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
    <div className="absolute top-4 md:top-8 right-4 md:right-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 z-20 w-auto">
      <div className="hidden md:flex space-x-3">
        <Button
          icon={<Clock size={16} />}
          label="Personal timer"
          time={formatTime(timerState.time)}
          active={timerState.isRunning}
          onClick={() => {}}
          darkMode={darkMode}
        />
        <Button
          icon={<Target size={16} />}
          label="Session goals"
          count={`${goalsCount.completed}/${
            goalsCount.open + goalsCount.completed
          }`}
          active={false}
          onClick={() => {}}
          darkMode={darkMode}
        />
      </div>
      <div
        className="flex space-x-2 justify-end md:static fixed top-0 left-0 right-0 z-30 bg-transparent px-4 py-2 md:p-0 md:bg-none md:top-auto md:left-auto md:right-auto md:z-20 md:w-auto w-full md:flex-none md:justify-end md:space-x-2 sm:bg-opacity-80 sm:backdrop-blur-lg sm:bg-gray-900/80"
        style={{ pointerEvents: "auto" }}
      >
        <IconButton
          icon={<Image size={20} />}
          active={activeModal === "background"}
          onClick={() => toggleModal("background")}
          tooltip="Background"
          darkMode={darkMode}
        />
        <IconButton
          icon={<BarChart2 size={20} />}
          active={activeModal === "stats"}
          onClick={() => toggleModal("stats")}
          tooltip="Stats"
          darkMode={darkMode}
        />
        <IconButton
          icon={
            darkMode ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )
          }
          onClick={toggleDarkMode}
          active={false}
          tooltip={darkMode ? "Light mode" : "Dark mode"}
          darkMode={darkMode}
        />
        <IconButton
          icon={<Expand size={20} />}
          onClick={toggleFullscreen}
          active={false}
          tooltip="Fullscreen"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function Button({
  icon,
  label,
  time,
  count,
  active,
  onClick,
  darkMode,
}: ButtonProps) {
  return (
    <div
      className={`flex items-center px-4 py-2 rounded-md ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
          : darkMode
          ? "bg-gray-900/80 text-white"
          : "bg-white/80 text-gray-900 border border-gray-200"
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
  darkMode,
}: IconButtonProps) {
  return (
    <div className="relative group">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-md ${
          active
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-900/30"
            : darkMode
            ? "bg-gray-900/80 hover:bg-gray-800"
            : "bg-white/80 hover:bg-gray-100 border border-gray-200"
        } ${
          darkMode ? "text-white" : "text-gray-900"
        } cursor-pointer transition-all duration-300 backdrop-blur-lg transform group-hover:scale-105`}
        onClick={onClick}
      >
        {icon}
      </div>
      {tooltip && (
        <div
          className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 ${
            darkMode
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-200"
          } text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg`}
        >
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
  darkMode,
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
    <div
      className={`w-full md:w-80 ${
        darkMode
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/90 border-gray-200"
      } backdrop-blur-lg rounded-xl p-5 ${
        darkMode ? "text-white" : "text-gray-900"
      } shadow-xl transition-all duration-300 hover:shadow-2xl border ${
        darkMode ? "hover:border-gray-700" : "hover:border-gray-300"
      }`}
    >
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
            className={`cursor-pointer ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
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
        </div>
      </div>

      {showTimerSettings && (
        <div
          className={`mb-4 ${
            darkMode ? "bg-gray-800/80" : "bg-gray-100/80"
          } p-3 rounded-lg animate-fadeIn`}
        >
          <div
            className={`text-sm mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Timer duration:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[25, 30, 45, 50, 60, 90].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setCustomTimer(minutes)}
                className={`py-1.5 rounded text-sm cursor-pointer ${
                  (timerState.initialTime || 3000) === minutes * 60
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
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
          className={`w-12 h-12 flex items-center justify-center ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 cursor-pointer"
              : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
          } rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg hover:shadow-purple-900/20 transform hover:scale-105`}
          onClick={resetTimer}
        >
          <div
            className={`w-3 h-3 ${
              darkMode ? "bg-white" : "bg-gray-900"
            } rounded-sm`}
          ></div>
        </button>
        <button
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transform hover:scale-105 ${
            timerState.isRunning
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-900/30 cursor-pointer"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-900/30 cursor-pointer"
          }`}
          onClick={toggleTimer}
        >
          {timerState.isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      <button
        onClick={onTakeBreak}
        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer"
      >
        <Coffee size={16} className="mr-2" />
        Take a Break
      </button>

      <div
        className={`text-xs ${
          darkMode
            ? "text-gray-400 bg-gray-800/60"
            : "text-gray-600 bg-gray-100/60"
        } text-center mt-4 py-1.5 rounded-md`}
      >
        Press{" "}
        <kbd
          className={`px-1.5 py-0.5 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded text-xs font-semibold shadow-inner`}
        >
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
  darkMode,
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
    <div
      className={`w-full md:w-80 ${
        darkMode
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/90 border-gray-200"
      } backdrop-blur-lg rounded-xl p-5 ${
        darkMode ? "text-white" : "text-gray-900"
      } shadow-xl transition-all duration-300 hover:shadow-2xl border ${
        darkMode ? "hover:border-gray-700" : "hover:border-gray-300"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target size={18} className="mr-2 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide">
            Session goals
          </span>
        </div>
      </div>

      <div className="mb-5">
        <div
          className={`flex items-center ${
            darkMode ? "bg-gray-800/80" : "bg-gray-100/80"
          } rounded-lg overflow-hidden shadow-inner`}
        >
          <input
            type="text"
            className={`flex-1 bg-transparent px-4 py-3 text-sm outline-none ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-500"
            }`}
            placeholder="Add a new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addGoal()}
          />
          <button
            className="w-12 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 cursor-pointer"
            onClick={addGoal}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <div
          className={`w-1/2 flex flex-col items-center py-2 ${
            darkMode ? "bg-gray-800/60" : "bg-gray-100/60"
          } rounded-l-lg`}
        >
          <div className="text-2xl text-indigo-400 font-bold">{openGoals}</div>
          <div
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } uppercase tracking-wide`}
          >
            Open
          </div>
        </div>
        <div
          className={`w-1/2 flex flex-col items-center py-2 ${
            darkMode ? "bg-gray-800/60" : "bg-gray-100/60"
          } rounded-r-lg`}
        >
          <div className="text-2xl text-emerald-400 font-bold">
            {completedGoals}
          </div>
          <div
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } uppercase tracking-wide`}
          >
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
                ? darkMode
                  ? "bg-emerald-900/30 hover:bg-emerald-900/40"
                  : "bg-emerald-100/50 hover:bg-emerald-100/70"
                : darkMode
                ? "bg-gray-800/60 hover:bg-gray-800/80"
                : "bg-gray-100/60 hover:bg-gray-100/80"
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div
              className={`w-6 h-6 aspect-square flex items-center justify-center rounded-full mr-3 transition-all duration-300 ${
                goal.completed
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                  : darkMode
                  ? "border border-gray-500 hover:border-white"
                  : "border border-gray-400 hover:border-gray-600"
              }`}
            >
              {goal.completed && <Check size={14} className="text-gray-900" />}
            </div>
            <div
              className={`text-sm ${
                goal.completed
                  ? darkMode
                    ? "line-through text-gray-400"
                    : "line-through text-gray-500"
                  : darkMode
                  ? "text-white"
                  : "text-gray-900"
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
          background: ${darkMode
            ? "rgba(31, 41, 55, 0.5)"
            : "rgba(229, 231, 235, 0.5)"};
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

function BottomBar({ darkMode }: { darkMode: boolean }) {
  const [studyingUsers, setStudyingUsers] = useState(785);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2;
      setStudyingUsers((prev) => Math.max(700, Math.min(900, prev + change)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-12 ${
        darkMode
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      } backdrop-blur-lg border-t flex items-center justify-between px-4 md:px-8 z-30`}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
        <span
          className={`${
            darkMode ? "text-white" : "text-gray-900"
          } font-bold mr-1`}
        >
          {studyingUsers}
        </span>
        <span
          className={`${
            darkMode ? "text-gray-400" : "text-gray-600"
          } text-sm hidden sm:inline`}
        >
          users solo studying
        </span>
        <span
          className={`${
            darkMode ? "text-gray-400" : "text-gray-600"
          } text-sm sm:hidden`}
        >
          studying
        </span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
        <span
          className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
        >
          Focused Study App
        </span>
      </div>
    </div>
  );
}

function BreakTimerModal({
  closeModal,
  breakTime,
  darkMode,
}: BreakTimerModalProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-40 ${
        darkMode ? "bg-black/50" : "bg-black/30"
      } backdrop-blur-sm p-4`}
    >
      <div
        className={`w-full max-w-96 ${
          darkMode
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } rounded-xl shadow-2xl ${
          darkMode ? "text-white" : "text-gray-900"
        } z-30 border overflow-hidden`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode
              ? "border-gray-800 bg-gradient-to-r from-amber-900/50 to-orange-900/50"
              : "border-gray-200 bg-gradient-to-r from-amber-100/50 to-orange-100/50"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Coffee size={18} className="text-amber-400" />
            <span className="font-medium">Break Time</span>
          </div>
          <div className="flex space-x-2">
            <X
              size={18}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } cursor-pointer transition-colors`}
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="text-center mb-6">
            <div
              className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
            >
              You've been on break for:
            </div>
            <div className="text-6xl font-mono font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {formatTime(breakTime)}
            </div>
          </div>

          <div
            className={`w-full ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } h-1.5 rounded-full mb-6 overflow-hidden`}
          >
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((breakTime / 600) * 100, 100)}%` }}
            ></div>
          </div>

          <div
            className={`text-center mb-6 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Taking regular breaks improves productivity and focus.
            <br />
            Remember to stretch and rest your eyes.
          </div>

          <button
            onClick={closeModal}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg cursor-pointer"
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
  darkMode,
}: StatsModalProps) {
  const [timeframe, setTimeframe] = useState("This month");
  const [rank, setRank] = useState(1234);

  const formatStudyTime = () => {
    const hours = Math.floor(totalStudyTime / 3600);
    const minutes = Math.floor((totalStudyTime % 3600) / 60);
    return `${hours}.${minutes.toString().padStart(2, "0")}`;
  };

  const monthlyProgress = Math.min((totalStudyTime / 36000) * 100, 100);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-40 ${
        darkMode ? "bg-black/50" : "bg-black/30"
      } backdrop-blur-sm p-4`}
    >
      <div
        className={`w-full max-w-96 ${
          darkMode
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } rounded-xl shadow-2xl ${
          darkMode ? "text-white" : "text-gray-900"
        } z-30 border overflow-hidden`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode
              ? "border-gray-800 bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
              : "border-gray-200 bg-gradient-to-r from-indigo-100/50 to-purple-100/50"
          }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart2 size={18} className="text-indigo-400" />
            <span className="font-medium">Study stats</span>
          </div>
          <div className="flex space-x-2">
            <X
              size={18}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } cursor-pointer transition-colors`}
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-5">
          <div
            className={`${
              darkMode
                ? "bg-gray-800/60 border-gray-700/50 hover:border-gray-600/50"
                : "bg-gray-100/60 border-gray-200/50 hover:border-gray-300/50"
            } rounded-lg p-4 mb-4 border transition-colors`}
          >
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Study time
                </div>
                <div className="text-xl font-bold">{formatStudyTime()} h</div>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode
                ? "bg-gray-800/60 border-gray-700/50 hover:border-gray-600/50"
                : "bg-gray-100/60 border-gray-200/50 hover:border-gray-300/50"
            } rounded-lg p-4 mb-4 border transition-colors`}
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Current monthly level
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 ${
                      darkMode ? "bg-white" : "bg-gray-900"
                    } rounded-full mr-2`}
                  ></div>
                  <span
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Member (0-10h)
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`w-full h-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded-full mt-2 mb-1 overflow-hidden`}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>

            <div className="text-sm">
              <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>
                {(10 - parseFloat(formatStudyTime())).toFixed(1)} hours left
                until:{" "}
              </span>
              <span className="text-purple-400">Entry (10h-60h)</span>
            </div>
          </div>

          <div
            className={`${
              darkMode
                ? "bg-gray-800/60 border-gray-700/50 hover:border-gray-600/50"
                : "bg-gray-100/60 border-gray-200/50 hover:border-gray-300/50"
            } rounded-lg p-4 border transition-colors`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-indigo-900/20">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Leaderboard rank
                </div>
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
  darkMode,
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
    { id: "all", label: "All" },
    { id: "anime", label: "Anime" },
    { id: "nature", label: "Nature" },
    { id: "city", label: "City" },
    { id: "cafe", label: "Cafe" },
    { id: "study", label: "Study" },
    { id: "abstract", label: "Abstract" },
  ];

  const filteredBackgrounds =
    activeCategory === "all"
      ? backgrounds
      : backgrounds.filter((bg) => bg.category === activeCategory);

  const handleBackgroundSelect = (bgId: string) => {
    setSelectedBackground(bgId);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-40 ${
        darkMode ? "bg-black/50" : "bg-black/30"
      } backdrop-blur-sm`}
    >
      <div
        className={`w-full max-w-96 mx-4 sm:mx-0 ${
          darkMode
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } rounded-xl shadow-2xl ${
          darkMode ? "text-white" : "text-gray-900"
        } z-30 border overflow-hidden`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode
              ? "border-gray-800 bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
              : "border-gray-200 bg-gradient-to-r from-indigo-100/50 to-purple-100/50"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Image size={18} className="text-indigo-400" />
            <span className="font-medium">Background Selection</span>
          </div>
          <div className="flex space-x-3">
            <RefreshCw
              size={18}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } cursor-pointer transition-colors`}
              onClick={() => {
                const randomIndex = Math.floor(
                  Math.random() * backgrounds.length
                );
                setSelectedBackground(backgrounds[randomIndex].id);
              }}
            />
            <X
              size={18}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } cursor-pointer transition-colors`}
              onClick={closeModal}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20 cursor-pointer"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
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
                <div
                  className={`aspect-video ${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  } overflow-hidden`}
                >
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
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 cursor-pointer"
            onClick={closeModal}
          >
            Apply Background
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatroomContent({
  activeModal,
  toggleModal,
  startBreakTimer,
  timerState,
  setTimerState,
  selectedBackground,
  setSelectedBackground,
  darkMode,
  toggleDarkMode,
  goals,
  setGoals,
  openGoals,
  setOpenGoals,
  completedGoals,
  setCompletedGoals,
  chatMessages,
  setChatMessages,
}: ChatroomContentProps & {
  chatMessages: { [key: string]: ChatMessage[] };
  setChatMessages: React.Dispatch<
    React.SetStateAction<{ [key: string]: ChatMessage[] }>
  >;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(7200);
  const [timerMuted, setTimerMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Engineering");
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chatRooms: { [key: string]: ChatRoom } = {
    Engineering: {
      id: "engineering",
      name: "Engineering Study Group",
      description:
        "Discuss algorithms, data structures, and engineering concepts",
      memberCount: 8,
      messages: [
        {
          id: 1,
          user: "Alex Chen",
          message:
            "Hey everyone! Working on dynamic programming problems today. Anyone want to discuss the knapsack problem?",
          timestamp: new Date(Date.now() - 300000),
          avatar: "AC",
        },
        {
          id: 2,
          user: "Maria Rodriguez",
          message:
            "I'm struggling with understanding time complexity. Can someone explain how to analyze recursive algorithms?",
          timestamp: new Date(Date.now() - 240000),
          avatar: "MR",
        },
        {
          id: 3,
          user: "David Kim",
          message:
            "Sure! For recursive algorithms, you typically use the master theorem or draw out the recursion tree to calculate time complexity.",
          timestamp: new Date(Date.now() - 180000),
          avatar: "DK",
        },
        {
          id: 4,
          user: "Sarah Johnson",
          message:
            "I find it helpful to start with simple examples. Like calculating factorial - T(n) = T(n-1) + O(1), which gives us O(n)",
          timestamp: new Date(Date.now() - 120000),
          avatar: "SJ",
        },
        {
          id: 5,
          user: "Alex Chen",
          message:
            "Exactly! And for the knapsack problem, the recurrence relation is T(n) = 2*T(n-1) + O(1), giving us O(2^n) for the naive approach.",
          timestamp: new Date(Date.now() - 60000),
          avatar: "AC",
        },
      ],
      members: [
        {
          id: 1,
          name: "Alex Chen",
          status: "online",
          avatar: "AC",
          role: "Moderator",
        },
        { id: 2, name: "Maria Rodriguez", status: "online", avatar: "MR" },
        { id: 3, name: "David Kim", status: "online", avatar: "DK" },
        { id: 4, name: "Sarah Johnson", status: "online", avatar: "SJ" },
        { id: 5, name: "John Smith", status: "offline", avatar: "JS" },
        { id: 6, name: "Emma Wilson", status: "online", avatar: "EW" },
        { id: 7, name: "Mike Brown", status: "offline", avatar: "MB" },
        { id: 8, name: "Lisa Davis", status: "online", avatar: "LD" },
      ],
    },
    Medical: {
      id: "medical",
      name: "Medical Study Group",
      description: "Anatomy, physiology, and medical terminology discussions",
      memberCount: 7,
      messages: [
        {
          id: 1,
          user: "Dr. Priya Patel",
          message:
            "Today we're focusing on cardiovascular anatomy. Remember that the heart has four chambers: two atria and two ventricles.",
          timestamp: new Date(Date.now() - 420000),
          avatar: "PP",
        },
        {
          id: 2,
          user: "James Miller",
          message:
            "I'm having trouble remembering all the heart valves. Could someone list them?",
          timestamp: new Date(Date.now() - 360000),
          avatar: "JM",
        },
        {
          id: 3,
          user: "Nina Adams",
          message:
            "The four valves are: Tricuspid (right AV), Pulmonary (right semilunar), Mitral/Bicuspid (left AV), and Aortic (left semilunar).",
          timestamp: new Date(Date.now() - 300000),
          avatar: "NA",
        },
        {
          id: 4,
          user: "Dr. Priya Patel",
          message:
            "Perfect, Nina! A good mnemonic is 'Try Pulling My Aorta' - Tricuspid, Pulmonary, Mitral, Aortic.",
          timestamp: new Date(Date.now() - 240000),
          avatar: "PP",
        },
        {
          id: 5,
          user: "Kevin Walsh",
          message:
            "That's helpful! I'm also working on understanding the cardiac cycle. When exactly do the valves open and close?",
          timestamp: new Date(Date.now() - 180000),
          avatar: "KW",
        },
      ],
      members: [
        {
          id: 1,
          name: "Dr. Priya Patel",
          status: "online",
          avatar: "PP",
          role: "Instructor",
        },
        { id: 2, name: "James Miller", status: "online", avatar: "JM" },
        { id: 3, name: "Nina Adams", status: "online", avatar: "NA" },
        { id: 4, name: "Kevin Walsh", status: "online", avatar: "KW" },
        { id: 5, name: "Rachel Green", status: "offline", avatar: "RG" },
        { id: 6, name: "Tom Anderson", status: "online", avatar: "TA" },
        { id: 7, name: "Zoe Clarke", status: "offline", avatar: "ZC" },
      ],
    },
  };

  const currentRoom = chatRooms[selectedCategory];

  useEffect(() => {
    if (currentRoom && !chatMessages[selectedCategory]) {
      setChatMessages((prev) => ({
        ...prev,
        [selectedCategory]: [...currentRoom.messages],
      }));
    }
  }, [selectedCategory, currentRoom]);

  const getCurrentMessages = () => {
    return chatMessages[selectedCategory] || currentRoom?.messages || [];
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [getCurrentMessages().length]);

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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        user: "You",
        message: newMessage.trim(),
        timestamp: new Date(),
        avatar: "YO",
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedCategory]: [
          ...(prev[selectedCategory] || currentRoom.messages),
          message,
        ],
      }));

      setNewMessage("");
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const onlineMembers = currentRoom.members.filter(
    (member) => member.status === "online"
  );
  const offlineMembers = currentRoom.members.filter(
    (member) => member.status === "offline"
  );

  return (
    <div
      className={`flex-1 relative overflow-hidden md:overflow-hidden overflow-y-auto ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Background selectedBackground={selectedBackground} />
      <TopBar
        toggleModal={toggleModal}
        activeModal={activeModal}
        toggleFullscreen={toggleFullscreen}
        timerState={timerState}
        goalsCount={{ open: openGoals, completed: completedGoals }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Category Selection */}
      <div className="pt-24 px-4 pb-16 md:p-0 md:absolute md:top-24 md:left-8 md:right-8 md:bottom-16 z-20">
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {["Engineering", "Medical"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20 cursor-pointer"
                  : darkMode
                  ? "bg-gray-900/80 text-gray-300 hover:bg-gray-800/90 hover:text-white cursor-pointer"
                  : "bg-white/80 text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 border border-gray-200 cursor-pointer"
              } backdrop-blur-lg`}
            >
              <Hash size={14} className="inline mr-1 md:mr-2" />
              {category}
              <span className="ml-1 md:ml-2 text-xs opacity-75">
                {chatRooms[category].memberCount}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-auto md:h-[calc(100vh-268px)]">
          <div
            className={`flex-1 ${
              darkMode
                ? "bg-gray-900/90 border-gray-800"
                : "bg-white/90 border-gray-200"
            } backdrop-blur-lg rounded-xl border overflow-hidden flex flex-col min-h-0 mobile-chat-height overflow-y-auto h-96 md:h-[calc(100vh-268px)]`}
            style={{ overflowY: "auto" }}
          >
            {/* Chat Header */}
            <div
              className={`p-3 md:p-4 border-b ${
                darkMode
                  ? "border-gray-800 bg-gradient-to-r from-gray-800/80 to-gray-900/80"
                  : "border-gray-200 bg-gradient-to-r from-gray-100/80 to-gray-200/80"
              } flex-shrink-0`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-base md:text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } truncate`}
                  >
                    {currentRoom.name}
                  </h3>
                  <p
                    className={`text-xs md:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } truncate`}
                  >
                    {currentRoom.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <div
                    className={`flex items-center text-xs md:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Circle
                      size={8}
                      className="text-emerald-500 fill-current mr-1"
                    />
                    <span className="hidden sm:inline">
                      {onlineMembers.length} online
                    </span>
                    <span className="sm:hidden">{onlineMembers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 custom-scrollbar min-h-0"
            >
              {getCurrentMessages().map((message) => (
                <div
                  key={message.id}
                  className="flex items-start space-x-2 md:space-x-3"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs md:text-sm font-medium flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        } text-sm md:text-base truncate`}
                      >
                        {message.user}
                      </span>
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-500" : "text-gray-500"
                        } flex-shrink-0`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } text-xs md:text-sm leading-relaxed break-words`}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div
              className={`p-3 md:p-4 border-t ${
                darkMode ? "border-gray-800" : "border-gray-200"
              } flex-shrink-0`}
            >
              <div className="flex items-end space-x-2 md:space-x-3">
                <div
                  className={`flex-1 flex items-center ${
                    darkMode ? "bg-gray-800/80" : "bg-gray-100/80"
                  } rounded-lg overflow-hidden`}
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={`Message #${selectedCategory.toLowerCase()}`}
                    className={`flex-1 bg-transparent px-3 md:px-4 py-2 md:py-3 ${
                      darkMode
                        ? "text-white placeholder-gray-400"
                        : "text-gray-900 placeholder-gray-500"
                    } outline-none text-sm md:text-base`}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg transition-all duration-300 flex-shrink-0 cursor-pointer"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          <div
            className={`w-full md:w-60 xl:w-64 ${
              darkMode
                ? "bg-gray-900/90 border-gray-800"
                : "bg-white/90 border-gray-200"
            } backdrop-blur-lg rounded-xl border overflow-hidden flex flex-col mobile-chat-height overflow-y-auto h-96 md:h-full`}
            style={{ overflowY: "auto" }}
          >
            {/* Members Header */}
            <div
              className={`p-3 md:p-4 border-b ${
                darkMode ? "border-gray-800" : "border-gray-200"
              } flex-shrink-0`}
            >
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                } text-sm md:text-base`}
              >
                Members ({currentRoom.memberCount})
              </h4>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
              {/* Online Members */}
              <div className="p-3">
                <div
                  className={`text-xs font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wide mb-3`}
                >
                  Online — {onlineMembers.length}
                </div>
                <div className="space-y-1 md:space-y-2">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-2 md:space-x-3 p-2 rounded-lg ${
                        darkMode
                          ? "hover:bg-gray-800/50"
                          : "hover:bg-gray-100/50"
                      } transition-colors`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs md:text-sm font-medium">
                          {member.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full border ${
                            darkMode ? "border-gray-900" : "border-white"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`${
                            darkMode ? "text-white" : "text-gray-900"
                          } text-xs md:text-sm font-medium truncate`}
                        >
                          {member.name}
                        </div>
                        {member.role && (
                          <div className="text-xs text-indigo-400 truncate">
                            {member.role}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Members */}
              {offlineMembers.length > 0 && (
                <div
                  className={`p-3 border-t ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } uppercase tracking-wide mb-3`}
                  >
                    Offline — {offlineMembers.length}
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    {offlineMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center space-x-2 md:space-x-3 p-2 rounded-lg ${
                          darkMode
                            ? "hover:bg-gray-800/50"
                            : "hover:bg-gray-100/50"
                        } transition-colors opacity-60`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-gray-300 text-xs md:text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 bg-gray-500 rounded-full border ${
                              darkMode ? "border-gray-900" : "border-white"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            } text-xs md:text-sm font-medium truncate`}
                          >
                            {member.name}
                          </div>
                          {member.role && (
                            <div
                              className={`text-xs ${
                                darkMode ? "text-gray-500" : "text-gray-500"
                              } truncate`}
                            >
                              {member.role}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomBar darkMode={darkMode} />

      {/* Modals */}
      {activeModal === "stats" && (
        <StatsModal
          closeModal={() => toggleModal("stats")}
          totalStudyTime={totalStudyTime}
          goalsCount={{ open: openGoals, completed: completedGoals }}
          darkMode={darkMode}
        />
      )}

      {activeModal === "background" && (
        <BackgroundModal
          closeModal={() => toggleModal("background")}
          setSelectedBackground={setSelectedBackground}
          selectedBackground={selectedBackground}
          darkMode={darkMode}
        />
      )}

      {activeModal === "break" && (
        <BreakTimerModal
          closeModal={() => toggleModal("break")}
          breakTime={0}
          darkMode={darkMode}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode
            ? "rgba(31, 41, 55, 0.5)"
            : "rgba(229, 231, 235, 0.5)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
        @media (max-width: 767px) {
          .mobile-chat-height {
            height: calc(100vh - 210px);
            min-height: 200px;
            max-height: 500px;
          }
          body.prevent-scroll {
            overflow: hidden !important;
            position: fixed !important;
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}

function LeaderboardContent({
  activeModal,
  toggleModal,
  startBreakTimer,
  timerState,
  setTimerState,
  selectedBackground,
  setSelectedBackground,
  darkMode,
  toggleDarkMode,
  goals,
  setGoals,
  openGoals,
  setOpenGoals,
  completedGoals,
  setCompletedGoals,
}: LeaderboardContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(7200);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  // Mock leaderboard data (restore this array)
  const leaderboardData: LeaderboardUser[] = [
    {
      id: 1,
      name: "Alex Chen",
      studyHours: 87.5,
      totalSessions: 156,
      avatar: "AC",
      rank: 1,
      streak: 28,
      level: "Master",
      badge: "flame",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      studyHours: 84.2,
      totalSessions: 142,
      avatar: "MR",
      rank: 2,
      streak: 22,
      level: "Expert",
      badge: "zap",
    },
    {
      id: 3,
      name: "David Kim",
      studyHours: 81.8,
      totalSessions: 138,
      avatar: "DK",
      rank: 3,
      streak: 19,
      level: "Expert",
      badge: "target",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      studyHours: 78.4,
      totalSessions: 134,
      avatar: "SJ",
      rank: 4,
      streak: 15,
      level: "Advanced",
    },
    {
      id: 5,
      name: "Nina Patel",
      studyHours: 75.2,
      totalSessions: 129,
      avatar: "NP",
      rank: 5,
      streak: 17,
      level: "Advanced",
    },
    {
      id: 6,
      name: "James Miller",
      studyHours: 72.1,
      totalSessions: 125,
      avatar: "JM",
      rank: 6,
      streak: 12,
      level: "Advanced",
    },
    {
      id: 7,
      name: "Emma Wilson",
      studyHours: 69.8,
      totalSessions: 121,
      avatar: "EW",
      rank: 7,
      streak: 14,
      level: "Intermediate",
    },
    {
      id: 8,
      name: "Kevin Walsh",
      studyHours: 67.5,
      totalSessions: 118,
      avatar: "KW",
      rank: 8,
      streak: 10,
      level: "Intermediate",
    },
    {
      id: 9,
      name: "Zoe Clarke",
      studyHours: 65.3,
      totalSessions: 115,
      avatar: "ZC",
      rank: 9,
      streak: 8,
      level: "Intermediate",
    },
    {
      id: 10,
      name: "Tom Anderson",
      studyHours: 63.7,
      totalSessions: 112,
      avatar: "TA",
      rank: 10,
      streak: 6,
      level: "Intermediate",
    },
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "flame":
        return <Flame size={16} className="text-orange-400" />;
      case "zap":
        return <Zap size={16} className="text-yellow-400" />;
      case "target":
        return <Target size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };

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

  return (
    <div
      className={`flex-1 relative overflow-hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Background selectedBackground={selectedBackground} />
      <TopBar
        toggleModal={toggleModal}
        activeModal={activeModal}
        toggleFullscreen={toggleFullscreen}
        timerState={timerState}
        goalsCount={{ open: openGoals, completed: completedGoals }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        <div className="pt-24 px-4 pb-20 md:pt-32 md:px-8 md:pb-24 z-20 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"></div>

          {/* Top 3 Podium */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-4 lg:gap-6 mb-8">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 w-full md:w-auto flex-shrink-0">
                <div className="bg-gradient-to-br from-slate-400/20 to-slate-500/20 backdrop-blur-lg rounded-2xl p-4 md:p-4 lg:p-6 border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-slate-900/20">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-lg md:text-lg lg:text-xl font-bold shadow-lg">
                        {leaderboardData[1].avatar}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                        2
                      </div>
                      {leaderboardData[1].badge && (
                        <div className="absolute -bottom-1 -right-1">
                          {getBadgeIcon(leaderboardData[1].badge)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {leaderboardData[1].name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-2">
                      {leaderboardData[1].level}
                    </p>
                    <div className="text-2xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
                      {leaderboardData[1].studyHours}h
                    </div>
                    <div className="text-xs text-slate-300/80">
                      {leaderboardData[1].totalSessions} sessions •{" "}
                      {leaderboardData[1].streak} day streak
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2 w-full md:w-auto flex-shrink-0">
                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-lg rounded-2xl p-6 md:p-6 lg:p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-yellow-900/20">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 md:w-20 lg:w-24 md:h-20 lg:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white text-xl md:text-xl lg:text-2xl font-bold shadow-xl">
                        {leaderboardData[0].avatar}
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Crown size={20} className="text-yellow-900" />
                      </div>
                      {leaderboardData[0].badge && (
                        <div className="absolute -bottom-2 -right-2">
                          {getBadgeIcon(leaderboardData[0].badge)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-xl md:text-xl lg:text-2xl mb-2">
                      {leaderboardData[0].name}
                    </h3>
                    <p className="text-yellow-300 text-sm md:text-base mb-3">
                      {leaderboardData[0].level}
                    </p>
                    <div className="text-3xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                      {leaderboardData[0].studyHours}h
                    </div>
                    <div className="text-sm text-yellow-200/80">
                      {leaderboardData[0].totalSessions} sessions •{" "}
                      {leaderboardData[0].streak} day streak
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3 w-full md:w-auto flex-shrink-0">
                <div className="bg-gradient-to-br from-amber-600/20 to-orange-700/20 backdrop-blur-lg rounded-2xl p-4 md:p-4 lg:p-6 border border-amber-600/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-900/20">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-lg md:text-lg lg:text-xl font-bold shadow-lg">
                        {leaderboardData[2].avatar}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        3
                      </div>
                      {leaderboardData[2].badge && (
                        <div className="absolute -bottom-1 -right-1">
                          {getBadgeIcon(leaderboardData[2].badge)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {leaderboardData[2].name}
                    </h3>
                    <p className="text-amber-300 text-sm mb-2">
                      {leaderboardData[2].level}
                    </p>
                    <div className="text-2xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                      {leaderboardData[2].studyHours}h
                    </div>
                    <div className="text-xs text-amber-300/80">
                      {leaderboardData[2].totalSessions} sessions •{" "}
                      {leaderboardData[2].streak} day streak
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Top 10 List */}
          <div
            className={`${
              darkMode
                ? "bg-gray-900/90 border-gray-800"
                : "bg-white/90 border-gray-200"
            } backdrop-blur-lg rounded-xl border overflow-hidden`}
          >
            <div
              className={`p-4 md:p-6 border-b ${
                darkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-lg md:text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Top 10 Leaders
              </h2>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Complete rankings for {selectedPeriod.toLowerCase()}
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-4 md:p-6 border-b ${
                      darkMode
                        ? "border-gray-800/50 hover:bg-gray-800/30"
                        : "border-gray-200/50 hover:bg-gray-100/30"
                    } transition-all duration-300 ${
                      index < 3
                        ? darkMode
                          ? "bg-gradient-to-r from-gray-800/20 to-transparent"
                          : "bg-gradient-to-r from-gray-100/30 to-transparent"
                        : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 md:w-12 flex-shrink-0">
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-bold ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-yellow-900"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                            : darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-gray-300 text-gray-900"
                        }`}
                      >
                        {user.rank}
                      </div>
                    </div>
                    {/* User Info */}
                    <div className="flex items-center flex-1 min-w-0 ml-3 md:ml-4">
                      <div className="relative flex-shrink-0 mr-3 md:mr-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-br from-yellow-400 to-amber-600"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-orange-700"
                              : "bg-gradient-to-br from-indigo-500 to-purple-600"
                          }`}
                        >
                          {user.avatar}
                        </div>
                        {user.badge && (
                          <div className="absolute -bottom-1 -right-1">
                            {getBadgeIcon(user.badge)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                          <div className="min-w-0">
                            <h3
                              className={`${
                                darkMode ? "text-white" : "text-gray-900"
                              } font-semibold text-sm md:text-base truncate`}
                            >
                              {user.name}
                            </h3>
                            <p
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } text-xs md:text-sm truncate`}
                            >
                              {user.level}
                            </p>
                          </div>
                          {/* Stats - Hidden on very small screens, shown as grid on mobile */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm">
                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="text-center">
                                <div
                                  className={`font-bold text-lg md:text-xl ${
                                    index < 3
                                      ? index === 0
                                        ? "bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent"
                                        : index === 1
                                        ? "bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent"
                                        : "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                                      : darkMode
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {user.studyHours}h
                                </div>
                                <div
                                  className={`${
                                    darkMode ? "text-gray-500" : "text-gray-500"
                                  } text-xs`}
                                >
                                  Study Time
                                </div>
                              </div>
                              <div className="text-center hidden sm:block">
                                <div className="text-indigo-400 font-semibold">
                                  {user.totalSessions}
                                </div>
                                <div
                                  className={`${
                                    darkMode ? "text-gray-500" : "text-gray-500"
                                  } text-xs`}
                                >
                                  Sessions
                                </div>
                              </div>
                              <div className="text-center hidden md:block">
                                <div className="text-emerald-400 font-semibold">
                                  {user.streak}
                                </div>
                                <div
                                  className={`${
                                    darkMode ? "text-gray-500" : "text-gray-500"
                                  } text-xs`}
                                >
                                  Day Streak
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomBar darkMode={darkMode} />
      {/* Modals */}
      {activeModal === "stats" && (
        <StatsModal
          closeModal={() => toggleModal("stats")}
          totalStudyTime={totalStudyTime}
          goalsCount={{ open: openGoals, completed: completedGoals }}
          darkMode={darkMode}
        />
      )}
      {activeModal === "background" && (
        <BackgroundModal
          closeModal={() => toggleModal("background")}
          setSelectedBackground={setSelectedBackground}
          selectedBackground={selectedBackground}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
