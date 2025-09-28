import React, { useState, useEffect } from "react";
import { User, Maestro } from "../types/auth";
import {Users,FileText,LogOut,Search,Eye,Download,BookOpen,TrendingUp,Calendar,Award,Clock,HelpCircle,Menu,X as XIcon,Copy,
  Key,
  UserPlus,
  RefreshCw
} from "lucide-react";
import StudentReportModal from "../modals/StudentReportModal";
import BulkReportModal from "../modals/BulkReportModal";
import TourGuide from "../pages/TourGuide";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const { user, logout, token } = useAuth() as { user: Maestro | null; logout: () => void; token: string };
  const navigate = useNavigate();

  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBulkReport, setShowBulkReport] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [classCode, setClassCode] = useState<string>("");
  const [codeExpiration, setCodeExpiration] = useState<Date | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bloques de matemáticas
  const mathBlocks = [
    { id: 1, name: "Números y Operaciones", topics: ["Suma", "Resta", "Multiplicación"], color: "bg-blue-500" },
    { id: 2, name: "Álgebra", topics: ["Ecuaciones", "Variables", "Expresiones"], color: "bg-green-500" },
    { id: 3, name: "Geometría", topics: ["Figuras", "Perímetro", "Área"], color: "bg-purple-500" },
    { id: 4, name: "Medición", topics: ["Longitud", "Peso", "Tiempo"], color: "bg-yellow-500" },
    { id: 5, name: "Estadística", topics: ["Gráficas", "Datos", "Probabilidad"], color: "bg-red-500" },
    { id: 6, name: "Fracciones", topics: ["Fracciones", "Decimales", "Porcentajes"], color: "bg-indigo-500" },
  ];

  useEffect(() => {
    console.log("User object:", user); // Depuración
    
    if (!user) {
      navigate("/login");
      return;
    }

    // Si el usuario ya tiene un código, cargarlo
    if (user.codigo_ninos) {
      setClassCode(user.codigo_ninos);
      setCodeExpiration(user.codigo_expira ? new Date(user.codigo_expira) : null);
    }

    // Cargar estudiantes desde el backend
    fetchStudents();

    // Mostrar tour si no se completó
    const tourCompleted = localStorage.getItem("tour-completed-teacher");
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, [user, navigate]);

  const fetchStudents = async () => {
    console.log("Fetching students for user:", user);
    
    if (!user) {
      setError("Usuario no válido");
      setLoadingStudents(false);
      return;
    }
    
    // Verificar si user tiene _id en lugar de id
    const userId = user.id || (user as any)._id;
    
    if (!userId) {
      setError("Usuario no tiene ID válido");
      setLoadingStudents(false);
      return;
    }
    
    setLoadingStudents(true);
    try {
      // Usar el endpoint correcto según tu backend
      const response = await fetch(`http://localhost:5000/api/maestros/${userId}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data received:", data); // Para depuración
        
        // Verificar la estructura de la respuesta
        let alumnosData = [];
        
        if (Array.isArray(data)) {
          // Si la respuesta es directamente un array
          alumnosData = data;
        } else if (data.alumnos && Array.isArray(data.alumnos)) {
          // Si la respuesta tiene propiedad alumnos
          alumnosData = data.alumnos;
        } else if (data.users && Array.isArray(data.users)) {
          // Si la respuesta tiene propiedad users
          alumnosData = data.users;
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
        
        // Convertir los usuarios a formato User
        const alumnosFormateados: User[] = alumnosData.map((alumno: any) => ({
          id: alumno._id || alumno.id,
          username: alumno.username || alumno.nombre || "Sin nombre",
          email: alumno.email || "Sin email",
          password: "", 
          grado: alumno.grado || user.grado || "1° A",
          codigo_maestro: alumno.codigo_maestro,
          maestro: alumno.maestro
        }));
        
        setStudents(alumnosFormateados);
        setError(null);
      } else if (response.status === 404) {
        // Si el endpoint no existe, mostrar mensaje
        console.log("Endpoint no encontrado");
        setError("No se encontró el endpoint para cargar estudiantes. Contacta al administrador.");
        setStudents([]);
      } else {
        throw new Error('Error al cargar los estudiantes');
      }
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
      setError("Error de conexión al cargar estudiantes.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const generateClassCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/maestros/generar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el código');
      }

      const data = await response.json();
      setClassCode(data.codigo_ninos);
      setCodeExpiration(new Date(data.codigo_expira));
      setShowCodeModal(true);
      
      // Actualizar el usuario en el contexto de autenticación
      if (user) {
        user.codigo_ninos = data.codigo_ninos;
        user.codigo_expira = data.codigo_expira;
      }
    } catch (error) {
      console.error("Error generando código:", error);
      setError("No se pudo generar el código. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatExpirationDate = (date: Date | null) => {
    if (!date) return "No expira";
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCodeExpired = (expirationDate: Date | null) => {
    if (!expirationDate) return false;
    return new Date() > expirationDate;
  };

  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStudent = (student: User) => {
    setSelectedStudent(student);
    setShowReportModal(true);
  };

  const getOverallClassProgress = () => {
    // Esta función debería obtener datos reales del backend
    // Por ahora devolvemos un valor fijo
    return 65;
  };

  const getTopPerformers = () => {
    // Esta función debería obtener datos reales del backend
    // Por ahora devolvemos los primeros 3 estudiantes
    return students.slice(0, 3);
  };

  const getStudentsNeedingHelp = () => {
    // Esta función debería obtener datos reales del backend
    // Por ahora devolvemos un valor fijo
    return students.length > 3 ? 2 : 0;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Panel de Maestro</h1>
                <p className="text-xs sm:text-sm text-gray-500">Bienvenido, {user.username}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Maestro</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowTour(true)}
                className="flex items-center px-2 sm:px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
              >
                <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Tour</span>
              </button>

              {/* Botón para generar código de clase */}
              <button
                onClick={generateClassCode}
                disabled={loading}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-md text-sm ${
                  loading 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "text-green-600 hover:text-green-800 hover:bg-green-50"
                }`}
              >
                <Key className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {loading ? "Generando..." : user.codigo_ninos ? "Ver Código" : "Generar Código"}
                </span>
              </button>

              {/* Botón para recargar estudiantes */}
              <button
                onClick={fetchStudents}
                disabled={loadingStudents}
                className="flex items-center px-2 sm:px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${loadingStudents ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={generateClassCode}
                  disabled={loading}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors text-sm ${
                    loading 
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                      : "text-green-600 hover:text-green-800 hover:bg-green-50"
                  }`}
                >
                  <Key className="w-4 h-4 mr-2" />
                  {loading ? "Generando..." : user.codigo_ninos ? "Ver Código" : "Generar Código"}
                </button>
                <button
                  onClick={fetchStudents}
                  disabled={loadingStudents}
                  className="flex items-center w-full px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loadingStudents ? "animate-spin" : ""}`} />
                  Actualizar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Alumnos</p>
              <p className="text-lg font-bold">{students.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Progreso Promedio</p>
              <p className="text-lg font-bold">{getOverallClassProgress()}%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Mejores Alumnos</p>
              <p className="text-lg font-bold">{getTopPerformers().length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
            <Clock className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Necesitan Ayuda</p>
              <p className="text-lg font-bold">{getStudentsNeedingHelp()}</p>
            </div>
          </div>
        </div>

        {/* Buscador y controles */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">
              {loadingStudents ? "Cargando..." : `${students.length} alumnos`}
            </span>
          </div>
        </div>

        {/* Lista de alumnos */}
        {loadingStudents ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hay estudiantes</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? "No se encontraron estudiantes con ese nombre" : "Aún no tienes estudiantes registrados"}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Comparte tu código de clase con los alumnos para que se unan
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{student.username}</h3>
                  <p className="text-sm text-gray-500">Grado: {student.grado}</p>
                  <p className="text-sm text-gray-500">Email: {student.email}</p>
                  
                  {/* Información de progreso (deberías obtener estos datos del backend) */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Progreso general: {getOverallClassProgress()}%
                    </p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${getOverallClassProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="flex items-center px-3 py-2 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Ver
                  </button>
                  <button
                    onClick={() => setShowBulkReport(true)}
                    className="flex items-center px-3 py-2 text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-all text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" /> Reporte
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODALES --- */}
      {showReportModal && selectedStudent && (
        <StudentReportModal
          student={selectedStudent}
          mathBlocks={mathBlocks}
          onClose={() => {
            setShowReportModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showBulkReport && (
        <BulkReportModal
          students={students}
          mathBlocks={mathBlocks}
          teacher={user}
          onClose={() => setShowBulkReport(false)}
        />
      )}

      {showTour && <TourGuide userRole="teacher" onComplete={() => setShowTour(false)} onSkip={() => setShowTour(false)} />}

      {/* Modal para mostrar el código de clase */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Código de Clase</h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Comparte este código con tus alumnos para que se unan a tu clase:
              </p>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-2xl font-bold tracking-wider text-blue-700">{classCode}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Copy className="w-5 h-5 mr-1" />
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Expiración:</strong> {formatExpirationDate(codeExpiration)}
                {codeExpiration && isCodeExpired(codeExpiration) && (
                  <span className="text-red-600 font-bold ml-2">(Expirado)</span>
                )}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Puedes generar un nuevo código en cualquier momento.
              </p>
            </div>
            
            <button
              onClick={() => setShowCodeModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;