import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Download, Eye, Calendar, User, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  type: 'student_issue' | 'teacher_request' | 'technical_support' | 'general_inquiry';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedAt: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
}

interface ViewReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewReportsModal: React.FC<ViewReportsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Mock data - in real app this would come from props or API
  const tickets: SupportTicket[] = [
    {
      id: '1',
      title: 'Problema con ejercicios de fracciones',
      description: 'El alumno Juan Pérez tiene dificultades para entender las fracciones equivalentes.',
      type: 'student_issue',
      priority: 'high',
      status: 'open',
      reportedBy: 'Prof. María García',
      reportedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Solicitud de material adicional',
      description: 'Necesito más ejercicios de geometría para estudiantes avanzados.',
      type: 'teacher_request',
      priority: 'medium',
      status: 'resolved',
      reportedBy: 'Prof. Carlos López',
      reportedAt: '2024-01-14T14:20:00Z',
      response: 'Se han agregado 20 ejercicios adicionales de geometría avanzada al sistema.',
      respondedAt: '2024-01-15T09:15:00Z',
      respondedBy: 'Admin Sistema'
    },
    {
      id: '3',
      title: 'Error en el sistema de reportes',
      description: 'No puedo generar reportes PDF desde ayer.',
      type: 'technical_support',
      priority: 'urgent',
      status: 'in_progress',
      reportedBy: 'Prof. Ana Martínez',
      reportedAt: '2024-01-15T08:45:00Z',
    }
  ];

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || ticket.type === filterType;
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [tickets, searchTerm, filterType, filterStatus]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student_issue': return <User className="w-4 h-4" />;
      case 'teacher_request': return <MessageSquare className="w-4 h-4" />;
      case 'technical_support': return <AlertTriangle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'student_issue': return 'Problema de Alumno';
      case 'teacher_request': return 'Solicitud de Maestro';
      case 'technical_support': return 'Soporte Técnico';
      case 'general_inquiry': return 'Consulta General';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const urgent = tickets.filter(t => t.priority === 'urgent').length;
    const thisWeek = tickets.filter(t => {
      const ticketDate = new Date(t.reportedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return ticketDate >= weekAgo;
    }).length;

    return { total, open, inProgress, resolved, urgent, thisWeek };
  }, [tickets]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Ver Reportes</h2>
                <p className="text-blue-100">Historial completo de reportes del sistema</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <div className="text-sm text-gray-600">Abiertos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resueltos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.thisWeek}</div>
              <div className="text-sm text-gray-600">Esta Semana</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar reportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="student_issue">Problema de Alumno</option>
              <option value="teacher_request">Solicitud de Maestro</option>
              <option value="technical_support">Soporte Técnico</option>
              <option value="general_inquiry">Consulta General</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En Progreso</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-96 overflow-y-auto p-6">
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(ticket.type)}
                          <span className="text-sm font-medium text-gray-600">
                            {getTypeLabel(ticket.type)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{ticket.reportedBy}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(ticket.reportedAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Detalle del Reporte</h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedTicket.title}</h4>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(selectedTicket.status)}`}>
                        {getStatusIcon(selectedTicket.status)}
                        <span>{selectedTicket.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Descripción:</h5>
                    <p className="text-gray-600">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Reportado por:</h5>
                      <p className="text-gray-600">{selectedTicket.reportedBy}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Fecha:</h5>
                      <p className="text-gray-600">{new Date(selectedTicket.reportedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {selectedTicket.response && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Respuesta:</h5>
                      <p className="text-green-700">{selectedTicket.response}</p>
                      <div className="mt-2 text-sm text-green-600">
                        Respondido por {selectedTicket.respondedBy} el {new Date(selectedTicket.respondedAt!).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReportsModal;