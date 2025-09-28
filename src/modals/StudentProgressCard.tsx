import React, { useState } from 'react';
import { Student, MathBlock } from '../types/auth';
import { TrendingUp, Eye, Edit3, Check, X } from 'lucide-react';

interface StudentProgressCardProps {
  student: Student;
  mathBlocks: MathBlock[];
  viewMode?: 'grid' | 'list';
  onUpdateProgress: (studentId: string, block: string, progress: number) => void;
  onViewReport: () => void;
}

const StudentProgressCard: React.FC<StudentProgressCardProps> = ({
  student,
  mathBlocks,
  viewMode = 'grid',
  onUpdateProgress,
  onViewReport
}) => {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600 bg-green-100';
    if (progress >= 70) return 'text-blue-600 bg-blue-100';
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getOverallProgress = () => {
    const total = Object.values(student.progress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(total / 6);
  };

  const handleEditProgress = (block: string, currentProgress: number) => {
    setEditingBlock(block);
    setTempProgress(currentProgress);
  };

  const handleSaveProgress = () => {
    if (editingBlock) {
      onUpdateProgress(student.id, editingBlock, tempProgress);
      setEditingBlock(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
    setTempProgress(0);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-full">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{student.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{student.grade}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="text-center hidden sm:block">
              <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getProgressColor(getOverallProgress())}`}>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {getOverallProgress()}%
              </div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Progreso General</p>
            </div>
            
            <div className="hidden md:flex gap-2">
              {mathBlocks.slice(0, 3).map(block => {
                const blockKey = `block${block.id}` as keyof Student['progress'];
                const progress = student.progress[blockKey];
                return (
                  <div key={block.id} className="text-center">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getProgressBarColor(progress)}`}>
                      {progress}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">B{block.id}</p>
                  </div>
                );
              })}
              {mathBlocks.length > 3 && (
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    +{mathBlocks.length - 3}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Más</p>
                </div>
              )}
            </div>
            
            <button
              onClick={onViewReport}
              className="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm hover:-translate-y-0.5 flex-shrink-0"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ver Reporte</span>
              <span className="sm:hidden">Ver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{student.grade}</p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getProgressColor(getOverallProgress())}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {getOverallProgress()}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Progreso General</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {mathBlocks.map(block => {
          const blockKey = `block${block.id}` as keyof Student['progress'];
          const progress = student.progress[blockKey];
          const isEditing = editingBlock === blockKey;

          return (
            <div key={block.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    <span className="hidden sm:inline">Bloque {block.id}</span>
                    <span className="sm:hidden">B{block.id}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={tempProgress}
                          onChange={(e) => setTempProgress(Number(e.target.value))}
                          className="w-12 sm:w-16 px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          onClick={handleSaveProgress}
                          className="p-1 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {progress}%
                        </span>
                        <button
                          onClick={() => handleEditProgress(blockKey, progress)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewReport}
          className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm hover:-translate-y-0.5"
        >
          <Eye className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Ver Reporte</span>
          <span className="sm:hidden">Reporte</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 truncate">
          Última actualización: {new Date(student.lastUpdated).toLocaleDateString('es-MX')}
        </p>
      </div>
    </div>
  );
};

export default StudentProgressCard;