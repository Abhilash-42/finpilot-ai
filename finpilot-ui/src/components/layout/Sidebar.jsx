import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { navigation } from "@/config/navigation";
import UserProfile from "./UserProfile";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-white">

      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-7">

        <h1 className="text-3xl font-extrabold tracking-tight">

          <span className="text-orange-500">
            FinPilot
          </span>

          <span className="text-white">
            {" "}AI
          </span>

        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Personal Finance Assistant
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-4 py-6">

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon
                size={22}
                className="transition-transform duration-200 group-hover:scale-110"
              />

              <span className="font-medium">
                {item.title}
              </span>
            </NavLink>
          );
        })}

      </nav>

      {/* AI Assistant */}

      <NavLink
        to="/ai"
        className={({ isActive }) =>
          `mx-4 mb-4 block rounded-2xl border p-4 transition-all duration-200 ${
            isActive
              ? "border-orange-500 bg-orange-500/20 shadow-lg"
              : "border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20"
          }`
        }
      >
        <div className="flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-orange-400"
          />

          <p className="font-semibold">
            AI Assistant
          </p>

        </div>

        <p className="mt-2 text-sm text-slate-300">
          Ready to analyze your finances.
        </p>

      </NavLink>

      {/* User */}

      <UserProfile />

    </aside>
  );
}