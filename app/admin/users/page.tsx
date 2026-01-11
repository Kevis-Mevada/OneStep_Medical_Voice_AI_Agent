'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AppUser {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  createdAt: { seconds: number };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUsers(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchUsers = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin?type=users&userId=${userId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch users:", response.status);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response from API");
        return;
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-600">
              View and manage all registered users
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </header>

        {isLoading ? (
          <Card>
            <div className="p-8 text-center text-sm text-slate-600">Loading users...</div>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No users found</CardTitle>
              <CardDescription>
                No registered users in the system yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">User</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Role</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {user.displayName || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-[#DC2626] text-white"
                            : "bg-[#0F766E] text-white"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(user.createdAt.seconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
