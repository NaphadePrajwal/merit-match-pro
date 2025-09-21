import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, Bot, User, Lightbulb, FileText, MapPin, Volume2 } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";

interface ChatBotProps {
  language: string;
  userProfile: any;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: Lightbulb, text: "Which internship is right for me?", category: "guidance" },
  { icon: FileText, text: "How to write a good resume?", category: "tips" },
  { icon: MapPin, text: "Find internships near me", category: "search" },
  { icon: Bot, text: "What skills should I learn?", category: "skills" }
];

const ChatBot = ({ language, userProfile, onBack }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking } = useTextToSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hi ${userProfile?.name || 'there'}! 👋 I'm your AI Career Guide. I can help you with internship recommendations, career advice, and skill development. What would you like to know?`,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Which internship matches my profile?",
        "What skills should I develop?",
        "How to prepare for interviews?",
        "Best internship locations for me?"
      ]
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  const getBotResponse = async (userInput: string): Promise<string> => {
    try {
      const { data } = await supabase.functions.invoke('ai-career-guide', {
        body: {
          message: userInput,
          userProfile,
          context: "PM Internship Scheme career guidance"
        }
      });

      if (data?.guidance) {
        return data.guidance;
      }
    } catch (error) {
      console.error('AI guidance error:', error);
    }

    // Fallback responses
    const input = userInput.toLowerCase();
    
    if (input.includes('internship') && input.includes('right')) {
      return `Based on your profile with skills in ${userProfile?.skills?.slice(0, 3).join(', ')}, I'd recommend:\n\n1. **Data Analytics roles** - Your Python and analytical skills are perfect\n2. **Software Development** - Great match for your technical background\n3. **Digital Marketing** - Good for developing business skills\n\nWould you like me to explain why these match your profile?`;
    }
    
    if (input.includes('resume') || input.includes('cv')) {
      return `Here are key tips for a strong internship resume:\n\n✅ **Technical Skills Section** - List programming languages, tools\n✅ **Project Portfolio** - Include 2-3 relevant projects\n✅ **Education Details** - GPA (if good), relevant coursework\n✅ **Quantify Impact** - Use numbers and metrics\n✅ **Keep it 1-2 pages** - Concise and focused\n\nWant specific tips for your ${userProfile?.education || 'field'}?`;
    }
    
    if (input.includes('skill') && (input.includes('learn') || input.includes('develop'))) {
      return `Based on top internship requirements, I recommend focusing on:\n\n🎯 **High Priority:**\n• Python (Data Analysis)\n• SQL (Database skills)\n• Communication skills\n\n💡 **Growth Areas:**\n• Machine Learning basics\n• Project management\n• Industry-specific tools\n\nShall I create a personalized 30-day learning plan for you?`;
    }
    
    // Default response
    return `That's a great question! I can help you with:\n\n🎯 **Career Guidance** - Which internships match your profile\n📚 **Skill Development** - What to learn next\n📝 **Application Tips** - Resume and interview prep\n🌍 **Location Advice** - Best cities for your field\n\nTry asking something specific like "What skills should I learn for data science?" or use one of the quick actions below!`;
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const botResponse = await getBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: getBotSuggestions(currentInput)
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotSuggestions = (input: string): string[] => {
    if (input.toLowerCase().includes('skill')) {
      return [
        "Create a 30-day learning plan",
        "Show me free learning resources",
        "Which skills pay the most?"
      ];
    }
    if (input.toLowerCase().includes('internship')) {
      return [
        "How to apply effectively?",
        "What do companies look for?",
        "Internship vs full-time job?"
      ];
    }
    return [
      "Tell me about company culture",
      "How to network effectively?",
      "What's next after internship?"
    ];
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Career Guide</h1>
              <p className="text-muted-foreground">Get personalized career advice</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-success text-success-foreground'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                   <div className={`rounded-lg p-4 ${
                     message.sender === 'user'
                       ? 'bg-primary text-primary-foreground'
                       : 'bg-accent'
                   }`}>
                     <div className="flex items-start justify-between">
                       <p className="whitespace-pre-line flex-1">{message.text}</p>
                       {message.sender === 'bot' && (
                         <Button
                           variant="ghost"
                           size="icon"
                           className="ml-2 h-6 w-6"
                           onClick={() => speak(message.text, language)}
                         >
                           <Volume2 className="w-3 h-3" />
                         </Button>
                       )}
                     </div>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleQuickAction(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-accent rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleQuickAction(action.text)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about internships and careers..."
                className="flex-1"
              />
              <VoiceInput 
                onTranscript={(text) => {
                  setInputText(text);
                  // Auto-send after voice input
                  setTimeout(() => {
                    if (text.trim()) {
                      handleSendMessage();
                    }
                  }, 500);
                }}
                language={language}
                placeholder="Ask me anything..."
              />
              <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Try: "Which internship matches my skills?" or "How to prepare for tech interviews?"
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;