// src/pages/auth/RegisterPage.tsx
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/auth";
import { useNavigate } from "react-router-dom";

interface RegisterPageProps {
  onBackToLogin: () => void;
}

const gradeOptions = ["1A°", "1B°", "1C°"];

const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    cct: "",
    grado: "",
    role: "maestro" as UserRole,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({...errors, [field]: ""});
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "El nombre es requerido";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    if (!formData.cct.trim()) {
      newErrors.cct = "El CCT es requerido";
    }
    
    if (!formData.grado) {
      newErrors.grado = "Debe seleccionar un grado";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        cct: formData.cct,
        grado: formData.grado,
        role: formData.role,
      });
      
      setSuccessMessage(result.message);
      setIsSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/teacher-dashboard");
      }, 2000);
      
    } catch (err: any) {
      setErrors({ submit: err.message || "Error al registrar el maestro" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-6">{successMessage}</p>
          <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20">
        <button 
          onClick={onBackToLogin} 
          className="mb-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Registro de Maestro</h1>
        <p className="mb-4 text-gray-600">Crea tu cuenta para acceder al sistema</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              value={formData.username} 
              onChange={e => handleInputChange("username", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
          </div>
          
          <div>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={formData.email} 
              onChange={e => handleInputChange("email", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Contraseña" 
              value={formData.password} 
              onChange={e => handleInputChange("password", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirmar contraseña" 
              value={formData.confirmPassword} 
              onChange={e => handleInputChange("confirmPassword", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <input 
              type="text" 
              placeholder="CCT" 
              value={formData.cct} 
              onChange={e => handleInputChange("cct", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.cct && <p className="text-red-600 text-sm mt-1">{errors.cct}</p>}
          </div>
          
          <div>
            <select 
              value={formData.grado} 
              onChange={e => handleInputChange("grado", e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un grado</option>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.grado && <p className="text-red-600 text-sm mt-1">{errors.grado}</p>}
          </div>

          {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{errors.submit}</div>}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;