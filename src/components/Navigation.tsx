import { NavLink } from "react-router-dom";
import { CreditCard, BookOpen, MessageCircle } from "lucide-react";

export function Navigation() {
  const navItems = [
    { path: "/", label: "充值系统", icon: CreditCard },
    // { path: "/tutorial", label: "使用教程", icon: BookOpen },
    // { path: "/contact", label: "联系客服", icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/openai.svg" alt="OpenAI Logo" className="w-8 h-8" />
            <span className="font-bold text-xl text-foreground">ChatGPT Plus 充值系统 - 测试自动化 nginx 部署5</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}