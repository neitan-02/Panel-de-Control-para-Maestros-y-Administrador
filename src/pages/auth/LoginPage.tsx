// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { BookOpen, Users, Eye, EyeOff, ArrowLeft, User, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onShowRegister: () => void;
  onBackToLanding?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onShowRegister, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'teacher' | 'admin'>('teacher');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      
      // Redirigir según el rol del usuario
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (error: any) {
      console.error("Error completo:", error);
      setError(error.message || 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 relative">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel Educativo</h1>
            <p className="text-gray-600">Selecciona tu tipo de acceso</p>
          </div>

          {/* Tabs para seleccionar tipo de usuario */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Maestro
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                activeTab === 'admin'
                  ? 'bg-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-5 h-5 mr-2" />
              Administrador
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 bg-white/50 backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 px-4 rounded-xl hover:shadow-xl focus:ring-4 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 focus:ring-red-200'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-200'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                `Iniciar Sesión como ${activeTab === 'admin' ? 'Administrador' : 'Maestro'}`
              )}
            </button>
          </form>

          {/* Mostrar sección de registro solo para maestros */}
          {activeTab === 'teacher' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">¿No tienes cuenta como maestro?</p>
                <button
                  onClick={onShowRegister}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Registrarse como Maestro
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl">
            <h3 className="font-medium text-gray-900 mb-2 text-center">Credenciales de Prueba:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                <Shield className="w-4 h-4 text-red-500" />
                <span><strong>Admin:</strong> admin@escuela.edu / admin123</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span><strong>Maestro:</strong> maestro@escuela.edu / maestro123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;