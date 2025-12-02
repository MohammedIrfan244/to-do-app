import {
  Home,
  Book,
  CalendarDays,
  Dumbbell,
  Calculator,
  Heart,
  CheckCircle,
  PenLine,
} from "lucide-react";

interface NavItem {
  label: string;
  url: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export const navItems: NavItem[] = [
  {
    label: "Welcome",
    url: "/",
    description: "Good to see you :)",
    icon: <Home size={15} />,
    color: "#F87171" // more visible red
  },
  {
    label: "My Tasks",
    url: "/todo",
    description: "Let’s get things done",
    icon: <CheckCircle size={15} />,
    color: "#60A5FA" // deeper blue
  },
  {
    label: "My Notes",
    url: "/notes",
    icon: <Book size={15} />,
    description: "Little thoughts & big ideas",
    color: "#F472B6" // stronger pink
  },
  {
    label: "My Calendar",
    url: "/calendar",
    icon: <CalendarDays size={15} />,
    description: "What’s happening and when",
    color: "#FBBF24" // rich amber
  },
  {
    label: "My Workout",
    url: "/workout",
    icon: <Dumbbell size={15} />,
    description: "Move, track, grow stronger",
    color: "#34D399" // deeper green
  },
  {
    label: "Quick Calc",
    url: "/calculator",
    icon: <Calculator size={15} />,
    description: "Fast numbers when you need them",
    color: "#A78BFA" // stronger purple
  },
  {
    label: "Cycle Tracker",
    url: "/menstruation",
    icon: <Heart size={15} />,
    description: "A gentle guide for your cycle",
    color: "#FB7185" // stronger rose
  },
  {
    label: "Habits & Streaks",
    url: "/habits",
    icon: <Book size={15} />,
    description: "Build consistent routines",
    color: "#3B82F6" // strong blue
  },
  {
    label: "My Journal",
    url: "/journal",
    icon: <PenLine size={15} />,
    description: "Your safe space for reflection",
    color: "#C084FC" // visible violet
  },
];
