import { useEffect } from "react";
import { useNavigate } from "react-router";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { signWithGoogle, AuthState } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signWithGoogle();
    } catch (err) {
      console.error("Erro ao fazer o login com o Google", err);
    }
  };

  useEffect(() => {
    if (AuthState.user && !AuthState.loading) {
      navigate("/dashboard");
    }
  }, [AuthState.user, AuthState.loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <header>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">DevBills</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Gerencie suas finanças de forma simples e eficiente
            </p>
          </header>

          <main className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 space-y-6">
            <section className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Faça o login para continuar</h2>
              <p className="mt-1 text-sm text-gray-600">
                Acesse sua conta para começar a gerenciar suas finanças
              </p>
            </section>

            <GoogleLoginButton onClick={handleLogin} isLoading={false} />

            {AuthState.error && (
              <div className="bg-red-300 text-center text-red-700 mt-4">
                <p>{AuthState.error} Erro no sistema</p>
              </div>
            )}
            <footer className="mt-6">
              <p className="mt-1 text-sm text-gray-600 text-center">
                Ao fazer Login, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;
