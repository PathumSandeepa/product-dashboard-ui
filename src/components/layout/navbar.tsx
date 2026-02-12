"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function Navbar() {
   const { user, logoutAsync } = useAuthStore();
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const profileRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            profileRef.current &&
            !profileRef.current.contains(event.target as Node)
         ) {
            setIsProfileOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b shadow-sm">
         <div className="flex items-center justify-between h-full px-4 md:px-8">
            <span className="text-base font-bold tracking-tight text-foreground">
               PRODUCT DASHBOARD
            </span>

            <div className="relative" ref={profileRef}>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
               >
                  <User className="size-4" />
                  Profile
               </Button>

               {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-popover text-popover-foreground shadow-lg p-4 animate-in fade-in-0 zoom-in-95">
                     <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                           {(user?.name ?? "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </div>
                        <div className="min-w-0">
                           <p className="font-medium text-sm truncate">
                              {user?.name ?? "User"}
                           </p>
                           <p className="text-xs text-muted-foreground truncate">
                              {user?.email ?? ""}
                           </p>
                        </div>
                     </div>

                     <div className="pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Email verified
                           </span>
                           {user?.email_verified_at ? (
                              <span className="text-green-500 text-xs font-medium">
                                 ✓ Verified
                              </span>
                           ) : (
                              <span className="text-yellow-500 text-xs font-medium">
                                 ✗ Unverified
                              </span>
                           )}
                        </div>
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Member since
                           </span>
                           <span className="text-xs">
                              {user?.created_at?.split("T")[0] ?? "—"}
                           </span>
                        </div>
                     </div>

                     <div className="pt-3 mt-3 border-t">
                        <Button
                           variant="outline"
                           size="sm"
                           className="w-full"
                           onClick={async () => {
                              await logoutAsync();
                              window.location.href = "/login";
                           }}
                        >
                           <LogOut className="size-4" />
                           Logout
                        </Button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </nav>
   );
}
