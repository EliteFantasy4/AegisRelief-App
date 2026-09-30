import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  askAegisAssistant,
} from '../../services/aiAssistantService';
import {
  Sparkles,
  Send,
  X,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Globe,
  Radio,
  Copy,
  Check,
} from 'lucide-react';

interface AegisAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialContext?: string;
}

export const AegisAssistant: React.FC<AegisAssistantProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialContext,
}) => {
  // Consent State (Persisted in localStorage)
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(true);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'ne' | 'es' | 'fr'>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check existing consent
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aegis_ai_consent');
      if (stored === 'granted') {
        setHasConsented(true);
        setIsConsentModalOpen(false);
      } else {
        setHasConsented(false);
        setIsConsentModalOpen(true);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Handle initial query when opened
  useEffect(() => {
    if (isOpen && hasConsented && initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [isOpen, hasConsented, initialQuery]);

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if (hasConsented && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text:
            language === 'ne'
              ? 'नमस्ते! म Aegis AI सहायक हुँ। म तपाईंलाई विपद् पूर्वतयारी, आपत्कालीन सुरक्षा उपायहरू, र उद्धार कार्यहरूमा सहयोग गर्न यहाँ छु। तपाईं के जान्न चाहनुहुन्छ?'
              : 'Greetings. I am Aegis AI, your emergency disaster companion. I can provide immediate triage advice, survival checklists, and disaster intelligence. How may I assist you?',
          timestamp: new Date().toISOString(),
          language,
          suggestions:
            language === 'ne'
              ? [
                  'भूकम्प सुरक्षा निर्देशन',
                  'नेपाल आपत्कालीन सम्पर्क नम्बर',
                  'बाढी तथा डुबान सुरक्षा',
                  '७२ घण्टे आपत्कालीन झोला',
                ]
              : [
                  'Earthquake safety protocol',
                  'Nepal emergency helplines',
                  'Flash flood evacuation steps',
                  '72-Hour GO-BAG essentials',
                ],
        },
      ]);
    }
  }, [hasConsented, language]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleGrantConsent = () => {
    try {
      localStorage.setItem('aegis_ai_consent', 'granted');
    } catch {}
    setHasConsented(true);
    setIsConsentModalOpen(false);
  };

  const handleDeclineConsent = () => {
    try {
      localStorage.setItem('aegis_ai_consent', 'denied');
    } catch {}
    setHasConsented(false);
    setIsConsentModalOpen(false);
    onClose();
  };

  const handleRevokeConsent = () => {
    try {
      localStorage.removeItem('aegis_ai_consent');
    } catch {}
    setHasConsented(false);
    setIsConsentModalOpen(true);
    setMessages([]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await askAegisAssistant(prompt, {
        language,
        contextCategory: initialContext,
        userLocation: 'Global / Nepal',
      });
      setMessages((prev) => [...prev, response]);
    } catch {
      // Handled internally in service with graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      {/* 1. MANDATORY EXPLICIT CONSENT MODAL (Feature [F]) */}
      {isConsentModalOpen && !hasConsented && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Aegis AI Assistant Activation
              </h3>
              <p className="text-xs text-slate-500">Optional Disaster Intelligence Companion</p>
            </div>
          </div>

          {/* Bilingual Consent Text as Mandated */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            {/* English Consent Notice */}
            <div className="space-y-1">
              <span className="font-mono font-bold text-[10px] text-sky-600 dark:text-sky-400 uppercase">
                ENGLISH NOTICE
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "Enable Aegis AI Assistant? This optional feature helps summarize emergency steps and data. Your personal details are never collected or stored."
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2 space-y-1">
              {/* Nepali Consent Notice */}
              <span className="font-mono font-bold text-[10px] text-sky-600 dark:text-sky-400 uppercase">
                नेपाली सूचना
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "के तपाईं Aegis AI सहायक सक्षम गर्न चाहनुहुन्छ? यो ऐच्छिक सुविधाले आपत्कालीन चरणहरू र तथ्याङ्कहरू सार संक्षेप गर्न मद्दत गर्दछ। तपाईंको व्यक्तिगत विवरणहरू कहिल्यै सङ्कलन वा भण्डारण गरिने छैन।"
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Client-Side Privacy &amp; No Personal Data Storage
            </p>
            <p>
              In extreme emergencies, always prioritize calling verified national rescue hotlines directly.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleDeclineConsent}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Decline / Keep Offline
            </button>
            <button
              onClick={handleGrantConsent}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-md shadow-sky-500/25 transition-all"
            >
              I Agree &amp; Enable (सहमति दिन्छु)
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN ACTIVE AI ASSISTANT CHAT PANEL */}
      {hasConsented && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Aegis AI Assistant
                  </h3>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Multilingual Disaster Triage &amp; Survival Intelligence
                </p>
              </div>
            </div>

            {/* Language & Actions */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
                >
                  <option value="en">English (EN)</option>
                  <option value="ne">नेपाली (NE)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>

              {/* Reset History */}
              <button
                onClick={() => setMessages([])}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Panel */}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                      isAssistant
                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                        : 'bg-sky-600 text-white font-medium rounded-br-sm'
                    }`}
                  >
                    {/* Header for assistant message */}
                    {isAssistant && (
                      <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-700/60 pb-1.5 mb-2">
                        <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                          {msg.source === 'gemini-live' ? 'Gemini 3.8 Intelligence' : 'Aegis Verified Emergency Rulebook'}
                        </span>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Formatted Text Content */}
                    <div className="whitespace-pre-line prose-xs dark:prose-invert">
                      {msg.text}
                    </div>

                    {/* Suggested follow-up prompt chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                          Quick Follow-Ups:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(sug)}
                              className="text-[11px] bg-slate-100 dark:bg-slate-700/80 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-600"
                            >
                              {sug} →
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xs text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                <span>Formulating emergency triage advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-slate-400 shrink-0 font-bold">
              Topics:
            </span>
            {[
              language === 'ne' ? 'भूकम्प सुरक्षा चरणहरू' : 'Earthquake survival checklist',
              language === 'ne' ? 'नेपाल आपत्कालीन हटलाइन' : 'Nepal 100/1155 emergency helplines',
              language === 'ne' ? 'बाढी डुबान सावधानी' : 'Flash flood safety rules',
              language === 'ne' ? '७२ घण्टे आपत्कालीन झोला' : '72-Hour GO-BAG kit',
            ].map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(topic)}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-sky-600 whitespace-nowrap"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  language === 'ne'
                    ? 'कुनै पनि विपद् सम्बन्धी प्रश्न सोध्नुहोस् (उदा. भूकम्प आउँदा के गर्ने?)...'
                    : 'Ask about emergency triage, disaster protocols, or relief contacts...'
                }
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Aegis AI Assistant · Powered by Gemini &amp; Tactical Rulebook</span>
              <button
                onClick={handleRevokeConsent}
                className="hover:underline text-slate-500"
              >
                Revoke Consent &amp; Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
