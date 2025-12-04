import { 
  Home, CheckCircle, StickyNote, CalendarDays, Dumbbell, 
  Calculator, Image as ImageIcon, Moon, Heart, Zap, 
  PenLine, Rocket, BookOpen, Archive, Hourglass 
} from "lucide-react";

export interface NavItem {
  label: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: "Dashboard" | "Creation" | "Wellness" | "Personal";
  animationClass: string;
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    url: "/",
    description: "Your comfy starting point. Good vibes only.",
    icon: <Home size={18} />,
    color: "#F87171",
    category: "Dashboard",
    animationClass: "animate-home"
  },
  {
    label: "My To-Dos",
    url: "/todo",
    description: "Let's get that sweet, sweet done feeling.",
    icon: <CheckCircle size={18} />,
    color: "#60A5FA",
    category: "Personal",
    animationClass: "animate-check"
  },
  {
    label: "My Calendar",
    url: "/calendar",
    icon: <CalendarDays size={18} />,
    description: "Plotting the adventures and chilling time.",
    color: "#FBBF24",
    category: "Personal",
    animationClass: "animate-calendar"
  },
  {
    label: "Reading List",
    url: "/books",
    icon: <BookOpen size={18} />,
    description: "Escaping reality, one chapter at a time.",
    color: "#34D399",
    category: "Personal",
    animationClass: "animate-book"
  },
  {
    label: "Habits & Streaks",
    url: "/habits",
    icon: <Zap size={18} />,
    description: "Consistency is the cheat code to life.",
    color: "#F59E0B",
    category: "Personal",
    animationClass: "animate-zap"
  },
  {
    label: "My Journal",
    url: "/journal",
    icon: <PenLine size={18} />,
    description: "Your safe space to vent and reflect.",
    color: "#C084FC",
    category: "Personal",
    animationClass: "animate-journal"
  },
  {
    label: "Photo Album",
    url: "/album",
    icon: <ImageIcon size={18} />,
    description: "Memories are just a click away.",
    color: "#FCD34D",
    category: "Personal",
    animationClass: "animate-photo"
  },
  {
    label: "Workouts",
    url: "/workout",
    icon: <Dumbbell size={18} />,
    description: "Get those endorphins movin' and groovin'.",
    color: "#4ADE80",
    category: "Wellness",
    animationClass: "animate-dumbbell"
  },
  {
    label: "Sleep Tracker",
    url: "/sleep",
    icon: <Moon size={18} />,
    description: "Optimizing rest for maximum chill.",
    color: "#6366F1",
    category: "Wellness",
    animationClass: "animate-moon"
  },
  {
    label: "Cycle Tracker",
    url: "/menstruation",
    icon: <Heart size={18} />,
    description: "Staying in tune with the body's flow.",
    color: "#FB7185",
    category: "Wellness",
    animationClass: "animate-heart"
  },
  {
    label: "My Projects",
    url: "/projects",
    icon: <Rocket size={18} />,
    description: "Where the magic and big things happen.",
    color: "#FB923C",
    category: "Creation",
    animationClass: "animate-rocket"
  },
  {
    label: "Focus Time",
    url: "/focus",
    icon: <Hourglass size={18} />,
    description: "Lock out the noise, lock in the flow.",
    color: "#A78BFA",
    category: "Creation",
    animationClass: "animate-hourglass"
  },
  {
    label: "My Notes",
    url: "/notes",
    icon: <StickyNote size={18} />,
    description: "Catching those random brainstorms before they fly away.",
    color: "#F472B6",
    category: "Creation",
    animationClass: "animate-note"
  },
  {
    label: "Resources Stash",
    url: "/resources",
    icon: <Archive size={18} />,
    description: "My favorite digital tools and goodies.",
    color: "#2DD4BF",
    category: "Creation",
    animationClass: "animate-archive"
  },
  {
    label: "Quick Calc",
    url: "/calculator",
    icon: <Calculator size={18} />,
    description: "Math? We just need fast answers.",
    color: "#818CF8",
    category: "Creation",
    animationClass: "animate-calc"
  }
];
