"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserRole } from "@/lib/demo-data";

export type DemoUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
};

type StoredUser = DemoUser & { password: string };

type AuthResult = {
  ok: boolean;
  error?: string;
};

type RegisterInput = {
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: DemoUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
};

const USERS_KEY = "beelearn-users";
const CURRENT_USER_KEY = "beelearn-current-user";

const DEFAULT_USERS: StoredUser[] = [
  {
    id: "student-01",
    username: "student",
    password: "learn",
    name: "Nala Mokoena",
    email: "nala@beelearn.local",
    role: "student",
  },
  {
    id: "parent-01",
    username: "parent",
    password: "care",
    name: "Thabo Khumalo",
    email: "thabo@beelearn.local",
    role: "parent",
  },
];

function toPublicUser(user: StoredUser): DemoUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

function writeCurrentUser(user: DemoUser | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readUsers();
    setUser(readCurrentUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const users = readUsers();
    const match = users.find(
      (entry) => entry.username === username && entry.password === password
    );
    if (!match) {
      return { ok: false, error: "Invalid username or password." };
    }
    const publicUser = toPublicUser(match);
    setUser(publicUser);
    writeCurrentUser(publicUser);
    return { ok: true };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const users = readUsers();
    const exists = users.some((entry) => entry.username === input.username);
    if (exists) {
      return { ok: false, error: "That username is already taken." };
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      username: input.username,
      password: input.password,
      name: input.name,
      email: input.email,
      role: input.role,
    };
    const updated = [...users, newUser];
    writeUsers(updated);
    const publicUser = toPublicUser(newUser);
    setUser(publicUser);
    writeCurrentUser(publicUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
