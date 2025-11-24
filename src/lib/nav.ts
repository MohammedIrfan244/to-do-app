

interface NavItem {
    label: string;
    url: string;
}


export const navItems: NavItem[] = [
    { label: "Todo", url: "/" },
    { label: "Notes", url: "/notes" },
    { label: "Calendar", url: "/calendar" },
];