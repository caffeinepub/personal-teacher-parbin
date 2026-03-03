import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

// ─── AI Response Logic ────────────────────────────────────────────────────────

function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (
    msg.includes("maths") ||
    msg.includes("math") ||
    msg.includes("ganit") ||
    msg.includes("number")
  ) {
    return "Maths ek bahut interesting subject hai! 🔢\n\nMaths mein strong hone ke liye:\n• Roz thodi practice karein\n• Tables zaroor yaad karein (1-20 tak)\n• Problems step-by-step solve karein\n• Agar koi concept clear nahi ho to mujhse poochho!\n\nKaunsa topic samajhna hai aapko? Addition, Multiplication, Fractions, ya Algebra?";
  }

  if (
    msg.includes("science") ||
    msg.includes("vigyan") ||
    msg.includes("physics") ||
    msg.includes("chemistry") ||
    msg.includes("biology")
  ) {
    return "Science bilkul amazing subject hai! 🔬\n\nScience mein achhe results ke liye:\n• Diagrams banao aur label karein\n• Experiments ke steps yaad karein\n• Real life examples se connect karein\n• NCERT carefully padho\n\nPhysics, Chemistry, ya Biology — kaunsa topic chahiye? Main poori madad karunga! 🌟";
  }

  if (
    msg.includes("history") ||
    msg.includes("itihaas") ||
    msg.includes("social") ||
    msg.includes("bhugol") ||
    msg.includes("geography")
  ) {
    return "Social Science bahut interesting hai! 🌍\n\nHistory mein:\n• Dates aur events timeline mein yaad karein\n• Maps pe countries aur capitals mark karein\n• Stories ki tarah padho — boring nahi lagega!\n• Important rulers aur movements note karein\n\nKaunsa chapter help chahiye? Main aasaan language mein samjhaunga! 📚";
  }

  if (
    msg.includes("english") ||
    msg.includes("angrezi") ||
    msg.includes("grammar") ||
    msg.includes("essay")
  ) {
    return "English improve karna bilkul possible hai! 📖\n\nEnglish mein aage badhne ke tips:\n• Roz English newspaper ka ek article padho\n• New words ka ek notebook banao\n• Grammar rules practice karo — tenses bahut important hain!\n• English mein likhne ki practice karo\n\nEssay writing, grammar, ya reading — kya help chahiye? 😊";
  }

  if (
    msg.includes("hindi") ||
    msg.includes("nibandh") ||
    msg.includes("vyakaran")
  ) {
    return "Hindi hamari matra bhasha hai — isko aur accha banao! 🇮🇳\n\nHindi ke liye:\n• Roz ek paragraph likhne ki practice karein\n• Kavita padhein — bhasha ki samajh badhti hai\n• Vyakaran ke rules — karak, sandhia, samas yaad karein\n• NCERT ki kahaniyaan dhyan se padho\n\nKaunsa topic hai? Main zaroor guide karunga! 🌺";
  }

  if (
    msg.includes("computer") ||
    msg.includes("programming") ||
    msg.includes("coding")
  ) {
    return "Computer Science future ka subject hai! 💻\n\nComputer mein strong hone ke liye:\n• Basic concepts — hardware, software, memory samjho\n• Programming start karo — Python beginner ke liye best hai\n• Practice karo — theory se zyada practice zaroori hai!\n• Internet safety ke rules yaad rakho\n\nKaunsa topic cover karna chahoge? 🚀";
  }

  if (
    msg.includes("exam") ||
    msg.includes("test") ||
    msg.includes("pariksha") ||
    msg.includes("board")
  ) {
    return "Exam ki preparation ke liye yeh tips follow karein! 📝\n\n1️⃣ **Revision Schedule** — Exam se 15 din pehle start karein\n2️⃣ **Previous Papers** — Last 5 saal ke papers solve karein\n3️⃣ **Important Topics** — Marking scheme dekho\n4️⃣ **Rest** — Exam se ek raat pehle achha soiye\n5️⃣ **Positive Thinking** — Aap kar sakte ho! 💪\n\nKaunse subject mein zyada help chahiye?";
  }

  if (
    msg.includes("help") ||
    msg.includes("madad") ||
    msg.includes("samjho") ||
    msg.includes("explain")
  ) {
    return "Bilkul, main yahan hoon aapki poori madad ke liye! 🤗\n\nMain in subjects mein help kar sakta hoon:\n• 🔢 Maths — Sab levels ke liye\n• 🔬 Science — Physics, Chemistry, Biology\n• 📖 English — Grammar, Essays, Reading\n• 🇮🇳 Hindi — Vyakaran, Nibandh\n• 🌍 Social Science — History, Geography, Civics\n• 💻 Computer Science\n\nKaunsa subject ya topic chahiye? Sirf poochho! 😊";
  }

  if (
    msg.includes("namaste") ||
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hii") ||
    msg.includes("hey")
  ) {
    return "Namaste! 🙏 Main Parbin hoon — aapka Personal AI Teacher!\n\nAaj aap kya padhna chahte ho?\n\n• Koi subject ka concept samjhna hai?\n• Exam tips chahiye?\n• Koi specific doubt hai?\n\nMain hamesha yahan hoon — bina jhijhak ke poochho! Aapki safalta mere liye bahut important hai! 🌟";
  }

  if (
    msg.includes("motivat") ||
    msg.includes("haar") ||
    msg.includes("mushkil") ||
    msg.includes("difficult") ||
    msg.includes("hard")
  ) {
    return "Arey, haar mat maano! 💪✨\n\n**Yaad rakho:**\n• Har great student ko bhi kabhi mushkil lagti hai\n• Practice se sab asaan ho jaata hai\n• APJ Abdul Kalam ne bhi gareeb parivaar se shuruat ki thi\n• Aap jo soch sakte ho, kar sakte ho!\n\n**Aaj se start karo:**\n1. Sirf 15 min roz padho\n2. Ek chapter ek baar mein\n3. Doubt aaye to turant poochho\n\nMain aapke saath hoon — aap zaroor kar sakte ho! 🌟🚀";
  }

  if (msg.includes("class") || msg.includes("kaksha")) {
    return "Hamare paas Class 1 se 12 tak sab ke liye content hai! 📚\n\n**Available subjects:**\n• Class 1-5: Maths, English, Hindi, EVS\n• Class 6-8: Maths, Science, Social Science, Hindi, English, Computer\n• Class 9-10: Maths, Science, Social Science, Hindi, English, Computer\n• Class 11-12: Physics, Chemistry, Biology, Maths, English\n\nHome page pe jaake apni class choose karein! 🎯";
  }

  // Default fallback
  return "Ek bahut accha sawaal! 🤔\n\nMain Parbin hoon — aapka Personal AI Teacher.\n\nMujhe batao:\n• Kaunse subject mein help chahiye?\n• Kaunsi class mein ho aap?\n• Exam preparation chahiye ya concept samajhna hai?\n\nMain aapko clearly samjhaunga — Hindi ya English, jaise aap chahein! Poochhte rahein, seekhte rahein! 📖✨";
}

const STARTER_SUGGESTIONS = [
  "Maths ke tips batao",
  "Science samjhao",
  "Exam preparation help",
  "Motivate karo!",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: "Namaste! 🙏 Main Parbin hoon — aapka Personal AI Teacher!\n\nAaj aap kya padhna chahte ho? Koi bhi subject, koi bhi doubt — main hamesha yahan hoon aapki madad ke liye! 😊\n\nNeeche koi suggestion try karein ya seedha apna sawaal poochhen!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI "thinking" delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiResponse = getAIResponse(text);
    const aiMsg: Message = {
      id: nextId.current++,
      role: "ai",
      text: aiResponse,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-warm flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-black text-xl text-foreground flex items-center gap-2">
            Parbin AI Teacher
            <Sparkles className="w-4 h-4 text-primary" />
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-warm" />
            <span className="text-xs text-muted-foreground">
              Online — Madad ke liye taiyaar!
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === "ai"
                    ? "bg-primary shadow-warm"
                    : "bg-secondary border border-border"
                }`}
              >
                {msg.role === "ai" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-foreground" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm shadow-warm"
                    : "bg-card border border-border text-foreground rounded-tl-sm shadow-xs"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-warm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {STARTER_SUGGESTIONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 bg-secondary border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          data-ocid="chat.input"
          placeholder="Apna sawaal likhein... (e.g. Maths ke tips batao)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl h-12 px-4 text-sm border-border focus:border-primary"
          disabled={isTyping}
          autoFocus
        />
        <Button
          type="submit"
          data-ocid="chat.submit_button"
          disabled={!input.trim() || isTyping}
          className="h-12 w-12 rounded-2xl p-0 flex-shrink-0 shadow-warm"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
