import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, ArrowLeft, CheckCircle, Lightbulb, Target, 
  Users, BookOpen, Settings, TrendingUp, FileText, Reply 
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ComponentType<any>;
}

interface TourGuideProps {
  userRole: 'teacher' | 'admin';
  onComplete: () => void;
  onSkip: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({ userRole, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Steps de maestro
  const teacherSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido al Panel de Maestro!',
      description: 'Te guiaremos por las principales funciones para que puedas aprovechar al máximo el sistema. Aquí podrás gestionar y monitorear el progreso de tus alumnos.',
      target: 'header',
      position: 'bottom',
      icon: BookOpen
    },
    {
      id: 'stats',
      title: 'Estadísticas de tu Clase',
      description: 'Aquí podrás ver el resumen de tus alumnos: total de estudiantes, progreso promedio de la clase y tu CCT asignada.',
      target: 'stats-cards',
      position: 'bottom',
      icon: Target
    },
    {
      id: 'analytics',
      title: 'Análisis de Rendimiento',
      description: 'Aquí verás el análisis detallado: mejores estudiantes de tu clase y aquellos que necesitan apoyo adicional.',
      target: 'analytics-cards',
      position: 'bottom',
      icon: TrendingUp
    },
    {
      id: 'filters',
      title: 'Filtros por Bloque Matemático',
      description: 'Aquí podrás filtrar a tus estudiantes por bloques matemáticos específicos.',
      target: 'math-blocks',
      position: 'bottom',
      icon: Settings
    },
    {
      id: 'students',
      title: 'Gestión de Alumnos',
      description: 'Aquí verás todos tus alumnos asignados. Podrás actualizar su progreso en cada bloque matemático.',
      target: 'students-section',
      position: 'top',
      icon: Users
    },
    {
      id: 'reports',
      title: 'Reportes PDF',
      description: 'Aquí podrás generar reportes generales de toda tu clase en formato PDF.',
      target: 'bulk-report-btn',
      position: 'left',
      icon: FileText
    }
  ];

  // Steps de administrador
  const adminSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido al Panel de Administración!',
      description: 'Como administrador, aquí podrás gestionar maestros, alumnos y el sistema de soporte.',
      target: 'header',
      position: 'bottom',
      icon: Settings
    },
    {
      id: 'stats',
      title: 'Estadísticas del Sistema',
      description: 'Aquí verás las estadísticas generales del sistema: total de maestros y alumnos registrados.',
      target: 'admin-stats',
      position: 'bottom',
      icon: Target
    },
    {
      id: 'teachers',
      title: 'Gestión de Maestros',
      description: 'Aquí podrás ver todos los maestros registrados y cambiar sus contraseñas.',
      target: 'teachers-tab',
      position: 'bottom',
      icon: BookOpen
    },
    {
      id: 'students',
      title: 'Supervisión de Alumnos',
      description: 'Aquí verás todos los alumnos del sistema organizados por maestro.',
      target: 'students-tab',
      position: 'bottom',
      icon: Users
    },
    {
      id: 'support',
      title: 'Sistema de Soporte',
      description: 'Aquí podrás recibir, visualizar y responder todos los reportes de los maestros.',
      target: 'support-tab',
      position: 'bottom',
      icon: Reply
    }
  ];

  // 🔹 Se define aquí antes de useEffect
  const steps = userRole === 'teacher' ? teacherSteps : adminSteps;

  useEffect(() => {
    if (isVisible && currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      setHighlightedElement(currentStepData.target);

      const targetElement = document.getElementById(currentStepData.target);
      if (targetElement) {
        targetElement.style.position = 'relative';
        targetElement.style.zIndex = '60';
        targetElement.style.boxShadow =
          '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)';
        targetElement.style.borderRadius = '12px';
        targetElement.style.transition = 'all 0.3s ease';
      }

      return () => {
        if (targetElement) {
          targetElement.style.position = '';
          targetElement.style.zIndex = '';
          targetElement.style.boxShadow = '';
          targetElement.style.borderRadius = '';
        }
      };
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-completed-${userRole}`, 'true');
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-completed-${userRole}`, 'true');
    onSkip();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-2xl mr-4">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100 text-sm">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl mb-4">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Información</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{currentStepData.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso del Tour</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-600 scale-125'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
            >
              Saltar Tour
            </button>
            
            <div className="flex-1 flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium hover:-translate-y-0.5 transform-gpu"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;
