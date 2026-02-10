// version 1.1 - Update check
// version 1.0.2 - 업데이트 확인용
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { HashRouter as Router } from 'react-router-dom';
import { X } from 'lucide-react';

function AppContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('calendarData');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarData', JSON.stringify(entries));
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const POINT_COLOR = '#7851C2';
  // 폰트 설정을 변수로 만들었습니다.
  const FONT_FAMILY = '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';

  const handleFile = (file, dateKey) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEntries(prev => ({ ...prev, [dateKey]: { ...prev[dateKey], photo: e.target.result } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteEntry = (dateKey) => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      const newEntries = { ...entries };
      delete newEntries[dateKey];
      setEntries(newEntries);
      setSelectedDate(null);
    }
  };

  const downloadImage = async () => {
    if (calendarRef.current) {
      const canvas = await html2canvas(calendarRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = `Sunny_Calendar_${year}_${month + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const styles = {
    container: { maxWidth: '393px', margin: '0 auto', fontFamily: FONT_FAMILY, backgroundColor: '#fff', minHeight: '100vh', color: '#333' },
    header: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    todayInfo: { fontSize: '13px', color: POINT_COLOR, fontWeight: '600', marginBottom: '5px', letterSpacing: '-0.5px' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    select: { padding: '8px', border: 'none', backgroundColor: '#F3F0F9', borderRadius: '8px', fontSize: '14px', color: POINT_COLOR, fontWeight: 'bold', fontFamily: FONT_FAMILY },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#eee' },
    cell: { aspectRatio: '393/650', backgroundColor: 'white', position: 'relative', cursor: 'pointer', overflow: 'hidden' },
    emptyCell: { gridColumn: `span ${firstDayOfMonth}`, backgroundColor: '#F8F9FA' },
    endEmptyCell: { gridColumn: `span ${ (7 - (firstDayOfMonth + daysInMonth) % 7) % 7 }`, backgroundColor: '#F8F9FA' },
    dayNum: { position: 'absolute', top: '8px', left: '8px', fontSize: '12px', fontWeight: '700', zIndex: 2, fontFamily: FONT_FAMILY },
    modal: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(10px)' },
    modalContent: { backgroundColor: 'white', padding: '24px', borderRadius: '32px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', position: 'relative' },
    closeBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', backgroundColor: '#f0f0f0', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    previewArea: { width: '100%', aspectRatio: '1/1', borderRadius: '20px', backgroundColor: '#f5f5f5', marginBottom: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${POINT_COLOR}44` },
    textarea: { width: '100%', height: '100px', border: '1px solid #eee', borderRadius: '15px', padding: '12px', fontSize: '15px', marginBottom: '15px', outline: 'none', resize: 'none', backgroundColor: '#fcfcfc', color: '#000', WebkitAppearance: 'none', boxSizing: 'border-box', fontFamily: FONT_FAMILY },
    btnGroup: { display: 'flex', gap: '8px' },
    primaryBtn: { flex: 2, padding: '15px', backgroundColor: POINT_COLOR, color: '#fff', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '15px', fontFamily: FONT_FAMILY, cursor: 'pointer' },
    deleteBtn: { flex: 1, padding: '15px', backgroundColor: '#fff', color: '#FF4B4B', borderRadius: '15px', border: '1px solid #FF4B4B', fontWeight: 'bold', fontSize: '15px', fontFamily: FONT_FAMILY, cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.todayInfo}>
          {now.toLocaleDateString('ko-KR')} {now.toLocaleTimeString('ko-KR', { hour12: false })} (KST)
        </div>
        <div style={styles.nav}>
          <div style={{display: 'flex', gap: '8px'}}>
            <select value={year} onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month))} style={styles.select}>
              {[2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select value={month} onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value)))} style={styles.select}>
              {Array.from({length: 12}, (_, i) => <option key={i} value={i}>{i+1}월</option>)}
            </select>
          </div>
          <button onClick={downloadImage} style={{backgroundColor: POINT_COLOR, color: '#fff', padding: '10px 18px', borderRadius: '24px', fontSize: '12px', border: 'none', fontWeight: 'bold', fontFamily: FONT_FAMILY, cursor: 'pointer'}}>SAVE</button>
        </div>
      </header>

      <div ref={calendarRef} style={{backgroundColor: 'white'}}>
        <div style={styles.grid}>
          {weekDays.map((wd, i) => (
            <div key={wd} style={{textAlign: 'center', fontSize: '11px', padding: '10px 0', color: i===0?'#ff6b6b':i===6?'#4dabf7':'#adb5bd', fontWeight: '800', backgroundColor: 'white', fontFamily: FONT_FAMILY}}>{wd}</div>
          ))}
          {firstDayOfMonth > 0 && <div style={styles.emptyCell} />}
          {days.map(day => {
            const dateKey = `${year}-${month + 1}-${day}`;
            const hasPhoto = entries[dateKey]?.photo;
            return (
              <div key={day} style={styles.cell} onClick={() => setSelectedDate(day)}>
                <span style={{...styles.dayNum, color: hasPhoto ? 'white' : '#333', textShadow: hasPhoto ? '0 1px 4px rgba(0,0,0,0.5)' : 'none'}}>{day}</span>
                {hasPhoto && <img src={entries[dateKey].photo} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="" />}
              </div>
            );
          })}
          {((firstDayOfMonth + daysInMonth) % 7) !== 0 && <div style={styles.endEmptyCell} />}
        </div>
      </div>

      {selectedDate && (() => {
        const dateKey = `${year}-${month + 1}-${selectedDate}`;
        const entry = entries[dateKey] || {};
        return (
          <div style={styles.modal} onClick={() => setSelectedDate(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setSelectedDate(null)}>
                <X size={18} color="#666" />
              </button>
              <h2 style={{fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: POINT_COLOR, fontFamily: FONT_FAMILY}}>{month + 1}월 {selectedDate}일</h2>
              
              <div style={styles.previewArea} onClick={() => document.getElementById('fileInput').click()}>
                {entry.photo ? (
                  <img src={entry.photo} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="preview" />
                ) : (
                  <span style={{fontSize: '14px', color: '#aaa', fontFamily: FONT_FAMILY}}>사진 추가하기</span>
                )}
              </div>
              <input id="fileInput" type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0], dateKey)} style={{display: 'none'}} />

              <textarea 
                style={styles.textarea}
                placeholder="오늘의 메모를 남겨주세요."
                value={entry.memo || ''}
                onChange={(e) => setEntries(prev => ({...prev, [dateKey]: { ...prev[dateKey], memo: e.target.value }}))}
              />

              <div style={styles.btnGroup}>
                <button onClick={() => deleteEntry(dateKey)} style={styles.deleteBtn}>삭제</button>
                <button onClick={() => setSelectedDate(null)} style={styles.primaryBtn}>완료</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;