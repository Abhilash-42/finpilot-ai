import { Search, Bell, Moon, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const displayName =
    user?.full_name ||
    user?.name ||
    "Abhilash";

  const email =
    user?.email ||
    "AI & ML Student";

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-slate-200 bg-white/90 backdrop-blur-lg">

      <div className="flex h-full items-center justify-between px-8">

        {/* Search */}

        <div className="relative w-[420px]">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <Input
            placeholder="Search transactions..."
            className="h-12 rounded-xl border-slate-200 pl-11 shadow-sm"
          />

        </div>

        {/* Right */}

        <div className="flex items-center gap-6">

          <button className="relative rounded-xl p-2 transition hover:bg-slate-100">

            <Bell size={22} />

            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />

          </button>

          <button className="rounded-xl p-2 transition hover:bg-slate-100">

            <Moon size={22} />

          </button>

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100">

                <Avatar>

                  <AvatarFallback className="bg-orange-500 text-white">

                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}

                  </AvatarFallback>

                </Avatar>

                <div className="text-left">

                  <p className="font-semibold">

                    {displayName}

                  </p>

                  <p className="text-xs text-slate-500">

                    {email}

                  </p>

                </div>

                <ChevronDown size={18} />

              </button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem>

                Profile

              </DropdownMenuItem>

              <DropdownMenuItem>

                Settings

              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </div>

    </header>
  );
}