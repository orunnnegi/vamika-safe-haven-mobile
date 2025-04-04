
import { Home, Phone, AlertTriangle, Map, LifeBuoy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: Home
    },
    {
      name: "Contacts",
      path: "/emergency-contacts",
      icon: Phone
    },
    {
      name: "Reports",
      path: "/incident-reports",
      icon: AlertTriangle
    },
    {
      name: "Safe Spots",
      path: "/safe-spots",
      icon: Map
    },
    {
      name: "Resources",
      path: "/resources",
      icon: LifeBuoy
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex justify-between items-center px-4 z-50">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
