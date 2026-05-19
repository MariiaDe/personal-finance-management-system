import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Icon from "./Icon";
import { useTheme } from "../context/useTheme";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: "/dashboard", label: "Дашборд", icon: "dashboard" },
    { to: "/transactions", label: "Операції", icon: "transactions" },
    { to: "/categories", label: "Категорії", icon: "categories" },
    { to: "/budgets", label: "Бюджети", icon: "budget" },
    { to: "/goals", label: "Цілі", icon: "goals" },
    { to: "/statistics", label: "Статистика", icon: "statistics" },
    { to: "/profile", label: "Профіль", icon: "profile" }
  ];

  return (
    <div className="nav-shell">
      <button className="nav-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        <Icon name={open ? "close" : "menu"} className="nav-toggle__icon" />
        <span>Меню</span>
      </button>

      <nav className={`navbar ${open ? "is-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            <Icon name={link.icon} className="nav-link__icon" />
            <span>{link.label}</span>
          </Link>
        ))}

        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          <Icon name={theme === "dark" ? "sun" : "moon"} className="nav-link__icon" />
          <span>{theme === "dark" ? "Світла тема" : "Темна тема"}</span>
        </button>
      </nav>
    </div>
  );
}
