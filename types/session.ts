export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  verified: true;
};

export type SessionStatus = "loading" | "anonymous" | "ready";

export type SessionValue = {
  status: SessionStatus;
  user: SessionUser | null;
  isAdmin: boolean;
  setSession: (user: SessionUser, isAdmin: boolean) => void;
  logout: () => Promise<void>;
};
