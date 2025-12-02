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
    label: "Todo",
    url: "/",
    description: "Manage your tasks efficiently",
    icon: <Home size={15} />,
    color: "#93C5FD" // light pastel blue
  },
  {
    label: "Notes",
    url: "/notes",
    icon: <Book size={15} />,
    description: "Quick thoughts and documented ideas",
    color: "#FBCFE8" // soft pink pastel
  },
  {
    label: "Calendar",
    url: "/calendar",
    icon: <CalendarDays size={15} />,
    description: "Events, meetings & scheduling",
    color: "#FDE68A" // warm pastel yellow
  },
  {
    label: "Workout",
    url: "/workout",
    icon: <Dumbbell size={15} />,
    description: "Fitness logs and tracker",
    color: "#A7F3D0" // mint pastel green
  },
  {
    label: "Calculator",
    url: "/calculator",
    icon: <Calculator size={15} />,
    description: "Smart functional calculator",
    color: "#DDD6FE" // pastel purple
  },
  {
    label: "Menstruation",
    url: "/menstruation",
    icon: <Heart size={15} />,
    description: "Cycle tracking insights",
    color: "#FECACA" // soft rose
  },
  {
  label: "Habits",
  url: "/habits",
  icon: <CheckCircle size={15} />,
  description: "Daily habit tracking & streaks",
  color: "#BFDBFE" // soft pastel sky blue
},
{
  label: "Journal",
  url: "/journal",
  icon: <PenLine size={15} />,
  description: "Daily reflection and thoughts",
  color: "#E9D5FF" // soft lavender
},
];
