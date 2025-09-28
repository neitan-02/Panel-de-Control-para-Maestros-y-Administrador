import React, { useState, useEffect } from 'react';
import { User, Student, SupportTicket } from '../types/auth';
import { LogOut, Users, BookOpen, Settings, Key, Search, Eye, MessageSquare, AlertTriangle, Clock, CheckCircle, XCircle, Filter, Send, Reply, HelpCircle, Shield, Menu, X as XIcon } from 'lucide-react';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import SupportTicketModal from '../modals/SupportTicketModal';
import CreateTicketModal from '../modals/CreateTicketModal';
import RespondTicketModal from '../modals/RespondTicketModal';
import TourGuide from './TourGuide';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showChangePassword, setShowChangePassword] = useState<User | null>(null);
  const [showTicketModal, setShowTicketModal] = useState<SupportTicket | null>(null);
  const [showRespondTicket, setShowRespondTicket] = useState<SupportTicket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const teachers = registeredUsers.filter((u: User) => u.role === 'teacher');
    setUsers(teachers);

    // Load sample students
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'María González',
        teacherId: 'teacher-1',
        grade: '1° A',
        progress: { block1: 85, block2: 70, block3: 92, block4: 60, block5: 75, block6: 80 },
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Carlos López',
        teacherId: 'teacher-1',
        grade: '1° A',
        progress: { block1: 75, block2: 85, block3: 68, block4: 90, block5: 82, block6: 70 },
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'Ana Martínez',
        teacherId: 'teacher-2',
        grade: '1° B',
        progress: { block1: 95, block2: 88, block3: 90, block4: 85, block5: 92, block6: 94 },
        lastUpdated: new Date()
      },
      {
        id: '4',
        name: 'Pedro Rodríguez',
        teacherId: 'teacher-2',
        grade: '1° B',
        progress: { block1: 60, block2: 65, block3: 58, block4: 70, block5: 62, block6: 68 },
        lastUpdated: new Date()
      }
    ];
    setStudents(sampleStudents);
    setFilteredStudents(sampleStudents);

    // Load sample tickets
    const sampleTickets: SupportTicket[] = [
      {
        id: '1',
        type: 'student_issue',
        priority: 'high',
        status: 'open',
        title: 'Problema con ejercicios de fracciones',
        description: 'El alumno Juan Pérez tiene dificultades para entender las fracciones equivalentes.',
        reportedBy: {
          id: 'teacher-1',
          name: 'Prof. María García',
          role: 'teacher',
          email: 'maria@escuela.edu'
        },
        studentAffected: {
          id: '1',
          name: 'Juan Pérez',
          grade: '1° A'
        },
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: '2',
        type: 'teacher_request',
        priority: 'medium',
        status: 'resolved',
        title: 'Solicitud de material adicional',
        description: 'Necesito más ejercicios de geometría para estudiantes avanzados.',
        reportedBy: {
          id: 'teacher-2',
          name: 'Prof. Carlos López',
          role: 'teacher',
          email: 'carlos@escuela.edu'
        },
        createdAt: new Date('2024-01-14T14:20:00Z'),
        updatedAt: new Date('2024-01-15T09:15:00Z'),
        resolvedAt: new Date('2024-01-15T09:15:00Z'),
        resolution: 'Se han agregado 20 ejercicios adicionales de geometría avanzada al sistema.'
      }
    ];
    setTickets(sampleTickets);
    setFilteredTickets(sampleTickets);
  }, []);

  useEffect(() => {
    // Filter tickets based on search term and status
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter]);

  useEffect(() => {
    // Filter students based on search term
    let filtered = students;

    if (studentSearchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(studentSearchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, studentSearchTerm]);

  const handleChangePassword = (teacherId: string, newPassword: string) => {
    // In a real app, this would update the password in the backend
    console.log(`Changing password for teacher ${teacherId} to ${newPassword}`);
    setShowChangePassword(null);
    alert('Contraseña cambiada exitosamente');
  };

  const handleRespondTicket = (ticketId: string, response: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'in_progress' as const,
          resolution: response,
          updatedAt: new Date()
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'urgent':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;

    return { total, open, inProgress, resolved };
  };

  const stats = getTicketStats();

  const renderTeachers = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
            Maestros Registrados ({users.length})
          </h3>
        </div>
        
        <div className="p-4 sm:p-6">
          {users.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay maestros registrados</h3>
              <p className="text-gray-500">Los maestros aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {users.map((teacher) => (
                <div key={teacher.id} className="bg-gradient-to-r from-white to-blue-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-full flex-shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{teacher.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {teacher.grade}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            CCT: {teacher.cct}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowChangePassword(teacher)}
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
              Gestión de Alumnos ({students.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar alumnos..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {studentSearchTerm ? 'No se encontraron alumnos' : 'No hay alumnos registrados'}
              </h3>
              <p className="text-gray-500">
                {studentSearchTerm ? 'Intenta con otro término de búsqueda' : 'Los alumnos aparecerán aquí cuando los maestros los registren'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const teacher = users.find(u => u.id === student.teacherId);
                
                return (
                  <div key={student.id} className="bg-gradient-to-r from-white to-green-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full flex-shrink-0">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.grade}</p>
                          {teacher && (
                            <p className="text-xs text-gray-500">Maestro: {teacher.name}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowChangePassword({ 
                          id: student.id, 
                          name: student.name, 
                          email: `${student.name.toLowerCase().replace(' ', '.')}@alumno.edu`,
                          role: 'teacher',
                          grade: student.grade,
                          createdAt: new Date()
                        } as User)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium hover:-translate-y-0.5 w-full sm:w-auto"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Cambiar Contraseña
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Support Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Abiertos</p>
              <p className="text-lg sm:text-xl font-bold text-yellow-600">{stats.open}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Resueltos</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="open">Abiertos</option>
            <option value="in_progress">En Progreso</option>
            <option value="resolved">Resueltos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reportes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Intenta ajustar tu búsqueda o filtros.'
                  : 'Los reportes de los maestros aparecerán aquí.'}
              </p>
              <button
                onClick={() => setShowCreateTicket(true)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                Crear Ticket de Prueba
              </button>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-gradient-to-r from-white to-purple-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center">
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 text-xs text-gray-600 capitalize">{ticket.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{ticket.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Por: {ticket.reportedBy.name}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString('es-MX')}</span>
                      {ticket.studentAffected && (
                        <span>Alumno: {ticket.studentAffected.name}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setShowTicketModal(ticket)}
                      className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium hover:-translate-y-0.5"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </button>
                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                      <button
                        onClick={() => setShowRespondTicket(ticket)}
                        className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium hover:-translate-y-0.5"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Responder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* App Logo */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-xs sm:text-sm text-gray-500">Bienvenido, {user.name}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Admin</h1>
              </div>
              
              {/* Company Logo - Hidden on mobile */}
              <div className="ml-6 hidden lg:flex items-center">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-xl mr-2 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    EduTech Solutions
                  </p>
                  <p className="text-xs text-gray-500">Innovación Educativa</p>
                </div>
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
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={onLogout}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <ul className="space-y-2">
                <li>
                  <button
                    id="teachers-tab"
                    onClick={() => setActiveTab('teachers')}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'teachers'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                    <span>Maestros</span>
                  </button>
                </li>
                <li>
                  <button
                    id="students-tab"
                    onClick={() => setActiveTab('students')}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'students'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                    <span>Alumnos</span>
                  </button>
                </li>
                <li>
                  <button
                    id="support-tab"
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'support'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                    <span>Soporte</span>
                    {stats.open > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        {stats.open}
                      </span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'teachers' && renderTeachers()}
            {activeTab === 'students' && renderStudents()}
            {activeTab === 'support' && renderSupport()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showChangePassword && (
        <ChangePasswordModal
          teacher={showChangePassword}
          onClose={() => setShowChangePassword(null)}
          onChangePassword={handleChangePassword}
        />
      )}

      {showCreateTicket && (
        <CreateTicketModal
          teachers={users.filter(u => u.role === 'teacher')}
          students={students}
          onCreate={(ticket) => {
            const newTicket = {
              ...ticket,
              id: `ticket-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setTickets(prev => [...prev, newTicket]);
            setShowCreateTicket(false);
          }}
          onClose={() => setShowCreateTicket(false)}
        />
      )}

      {showTicketModal && (
        <SupportTicketModal
          ticket={showTicketModal}
          teachers={users}
          students={students}
          onUpdate={(ticketId, updates) => {
            setTickets(prev => prev.map(t => 
              t.id === ticketId ? { ...t, ...updates, updatedAt: new Date() } : t
            ));
          }}
          onClose={() => setShowTicketModal(null)}
        />
      )}

      {showRespondTicket && (
        <RespondTicketModal
          ticket={showRespondTicket}
          onRespond={handleRespondTicket}
          onClose={() => setShowRespondTicket(null)}
        />
      )}

      {/* Tour Guide */}
      {showTour && (
        <TourGuide
          userRole="admin"
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;