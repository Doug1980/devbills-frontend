import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut as firebaseSignOut,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { firebaseAuth, githubAuthProvider, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types/auth";

interface AuthContextProps {
  authState: AuthState;
  signWithGoogle: () => Promise<void>;
  signWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  // ✅ nova função de redefinição de senha
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({ user: null, error: null, loading: false });
        }
      },
      (error) => {
        console.error("Erro na Autenticação");
        setAuthState({ user: null, error: error.message, loading: false });
      },
    );

    return () => unsubscribe();
  }, []);

  const signWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const { user } = result;

      // ✅ verifica se há conta manual com o mesmo email e vincula
      const providerIds = user.providerData.map((p) => p.providerId);
      if (!providerIds.includes("password") && user.email) {
        // conta só tem Google — sem necessidade de vincular
      }

      setAuthState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        error: null,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao tentar logar com Google";
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  // ✅ login com GitHub
  const signWithGithub = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await signInWithPopup(firebaseAuth, githubAuthProvider);
      const { user } = result;
      setAuthState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        error: null,
        loading: false,
      });
    } catch (err: any) {
      if (err?.code === "auth/account-exists-with-different-credential") {
        try {
          const googleResult = await signInWithPopup(firebaseAuth, googleAuthProvider);
          await linkWithPopup(googleResult.user, githubAuthProvider);
          setAuthState({
            user: {
              uid: googleResult.user.uid,
              email: googleResult.user.email,
              displayName: googleResult.user.displayName,
              photoURL: googleResult.user.photoURL,
            },
            error: null,
            loading: false,
          });
        } catch (linkErr) {
          const message = "Erro ao vincular contas. Tente novamente.";
          setAuthState((prev) => ({ ...prev, loading: false, error: message }));
          throw new Error(message);
        }
        return;
      }

      const message = err instanceof Error ? err.message : "Erro ao tentar logar com GitHub";
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  };

  // ✅ login com email e senha
  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "Usuário não encontrado",
        "auth/wrong-password": "Senha incorreta",
        "auth/invalid-credential": "Email ou senha inválidos",
        "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
      };
      const message = errorMessages[err?.code] ?? "Erro ao fazer login";
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  };

  // ✅ cadastro com nome, email e senha
  // ✅ se o email já existe via Google, vincula automaticamente
  const signUpWithEmail = async (name: string, email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(user, { displayName: name });
      setAuthState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: null,
        },
        error: null,
        loading: false,
      });
    } catch (err: any) {
      // ✅ email já existe via Google — vincula email/senha à conta Google
      if (err?.code === "auth/email-already-in-use") {
        try {
          const googleResult = await signInWithPopup(firebaseAuth, googleAuthProvider);
          // ✅ vincula a credencial de email/senha à conta Google
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(googleResult.user, credential);
          // ✅ atualiza o nome se necessário
          if (!googleResult.user.displayName) {
            await updateProfile(googleResult.user, { displayName: name });
          }
          setAuthState({
            user: {
              uid: googleResult.user.uid,
              email: googleResult.user.email,
              displayName: googleResult.user.displayName ?? name,
              photoURL: googleResult.user.photoURL,
            },
            error: null,
            loading: false,
          });
          return;
        } catch (linkErr: any) {
          // ✅ se já está vinculado, só faz login normal
          if (linkErr?.code === "auth/provider-already-linked") {
            try {
              await signInWithEmailAndPassword(firebaseAuth, email, password);
              return;
            } catch {
              const message = "Erro ao fazer login. Tente novamente.";
              setAuthState((prev) => ({ ...prev, loading: false, error: message }));
              throw new Error(message);
            }
          }
          const message = "Erro ao vincular conta. Tente usar o botão 'Entrar com Google'.";
          setAuthState((prev) => ({ ...prev, loading: false, error: message }));
          throw new Error(message);
        }
      }

      const errorMessages: Record<string, string> = {
        "auth/weak-password": "Senha muito fraca — mínimo 6 caracteres",
        "auth/invalid-email": "Email inválido",
      };
      const message = errorMessages[err?.code] ?? "Erro ao criar conta";
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
      throw new Error(message);
    }
  };

  // ✅ redefinição de senha via email
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "Nenhuma conta encontrada com este email",
        "auth/invalid-email": "Email inválido",
      };
      const message = errorMessages[err?.code] ?? "Erro ao enviar email de redefinição";
      throw new Error(message);
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao sair";
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signWithGoogle,
        signWithGithub,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro um AuthProvider");
  }
  return context;
};
