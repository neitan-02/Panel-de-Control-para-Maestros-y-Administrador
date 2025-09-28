import React, { useState } from 'react';
import { SupportTicket, User, Student } from '../types/auth';
import { X, MessageSquare, AlertTriangle, BookOpen, User as UserIcon, FileText, Plus } from 'lucide-react';

interface CreateTicketModalProps {
  teachers: User[];
  students: Student[];
  onCreate: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  teachers,
  students,
  onCreate,
  onClose
}) => {
  const [formData, setFormData] = useState({
    type: 'general_inquiry' as SupportTicket['type'],
    priority: 'medium' as SupportTicket['priority'],
    title: '',
    description: '',
    reportedById: '',
    studentAffectedId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ticketTypes = [
    { value: 'student_issue', label: 'Problema de Alumno', icon: BookOpen },
    { value: 'teacher_request', label: 'Solicitud de Maestro', icon: UserIcon },
    { value: 'technical_support', label: 'Soporte Técnico', icon: MessageSquare },
    { value: 'general_inquiry', label: 'Consulta General', icon: FileText }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.reportedById) {
      newErrors.reportedById = 'Selecciona quien reporta';
    }

    if (formData.type === 'student_issue' && !formData.studentAffectedId) {
      newErrors.studentAffectedId = 'Selecciona el alumno afectado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const reporter = teachers.find(t => t.id === formData.reportedById);
    const studentAffected = formData.studentAffectedId ? 
      students.find(s => s.id === formData.studentAffectedId) : undefined;

    if (!reporter) {
      setErrors({ reportedById: 'Maestro no encontrado' });
      return;
    }

    const newTicket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'> = {
      type: formData.type,
      priority: formData.priority,
      status: 'open',
      title: formData.title.trim(),
      description: formData.description.trim(),
      reportedBy: {
        id: reporter.id,
        name: reporter.name,
        role: reporter.role,
        email: reporter.email
      },
      ...(studentAffected && {
        studentAffected: {
          id: studentAffected.id,
          name: studentAffected.name,
          grade: studentAffected.grade
        }
      })
    };

    onCreate(newTicket);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Crear Ticket de Soporte</h2>
              <p className="text-sm text-gray-600">Reportar un problema o solicitud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Ticket Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Ticket
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ticketTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.type === type.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <h4 className="font-medium text-sm">{type.label}</h4>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prioridad
            </label>
            <div className="flex gap-2">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange('priority', priority.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.priority === priority.value
                      ? priority.color + ' ring-2 ring-offset-2 ring-purple-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority.value === 'urgent' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Ticket
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe brevemente el problema o solicitud"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Detallada
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Proporciona todos los detalles relevantes sobre el problema o solicitud"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Reported By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reportado Por
            </label>
            <select
              value={formData.reportedById}
              onChange={(e) => handleInputChange('reportedById', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.reportedById ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un maestro</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.grade} ({teacher.email})
                </option>
              ))}
            </select>
            {errors.reportedById && <p className="mt-1 text-sm text-red-600">{errors.reportedById}</p>}
          </div>

          {/* Student Affected (only for student issues) */}
          {formData.type === 'student_issue' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alumno Afectado
              </label>
              <select
                value={formData.studentAffectedId}
                onChange={(e) => handleInputChange('studentAffectedId', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.studentAffectedId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un alumno</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.grade}
                  </option>
                ))}
              </select>
              {errors.studentAffectedId && <p className="mt-1 text-sm text-red-600">{errors.studentAffectedId}</p>}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium hover:-translate-y-0.5"
            >
              Crear Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;