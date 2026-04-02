import { Activity, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const {
    signWithGoogle,
    signWithGithub,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    authState,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSent(false);
    setLoading(true);
    try {
      await signInWithEmail(loginEmail, loginPassword);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ validação de senha forte
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(registerPassword)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial (!@#$%^&*)",
      );
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(registerName, registerEmail, registerPassword);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setError("");
    setLoading(true);
    try {
      await signWithGithub();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!loginEmail) {
      setError("Digite seu email acima para redefinir a senha");
      return;
    }
    setResetLoading(true);
    setError("");
    try {
      await resetPassword(loginEmail);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const inputClass = `block w-full rounded-xl border border-gray-700 bg-gray-800 
    px-4 py-3 text-sm text-gray-50 focus:outline-none focus:ring-2 
    focus:border-primary-500 input-focus`;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="w-10 h-10 text-primary-500" />
          <Link to="/" className="flex gap-2 text-4xl text-primary-500 items-center font-bold">
            DevBills PRO
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 bg-red-300 border border-red-700 rounded-xl p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {/* Sucesso reset */}
          {resetSent && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-primary-500 rounded-xl p-3 mb-4">
              <p className="text-sm text-primary-500">
                ✅ Email de redefinição enviado para <strong>{loginEmail}</strong>! Verifique sua
                caixa de entrada.
              </p>
            </div>
          )}

          {/* ✅ formulário de login */}
          {!showRegister && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className={`${inputClass} pr-10`}
                  />
                  {/* ✅ cursor-pointer no olho */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-50 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* ✅ cursor-pointer no esqueci senha */}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="mt-1 text-xs text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  {resetLoading ? "Enviando..." : "Esqueci minha senha"}
                </button>
              </div>
              {/* ✅ cursor-pointer no Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-gray-900 font-semibold py-3 rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
              </button>
            </form>
          )}

          {/* ✅ formulário de cadastro */}
          {showRegister && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Nome</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    // ✅ placeholder atualizado com requisitos
                    placeholder="Mín. 8 caracteres, 1 maiúscula e 1 especial"
                    required
                    className={`${inputClass} pr-10`}
                  />
                  {/* ✅ cursor-pointer no olho */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-50 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">
                  Confirmar senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  className={inputClass}
                />
              </div>
              {/* ✅ cursor-pointer no Salvar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-gray-900 font-semibold py-3 rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </button>
            </form>
          )}

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-400">ou continue com</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* ✅ botão Google */}
          <GoogleLoginButton onClick={handleGoogle} isLoading={loading} />

          {/* ✅ cursor-pointer no GitHub */}
          <button
            type="button"
            onClick={handleGithub}
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-3 border border-gray-400 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Entrar com GitHub
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-400">ou crie uma nova conta</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* ✅ cursor-pointer no Criar conta */}
          <button
            type="button"
            onClick={() => {
              setShowRegister(!showRegister);
              setError("");
              setResetSent(false);
            }}
            className="w-full bg-gray-600 border border-gray-400 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
          >
            {showRegister ? "← Voltar para login" : "Criar conta"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          DevBills 2026 — Desenvolvido por{" "}
          <span className="font-semibold text-gray-300">Douglas Salazar</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
