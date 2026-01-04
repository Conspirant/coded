import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Bot,
    Send,
    User,
    Sparkles,
    Loader2,
    MessageSquare,
    Lightbulb,
    AlertCircle,
    Trash2,
    GraduationCap
} from "lucide-react";
import { sendMessage, QUICK_PROMPTS, type Message } from "@/lib/gemini";
import ReactMarkdown from 'react-markdown';

// Animation styles
const messageAnimationStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes typingDots {
    0%, 20% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    80%, 100% {
      opacity: 0.3;
    }
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  
  .typing-dot {
    animation: typingDots 1.4s infinite;
  }
  
  .typing-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const AICounselor = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Inject animation styles
    useEffect(() => {
        const styleId = 'chat-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = messageAnimationStyles;
            document.head.appendChild(style);
        }
    }, []);

    const [status, setStatus] = useState<string>("");

    // Smooth auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages, isLoading, status]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isLoading) return;

        setError(null);
        setInput("");
        setStatus("");

        const userMessage: Message = {
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await sendMessage(textToSend, messages, (newStatus) => {
                setStatus(newStatus);
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('AI response error:', err);
            setError(err instanceof Error ? err.message : 'Failed to get response');
        } finally {
            setIsLoading(false);
            setStatus("");
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] -m-4 md:-m-6">
            {/* Header - Compact on mobile */}
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg shadow-purple-500/20">
                        <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                            AI Counselor
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs px-1.5 py-0">
                                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                Beta
                            </Badge>
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                            Ask about KCET admissions, colleges, or counseling
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="h-8 px-2 md:px-3 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Clear</span>
                    </Button>
                )}
            </div>

            {/* Chat Area - Full height */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 md:px-6">
                {messages.length === 0 ? (
                    // Welcome Screen - Responsive with animations
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4 animate-fade-in-up">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-4 shadow-lg shadow-purple-500/10">
                            <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="space-y-2 max-w-md mb-6">
                            <h2 className="text-lg md:text-xl font-semibold">Welcome! 🎓</h2>
                            <p className="text-sm md:text-base text-muted-foreground">
                                I'm here to help you with KCET. Ask about colleges, cutoffs, or anything!
                            </p>
                        </div>

                        {/* Quick Prompts - Grid for mobile */}
                        <div className="w-full max-w-lg space-y-3">
                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground justify-center">
                                <Lightbulb className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                <span>Try asking:</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto py-2.5 md:py-3 px-3 md:px-4 text-left justify-start text-xs md:text-sm 
                             hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300
                             transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                                        onClick={() => handleSend(prompt)}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 flex-shrink-0 text-purple-500" />
                                        <span className="line-clamp-1">{prompt}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Messages - Full width bubbles with animations
                    <div className="py-4 space-y-4 max-w-4xl mx-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 md:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                           ${message.role === 'user' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg h-fit flex-shrink-0 shadow-md shadow-purple-500/20">
                                        <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm
                             transition-all duration-200 hover:shadow-md ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                            : 'bg-muted rounded-bl-md'
                                        }`}
                                >
                                    {message.role === 'assistant' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm md:text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                                    )}
                                    <p className={`text-[10px] md:text-xs mt-1.5 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {message.role === 'user' && (
                                    <div className="p-1.5 md:p-2 bg-secondary rounded-lg h-fit flex-shrink-0 shadow-sm">
                                        <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Animated Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-2 md:gap-3 justify-start animate-slide-in-left">
                                <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg h-fit shadow-md shadow-purple-500/20">
                                    <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                                            <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                                            <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                                        </div>
                                        {status && (
                                            <span className="text-xs text-muted-foreground animate-fade-in-up">
                                                {status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Error Alert with animation */}
            {error && (
                <Alert variant="destructive" className="mx-3 md:mx-6 mb-2 py-2 animate-fade-in-up">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                </Alert>
            )}

            {/* Input Area - Sticky bottom, mobile-friendly */}
            <div className="px-3 py-3 md:px-6 md:py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask anything about KCET..."
                        disabled={isLoading}
                        className="flex-1 h-10 md:h-11 text-sm md:text-base transition-all duration-200 
                       focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="h-10 md:h-11 w-10 md:w-11 p-0 bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-700 hover:to-blue-700 transition-all duration-200
                       hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                    </Button>
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2">
                    AI responses are for guidance only. Verify with official KEA sources.
                </p>
            </div>
        </div>
    );
};

export default AICounselor;
