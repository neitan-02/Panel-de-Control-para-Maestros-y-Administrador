import React, { useState } from 'react';
import { Student, MathBlock, User } from '../types/auth';
import { X, Download, FileText, Users, TrendingUp, BarChart3, Award, AlertTriangle, Calendar } from 'lucide-react';

interface BulkReportModalProps {
  students: Student[];
  mathBlocks: MathBlock[];
  teacher: User;
  onClose: () => void;
}

const BulkReportModal: React.FC<BulkReportModalProps> = ({ 
  students, 
  mathBlocks, 
  teacher, 
  onClose 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');

  const getOverallClassProgress = () => {
    if (students.length === 0) return 0;
    const totalProgress = students.reduce((sum, student) => {
      const studentAvg = Object.values(student.progress).reduce((a, b) => a + b, 0) / 6;
      return sum + studentAvg;
    }, 0);
    return Math.round(totalProgress / students.length);
  };

  const getBlockAverages = () => {
    if (students.length === 0) return {};
    const blockAverages: Record<string, number> = {};
    for (let i = 1; i <= 6; i++) {
      const blockKey = `block${i}` as keyof Student['progress'];
      const total = students.reduce((sum, student) => sum + student.progress[blockKey], 0);
      blockAverages[`block${i}`] = Math.round(total / students.length);
    }
    return blockAverages;
  };

  const getTopPerformers = () => {
    return students
      .map(student => ({
        ...student,
        avgProgress: Math.round(Object.values(student.progress).reduce((a, b) => a + b, 0) / 6)
      }))
      .sort((a, b) => b.avgProgress - a.avgProgress)
      .slice(0, 5);
  };

  const getStudentsNeedingHelp = () => {
    return students
      .map(student => ({
        ...student,
        avgProgress: Math.round(Object.values(student.progress).reduce((a, b) => a + b, 0) / 6)
      }))
      .filter(student => student.avgProgress < 70)
      .sort((a, b) => a.avgProgress - b.avgProgress);
  };

  const getProgressDistribution = () => {
    const distribution = { excellent: 0, good: 0, regular: 0, needsHelp: 0 };
    students.forEach(student => {
      const avgProgress = Math.round(Object.values(student.progress).reduce((a, b) => a + b, 0) / 6);
      if (avgProgress >= 90) distribution.excellent++;
      else if (avgProgress >= 70) distribution.good++;
      else if (avgProgress >= 50) distribution.regular++;
      else distribution.needsHelp++;
    });
    return distribution;
  };

  const generateBulkPDF = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate PDF generation
      
      const reportData = {
        teacher: {
          name: teacher.name,
          grade: teacher.grade,
          cct: teacher.cct,
          email: teacher.email
        },
        classStats: {
          totalStudents: students.length,
          overallProgress: getOverallClassProgress(),
          blockAverages: getBlockAverages(),
          distribution: getProgressDistribution()
        },
        topPerformers: getTopPerformers(),
        studentsNeedingHelp: getStudentsNeedingHelp(),
        detailedStudents: reportType === 'detailed' ? students.map(student => ({
          name: student.name,
          grade: student.grade,
          progress: student.progress,
          overallProgress: Math.round(Object.values(student.progress).reduce((a, b) => a + b, 0) / 6),
          lastUpdated: student.lastUpdated
        })) : [],
        mathBlocks: mathBlocks,
        generatedAt: new Date().toISOString(),
        reportType
      };

      console.log('Generating bulk PDF with data:', reportData);
      
      alert(`¡Reporte ${reportType === 'summary' ? 'Resumen' : 'Detallado'} generado exitosamente!\n\n` +
            `📊 Total de alumnos: ${students.length}\n` +
            `📈 Progreso promedio: ${getOverallClassProgress()}%\n` +
            `🏆 Estudiantes destacados: ${getTopPerformers().length}\n` +
            `⚠️ Necesitan apoyo: ${getStudentsNeedingHelp().length}\n\n` +
            `En una aplicación real, aquí se descargaría el archivo PDF completo con todos los datos de la clase.`);
      
      onClose();
    } catch (error) {
      alert('Error al generar el reporte. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const blockAverages = getBlockAverages();
  const topPerformers = getTopPerformers();
  const studentsNeedingHelp = getStudentsNeedingHelp();
  const distribution = getProgressDistribution();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl mr-4 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reporte General de la Clase</h2>
              <p className="text-sm text-gray-600">{teacher.name} - {teacher.grade} - CCT: {teacher.cct}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Report Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tipo de Reporte</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setReportType('summary')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  reportType === 'summary'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <h4 className="font-medium">Reporte Resumen</h4>
                <p className="text-sm text-gray-600">Estadísticas generales y análisis de clase</p>
              </button>
              <button
                onClick={() => setReportType('detailed')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  reportType === 'detailed'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <h4 className="font-medium">Reporte Detallado</h4>
                <p className="text-sm text-gray-600">Incluye progreso individual de cada alumno</p>
              </button>
            </div>
          </div>

          {/* Class Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Alumnos</p>
                  <p className="text-2xl font-bold text-blue-900">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Progreso Promedio</p>
                  <p className="text-2xl font-bold text-green-900">{getOverallClassProgress()}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Destacados</p>
                  <p className="text-2xl font-bold text-yellow-900">{distribution.excellent + distribution.good}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Necesitan Apoyo</p>
                  <p className="text-2xl font-bold text-red-900">{studentsNeedingHelp.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Block Averages */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Promedio por Bloque Matemático</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mathBlocks.map(block => {
                const average = blockAverages[`block${block.id}`] || 0;
                return (
                  <div key={block.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Bloque {block.id}</h4>
                      <span className={`text-lg font-bold ${
                        average >= 90 ? 'text-green-600' :
                        average >= 70 ? 'text-blue-600' :
                        average >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {average}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{block.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          average >= 90 ? 'bg-green-500' :
                          average >= 70 ? 'bg-blue-500' :
                          average >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${average}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performers and Students Needing Help */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                Mejores Estudiantes
              </h3>
              <div className="space-y-3">
                {topPerformers.slice(0, 5).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                    <span className="font-bold text-green-600">{student.avgProgress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                Necesitan Apoyo
              </h3>
              <div className="space-y-3">
                {studentsNeedingHelp.length > 0 ? studentsNeedingHelp.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{student.name}</span>
                    <span className="font-bold text-red-600">{student.avgProgress}%</span>
                  </div>
                )) : (
                  <p className="text-green-600 font-medium">¡Todos los estudiantes van bien!</p>
                )}
              </div>
            </div>
          </div>

          {/* Report Preview Info */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Información del Reporte
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Fecha de generación: {new Date().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p>• Tipo: {reportType === 'summary' ? 'Reporte Resumen' : 'Reporte Detallado'}</p>
              <p>• Total de alumnos incluidos: {students.length}</p>
              <p>• Bloques matemáticos analizados: {mathBlocks.length}</p>
              {reportType === 'detailed' && (
                <p>• Incluye progreso individual detallado de cada alumno</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={generateBulkPDF}
            disabled={isGenerating || students.length === 0}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generar Reporte PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkReportModal;