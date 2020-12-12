import { useContext, createContext } from "react";
import { useProvideAuth } from "hooks/useProvideAuth";
import type { User} from 'interfaces/user'
import type { LoginInput, AuthorizeInput } from 'interfaces/input'

interface AuthContextType {
  user: User | null;
  error: string | null;
  loading: boolean;
  login: (input: LoginInput) => void
  logout: () => void
  authorize: (input: AuthorizeInput) => void
}

const AuthContext = createContext<AuthContextType|null>(null);

export function useAuth(): AuthContextType {
  const context = useContext<AuthContextType|null>(AuthContext);
  if (context === null) {
    throw new Error("useAuth must belong to AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC = ({ children }): React.ReactElement => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
