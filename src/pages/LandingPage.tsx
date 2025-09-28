import React, { useState } from 'react';
import { BookOpen, Users, TrendingUp, Award, Mail, Phone, MapPin, ChevronRight, Star, CheckCircle, ArrowRight, Menu, X, Send } from 'lucide-react';
import oscar from '../assets/integrantes/oscar.jpg';
import luis from '../assets/integrantes/luis.jpg';
import ricardo from '../assets/integrantes/ricardo.jpg';

interface LandingPageProps {
  onAccessPanel: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAccessPanel }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamMembers = [
    {
      name: 'Oscar Bello Chino',
      role: 'Tester de software',
      description: 'Eencargado de revisar y probar aplicaciones para detectar errores y asegurar que funcionen correctamente.',
      image: oscar,
      expertise: ['Pedagogía', 'Matemáticas', 'Liderazgo']
    },
    {
      name: 'Luis Angel Gutierrez Bernal',
      role: 'UX/UI Designer',
      description: 'Se encarga de diseñar la experiencia e interfaz de usuario para que sean fáciles y agradables de usar.',
      image: luis,
      expertise: ['Desarrollo', 'Diseño', 'Interfaz']
    },
    {
      name: 'Ricardo Alexis Maya Sanchez ',
      role: 'Project manager',
      description: 'Se encarga de planificar y supervisar proyectos para cumplir objetivos.',
      image: ricardo,
      expertise: ['Planificación', 'Gestión', 'Liderazgo']
    },
    {
      name: 'Nathan Hernandez Moreno',
      role: 'fullstack',
      description: 'Se encarga de desarrollar tanto el frontend como el backend de aplicaciones web, movil.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      expertise: ['Frontend', 'Backend', 'Bases de datos']
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Gestión Académica',
      description: 'Sistema completo para el seguimiento del progreso académico de cada estudiante'
    },
    {
      icon: TrendingUp,
      title: 'Análisis de Progreso',
      description: 'Herramientas avanzadas de análisis para identificar áreas de mejora'
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Plataforma que conecta maestros, administradores y estudiantes'
    },
    {
      icon: Award,
      title: 'Reportes Detallados',
      description: 'Generación automática de reportes PDF con métricas detalladas'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduControl Pro
                </h1>
                <p className="text-xs text-gray-500">Sistema Educativo Integral</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('nosotros')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Nosotros
              </button>
              <button
                onClick={() => scrollToSection('equipo')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Equipo
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contacto
              </button>
              <button
                onClick={onAccessPanel}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 font-medium transform-gpu animate-pulse hover:animate-none"
              >
                Acceder al Panel
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection('inicio')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection('nosotros')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Nosotros
                </button>
                <button
                  onClick={() => scrollToSection('equipo')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Equipo
                </button>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Contacto
                </button>
                <button
                  onClick={onAccessPanel}
                  className="block w-full text-left px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium mt-2"
                >
                  Acceder al Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Sistema Educativo de Nueva Generación
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforma la
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Educación </span>
              con Tecnología
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              EduControl Pro es la plataforma integral que revoluciona la gestión educativa, 
              conectando maestros, administradores y estudiantes en un ecosistema digital avanzado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onAccessPanel}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 font-semibold text-lg flex items-center transform-gpu animate-bounce hover:animate-none group"
              >
                <span className="group-hover:animate-pulse">Comenzar Ahora</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => scrollToSection('nosotros')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold text-lg flex items-center hover:scale-105 transform-gpu group"
              >
                <span className="group-hover:animate-pulse">Conocer Más</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="nosotros" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Acerca de 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Nosotros</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos pioneros en tecnología educativa, comprometidos con transformar 
              la experiencia de aprendizaje a través de soluciones innovadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl mr-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Nuestra Misión</h3>
                </div>
                <p className="text-gray-600">
                  Democratizar el acceso a herramientas educativas de calidad, 
                  empoderando a educadores y estudiantes con tecnología de vanguardia.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl mr-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Nuestra Visión</h3>
                </div>
                <p className="text-gray-600">
                  Ser la plataforma educativa líder que transforme la manera en que 
                  las instituciones gestionan y optimizan el proceso de enseñanza-aprendizaje.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-xl mr-4">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Nuestros Valores</h3>
                </div>
                <p className="text-gray-600">
                  Innovación, calidad, accesibilidad y compromiso con la excelencia educativa 
                  son los pilares que guían cada decisión y desarrollo.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-6">¿Por qué EduControl Pro?</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  <span>Interfaz intuitiva y fácil de usar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  <span>Reportes detallados y análisis avanzado</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  <span>Soporte técnico especializado 24/7</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  <span>Actualizaciones constantes y mejoras</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  <span>Seguridad de datos garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestro 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Equipo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales apasionados por la educación y la tecnología, 
              trabajando juntos para crear soluciones excepcionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">EduControl Pro</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Transformando la educación con tecnología de vanguardia
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2024 EduControl Pro. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;