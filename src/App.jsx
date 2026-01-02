import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, Settings, UserPlus, Check, X, ShieldCheck, 
  School, Calendar, Users, Mail, Lock, ArrowRight, 
  LogOut, Camera, Smile, Star, Volume2, Mic, Play, 
  RefreshCw, Coins, Sparkles, BookOpen, Zap, Cpu, Loader
} from 'lucide-react';

// ==========================================
// 0. DATA & MOCK BACKEND
// ==========================================
const CURRICULUM = [
  { id: 1, en: "Apple", vn: "ಸೇಬು", translit: "ಆಪಲ್", img: "🍎", color: "bg-red-50", accent: "text-red-600", btn: "bg-red-500", border: "border-red-200" },
  { id: 2, en: "Ball", vn: "ಚೆಂಡು", translit: "ಬಾಲ್", img: "⚽", color: "bg-blue-50", accent: "text-blue-600", btn: "bg-blue-500", border: "border-blue-200" },
  { id: 3, en: "Cat", vn: "ಬೆಕ್ಕು", translit: "ಕ್ಯಾಟ್", img: "🐱", color: "bg-yellow-50", accent: "text-yellow-700", btn: "bg-yellow-500", border: "border-yellow-200" },
  { id: 4, en: "Dog", vn: "ನಾಯಿ", translit: "ಡಾಗ್", img: "🐕", color: "bg-orange-50", accent: "text-orange-700", btn: "bg-orange-500", border: "border-orange-200" },
  { id: 5, en: "Sun", vn: "ಸೂರ್ಯ", translit: "ಸನ್", img: "☀️", color: "bg-amber-50", accent: "text-amber-600", btn: "bg-amber-500", border: "border-amber-200" },
  { id: 6, en: "Fish", vn: "ಮೀನು", translit: "ಫಿಶ್", img: "🐟", color: "bg-cyan-50", accent: "text-cyan-600", btn: "bg-cyan-500", border: "border-cyan-200" },
  { id: 7, en: "Girl", vn: "ಹುಡುಗಿ", translit: "ಗರ್ಲ್", img: "👧", color: "bg-pink-50", accent: "text-pink-600", btn: "bg-pink-500", border: "border-pink-200" },
  { id: 8, en: "House", vn: "ಮನೆ", translit: "ಹೌಸ್", img: "🏠", color: "bg-emerald-50", accent: "text-emerald-600", btn: "bg-emerald-500", border: "border-emerald-200" },
];

const DB = {
  students: [
    { id: 1, name: "Raju", gender: "boy", age: 6, coins: 0 },
    { id: 2, name: "Priya", gender: "girl", age: 6, coins: 0 }
  ],
  enrollStudent: (s) => {
    const newStudent = { ...s, id: Date.now(), coins: 0 };
    DB.students.push(newStudent);
    return newStudent;
  }
};

// ==========================================
// 1. HELPERS
// ==========================================

// Audio cache for pre-recorded word pronunciations
const audioCache = {};
let currentAudio = null; // Track currently playing audio

// Stop all audio and speech
const stopAllAudio = () => {
  // Stop browser TTS
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Stop any playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

// Speak a word - uses pre-recorded audio if available, fallback to TTS
const speak = (text, onEnd = null) => {
  // Stop any currently playing audio first
  stopAllAudio();
  const word = text.toLowerCase().trim();
  const audioPath = `/audio/${word}.mp3`;
  
  // Try pre-recorded audio first
  if (audioCache[word]) {
    // Use cached audio
    const audio = audioCache[word].cloneNode();
    currentAudio = audio;
    audio.onended = () => { currentAudio = null; if (onEnd) onEnd(); };
    audio.onerror = () => { currentAudio = null; fallbackToTTS(text, onEnd); };
    audio.play().catch(() => { currentAudio = null; fallbackToTTS(text, onEnd); });
    return;
  }
  
  // Try to load and cache the audio
  const audio = new Audio(audioPath);
  audio.oncanplaythrough = () => {
    audioCache[word] = audio;
    const playAudio = audio.cloneNode();
    currentAudio = playAudio;
    playAudio.onended = () => { currentAudio = null; if (onEnd) onEnd(); };
    playAudio.play().catch(() => { currentAudio = null; fallbackToTTS(text, onEnd); });
  };
  audio.onerror = () => fallbackToTTS(text, onEnd);
  audio.load();
};

// Fallback to browser TTS if audio file not found
const fallbackToTTS = (text, onEnd = null) => {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      
      // Try to find Indian voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('en-IN')) || 
                          voices.find(v => v.lang.startsWith('en'));
      if (indianVoice) utterance.voice = indianVoice;
      
      if (onEnd) utterance.onend = onEnd;
      
      window.speechSynthesis.speak(utterance);
    } else if (onEnd) {
      // No TTS available, just call onEnd after delay
      setTimeout(onEnd, 500);
    }
  } catch (e) {
    console.warn("TTS Error:", e);
    if (onEnd) setTimeout(onEnd, 500);
  }
};

// Confetti Celebration Component - colorful falling pieces
const CelebrationAnimation = () => {
  // Generate random confetti pieces
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 1.2 + Math.random() * 0.8,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF69B4', '#98D8C8'][Math.floor(Math.random() * 8)],
    size: 10 + Math.random() * 15,
    type: Math.random() > 0.6 ? 'circle' : 'rect',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          <div
            style={{
              width: piece.size,
              height: piece.type === 'rect' ? piece.size * 0.4 : piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.type === 'circle' ? '50%' : '2px',
              boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};


// ==========================================
// PHONETIC MATCHING SYSTEM
// ==========================================

// Soundex-inspired phonetic encoder - converts words to sound codes
// Words that SOUND the same get the SAME code
const getPhoneticCode = (word) => {
  const w = word.toLowerCase().trim();
  if (!w) return '';
  
  // Phonetic groupings - letters that sound similar
  const phoneticMap = {
    'b': '1', 'f': '1', 'p': '1', 'v': '1',  // Labials
    'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2', // Gutturals
    'd': '3', 't': '3',  // Dentals
    'l': '4',  // Liquid
    'm': '5', 'n': '5',  // Nasals
    'r': '6',  // R
    // a, e, i, o, u, h, w, y are ignored (vowels and weak consonants)
  };
  
  // Keep first letter, encode rest
  let code = w[0].toUpperCase();
  let lastCode = phoneticMap[w[0]] || '0';
  
  for (let i = 1; i < w.length && code.length < 4; i++) {
    const c = w[i];
    const mapped = phoneticMap[c];
    if (mapped && mapped !== lastCode) {
      code += mapped;
      lastCode = mapped;
    } else if (!mapped) {
      lastCode = '0'; // Reset on vowels
    }
  }
  
  // Pad to 4 characters
  return (code + '0000').substring(0, 4);
};

// Double Metaphone-inspired: Handle common English sound patterns
const normalizeForSound = (word) => {
  let w = word.toLowerCase().trim();
  
  // Common sound normalizations
  w = w.replace(/ph/g, 'f');     // phone -> fone
  w = w.replace(/ght/g, 't');    // night -> nit
  w = w.replace(/kn/g, 'n');     // knee -> nee
  w = w.replace(/wr/g, 'r');     // write -> rite
  w = w.replace(/wh/g, 'w');     // what -> wat
  w = w.replace(/ck/g, 'k');     // back -> bak
  w = w.replace(/tch/g, 'ch');   // watch -> wach
  w = w.replace(/dge/g, 'j');    // badge -> baj
  w = w.replace(/tion/g, 'shun'); // nation -> nashun
  w = w.replace(/sion/g, 'zhun'); // vision -> vizhun
  
  // Remove silent letters at end
  w = w.replace(/mb$/g, 'm');    // lamb -> lam
  w = w.replace(/mn$/g, 'm');    // autumn -> autum
  
  // Vowel normalizations (they often sound similar)
  w = w.replace(/[aeiou]+/g, 'a'); // Collapse vowels
  
  return w;
};

// Calculate similarity using multiple methods
const calculateSimilarity = (recognized, expected) => {
  const r = recognized.toLowerCase().trim();
  const e = expected.toLowerCase().trim();
  
  console.log(`🔍 Comparing: "${r}" vs "${e}"`);
  
  // 1. EXACT MATCH
  if (r === e) {
    console.log('  ✓ Exact match!');
    return 1.0;
  }
  
  // 2. CHECK IF EXPECTED WORD IS IN THE PHRASE
  // Handles: "I said apple" contains "apple"
  const words = r.split(/\s+/);
  if (words.includes(e)) {
    console.log('  ✓ Found exact word in phrase');
    return 0.95;
  }
  
  // 3. PHONETIC CODE MATCH (Soundex-style)
  // "sun" and "son" both encode to "S500"
  const rCode = getPhoneticCode(r);
  const eCode = getPhoneticCode(e);
  console.log(`  Phonetic codes: "${rCode}" vs "${eCode}"`);
  
  if (rCode === eCode) {
    console.log('  ✓ Phonetic match!');
    return 0.9;
  }
  
  // 4. NORMALIZED SOUND MATCH
  const rNorm = normalizeForSound(r);
  const eNorm = normalizeForSound(e);
  console.log(`  Normalized: "${rNorm}" vs "${eNorm}"`);
  
  if (rNorm === eNorm) {
    console.log('  ✓ Normalized sound match!');
    return 0.85;
  }
  
  // 5. CONTAINS CHECK
  if (r.includes(e) || e.includes(r)) {
    console.log('  ✓ Contains match');
    return 0.8;
  }
  
  // 6. FIRST SOUND MATCH (for short words)
  // Kids might say just the beginning
  if (e.length >= 3 && r.length >= 2) {
    if (r.substring(0, 2) === e.substring(0, 2)) {
      console.log('  ✓ First sounds match');
      return 0.7;
    }
  }
  
  // 7. LEVENSHTEIN DISTANCE (letter-by-letter)
  const matrix = [];
  for (let i = 0; i <= e.length; i++) matrix[i] = [i];
  for (let j = 0; j <= r.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= e.length; i++) {
    for (let j = 1; j <= r.length; j++) {
      if (e[i-1] === r[j-1]) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1,
          matrix[i][j-1] + 1,
          matrix[i-1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[e.length][r.length];
  const maxLen = Math.max(r.length, e.length);
  let similarity = 1 - (distance / maxLen);
  
  // Boost for short words with 1 letter difference
  if (e.length <= 4 && distance <= 1) {
    similarity = Math.max(similarity, 0.65);
  }
  
  console.log(`  Levenshtein: distance=${distance}, similarity=${similarity.toFixed(2)}`);
  
  return similarity;
};

// Get feedback message based on similarity score
const getFeedback = (similarity, expectedWord, recognizedText) => {
  if (similarity >= 0.7) {
    return { message: "Correct! Great job!", type: 'success', score: similarity };
  } else {
    return { message: "Try again!", type: 'error', score: similarity };
  }
};

// ==========================================
// 2. CINEMATIC INTRO (TUNED TIMING)
// ==========================================
const CinematicIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('start');

  useEffect(() => {
    const sequence = [
      { t: 50, f: 'dropping' },   // Start drops (faster start)
      { t: 800, f: "machine" },   // Slam IN MACHINE (faster: 0.8s)
      { t: 2000, f: 'hold' },     // Read time (reduced from 3s to 2s)
      { t: 2800, f: 'finish' },   // Fade out (reduced from 4s to 2.8s)
      { t: 3500, f: 'complete' }  // Unmount (total: 3.5s instead of 5s)
    ];

    const timers = sequence.map(s => setTimeout(() => {
      if (s.f === 'complete') onComplete();
      else setPhase(s.f);
    }, s.t));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 'finish' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pointer-events-none"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* SEQUENTIAL DROPPING TEXT */}
        <div className={`flex gap-1 md:gap-3 mb-6 ${phase === 'machine' ? 'animate-shake-impact' : ''}`}>
          {['T','E','A','C','H','E','R'].map((char, i) => {
            const delay = i * 0.08;
            return (
              <div key={i} className="relative group" style={{ 
                  animationName: phase !== 'start' ? 'heavy-drop' : 'none',
                  animationDuration: phase !== 'start' ? '0.5s' : undefined,
                  animationTimingFunction: phase !== 'start' ? 'cubic-bezier(0.25, 1, 0.5, 1)' : undefined,
                  animationDelay: phase !== 'start' ? `${delay}s` : undefined,
                  animationFillMode: phase !== 'start' ? 'forwards' : undefined,
                  opacity: phase === 'start' ? 0 : undefined, 
                  transform: phase === 'start' ? 'translateY(-100vh)' : undefined
              }}>
                <div className="w-10 h-14 md:w-20 md:h-28 bg-gradient-to-b from-yellow-300 to-yellow-500 border-b-8 border-r-8 border-yellow-700 rounded-lg shadow-[0_10px_30px_rgba(234,179,8,0.3)] flex items-center justify-center">
                  <span className="text-3xl md:text-7xl font-black text-yellow-900 font-sans drop-shadow-sm">{char}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MACHINE SLIDER */}
        <div className="relative h-20 overflow-visible">
           <div className="relative bg-blue-600/10 border-y border-blue-500/50 px-8 py-2 backdrop-blur-sm shadow-[0_0_50px_rgba(37,99,235,0.2)] flex items-center gap-4 rounded-xl"
             style={{ animation: phase === 'machine' || phase === 'hold' || phase === 'finish' ? 'cyber-slide 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none', opacity: 0, transform: 'translateX(-100vw)' }}>
             <Cpu size={24} className="text-blue-400 animate-spin-slow" />
             <span className="text-xl md:text-4xl font-bold text-white tracking-[0.5em] font-mono drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">IN MACHINE</span>
             <Zap size={24} className="text-yellow-400 animate-pulse" />
           </div>
        </div>
      </div>
      <div className="absolute bottom-16 w-48 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 animate-loading-bar"></div></div>
      <style>{`
        @keyframes heavy-drop { 
          0% { transform: translateY(-100vh) rotate(-10deg); opacity: 1; } 
          60% { transform: translateY(0); } 
          75% { transform: translateY(-20px) rotate(5deg); } 
          100% { transform: translateY(0) rotate(0deg); opacity: 1; } 
        }
        @keyframes cyber-slide { 0% { transform: translateX(-100vw) skewX(-20deg); opacity: 0; filter: blur(10px); } 70% { transform: translateX(20px) skewX(10deg); opacity: 1; filter: blur(0px); } 100% { transform: translateX(0) skewX(0deg); opacity: 1; } }
        @keyframes shake-impact { 0%, 100% { transform: translate(0, 0); } 20%, 60% { transform: translate(2px, -1px); } 40%, 80% { transform: translate(-2px, 1px); } }
        @keyframes load { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-loading-bar { animation: load 3.5s linear forwards; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ==========================================
// 3. COMPONENTS: MAGIC MIRROR
// ==========================================
const MagicMirror = ({ onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(s => { if(videoRef.current) videoRef.current.srcObject = s; })
      .catch((e) => {
        // Camera access denied - this is expected and handled gracefully
        setError(true);
      }); 

    // Simulate Passive Detection
    const timer = setTimeout(() => {
      onScan(); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-64 h-72 sm:w-72 sm:h-80 bg-black rounded-[2rem] sm:rounded-[3rem] border-[8px] sm:border-[12px] border-slate-700 shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {!error ? (
           <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
        ) : (
           <div className="w-full h-full bg-slate-800 flex items-center justify-center">
             <div className="text-white/20 flex flex-col items-center">
               <Camera size={48} />
               <span className="text-xs mt-2 font-mono">CAMERA ACTIVE</span>
             </div>
           </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

// ==========================================
// 4. COMPONENT: TEACHER DASHBOARD
// ==========================================
const TeacherPortal = ({ onExit }) => {
  const [view, setView] = useState('login');
  const [students, setStudents] = useState(DB.students);
  const [form, setForm] = useState({ name: '', gender: 'boy' });

  // 1. Teacher Login View
  if (view === 'login') return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-fade-in">
       <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative border-4 border-white/20">
         <button onClick={onExit} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"><X size={20}/></button>
         <div className="mb-6">
           <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center"><ShieldCheck size={32} className="text-blue-600"/></div>
           <h2 className="text-2xl font-black text-slate-800">Teacher Login</h2>
         </div>
         <div className="space-y-3">
            <input className="w-full bg-slate-50 p-4 rounded-xl border-2 outline-none focus:border-blue-500 font-bold text-slate-700 text-sm" placeholder="School Email" defaultValue="teacher@school.com"/>
            <input className="w-full bg-slate-50 p-4 rounded-xl border-2 outline-none focus:border-blue-500 font-bold text-slate-700 text-sm" type="password" placeholder="Password" defaultValue="pass"/>
            <button onClick={() => setView('dash')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all mt-2">Enter Class</button>
         </div>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-100 p-3 sm:p-4 animate-slide-up">
       <div className="bg-white w-full max-w-md h-[90vh] sm:h-[600px] max-h-[700px] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative">
          <div className="bg-blue-600 p-4 sm:p-6 pb-10 sm:pb-12 text-white relative overflow-hidden">
             <div className="relative z-10 flex justify-between items-start">
               <div><h2 className="font-bold text-base sm:text-lg flex items-center gap-2"><School size={18} className="sm:w-5 sm:h-5"/> Class 1-A</h2><p className="text-blue-200 text-xs font-bold">Gov School #4</p></div>
               <button onClick={onExit} className="bg-blue-500 p-1.5 sm:p-2 rounded-full hover:bg-blue-400"><LogOut size={14} className="sm:w-4 sm:h-4"/></button>
             </div>
             <div className="absolute -bottom-10 -right-10 text-blue-500 opacity-50 hidden sm:block"><Users size={120}/></div>
          </div>
          <div className="flex-1 -mt-4 sm:-mt-6 bg-white rounded-t-[1.5rem] sm:rounded-t-[2rem] p-4 sm:p-6 flex flex-col relative z-20">
             <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Admission</label>
                <div className="flex gap-2 mt-2 mb-3">
                   <input className="flex-1 bg-slate-50 p-3 rounded-xl border font-bold text-slate-800 outline-none focus:border-blue-500" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                   <div className="flex bg-slate-50 rounded-xl border p-1 gap-1">
                     {['boy','girl'].map(g => (<button key={g} onClick={() => setForm({...form, gender: g})} className={`px-3 rounded-lg text-xl transition-all ${form.gender === g ? 'bg-white shadow-sm' : 'opacity-40'}`}>{g==='boy'?'👦':'👧'}</button>))}
                   </div>
                </div>
                <button disabled={!form.name} onClick={() => { setStudents([...students, DB.enrollStudent(form)]); setForm({...form, name: ''}); }} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"><Camera size={18}/> Capture Face ID</button>
             </div>
             <div className="flex-1 overflow-hidden flex flex-col">
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Class Roster ({students.length})</h3>
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                 {students.map(s => (
                   <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">{s.gender === 'boy' ? '👦' : '👧'}</div>
                     <div><p className="font-bold text-sm text-slate-700">{s.name}</p></div>
                     <div className="ml-auto flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100"><Coins size={12} className="fill-yellow-500 text-yellow-600"/> {s.coins}</div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
       </div>
       <style>{` .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; } `}</style>
    </div>
  );
};

// ==========================================
// 5. COMPONENT: STUDENT RAILROAD
// ==========================================
const StudentApp = ({ student, onLogout }) => {
  const [level, setLevel] = useState(0);
  const [stage, setStage] = useState('learn');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, success
  const [showCelebration, setShowCelebration] = useState(false); 
  const [coins, setCoins] = useState(student ? student.coins : 0);
  const [feedback, setFeedback] = useState(null);
  const [heardText, setHeardText] = useState('');
  
  // Refs to track state across callbacks
  const levelRef = useRef(0);
  const isListeningRef = useRef(false);
  const hasStartedRef = useRef(false);
  const recognitionRef = useRef(null);
  
  // Keep levelRef in sync
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  
  if (!student) return null;
  const word = CURRICULUM[level] || CURRICULUM[0];

  // Main function: Speak the word, then listen
  const speakThenListen = () => {
    if (isListeningRef.current) return;
    
    console.log('🔊 Speaking:', word.en);
    setStatus('idle');
    setFeedback(null);
    setHeardText('');
    
    // Use speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.en);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      
      utterance.onend = () => {
        console.log('🔊 Speech ended, starting listener in 500ms...');
        setTimeout(() => {
          startListening();
        }, 500);
      };
      
      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        // Still try to listen even if speech fails
        setTimeout(() => startListening(), 500);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // No speech synthesis, just start listening
      startListening();
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (isListeningRef.current) {
      console.log('Already listening, skip');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback({ message: "Please use Chrome browser! 🌐", type: 'error' });
      return;
    }
    
    console.log('🎤 Starting recognition...');
    isListeningRef.current = true;
    setStatus('listening');
    setHeardText('');
    
    let gotResult = false;
    let timeoutId = null;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    
    recognition.onstart = () => {
      console.log('🎤 Recognition started!');
    };
    
    recognition.onresult = (event) => {
      gotResult = true;
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Heard:', transcript, 'isFinal:', event.results[0].isFinal);
      setHeardText(transcript);
      
      if (event.results[0].isFinal) {
        if (timeoutId) clearTimeout(timeoutId);
        isListeningRef.current = false;
        processResult(transcript.toLowerCase().trim());
      }
    };
    
    recognition.onerror = (event) => {
      console.error('🎤 Error:', event.error);
      if (timeoutId) clearTimeout(timeoutId);
      isListeningRef.current = false;
      
      if (event.error === 'no-speech') {
        // Child didn't speak - just try again automatically with encouragement
        setFeedback({ message: "Let's try again! 🌟", type: 'encourage' });
        setTimeout(() => {
          setFeedback(null);
          speakThenListen();
        }, 1000);
      } else if (event.error === 'not-allowed') {
        setStatus('idle');
        setFeedback({ message: "Please allow the microphone! 🎤", type: 'error' });
      } else if (event.error !== 'aborted') {
        // Auto-retry on other errors
        setTimeout(() => speakThenListen(), 1000);
      }
    };
    
    recognition.onend = () => {
      console.log('🎤 Recognition ended, gotResult:', gotResult);
      if (timeoutId) clearTimeout(timeoutId);
      
      // If no result, automatically try again (child-friendly - no action needed)
      if (isListeningRef.current && !gotResult) {
        isListeningRef.current = false;
        setFeedback({ message: "Let's try again! 🌟", type: 'encourage' });
        setTimeout(() => {
          setFeedback(null);
          speakThenListen();
        }, 1000);
      }
      isListeningRef.current = false;
    };
    
    try {
      recognition.start();
      
      // Auto-timeout after 5 seconds - automatically retry (no scary messages!)
      timeoutId = setTimeout(() => {
        if (isListeningRef.current) {
          console.log('🎤 Timeout - auto-retrying');
          try { recognition.stop(); } catch(e) {}
          
          if (!gotResult) {
            isListeningRef.current = false;
            // Show brief encouraging message, then auto-retry
            setFeedback({ message: "Say it with me! 🎵", type: 'encourage' });
            setTimeout(() => {
              setFeedback(null);
              speakThenListen();
            }, 1000);
          }
        }
      }, 5000);
      
    } catch (e) {
      console.error('Failed to start recognition:', e);
      isListeningRef.current = false;
      // Auto-retry
      setTimeout(() => speakThenListen(), 1000);
    }
  };

  // Process the recognized speech
  const processResult = (heard) => {
    const currentWord = CURRICULUM[levelRef.current];
    const expected = currentWord.en.toLowerCase();
    
    console.log('📝 Processing:', heard, 'vs', expected);
    setStatus('processing');
    
    // Calculate similarity
    const similarity = calculateSimilarity(heard, expected);
    console.log('📝 Similarity:', similarity);
    
    if (similarity >= 0.6) {
      // CORRECT!
      console.log('✅ Correct! Heard:', heard, 'Expected:', expected, 'Similarity:', similarity);
      setFeedback({ message: `🎉 Correct! "${heard}"`, type: 'success' });
      setShowCelebration(true);
      setCoins(c => c + 10);
      
      // Play success sound
      try {
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3').play();
      } catch(e) {}
      
      // Move to next word after delay
      setTimeout(() => {
        setShowCelebration(false);
        if (levelRef.current < CURRICULUM.length - 1) {
          const next = levelRef.current + 1;
          levelRef.current = next;
          hasStartedRef.current = false;
          setLevel(next);
          setStatus('idle');
          setFeedback(null);
          setHeardText('');
        } else {
          setStage('reward');
        }
      }, 2500);
      
    } else {
      // INCORRECT - Try again
      console.log('❌ Incorrect, try again');
      setFeedback({ message: `Heard "${heard}" - Try again!`, type: 'error' });
      
      // Play error sound
      try {
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.wav').play();
      } catch(e) {}
      
      // Retry after delay
      setTimeout(() => {
        setStatus('idle');
        speakThenListen();
      }, 2500);
    }
  };

  // Auto-start when entering learn stage
  useEffect(() => {
    if (stage === 'learn' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      console.log('🚀 Auto-starting for word:', word.en);
      
      // Give browser time to mount + request mic permission on first run
      const timer = setTimeout(() => {
        speakThenListen();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [stage, level]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      stopAllAudio(); // Stop all audio when leaving
    };
  }, []);

  // Manual replay button
  const handleReplay = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    isListeningRef.current = false;
    speakThenListen();
  };

  // --- RENDERERS ---

  // 2. REWARD
  if (stage === 'reward') return (
    <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden animate-fade-in">
       <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-4 sm:border-8 border-yellow-400 text-center w-full max-w-sm z-10 mx-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">Good Job!</h1>
          <div className="bg-slate-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col items-center mt-4 sm:mt-6 border-2 border-slate-200">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Coins</span>
             <div className="text-4xl sm:text-6xl font-black text-yellow-500 flex items-center gap-2 mt-2">
                <Coins size={32} className="sm:w-12 sm:h-12 text-yellow-500 fill-yellow-500"/> {coins}
             </div>
          </div>
          <button onClick={onLogout} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-lg sm:text-xl">
             Finish Demo <LogOut size={18} className="sm:w-5 sm:h-5" />
          </button>
       </div>
    </div>
  );

  // 3. LEARNING (Unified View with all elements)
  return (
    <div className={`h-screen w-full flex flex-col font-sans transition-colors duration-700 ${word.color} relative overflow-hidden`}>
      {/* Celebration Animation */}
      {showCelebration && <CelebrationAnimation />}
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-3 sm:p-6 flex justify-between items-center z-20">
        <div className="flex gap-1 sm:gap-2">
           {[...Array(8)].map((_, i) => (
             <div key={i} className={`h-2 w-4 sm:h-3 sm:w-8 rounded-full transition-colors border border-white/50 sm:border-2 ${i <= level ? 'bg-green-500' : 'bg-black/10'}`}></div>
           ))}
        </div>
        <div className="flex gap-2 sm:gap-4">
           <div className="bg-yellow-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-black text-yellow-900 flex items-center gap-1 sm:gap-2 shadow-lg border-2 sm:border-4 border-white text-sm sm:text-base">
              {coins} <Coins size={16} className="sm:w-5 sm:h-5 fill-current"/>
           </div>
           <button onClick={onLogout} className="bg-white p-2 sm:p-3 rounded-full shadow-lg text-red-400 hover:scale-110 transition-transform"><LogOut size={18} className="sm:w-5 sm:h-5"/></button>
        </div>
      </div>

      {/* Content - All elements shown together */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full pt-20 sm:pt-28 pb-4">
         <div className="flex-1 flex flex-col items-center justify-center w-full px-4 max-w-2xl">
            <div className="animate-pop-in flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6">
               {/* Image */}
               <div 
                 className="text-[100px] sm:text-[140px] md:text-[180px] leading-none filter drop-shadow-2xl transform hover:scale-110 transition-transform cursor-pointer" 
                 onClick={handleReplay}
               >
                  {word.img}
               </div>
               
               {/* English Word */}
               <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-800 tracking-tighter drop-shadow-sm text-center break-words">
                  {word.en}
               </h1>
               
               {/* Kannada Translation */}
               <div className="bg-white/60 backdrop-blur-sm px-6 sm:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border-2 border-white/50 shadow-lg">
                  <span className="text-3xl sm:text-5xl font-black text-blue-600 drop-shadow-sm">{word.vn}</span>
               </div>
               
               {/* Transliteration (English word in Kannada script) */}
               <div className="bg-white/50 backdrop-blur-sm px-6 sm:px-10 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                  <p className="text-2xl sm:text-4xl font-bold text-gray-700 tracking-wider">{word.translit}</p>
               </div>
            </div>
         </div>

         {/* Status and Feedback Section */}
         <div className="w-full flex flex-col items-center px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
             
             {/* Listening indicator - child-friendly */}
             {status === 'listening' && (
               <div className="bg-white px-6 sm:px-10 py-4 sm:py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3 border-4 border-purple-400 w-full max-w-md">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-8 h-8 bg-purple-500 rounded-full animate-ping absolute"></div>
                      <div className="w-8 h-8 bg-purple-600 rounded-full relative flex items-center justify-center">
                        <Mic size={16} className="text-white" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-purple-600">Say it! 🗣️</span>
                  </div>
                  {heardText && (
                    <p className="text-xl font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-xl">"{heardText}"</p>
                  )}
               </div>
             )}
             
             {/* Feedback messages */}
             {feedback && (
               <div className={`px-6 sm:px-10 py-4 sm:py-5 rounded-3xl shadow-2xl w-full max-w-md text-center animate-pop-in ${
                 feedback.type === 'success' ? 'bg-green-500 text-white border-4 border-green-300' :
                 feedback.type === 'encourage' ? 'bg-purple-500 text-white border-4 border-purple-300' :
                 feedback.type === 'error' ? 'bg-orange-500 text-white border-4 border-orange-300' :
                 'bg-yellow-400 text-yellow-900 border-4 border-yellow-300'
               }`}>
                  <p className="text-2xl sm:text-3xl font-black">{feedback.message}</p>
               </div>
             )}
             
             {/* Manual replay - only if stuck (e.g., mic blocked) */}
             {status === 'idle' && feedback?.type === 'error' && (
               <button 
                 onClick={handleReplay}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl font-black text-xl flex items-center gap-3 transition-all active:scale-95 mt-4"
               >
                 <Volume2 size={28} /> Try Again
               </button>
             )}
             
         </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. ROOT CONTROLLER
// ==========================================
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState('mirror'); 
  const [student, setStudent] = useState(null);
  const [showTeacher, setShowTeacher] = useState(false);
  const loginTimer = useRef(null);

  useEffect(() => {
    if (!showIntro && view === 'mirror' && !showTeacher) {
      // Auto-login disabled for demo control
    }
    return () => clearTimeout(loginTimer.current);
  }, [showIntro, view, showTeacher]);

  const handleDemoLogin = () => {
    // Web Speech API doesn't need explicit permission request - it asks automatically when recognition starts
    setStudent(DB.students[0]);
    setView('student');
  };

  return (
    <div className="w-full h-screen font-sans overflow-hidden bg-sky-300 selection:bg-yellow-200">
      
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* LANDING PAGE */}
      <div className="absolute inset-0 bg-sky-300">
         <div className="absolute top-4 right-4 sm:top-10 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-yellow-400 rounded-full shadow-[0_0_60px_rgba(250,204,21,0.8)] animate-pulse"></div>
         <div className="absolute top-12 left-4 sm:top-20 sm:left-10 text-white/60"><CloudIcon size={80} /></div>
         <div className="absolute top-24 right-20 sm:top-40 sm:right-40 text-white/40 hidden sm:block"><CloudIcon size={80} /></div>
         
         <div className="absolute bottom-0 w-full h-1/3 bg-green-500 border-t-[8px] sm:border-t-[12px] border-green-600">
            <div className="absolute -top-16 -left-4 sm:-top-24 sm:left-10"><AnimatedRabbit size={100} /></div>
            <div className="absolute -top-12 -right-4 sm:-top-16 sm:right-10"><AnimatedCat size={80} /></div>
            <div className="absolute top-6 left-1/4 opacity-30 text-green-800 hidden sm:block"><GrassClump className="w-12 h-12"/></div>
            <div className="absolute top-2 right-1/3 opacity-30 text-green-800 hidden sm:block"><GrassClump className="w-12 h-12"/></div>
         </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 sm:p-6">
        {view === 'mirror' && !showIntro && (
          <div className="flex flex-col items-center animate-fade-in w-full max-w-sm">
             <MagicMirror onScan={() => {}} />
             <div className="mt-8 sm:mt-12 flex justify-between w-full px-2 sm:px-4 gap-2">
                <button onClick={() => setShowTeacher(true)} className="flex items-center gap-1.5 sm:gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold border border-white/20 px-3 sm:px-4 py-2 rounded-full hover:bg-white/10 bg-black/10">
                   <Settings size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Teacher</span>
                </button>
                <button onClick={handleDemoLogin} className="flex items-center gap-1.5 sm:gap-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 transition-all text-xs font-bold border-b-4 border-yellow-600 px-3 sm:px-4 py-2 rounded-full shadow-lg active:border-b-0 active:translate-y-1">
                   <Zap size={12} className="sm:w-3.5 sm:h-3.5" /> <span>Demo Student</span>
                </button>
             </div>
          </div>
        )}
        
        {/* TEACHER MODAL (Correctly Mounted) */}
        {showTeacher && <TeacherPortal onExit={() => setShowTeacher(false)} />}
      </div>

      {view === 'student' && (
        <div className="fixed inset-0 z-50 bg-white">
           <StudentApp student={student} onLogout={() => { stopAllAudio(); setStudent(null); setView('mirror'); }} />
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-bounce-gentle { animation: bounce 2s infinite ease-in-out; }
        .animate-celebration { animation: fadeIn 0.3s ease-out; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        /* Confetti celebration animations */
        @keyframes confetti-fall {
          0% { 
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(10vh) rotate(90deg) scale(1);
          }
          100% { 
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 2s ease-out forwards;
        }
        
        @keyframes star-pop {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 1; }
        }
        .animate-star-pop {
          animation: star-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        @keyframes celebration-burst {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .animate-celebration-burst {
          animation: celebration-burst 0.5s ease-out forwards;
        }
        
        @keyframes ray-burst {
          0% { stroke-dasharray: 0 100; opacity: 0; }
          50% { stroke-dasharray: 50 50; opacity: 1; }
          100% { stroke-dasharray: 80 20; opacity: 0.6; }
        }
        .animate-ray-burst {
          animation: ray-burst 0.8s ease-out forwards;
        }
        @keyframes heavy-drop { 0% { transform: translateY(-100vh) rotate(-10deg); opacity: 1; } 60% { transform: translateY(0); } 75% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); opacity: 1; } }
        @keyframes cyber-slide { 0% { transform: translateX(-100vw) skewX(-20deg); opacity: 0; filter: blur(10px); } 70% { transform: translateX(20px) skewX(10deg); opacity: 1; filter: blur(0px); } 100% { transform: translateX(0) skewX(0deg); opacity: 1; } }
        @keyframes shake-impact { 0%, 100% { transform: translate(0, 0); } 20%, 60% { transform: translate(2px, -1px); } 40%, 80% { transform: translate(-2px, 1px); } }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        /* Rabbit/Cat */
        @keyframes wave-hand { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg); } }
        @keyframes walk-legs { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes blink-eyes { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
        @keyframes wag-tail { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
      `}</style>
    </div>
  );
}

// ASSETS
const CloudIcon = ({ size }) => <svg width={size} height={size*0.6} viewBox="0 0 24 24" fill="currentColor"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.108,0.015-0.212,0.026-0.317C11.536,13.064,11.025,13,10.5,13c-2.485,0-4.5,2.015-4.5,4.5s2.015,4.5,4.5,4.5h7c2.485,0,4.5-2.015,4.5-4.5S19.985,13,17.5,13c-0.279,0-0.55,0.029-0.814,0.081C16.388,10.662,14.654,9,12.5,9c-3.037,0-5.5,2.463-5.5,5.5c0,0.108-0.015,0.212-0.026,0.317C6.964,14.936,7.475,15,8,15c0.231,0,0.457-0.021,0.678-0.053C8.243,15.632,8,16.299,8,17c0,2.761,2.239,5,5,5h4.5c2.761,0,5-2.239,5-5S20.261,12,17.5,12c-0.125,0-0.248,0.006-0.369,0.018C17.062,11.966,17,11.913,17,11.859C17,10.28,15.72,9,14.141,9c-1.282,0-2.366,0.844-2.723,2.008C11.166,11.002,11.084,11,11,11c-2.761,0-5,2.239-5,5s2.239,5,5,5h6.5c2.761,0,5-2.239,5-5S20.261,16,17.5,16z"/></svg>;
const GrassClump = ({ className }) => <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor" className={className}><path d="M0,30 Q10,0 20,30"/><path d="M10,30 Q20,10 30,30"/><path d="M20,30 Q30,5 40,30"/></svg>;
const AnimatedRabbit = ({ size }) => <svg width={size} height={size} viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="92" rx="30" ry="5" fill="black" opacity="0.1" /><path d="M30 75 Q25 85 35 90 L45 90 Q50 80 40 70" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><circle cx="25" cy="70" r="8" fill="white" stroke="#e5e7eb" strokeWidth="2" /><path d="M35 60 Q35 85 55 85 Q75 85 75 60 Q75 45 55 45 Q35 45 35 60" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><path d="M40 65 Q55 75 70 65" fill="white" opacity="0.9"/><g style={{ animation: 'walk-legs 1s infinite ease-in-out' }}><path d="M55 75 Q50 85 60 90 L70 90 Q75 80 65 70" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><path d="M58 88 L68 88" stroke="white" strokeWidth="2" opacity="0.5" /></g><g style={{ transformOrigin: '70px 55px', animation: 'wave-hand 1.5s infinite ease-in-out' }}><path d="M70 55 Q90 45 90 25 Q80 20 65 50" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><circle cx="90" cy="25" r="5" fill="white" stroke="#9ca3af" strokeWidth="1" /></g><path d="M35 55 Q25 65 35 75" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><g style={{ animation: 'walk-legs 2s infinite ease-in-out reverse' }}><path d="M45 25 Q40 0 50 5 Q60 15 55 25" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><ellipse cx="48" cy="15" rx="3" ry="8" fill="#fca5a5" transform="rotate(-10 48 15)"/><path d="M65 25 Q70 0 60 5 Q50 15 55 25" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><ellipse cx="62" cy="15" rx="3" ry="8" fill="#fca5a5" transform="rotate(10 62 15)"/><circle cx="55" cy="35" r="18" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" /><ellipse cx="55" cy="42" rx="10" ry="8" fill="white" /><g style={{ animation: 'blink-eyes 3s infinite' }}><circle cx="48" cy="32" r="3" fill="#1f2937" /><circle cx="62" cy="32" r="3" fill="#1f2937" /><circle cx="49" cy="31" r="1" fill="white" /><circle cx="63" cy="31" r="1" fill="white" /></g><path d="M52 40 Q55 43 58 40" fill="#fca5a5" /><path d="M40 40 L30 38" stroke="#d1d5db" strokeWidth="1" /><path d="M40 42 L30 44" stroke="#d1d5db" strokeWidth="1" /><path d="M70 40 L80 38" stroke="#d1d5db" strokeWidth="1" /><path d="M70 42 L80 44" stroke="#d1d5db" strokeWidth="1" /></g></svg>;
const AnimatedCat = ({ size }) => <svg width={size} height={size} viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="90" rx="30" ry="5" fill="black" opacity="0.2" /><g style={{ transformOrigin: '70px 70px', animation: 'wag-tail 2s infinite ease-in-out' }}><path d="M70 70 Q90 60 90 30 Q80 20 70 50" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" /></g><ellipse cx="50" cy="70" rx="25" ry="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/><g><ellipse cx="50" cy="50" rx="22" ry="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/><path d="M30 40 L30 20 L45 35" fill="#fbbf24" stroke="#d97706" strokeWidth="2" /><path d="M70 40 L70 20 L55 35" fill="#fbbf24" stroke="#d97706" strokeWidth="2" /><path d="M32 38 L32 25 L40 35" fill="#fcd34d" /><path d="M68 38 L68 25 L60 35" fill="#fcd34d" /><g style={{ transformOrigin: '50px 48px', animation: 'blink-eyes 4s infinite' }}><circle cx="42" cy="48" r="3" fill="#000" /><circle cx="43" cy="47" r="1" fill="#fff" /><circle cx="58" cy="48" r="3" fill="#000" /><circle cx="59" cy="47" r="1" fill="#fff" /></g><ellipse cx="50" cy="55" rx="3" ry="2" fill="#fca5a5" /><path d="M48 35 L50 40 L52 35" stroke="#d97706" strokeWidth="2" fill="none" /></g></svg>;
