import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Grid3X3, RotateCcw, Trash2, Layout, School } from 'lucide-react';

interface Seat {
  name: string;
  isEmpty: boolean;
}

export default function App() {
  const [studentList, setStudentList] = useState('');
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [seating, setSeating] = useState<Seat[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  const names = useMemo(() => 
    studentList.split('\n').map(n => n.trim()).filter(n => n !== ''),
    [studentList]
  );
  const totalSeats = rows * cols;

  const generateLayout = () => {
    if (names.length === 0) {
      setError('학생 이름을 입력해주세요.');
      return;
    }

    if (names.length > totalSeats) {
      setError(`좌석 수가 부족합니다. (학생: ${names.length}명, 좌석: ${totalSeats}석)`);
      return;
    }

    setError('');
    
    // Fisher-Yates Shuffle
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newSeating: Seat[] = [];
    for (let i = 0; i < totalSeats; i++) {
      if (i < shuffled.length) {
        newSeating.push({ name: shuffled[i], isEmpty: false });
      } else {
        newSeating.push({ name: '빈 자리', isEmpty: true });
      }
    }

    setSeating(newSeating);
    setShowResult(true);
  };

  const handleReset = () => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까?')) {
      setStudentList('');
      setRows(5);
      setCols(5);
      setSeating([]);
      setShowResult(false);
      setError('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 space-y-4 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-8 py-4 rounded-2xl shadow-sm border border-teal-100 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-100">
            🏫
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">랜덤 자리배치 생성기</h1>
            <p className="text-xs text-slate-500 font-medium">교실 자리 배치를 공정하고 빠르게 수행하세요</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-sm font-bold text-navy">배치 학생: {names.length}명</span>
            <br />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">좌석 용량: {totalSeats}석</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex space-x-2">
            <button
              onClick={generateLayout}
              className="bg-mint hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(72,201,176,0.3)] transition-all active:scale-95"
            >
              자리배치 만들기
            </button>
            <button
              onClick={generateLayout}
              className="bg-navy hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 섞기
            </button>
            <button
              onClick={handleReset}
              className="border-2 border-slate-200 text-slate-500 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              초기화
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Sidebar Section */}
        <section className="col-span-3 flex flex-col space-y-4 overflow-hidden">
          <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <label className="text-sm font-bold text-slate-700 mb-3 flex items-center shrink-0">
              <span className="w-2 h-2 bg-mint rounded-full mr-2"></span>
              학생 명단 입력
            </label>
            <textarea
              id="studentList"
              value={studentList}
              onChange={(e) => setStudentList(e.target.value)}
              className="flex-1 w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-mint focus:outline-none text-sm leading-relaxed resize-none scrollbar-hide transition-colors"
              placeholder="학생 이름을 한 줄에 한 명씩 입력하세요.&#10;예) 김철수&#10;이영희&#10;박지민..."
            />
            
            <div className="mt-6 grid grid-cols-2 gap-4 shrink-0">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">가로 좌석 수</label>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-navy focus:border-mint outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">세로 좌석 수</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-navy focus:border-mint outline-none transition-colors"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl overflow-hidden"
                >
                  <p className="text-red-500 text-xs font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Main Display Section */}
        <section className="col-span-9 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-mint"></div>
          
          <div className="flex flex-col h-full p-6">
            <div className="w-2/3 mx-auto bg-navy text-white text-center py-3 rounded-b-2xl font-bold tracking-[0.5em] text-sm shadow-xl mb-12 shadow-slate-200 ring-4 ring-slate-100">
              칠 판 (FRONT)
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide px-4">
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div
                    key="seating-grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid gap-3 justify-center content-start"
                    style={{ 
                      gridTemplateColumns: `repeat(${cols}, minmax(100px, 140px))` 
                    }}
                  >
                    {seating.map((seat, index) => (
                      <motion.div
                        key={`${seat.name}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.015 }}
                        className={`
                          aspect-[4/3] rounded-xl flex items-center justify-center p-3 text-sm font-bold transition-all shadow-sm border-2
                          ${seat.isEmpty 
                            ? 'bg-slate-50 border-dashed border-slate-200 text-slate-300' 
                            : 'bg-white border-slate-100 text-navy border-b-4 border-b-mint hover:translate-y-[-2px] hover:shadow-md'}
                        `}
                      >
                        {seat.name}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 select-none pointer-events-none">
                    <div className="text-6xl mb-4">🪑</div>
                    <p className="text-xl font-bold text-slate-400">배치된 자리가 없습니다</p>
                    <p className="text-sm text-slate-300 mt-2 font-medium">상단 버튼을 눌러 자리를 배치해 주세요</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl flex justify-between items-center shrink-0 border border-white/20">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          본 앱은 데이터를 외부로 전송하지 않는 안전한 교사용 도구입니다.
        </p>
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-mint rounded-full mr-2 shadow-sm shadow-teal-100"></span>
            학생 배치됨
          </span>
          <span className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-full mr-2"></span>
            빈 자리
          </span>
        </div>
      </footer>
    </div>
  );
}

