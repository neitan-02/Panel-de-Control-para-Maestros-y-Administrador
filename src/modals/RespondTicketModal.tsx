import React, { useState } from 'react';
import { X, Send, Clock, AlertTriangle, CheckCircle, User, Calendar, Tag, MessageSquare } from 'lucide-react';
import { SupportTicket } from '../types/auth';

interface RespondTicketModalProps {
  ticket: SupportTicket;
  onRespond: (ticketId: string, response: string, newStatus: string) => void;
  onClose: () => void;
}

const RespondTicketModal: React.FC<RespondTicketModalProps> = ({
  ticket,
  onRespond,
  onClose
}) => {
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('in_progress');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      onRespond(ticket.id, response, newStatus);
      setResponse('');
      onClose();
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student_issue': return '🎓';
      case 'teacher_request': return '👨‍🏫';
      case 'technical_support': return '🔧';
      case 'general_inquiry': return '📋';
      default: return '📝';
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

  const responseTemplates = {
    'student_issue': [
      'Hemos revisado el caso del alumno y procederemos con las siguientes acciones...',
      'Gracias por reportar esta situación. Coordinaremos con el equipo pedagógico para...',
      'Se ha programado una reunión para evaluar el progreso del alumno...'
    ],
    'teacher_request': [
      'Su solicitud ha sido aprobada y se procesará en los próximos días...',
      'Hemos recibido su petición y la estamos evaluando con el equipo directivo...',
      'Los recursos solicitados estarán disponibles a partir de...'
    ],
    'technical_support': [
      'El problema técnico ha sido identificado y se está trabajando en la solución...',
      'Se ha escalado el ticket al equipo de TI para resolución inmediata...',
      'La actualización del sistema se realizará durante el mantenimiento programado...'
    ],
    'general_inquiry': [
      'Gracias por su consulta. La información solicitada es la siguiente...',
      'Hemos revisado su pregunta y podemos confirmar que...',
      'Para más información sobre este tema, puede consultar...'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Responder Ticket</h2>
              <p className="text-blue-100">Ticket #{ticket.id.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Ticket Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(ticket.type)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{getTypeLabel(ticket.type)}</p>
                    <p className="text-sm text-gray-600">Tipo de reporte</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{ticket.reportedBy.name}</p>
                    <p className="text-sm text-gray-600">Reportado por</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Fecha de creación</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Prioridad</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Estado actual</p>
                  </div>
                </div>

                {ticket.studentAffected && (
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{ticket.studentAffected.name}</p>
                      <p className="text-sm text-gray-600">Alumno relacionado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Descripción del Problema
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Response Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Respuestas Sugeridas</h3>
              <div className="grid gap-2">
                {responseTemplates[ticket.type]?.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setResponse(template)}
                    className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-800 transition-colors duration-200"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta *
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Escriba su respuesta detallada aquí..."
                required
              />
            </div>

            {/* New Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Estado
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>

            {/* Quality Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Guías para una Respuesta de Calidad:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Sea específico y claro en sus instrucciones</li>
                <li>• Proporcione pasos concretos cuando sea necesario</li>
                <li>• Mantenga un tono profesional y empático</li>
                <li>• Incluya fechas o plazos cuando corresponda</li>
                <li>• Ofrezca seguimiento si es necesario</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!response.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Respuesta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RespondTicketModal;