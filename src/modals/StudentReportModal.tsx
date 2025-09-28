import React from 'react';
import { Student, MathBlock } from '../types/auth';
import { X, Download, FileText, TrendingUp } from 'lucide-react';

interface StudentReportModalProps {
  student: Student;
  mathBlocks: MathBlock[];
  onClose: () => void;
}

const StudentReportModal: React.FC<StudentReportModalProps> = ({ student, mathBlocks, onClose }) => {
  const getOverallProgress = () => {
    const total = Object.values(student.progress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(total / 6);
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 90) return { status: 'Excelente', color: 'text-green-600 bg-green-50' };
    if (progress >= 70) return { status: 'Bueno', color: 'text-blue-600 bg-blue-50' };
    if (progress >= 50) return { status: 'Regular', color: 'text-yellow-600 bg-yellow-50' };
    return { status: 'Necesita Apoyo', color: 'text-red-600 bg-red-50' };
  };

  const generatePDFReport = () => {
    // Simulate PDF generation
    const reportData = {
      student: student.name,
      grade: student.grade,
      overallProgress: getOverallProgress(),
      blocks: mathBlocks.map(block => ({
        name: block.name,
        progress: student.progress[`block${block.id}` as keyof Student['progress']],
        status: getProgressStatus(student.progress[`block${block.id}` as keyof Student['progress']]).status
      })),
      date: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // In a real application, you would generate an actual PDF here
    console.log('Generating PDF with data:', reportData);
    
    // Simulate download
    alert(`Reporte PDF generado para ${student.name}\n\nEn una aplicación real, aquí se descargaría el archivo PDF con todos los detalles del progreso del estudiante.`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reporte de Progreso</h2>
              <p className="text-sm text-gray-500">{student.name} - {student.grade}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progreso General</h3>
                <p className="text-3xl font-bold text-blue-600">{getOverallProgress()}%</p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getProgressStatus(getOverallProgress()).color}`}>
                  {getProgressStatus(getOverallProgress()).status}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Detailed Progress by Block */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Progreso por Bloque Matemático</h3>
            {mathBlocks.map(block => {
              const blockKey = `block${block.id}` as keyof Student['progress'];
              const progress = student.progress[blockKey];
              const status = getProgressStatus(progress);

              return (
                <div key={block.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Bloque {block.id}: {block.name}</h4>
                      <p className="text-sm text-gray-500">{block.topics.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{progress}%</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        progress >= 90 ? 'bg-green-500' :
                        progress >= 70 ? 'bg-blue-500' :
                        progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Recomendaciones</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {getOverallProgress() >= 90 && (
                <li>• Excelente desempeño. Continúa con actividades de enriquecimiento.</li>
              )}
              {getOverallProgress() >= 70 && getOverallProgress() < 90 && (
                <li>• Buen progreso. Reforzar áreas con menor puntuación.</li>
              )}
              {getOverallProgress() >= 50 && getOverallProgress() < 70 && (
                <li>• Requiere apoyo adicional en varios bloques matemáticos.</li>
              )}
              {getOverallProgress() < 50 && (
                <li>• Necesita atención individualizada y plan de apoyo específico.</li>
              )}
              
              {mathBlocks.map(block => {
                const blockKey = `block${block.id}` as keyof Student['progress'];
                const progress = student.progress[blockKey];
                if (progress < 70) {
                  return (
                    <li key={block.id}>
                      • Reforzar {block.name.toLowerCase()}: {block.topics.join(', ')}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>

          {/* Report Info */}
          <div className="text-sm text-gray-500">
            <p>Reporte generado el: {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>Última actualización: {new Date(student.lastUpdated).toLocaleDateString('es-MX')}</p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={generatePDFReport}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentReportModal;