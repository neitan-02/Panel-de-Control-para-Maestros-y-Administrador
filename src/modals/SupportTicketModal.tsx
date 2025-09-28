import React, { useState } from 'react';
import { SupportTicket, User, Student } from '../types/auth';
import { X, MessageSquare, AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp, User as UserIcon, BookOpen, Calendar, FileText, Edit3, Save } from 'lucide-react';

interface SupportTicketModalProps {
  ticket: SupportTicket;
  teachers: User[];
  students: Student[];
  onUpdate: (ticketId: string, updates: Partial<SupportTicket>) => void;
  onClose: () => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  ticket,
  teachers,
  students,
  onUpdate,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: ticket.status,
    priority: ticket.priority,
    adminNotes: ticket.adminNotes || '',
    resolution: ticket.resolution || ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-5 h-5" />;
      case 'in_progress': return <TrendingUp className="w-5 h-5" />;
      case 'resolved': return <CheckCircle className="w-5 h-5" />;
      case 'closed': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student_issue': return <BookOpen className="w-5 h-5" />;
      case 'teacher_request': return <UserIcon className="w-5 h-5" />;
      case 'technical_support': return <MessageSquare className="w-5 h-5" />;
      case 'general_inquiry': return <FileText className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
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

  const handleSave = () => {
    const updates: Partial<SupportTicket> = {
      ...editData,
      ...(editData.status === 'resolved' && !ticket.resolvedAt ? { resolvedAt: new Date() } : {})
    };
    
    onUpdate(ticket.id, updates);
    setIsEditing(false);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Maestro no encontrado';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
              {getTypeIcon(ticket.type)}
              <span className="text-white font-medium text-sm"></span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ticket de Soporte</h2>
              <p className="text-sm text-gray-600">ID: {ticket.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm hover:-translate-y-0.5"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Ticket</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="flex items-center text-sm font-medium text-gray-900">
                    {getTypeIcon(ticket.type)}
                    <span className="ml-2">{getTypeLabel(ticket.type)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prioridad:</span>
                  {isEditing ? (
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {ticket.priority.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  {isEditing ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fechas Importantes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Creado:</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(ticket.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Actualizado:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(ticket.updatedAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resuelto:</span>
                    <span className="text-sm font-medium text-green-600">
                      {new Date(ticket.resolvedAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{ticket.title}</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Reporter Info */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportado Por</h3>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{ticket.reportedBy.name}</p>
                <p className="text-sm text-gray-600">{ticket.reportedBy.email}</p>
                <p className="text-xs text-gray-500 capitalize">{ticket.reportedBy.role}</p>
              </div>
            </div>
          </div>

          {/* Student Affected */}
          {ticket.studentAffected && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alumno Afectado</h3>
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ticket.studentAffected.name}</p>
                  <p className="text-sm text-gray-600">{ticket.studentAffected.grade}</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas del Administrador</h3>
            {isEditing ? (
              <textarea
                value={editData.adminNotes}
                onChange={(e) => setEditData(prev => ({ ...prev, adminNotes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Agregar notas administrativas..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.adminNotes || 'No hay notas administrativas aún.'}
              </p>
            )}
          </div>

          {/* Resolution */}
          {(ticket.status === 'resolved' || ticket.status === 'closed' || isEditing) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolución</h3>
              {isEditing ? (
                <textarea
                  value={editData.resolution}
                  onChange={(e) => setEditData(prev => ({ ...prev, resolution: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Describir la resolución del ticket..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket.resolution || 'Resolución pendiente.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketModal;