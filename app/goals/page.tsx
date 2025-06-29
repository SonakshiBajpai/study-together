"use client";
import React, { useState } from "react";
import {
  Target,
  Plus,
  Check,
  Clock,
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Zap,
  X,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronRight,
  Info,
} from "lucide-react";

interface Goal {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
  completedAt?: Date;
}

interface GoalStats {
  total: number;
  completed: number;
  open: number;
  completedToday: number;
  streak: number;
}

export default function StudyGoalsContent() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      text: "waakQMFAEKIM",
      completed: false,
      priority: "high",
      category: "Study",
      createdAt: new Date(),
    },
    {
      id: 2,
      text: "sinoafnofr",
      completed: false,
      priority: "medium",
      category: "Personal",
      createdAt: new Date(),
    },
  ]);

  const [completedGoals, setCompletedGoals] = useState<Goal[]>([
    {
      id: 100,
      text: "Complete morning routine",
      completed: true,
      priority: "medium",
      category: "Personal",
      createdAt: new Date(Date.now() - 86400000),
      completedAt: new Date(),
    },
    {
      id: 101,
      text: "Review chemistry notes",
      completed: true,
      priority: "high",
      category: "Study",
      createdAt: new Date(Date.now() - 172800000),
      completedAt: new Date(),
    },
    {
      id: 102,
      text: "Organize study materials",
      completed: true,
      priority: "low",
      category: "Organization",
      createdAt: new Date(Date.now() - 259200000),
      completedAt: new Date(),
    },
    {
      id: 103,
      text: "Practice math problems",
      completed: true,
      priority: "high",
      category: "Study",
      createdAt: new Date(Date.now() - 345600000),
      completedAt: new Date(),
    },
    {
      id: 104,
      text: "Read 30 minutes",
      completed: true,
      priority: "medium",
      category: "Reading",
      createdAt: new Date(Date.now() - 432000000),
      completedAt: new Date(),
    },
    {
      id: 105,
      text: "Complete assignment draft",
      completed: true,
      priority: "high",
      category: "Study",
      createdAt: new Date(Date.now() - 518400000),
      completedAt: new Date(),
    },
    {
      id: 106,
      text: "Plan next week schedule",
      completed: true,
      priority: "medium",
      category: "Planning",
      createdAt: new Date(Date.now() - 604800000),
      completedAt: new Date(),
    },
    {
      id: 107,
      text: "Exercise for 30 minutes",
      completed: true,
      priority: "medium",
      category: "Health",
      createdAt: new Date(Date.now() - 691200000),
      completedAt: new Date(),
    },
    {
      id: 108,
      text: "Prepare presentation slides",
      completed: true,
      priority: "high",
      category: "Study",
      createdAt: new Date(Date.now() - 777600000),
      completedAt: new Date(),
    },
    {
      id: 109,
      text: "Clean study space",
      completed: true,
      priority: "low",
      category: "Organization",
      createdAt: new Date(Date.now() - 864000000),
      completedAt: new Date(),
    },
    {
      id: 110,
      text: "Review flashcards",
      completed: true,
      priority: "medium",
      category: "Study",
      createdAt: new Date(Date.now() - 950400000),
      completedAt: new Date(),
    },
  ]);

  const [newGoal, setNewGoal] = useState("");
  const [activeTab, setActiveTab] = useState<"open" | "completed">("open");
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedCategory, setSelectedCategory] = useState("Study");
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [categories, setCategories] = useState(["Study", "Personal", "Health", "Organization", "Reading", "Planning"]);

  const stats: GoalStats = {
    total: goals.length + completedGoals.length,
    completed: completedGoals.length,
    open: goals.length,
    completedToday: completedGoals.filter(
      (goal) => goal.completedAt && new Date(goal.completedAt).toDateString() === new Date().toDateString()
    ).length,
    streak: 5,
  };

  const addGoal = () => {
    if (newGoal.trim() !== "") {
      const goal: Goal = {
        id: Date.now(),
        text: newGoal,
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        createdAt: new Date(),
      };
      setGoals([...goals, goal]);
      setNewGoal("");
    }
  };

  const toggleGoal = (id: number) => {
    const goalToToggle = goals.find((goal) => goal.id === id);
    if (goalToToggle) {
      const updatedGoal = { ...goalToToggle, completed: true, completedAt: new Date() };
      setGoals(goals.filter((goal) => goal.id !== id));
      setCompletedGoals([updatedGoal, ...completedGoals]);
    } else {
      const goalToToggle = completedGoals.find((goal) => goal.id === id);
      if (goalToToggle) {
        const updatedGoal = { ...goalToToggle, completed: false };
        delete updatedGoal.completedAt;
        setCompletedGoals(completedGoals.filter((goal) => goal.id !== id));
        setGoals([...goals, updatedGoal]);
      }
    }
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    setCompletedGoals(completedGoals.filter((goal) => goal.id !== id));
  };

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = () => {
    if (editText.trim() !== "") {
      setGoals(goals.map((goal) => 
        goal.id === editingGoal ? { ...goal, text: editText } : goal
      ));
      setCompletedGoals(completedGoals.map((goal) => 
        goal.id === editingGoal ? { ...goal, text: editText } : goal
      ));
    }
    setEditingGoal(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setEditText("");
  };

  // Navigation functions
  const handleStartStudySession = () => {
    // Navigate to solo study section
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('navigate-to-route', { detail: 'solostudy' });
      window.dispatchEvent(event);
    }
  };

  const handleReviewGoals = () => {
    // Scroll to top of the page
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWeeklyReport = () => {
    const event = new CustomEvent('navigate-to-route', { detail: 'solostudy' });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  };

  const handleAddNewSection = () => {
    // Add a new category to the categories list
    const newSectionName = prompt("Enter the name for the new section:");
    if (newSectionName && newSectionName.trim() !== "" && !categories.includes(newSectionName.trim())) {
      setCategories([...categories, newSectionName.trim()]);
      setSelectedCategory(newSectionName.trim());
      const input = document.querySelector('input[placeholder="Type a goal..."]') as HTMLInputElement;
      input?.focus();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-900/20";
      case "medium": return "text-yellow-400 bg-yellow-900/20";
      case "low": return "text-green-400 bg-green-900/20";
      default: return "text-gray-400 bg-gray-900/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Study": return <BookOpen size={14} />;
      case "Health": return <Zap size={14} />;
      case "Personal": return <Target size={14} />;
      case "Organization": return <Award size={14} />;
      case "Reading": return <BookOpen size={14} />;
      case "Planning": return <Calendar size={14} />;
      default: return <Target size={14} />;
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-purple-900/10"></div>
      </div>
      
      <div className="relative z-10 h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 px-4 md:px-8 py-6 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  What do you want to achieve?
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                  Hi <span className="text-purple-400 font-semibold">@Dream</span>, set yourself up for success! 🚀
                </p>
              </div>
              <div className="text-right">
                <div className="text-orange-400 font-medium text-sm md:text-base">🌅 Sunday, 29 Jun</div>
              </div>
            </div>

            {/* Goal Input */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center bg-gray-800/80 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-colors gap-2 md:gap-0">
              <div className="flex items-center flex-1">
                <Target size={20} className="text-purple-400 ml-4" />
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-400 outline-none"
                  placeholder="Type a goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGoal()}
                />
              </div>
              
              <div className="flex items-center px-4 md:px-0 gap-2">
                {/* Priority Selector */}
                <select
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm flex-1 md:flex-none"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as "low" | "medium" | "high")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                {/* Category Selector */}
                <select
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm flex-1 md:flex-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <button
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg rounded-md"
                  onClick={addGoal}
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Goals Section */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex mb-6 bg-gray-800/60 rounded-lg p-1">
                <button
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 font-medium ${
                    activeTab === "open"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("open")}
                >
                  Open Goals
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 font-medium ${
                    activeTab === "completed"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed Goals
                </button>
              </div>

              {/* Goals List */}
              <div className="space-y-3">
                {activeTab === "open" && (
                  <>
                    {goals.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Target size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No open goals yet. Add one above to get started!</p>
                      </div>
                    ) : (
                      goals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onToggle={toggleGoal}
                          onDelete={deleteGoal}
                          onEdit={startEditing}
                          isEditing={editingGoal === goal.id}
                          editText={editText}
                          setEditText={setEditText}
                          onSaveEdit={saveEdit}
                          onCancelEdit={cancelEdit}
                          getPriorityColor={getPriorityColor}
                          getCategoryIcon={getCategoryIcon}
                        />
                      ))
                    )}
                  </>
                )}

                {activeTab === "completed" && (
                  <>
                    {completedGoals.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Check size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No completed goals yet. Complete some goals to see them here!</p>
                      </div>
                    ) : (
                      completedGoals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onToggle={toggleGoal}
                          onDelete={deleteGoal}
                          onEdit={startEditing}
                          isEditing={editingGoal === goal.id}
                          editText={editText}
                          setEditText={setEditText}
                          onSaveEdit={saveEdit}
                          onCancelEdit={cancelEdit}
                          getPriorityColor={getPriorityColor}
                          getCategoryIcon={getCategoryIcon}
                        />
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Goals Stats */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Goals stats</h3>
                  <Info size={18} className="text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-400">{stats.open}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Open</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Completed</div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Today's completed</span>
                    <span className="text-emerald-400 font-semibold">{stats.completedToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current streak</span>
                    <span className="text-orange-400 font-semibold">{stats.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total goals</span>
                    <span className="text-purple-400 font-semibold">{stats.total}</span>
                  </div>
                </div>
              </div>

              {/* Why Goal Setting */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Why goal setting?</h3>
                  <span className="ml-2">🧠</span>
                </div>
                
                <div className="text-sm text-gray-300 leading-relaxed space-y-3">
                  <p>
                    Goal definition, <span className="text-indigo-400 font-semibold">determination</span> and focus pay off. Define goals, recapitulate them regularly - and celebrate your achievements and <span className="text-purple-400 font-semibold">progress</span>. It will not just <span className="text-emerald-400 font-semibold">motivate</span> you but also improve your abilities to better assess your <span className="text-orange-400 font-semibold">workload</span>.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <TrendingUp size={14} className="text-indigo-400" />
                    <span>Track Progress</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Award size={14} className="text-emerald-400" />
                    <span>Celebrate Wins</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Zap size={14} className="text-purple-400" />
                    <span>Stay Motivated</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock size={14} className="text-orange-400" />
                    <span>Manage Time</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleStartStudySession}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-between"
                  >
                    <span>Start Study Session</span>
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={handleReviewGoals}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Review Goals</span>
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={handleWeeklyReport}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Weekly Report</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Goal Item Component
interface GoalItemProps {
  goal: Goal;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (goal: Goal) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  getPriorityColor: (priority: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}

function GoalItem({
  goal,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
  getPriorityColor,
  getCategoryIcon,
}: GoalItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`group flex items-center p-4 rounded-xl transition-all duration-300 border ${
        goal.completed
          ? "bg-emerald-900/20 hover:bg-emerald-900/30 border-emerald-800/50"
          : "bg-gray-800/60 hover:bg-gray-800/80 border-gray-700"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full mr-4 cursor-pointer transition-all duration-300 ${
          goal.completed
            ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900"
            : "border border-gray-500 hover:border-white"
        }`}
        onClick={() => onToggle(goal.id)}
      >
        {goal.completed && <Check size={14} />}
      </div>

      {/* Goal Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") onSaveEdit();
                if (e.key === "Escape") onCancelEdit();
              }}
              autoFocus
            />
            <button
              onClick={onSaveEdit}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Check size={14} />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3 mb-2">
              <span
                className={`text-sm ${
                  goal.completed ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {goal.text}
              </span>
              
              {/* Priority Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  goal.priority
                )}`}
              >
                {goal.priority}
              </span>
            </div>

            {/* Category and Date */}
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                {getCategoryIcon(goal.category)}
                <span>{goal.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{goal.createdAt.toLocaleDateString()}</span>
              </div>
              {goal.completedAt && (
                <div className="text-emerald-400">
                  ✓ {goal.completedAt.toLocaleDateString()}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="relative">
          <button
            className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreHorizontal size={16} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit(goal);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onDelete(goal.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 