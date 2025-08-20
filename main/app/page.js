'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BookOpen, Brain, Headphones, MessageCircle, Mic, Play, RotateCcw, Send, Settings, Star, Trophy, User, Volume2, Zap } from 'lucide-react';

export default function AiLinguoApp() {
  // State management
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [vocabularyCards, setVocabularyCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auth states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', name: '', password: '', cefrLevel: 'A2' });

  const messagesEndRef = useRef(null);

  // Initialize app
  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('ailinguo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // API calls
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    const config = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) config.body = JSON.stringify(data);
    
    try {
      const response = await fetch(`/api/${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Authentication handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiCall('auth/login', 'POST', loginForm);
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('ailinguo_user', JSON.stringify(response.user));
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiCall('auth/register', 'POST', registerForm);
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('ailinguo_user', JSON.stringify(response.user));
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
    setIsLoading(false);
  };

  // Chat handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiCall('tutor', 'POST', {
        userText: inputMessage,
        userLevel: user?.cefrLevel || 'B1',
        mode: 'conversation',
        sessionId: currentSession?._id
      });

      const tutorMessage = {
        id: Date.now() + 1,
        role: 'tutor',
        text: response.reply,
        corrections: response.corrections,
        exercise: response.miniExercise,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, tutorMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    }
    setIsLoading(false);
  };

  // Writing correction handler
  const handleWritingCheck = async () => {
    if (!writingText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiCall('tutor', 'POST', {
        userText: writingText,
        userLevel: user?.cefrLevel || 'B1',
        mode: 'writing'
      });

      // Show corrections in a dialog or similar
      console.log('Writing corrections:', response);
    } catch (error) {
      console.error('Writing check error:', error);
    }
    setIsLoading(false);
  };

  // Vocabulary handlers
  const loadVocabularyCards = async () => {
    try {
      const cards = await apiCall(`vocabulary/due?userId=${user._id}&limit=10`);
      setVocabularyCards(cards);
    } catch (error) {
      console.error('Vocabulary error:', error);
    }
  };

  const handleCardReview = async (result) => {
    const currentCard = vocabularyCards[currentCardIndex];
    if (!currentCard) return;

    try {
      await apiCall('vocabulary/review', 'POST', {
        userId: user._id,
        cardId: currentCard._id,
        result
      });

      if (currentCardIndex < vocabularyCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setCurrentCardIndex(0);
        loadVocabularyCards(); // Reload cards
      }
    } catch (error) {
      console.error('Card review error:', error);
    }
  };

  // Pronunciation handler
  const handleStartRecording = () => {
    setIsRecording(true);
    // Web Speech API implementation would go here
    setTimeout(() => {
      setIsRecording(false);
      // Mock pronunciation result
      console.log('Pronunciation recorded');
    }, 3000);
  };

  // Load lessons
  const loadLessons = async () => {
    try {
      const lessonsData = await apiCall(`lessons?level=${user?.cefrLevel || 'A1'}`);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Lessons error:', error);
    }
  };

  // Create new chat session
  const startNewChatSession = async () => {
    try {
      const session = await apiCall('chat/sessions', 'POST', {
        userId: user._id,
        level: user.cefrLevel,
        topic: 'general'
      });
      setCurrentSession(session);
      setChatMessages([]);
      setCurrentView('chat');
    } catch (error) {
      console.error('Session error:', error);
    }
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-10 w-10 text-blue-600" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Linguo
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Aprenda inglês com <span className="font-semibold text-blue-600">IA personalizada</span>. 
              Conversação inteligente, correção em tempo real, pronúncia perfeita e vocabulário eficiente.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Começar Agora 🚀
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Tabs defaultValue="register">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="register">Registrar</TabsTrigger>
                      <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <DialogHeader>
                          <DialogTitle>Criar conta no AI Linguo</DialogTitle>
                          <DialogDescription>
                            Comece sua jornada de aprendizado de inglês
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Nome completo</Label>
                            <Input 
                              value={registerForm.name}
                              onChange={(e) => setRegisterForm(prev => ({...prev, name: e.target.value}))}
                              placeholder="Seu nome"
                              required 
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input 
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                              placeholder="seu@email.com"
                              required 
                            />
                          </div>
                          <div>
                            <Label>Senha</Label>
                            <Input 
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                              placeholder="Mínimo 8 caracteres"
                              minLength="8"
                              required 
                            />
                          </div>
                          <div>
                            <Label>Seu nível de inglês atual</Label>
                            <Select value={registerForm.cefrLevel} onValueChange={(value) => setRegisterForm(prev => ({...prev, cefrLevel: value}))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione seu nível" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A1">A1 - Iniciante (Básico)</SelectItem>
                                <SelectItem value="A2">A2 - Elementar</SelectItem>
                                <SelectItem value="B1">B1 - Intermediário</SelectItem>
                                <SelectItem value="B2">B2 - Intermediário Alto</SelectItem>
                                <SelectItem value="C1">C1 - Avançado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                Criando conta...
                              </div>
                            ) : 'Criar Conta Gratuita'}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <DialogHeader>
                          <DialogTitle>Entrar no AI Linguo</DialogTitle>
                          <DialogDescription>
                            Continue de onde parou
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Email</Label>
                            <Input 
                              type="email" 
                              value={loginForm.email}
                              onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                              placeholder="seu@email.com"
                              required 
                            />
                          </div>
                          <div>
                            <Label>Senha</Label>
                            <Input 
                              type="password"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                              placeholder="Sua senha"
                              required 
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                Entrando...
                              </div>
                            ) : 'Entrar'}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentView('demo')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Ver Demo 👀
              </Button>
            </motion.div>
          </motion.header>

          {/* Features Grid */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Como funciona o AI Linguo?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: MessageCircle,
                  title: "Conversação Guiada",
                  description: "Chat inteligente com correções em tempo real e exercícios personalizados",
                  color: "blue"
                },
                {
                  icon: BookOpen,
                  title: "Correção de Escrita",
                  description: "Análise gramatical detalhada com sugestões e explicações claras",
                  color: "green"
                },
                {
                  icon: Headphones,
                  title: "Prática de Pronúncia",
                  description: "Gravação e análise da sua pronúncia com dicas específicas",
                  color: "purple"
                },
                {
                  icon: Zap,
                  title: "Vocabulário SRS",
                  description: "Sistema de revisão espaçada para memorização eficiente",
                  color: "orange"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${feature.color}-100 mx-auto mb-4`}
                      >
                        <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                      </motion.div>
                      <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CEFR Levels Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Trilhas Personalizadas por Nível CEFR
              </h2>
              <p className="text-gray-600 mb-12">
                Conteúdo adaptado do iniciante ao avançado, seguindo padrões internacionais
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { level: 'A1', name: 'Iniciante', progress: 85, color: 'bg-green-500' },
                  { level: 'A2', name: 'Básico', progress: 70, color: 'bg-blue-500' },
                  { level: 'B1', name: 'Intermediário', progress: 45, color: 'bg-yellow-500' },
                  { level: 'B2', name: 'Inter. Alto', progress: 25, color: 'bg-orange-500' },
                  { level: 'C1', name: 'Avançado', progress: 10, color: 'bg-red-500' }
                ].map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-lg border bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="font-bold text-lg mb-1">{level.level}</div>
                    <div className="text-sm text-gray-600 mb-3">{level.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${level.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${level.progress}%` }}
                        transition={{ delay: 2.0 + index * 0.2, duration: 1 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{level.progress}% concluído</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Pronto para começar sua jornada?
                </h3>
                <p className="mb-6 opacity-90">
                  Junte-se a milhares de estudantes que já estão aprendendo inglês de forma inteligente
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Começar Gratuitamente ✨
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Same dialog content as above */}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    );
  }

  // Dashboard
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold">AILínguo</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{user?.cefrLevel}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('profile')}>
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Olá, {user?.name}!</h1>
            <p className="text-gray-600">Continue sua jornada no aprendizado de inglês</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Progresso Diário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Meta: {user?.dailyGoalMinutes || 15} min</span>
                    <span>5/15 min</span>
                  </div>
                  <Progress value={33} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Sequência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.streakDays || 0} dias</div>
                <p className="text-sm text-gray-600">Continue assim!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  Nível Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.cefrLevel}</div>
                <p className="text-sm text-gray-600">Progresso sólido</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-24 flex-col gap-2" 
              variant="outline"
              onClick={startNewChatSession}
            >
              <MessageCircle className="h-6 w-6" />
              Praticar Conversa
            </Button>

            <Button 
              className="h-24 flex-col gap-2" 
              variant="outline"
              onClick={() => setCurrentView('writing')}
            >
              <BookOpen className="h-6 w-6" />
              Treinar Escrita
            </Button>

            <Button 
              className="h-24 flex-col gap-2" 
              variant="outline"
              onClick={() => setCurrentView('pronunciation')}
            >
              <Headphones className="h-6 w-6" />
              Pronúncia
            </Button>

            <Button 
              className="h-24 flex-col gap-2" 
              variant="outline"
              onClick={() => {
                setCurrentView('vocabulary');
                loadVocabularyCards();
              }}
            >
              <Zap className="h-6 w-6" />
              Vocabulário
            </Button>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Próxima Lição Recomendada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Present Simple Tense</h3>
                  <p className="text-sm text-gray-600">Nível {user?.cefrLevel} • 15 min</p>
                </div>
                <Button onClick={() => {
                  setCurrentView('lessons');
                  loadLessons();
                }}>
                  Começar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Chat View
  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Tutor IA</span>
            </div>
            <div />
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {chatMessages.length === 0 && (
                <Card className="text-center p-8">
                  <h3 className="text-lg font-medium mb-2">Olá! Sou seu tutor de inglês</h3>
                  <p className="text-gray-600 mb-4">Vamos praticar juntos? Pode falar sobre qualquer assunto!</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => setInputMessage("Hi! How are you today?")}>
                      Cumprimentos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInputMessage("I want to talk about my hobbies")}>
                      Hobbies
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInputMessage("Can you help me with grammar?")}>
                      Gramática
                    </Button>
                  </div>
                </Card>
              )}

              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border'
                  }`}>
                    <p>{message.text}</p>
                    
                    {message.corrections && message.corrections.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <h4 className="font-medium text-sm mb-2 text-gray-800">Correções:</h4>
                        {message.corrections.map((correction, index) => (
                          <div key={index} className="text-sm text-gray-700 mb-2">
                            <span className="bg-red-100 text-red-700 px-1 rounded line-through">{correction.original}</span>
                            {' → '}
                            <span className="bg-green-100 text-green-700 px-1 rounded font-medium">{correction.corrected}</span>
                            <p className="text-xs mt-1 text-gray-600">{correction.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.exercise && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <h4 className="font-medium text-sm mb-2 text-gray-800">Exercício Rápido:</h4>
                        <p className="text-sm mb-2">{message.exercise.question}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {message.exercise.options?.map((option, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                      <span className="text-sm">O tutor está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t bg-white p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Writing View
  if (currentView === 'writing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Correção de Escrita</span>
            </div>
            <div />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Escreva seu texto para correção</CardTitle>
              <CardDescription>
                Cole ou digite um parágrafo em inglês e receba correções detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="I go to school yesterday. It was a good day and I learn many things..."
                className="min-h-[200px]"
              />
              <Button onClick={handleWritingCheck} disabled={!writingText.trim() || isLoading}>
                {isLoading ? 'Analisando...' : 'Verificar Texto'}
              </Button>
            </CardContent>
          </Card>

          {/* Results would be shown here after analysis */}
        </div>
      </div>
    );
  }

  // Vocabulary View
  if (currentView === 'vocabulary') {
    const currentCard = vocabularyCards[currentCardIndex];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Vocabulário</span>
            </div>
            <div className="text-sm text-gray-600">
              {currentCardIndex + 1} / {vocabularyCards.length}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {currentCard ? (
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">{currentCard.term}</CardTitle>
                <Badge variant="secondary">{currentCard.cefrLevel}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-600">{currentCard.meaning}</p>
                <p className="text-sm italic">"{currentCard.example}"</p>
              </CardContent>
              <CardFooter className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => handleCardReview('again')}>
                  Errei
                </Button>
                <Button variant="outline" onClick={() => handleCardReview('hard')}>
                  Difícil
                </Button>
                <Button variant="outline" onClick={() => handleCardReview('good')}>
                  Bom
                </Button>
                <Button onClick={() => handleCardReview('easy')}>
                  Fácil
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Parabéns!</h3>
              <p className="text-gray-600 mb-4">Você terminou a revisão de hoje</p>
              <Button onClick={() => setCurrentView('dashboard')}>
                Voltar ao Dashboard
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Pronunciation View
  if (currentView === 'pronunciation') {
    const samplePhrases = [
      "The quick brown fox jumps over the lazy dog",
      "She sells seashells by the seashore",
      "How much wood would a woodchuck chuck"
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <span className="font-medium">Pronúncia</span>
            </div>
            <div />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Prática de Pronúncia</CardTitle>
              <CardDescription>
                Clique no botão de áudio para ouvir, depois grave sua pronúncia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-lg font-medium p-4 bg-gray-100 rounded">
                "{samplePhrases[0]}"
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Ouvir
                </Button>
                
                <Button 
                  onClick={handleStartRecording}
                  variant={isRecording ? "destructive" : "default"}
                  disabled={isRecording}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isRecording ? 'Gravando...' : 'Gravar'}
                </Button>
              </div>

              {isRecording && (
                <div className="text-sm text-gray-600">
                  🎙️ Gravando... Fale agora!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Demo View
  if (currentView === 'demo') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('landing')}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Demo - AI Linguo</span>
            </div>
            <div />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🎯 Demonstração Interativa</CardTitle>
                <CardDescription>
                  Veja como funciona uma aula de inglês com IA em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simulated chat */}
                  <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                        I go to school yesterday and meet my friends
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs border">
                        <p className="mb-3">Great! You're practicing past tense. Let me help you improve this sentence.</p>
                        
                        <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400 text-sm">
                          <h4 className="font-medium mb-2">Correções:</h4>
                          <div className="mb-2">
                            <span className="bg-red-100 text-red-700 px-1 rounded line-through">I go</span>
                            {' → '}
                            <span className="bg-green-100 text-green-700 px-1 rounded font-medium">I went</span>
                            <p className="text-xs mt-1 text-gray-600">Use past tense 'went' for yesterday</p>
                          </div>
                          <div className="mb-2">
                            <span className="bg-red-100 text-red-700 px-1 rounded line-through">meet</span>
                            {' → '}
                            <span className="bg-green-100 text-green-700 px-1 rounded font-medium">met</span>
                            <p className="text-xs mt-1 text-gray-600">Past tense of 'meet' is 'met'</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <h4 className="font-medium text-sm mb-2">Exercício Rápido:</h4>
                          <p className="text-sm mb-2">Complete: "Yesterday I ___ to the store"</p>
                          <div className="grid grid-cols-2 gap-1">
                            <Button variant="outline" size="sm" className="text-xs">go</Button>
                            <Button variant="outline" size="sm" className="text-xs bg-green-100">went ✓</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">✍️ Correção de Escrita</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <p className="text-gray-600">Texto original:</p>
                          <p>"I have a difficult with english grammar"</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-gray-600">Versão corrigida:</p>
                          <p>"I have <span className="bg-green-200">difficulty</span> with <span className="bg-green-200">English</span> grammar"</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">🎤 Análise de Pronúncia</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="space-y-2">
                          <p><strong>Frase:</strong> "The weather is beautiful"</p>
                          <p><strong>Sua pronúncia:</strong> "De weder is butiful"</p>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="font-medium">Dica:</p>
                            <p>Para 'th' em 'the', coloque a ponta da língua entre os dentes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">🎯 Flashcard SRS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2">beautiful</h3>
                        <Badge variant="secondary">A2</Badge>
                        <p className="text-gray-600 mt-4">bonito/bonita</p>
                        <p className="text-sm italic mt-2">"The sunset is beautiful"</p>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button variant="outline" size="sm">Errei</Button>
                          <Button variant="outline" size="sm">Difícil</Button>
                          <Button variant="outline" size="sm">Bom</Button>
                          <Button size="sm">Fácil</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Criar Conta e Começar Agora! 🚀
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Registration form */}
                    <Tabs defaultValue="register">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">Registrar</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <DialogHeader>
                            <DialogTitle>Criar conta no AI Linguo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nome</Label>
                              <Input 
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm(prev => ({...prev, name: e.target.value}))}
                                required 
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input 
                                type="email"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                                required 
                              />
                            </div>
                            <div>
                              <Label>Senha</Label>
                              <Input 
                                type="password"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                                required 
                              />
                            </div>
                            <div>
                              <Label>Nível de Inglês</Label>
                              <Select value={registerForm.cefrLevel} onValueChange={(value) => setRegisterForm(prev => ({...prev, cefrLevel: value}))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A1">A1 - Iniciante</SelectItem>
                                  <SelectItem value="A2">A2 - Básico</SelectItem>
                                  <SelectItem value="B1">B1 - Intermediário</SelectItem>
                                  <SelectItem value="B2">B2 - Intermediário Alto</SelectItem>
                                  <SelectItem value="C1">C1 - Avançado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? 'Criando...' : 'Criar Conta'}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <DialogHeader>
                            <DialogTitle>Entrar</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Email</Label>
                              <Input 
                                type="email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                                required 
                              />
                            </div>
                            <div>
                              <Label>Senha</Label>
                              <Input 
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                                required 
                              />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}