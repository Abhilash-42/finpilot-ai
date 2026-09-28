import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();

  const name = user?.full_name || "Abhilash";
  const email = user?.email || "user@example.com";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div className="border-t border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-orange-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <p className="truncate font-semibold text-white">
            {name}
          </p>

          <p className="truncate text-xs text-slate-400">
            {email}
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}