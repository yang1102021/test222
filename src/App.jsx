import React, { useState, useEffect } from "react";
import {
  MapPin, Utensils, Car, ShoppingBag, CloudSun, Phone,
  Plane, CreditCard, ChevronRight, Info, Train, Camera, Star, Plus, Trash2, Building2, Volume2, MessageCircle, Clock, ShieldAlert, X, Save, Edit2, GripVertical
} from "lucide-react";

const TravelApp = () => {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [currentDay, setCurrentDay] = useState(0);
  const [weather, setWeather] = useState({ max: "--", min: "--", code: 0 });

  // --- 1. 動態行程數據 (依照 PDF 錄入，支援拖移與編輯) ---
  const initialSchedule = [
    {
      date: "4月10日", location: "慶州", items: [
        { id: "101", time: "06:05", title: "金海機場 抵達", stay: "-", transport: "入境與拿行李", tip: "直接前往巴士站", type: "transport", nav: "Gimhae Airport" },
        { id: "102", time: "07:30", title: "機場 -> 慶州", stay: "-", transport: "市外巴士(60m)", tip: "1樓3號月台搭乘", type: "transport", nav: "Gimhae Airport Bus Stop" },
        { id: "103", time: "08:40", title: "慶州新羅飯店", stay: "30m", transport: "計程車(5m)", tip: "寄存行李，換小包出發", type: "stay", nav: "Gyeongju Silla Boutique Hotel" },
        { id: "104", time: "10:00", title: "普門亭 / 普門湖", stay: "3hr", transport: "計程車(15m)", tip: "慶州純豆腐。**櫻花環湖步道必走**", type: "spot", nav: "Bomun Pavilion" },
        { id: "105", time: "13:30", title: "巨松排骨 (慶州店)", stay: "1.5hr", transport: "步行", tip: "排骨拌飯。**行程重點美食**", type: "food", nav: "Geosong Galbi Gyeongju" },
        { id: "106", time: "15:30", title: "皇裡團路 / 半月城", stay: "2.5hr", transport: "步行", tip: "十元餅。**韓屋建築群超好拍**", type: "spot", nav: "Hwangnidan-gil" },
        { id: "107", time: "18:30", title: "東宮與月池", stay: "1.5hr", transport: "步行/計程車", tip: "炸雞晚餐。**夜櫻倒影是必拍點**", type: "spot", nav: "Donggung Palace" }
      ]
    },
    {
      date: "4月11日", location: "大邱", items: [
        { id: "201", time: "09:00", title: "慶州中央市場", stay: "1.5hr", transport: "步行", tip: "市場早餐。體驗在地早市氛圍", type: "food", nav: "Gyeongju Central Market" },
        { id: "202", time: "11:00", title: "慶州 -> 大邱", stay: "-", transport: "客運(60m)", tip: "回飯店取行李後前往車站", type: "transport", nav: "Gyeongju Terminal" },
        { id: "203", time: "12:30", title: "大邱民宿 (半月堂)", stay: "30m", transport: "地鐵/步行", tip: "寄存行李後再進食", type: "stay", nav: "Banwoldang Station" },
        { id: "204", time: "13:30", title: "大邱烤腸一條街", stay: "1.5hr", transport: "地鐵(15m)", tip: "大邱烤腸。**在地靈魂美食**", type: "food", nav: "Anjirang Gopchang Street" },
        { id: "205", time: "15:00", title: "現代百貨", stay: "2hr", transport: "步行", tip: "必逛9樓空中花園。設計師專櫃", type: "shop", nav: "The Hyundai Daegu" },
        { id: "206", time: "17:00", title: "半月堂 & 東城路", stay: "3hr", transport: "步行", tip: "草莓蛋糕。Olive Young 補貨", type: "shop", nav: "Dongseong-ro" },
        { id: "207", time: "19:30", title: "壽城池 (水舞夜櫻)", stay: "2hr", transport: "地鐵3號線(20m)", tip: "部隊火鍋。**單軌電車風景極佳**", type: "spot", nav: "Suseongmot" }
      ]
    },
    {
      date: "4月12日", location: "大邱", items: [
        { id: "301", time: "07:40", title: "半月堂18號出口", stay: "-", transport: "接駁車", tip: "**八公山賞櫻一日遊行程**", type: "transport", nav: "Banwoldang Exit 18" },
        { id: "302", time: "18:00", title: "大邱大創", stay: "1.5hr", transport: "步行", tip: "超大分店，買生活小物與零食", type: "shop", nav: "Daiso Daegu" }
      ]
    },
    {
      date: "4月13日", location: "大邱", items: [
        { id: "401", time: "09:00", title: "西門市場", stay: "2hr", transport: "地鐵(10m)", tip: "薄水餃、麵疙瘩。早餐解決", type: "food", nav: "Seomun Market" },
        { id: "402", time: "11:30", title: "達城公園 / 桂山教堂", stay: "2.5hr", transport: "步行", tip: "胡同歷史漫步", type: "spot", nav: "Gyesan Cathedral" },
        { id: "403", time: "14:00", title: "中央地下街", stay: "2hr", transport: "步行", tip: "平價美妝與服飾。下午茶", type: "shop", nav: "Daegu Underground Mall" },
        { id: "404", time: "16:30", title: "補漏網購物", stay: "1.5hr", transport: "步行", tip: "掃貨 Olive Young 或大創", type: "shop", nav: "Dongseongro" },
        { id: "405", time: "18:30", title: "大邱烤肉晚餐", stay: "1.5hr", transport: "步行", tip: "**最後一晚慶功宴**", type: "food", nav: "Daegu BBQ" }
      ]
    },
    {
      date: "4月14日", location: "釜山", items: [
        { id: "501", time: "09:00", title: "民宿 Check-out", stay: "-", transport: "-", tip: "行李寄放在民宿或置物櫃", type: "stay", nav: "Banwoldang Station" },
        { id: "502", time: "10:00", title: "大邱豬肉湯飯", stay: "1.5hr", transport: "步行", tip: "回台前最後美味", type: "food", nav: "Daegu Pork Soup" },
        { id: "503", time: "12:00", title: "大邱 -> 釜山機場", stay: "-", transport: "機場巴士(90m)", tip: "預留充足通勤時間", type: "transport", nav: "Gimhae Airport Bus" },
        { id: "506", time: "19:30", title: "回機場報到", stay: "2.5hr", transport: "-", tip: "22:00 準時起飛", type: "transport", nav: "Gimhae Airport" }
      ]
    }
  ];

  const [schedule, setSchedule] = useState(initialSchedule);
  const [editingItem, setEditingItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // --- 2. 專業統計記帳狀態 (支援雙向換算) ---
  const [expenses, setExpenses] = useState([]);
  const [krwIn, setKrwIn] = useState("");
  const [twdIn, setTwdIn] = useState("");
  const [expNote, setExpNote] = useState("");

  // 天氣與語音
  useEffect(() => {
    const fetchWeather = async () => {
      const cityCoords = { 慶州: { lat: 35.85, lon: 129.21 }, 大邱: { lat: 35.87, lon: 128.6 }, 釜山: { lat: 35.17, lon: 129.07 } };
      const coord = cityCoords[schedule[currentDay].location] || cityCoords["大邱"];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FSeoul`);
        const data = await res.json();
        setWeather({ max: Math.round(data.daily.temperature_2m_max[0]), min: Math.round(data.daily.temperature_2m_min[0]), code: data.daily.weathercode[0] });
      } catch (e) { console.error(e); }
    };
    fetchWeather();
  }, [currentDay]);

  const speakKorean = (t) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = "ko-KR"; u.rate = 0.9; window.speechSynthesis.speak(u);
  };

  // 行程編輯/新增/刪除/排序邏輯
  const saveItem = () => {
    const newS = [...schedule];
    const dayI = newS[currentDay].items;
    if (editingItem.isNew) {
      const { isNew, ...rest } = editingItem;
      dayI.push({ ...rest, id: Date.now().toString() });
    } else {
      const idx = dayI.findIndex(i => i.id === editingItem.id);
      dayI[idx] = editingItem;
    }
    dayI.sort((a, b) => a.time.localeCompare(b.time));
    setSchedule(newS); setEditingItem(null);
  };

  const deleteItem = (id) => {
    if (!window.confirm("確定刪除此行程？")) return;
    const newS = [...schedule];
    newS[currentDay].items = newS[currentDay].items.filter(i => i.id !== id);
    setSchedule(newS);
  };

  // 拖移排序
  const onDragStart = (idx) => setDraggedIndex(idx);
  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    const newS = [...schedule];
    const items = newS[currentDay].items;
    const moved = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(idx, 0, moved);
    setDraggedIndex(idx);
    setSchedule(newS);
  };

  // 記帳換算與統計 (匯率 1:40)
  const handleKrwChange = (v) => { setKrwIn(v); setTwdIn(v ? Math.round(v / 40) : ""); };
  const handleTwdChange = (v) => { setTwdIn(v); setKrwIn(v ? v * 40 : ""); };
  const addExp = (e) => {
    e.preventDefault();
    if (!krwIn || !expNote) return;
    setExpenses([{ id: Date.now(), krw: krwIn, twd: twdIn, note: expNote, date: schedule[currentDay].date }, ...expenses]);
    setKrwIn(""); setTwdIn(""); setExpNote("");
  };

  const dailyTotal = expenses.filter(e => e.date === schedule[currentDay].date).reduce((acc, curr) => acc + (parseInt(curr.krw) || 0), 0);
  const grandTotal = expenses.reduce((acc, curr) => acc + (parseInt(curr.krw) || 0), 0);

  return (
    <div className="max-w-md mx-auto bg-[#FFF5F8] min-h-screen pb-32 font-sans text-gray-800 relative shadow-2xl overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-white/95 backdrop-blur-md p-6 sticky top-0 z-20 border-b-4 border-pink-200 font-black">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-black text-gray-800 font-serif leading-tight">櫻花紀行 · 旗艦版 🌸</h1>
          </div>
          <div className="bg-pink-100 p-3 rounded-2xl border-2 border-pink-200 text-center min-w-[95px]">
            <p className="text-sm font-black text-pink-800">{weather.max}° / {weather.min}°</p>
            <p className="text-[10px] text-pink-600 uppercase mt-1 tracking-widest">{schedule[currentDay].location}</p>
          </div>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide">
          {schedule.map((day, idx) => (
            <button key={idx} onClick={() => setCurrentDay(idx)} className={`px-5 py-3 rounded-xl text-xs flex-shrink-0 transition-all border-2 ${currentDay === idx ? "bg-pink-700 text-white border-pink-700 shadow-md scale-105" : "bg-white text-pink-700 border-pink-100"}`}>
              {day.date}
            </button>
          ))}
        </div>
      </header>

      <main className="p-5 space-y-6">
        {/* --- 1. 行程分頁 (支援編輯/拖移) --- */}
        {activeTab === "itinerary" && (
          <div className="space-y-4 animate-in fade-in">
            {schedule[currentDay].items.map((item, idx) => (
              <div 
                key={item.id} 
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`bg-white rounded-2xl p-5 shadow-sm border border-pink-100 relative flex gap-4 transition-all ${draggedIndex === idx ? "opacity-30" : "opacity-100"}`}
              >
                <div className="flex items-center text-gray-300 cursor-grab active:cursor-grabbing"><GripVertical size={20} /></div>
                <div className={`absolute left-0 top-0 w-2 h-full ${item.type === "food" ? "bg-orange-400" : item.type === "transport" ? "bg-blue-400" : "bg-pink-400"}`} />
                <div className="min-w-[65px] text-center border-r-2 border-pink-50 pr-2">
                  <p className="font-mono font-black text-pink-800 text-base">{item.time}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase italic">{item.stay}</p>
                </div>
                <div className="flex-1" onClick={() => setEditingItem(item)}>
                  <h3 className="font-black text-gray-800 text-base leading-tight mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mb-2"><Car size={14}/> {item.transport}</p>
                  {item.tip && <div className="bg-pink-50/50 p-3 rounded-xl text-sm text-gray-700 border border-pink-100 font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: item.tip.replace(/\*\*(.*?)\*\*/g, '<b class="text-pink-900">$1</b>') }} />}
                </div>
                <div className="flex flex-col justify-between items-center">
                  <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${item.nav}`, "_blank")} className="text-pink-300"><MapPin size={26} /></button>
                  <button onClick={() => deleteItem(item.id)} className="text-gray-200 hover:text-red-400 mt-4"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
            <button onClick={() => setEditingItem({ isNew: true, time: "12:00", title: "", transport: "步行", stay: "1hr", tip: "", type: "spot", nav: "" })} className="w-full py-5 bg-white/60 rounded-2xl border-2 border-dashed border-pink-300 text-pink-800 font-black flex items-center justify-center gap-2 italic tracking-widest"><Plus size={24} /> 新增行程項目</button>
          </div>
        )}

        {/* --- 2. 統計記帳分頁 (核心更新) --- */}
        {activeTab === "accounting" && (
          <div className="space-y-6 animate-in fade-in font-black">
            <div className="bg-gradient-to-br from-pink-800 to-pink-500 rounded-[32px] p-8 shadow-xl text-white text-center relative overflow-hidden border-b-8 border-pink-900">
               <div className="flex justify-between items-end">
                  <div className="text-left leading-none">
                    <p className="text-pink-100 text-[10px] uppercase mb-2 tracking-widest">當日累計 ({schedule[currentDay].date})</p>
                    <h2 className="text-2xl font-mono italic font-black">₩ {dailyTotal.toLocaleString()}</h2>
                  </div>
                  <div className="text-right leading-none border-l border-white/20 pl-4">
                    <p className="text-pink-100 text-[10px] uppercase mb-2 tracking-tighter text-orange-200">全旅程累計</p>
                    <h2 className="text-3xl font-mono font-black">₩ {grandTotal.toLocaleString()}</h2>
                  </div>
               </div>
               <p className="mt-6 text-xs opacity-70 font-bold border-t border-white/10 pt-4 underline underline-offset-4 decoration-pink-300 decoration-2">總支出約等於 NT$ {(grandTotal / 40).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
            </div>

            <form onSubmit={addExp} className="bg-white p-7 rounded-[32px] shadow-lg border-2 border-pink-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-pink-800 ml-2 italic">韓元 KRW</label>
                    <input type="number" value={krwIn} onChange={(e) => handleKrwChange(e.target.value)} placeholder="₩ 0" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-lg font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-pink-800 ml-2 italic">台幣 TWD</label>
                    <input type="number" value={twdIn} onChange={(e) => handleTwdChange(e.target.value)} placeholder="$ 0" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-lg font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
              </div>
              <input type="text" value={expNote} onChange={(e) => setExpNote(e.target.value)} placeholder="消費項目內容..." className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
              <button type="submit" className="w-full bg-pink-700 text-white py-4 rounded-2xl font-black text-lg shadow-md tracking-widest italic">儲存今日支出記錄</button>
            </form>

            <div className="space-y-3">
              {expenses.filter(e => e.date === schedule[currentDay].date).map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center border-2 border-pink-50">
                  <div className="flex-1 pr-4">
                    <p className="font-black text-gray-800 text-base">{item.note}</p>
                    <p className="text-[10px] text-gray-400 mt-2 italic font-bold uppercase">{item.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-4 text-pink-800 font-mono font-black">
                    <div>
                        <p className="text-lg leading-none">₩{parseInt(item.krw).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold italic opacity-60">≈ NT${parseInt(item.twd).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setExpenses(expenses.filter(x => x.id !== item.id))} className="text-red-200 hover:text-red-500"><Trash2 size={22} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. 資訊分頁 (航班資訊已補全) --- */}
        {activeTab === "tools" && (
          <div className="space-y-6 animate-in fade-in font-black text-sm">
            <section className="bg-white rounded-[32px] p-6 border-4 border-pink-100 shadow-md">
                <h2 className="text-pink-900 flex items-center mb-5 text-xl tracking-tighter underline decoration-pink-300 decoration-4 italic"><Plane className="mr-3 text-pink-600" size={28} /> 易斯達航空航班資訊</h2>
                <div className="space-y-4 font-black">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Plane size={40} className="rotate-90"/></div>
                        <p className="text-xs text-blue-600 font-black mb-1 uppercase italic tracking-widest">4/10 去程 (ZE988)</p>
                        <p className="text-gray-800 text-base">02:35 桃園 T1 → 06:05 金海 I</p>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Plane size={40} className="-rotate-90"/></div>
                        <p className="text-xs text-orange-600 font-black mb-1 uppercase italic tracking-widest">4/14 回程 (ZE983)</p>
                        <p className="text-gray-800 text-base">22:00 金海 I → 00:20(+1) 桃園</p>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-[32px] p-6 border-4 border-pink-100 shadow-md font-black">
                <h2 className="text-pink-900 flex items-center mb-5 text-xl tracking-tighter"><ShieldAlert className="mr-3 text-red-500" size={28} /> 緊急與住宿卡</h2>
                <div className="space-y-3 mb-8">
                    <a href="tel:1330" className="flex justify-between items-center bg-pink-600 text-white p-5 rounded-2xl font-black shadow-lg">1330 旅遊諮詢 (繁中) <Phone size={20}/></a>
                    <div className="grid grid-cols-2 gap-3 font-black uppercase tracking-widest text-center">
                        <a href="tel:112" className="bg-red-500 p-4 rounded-2xl text-white shadow-md">112 報警</a>
                        <a href="tel:119" className="bg-red-500 p-4 rounded-2xl text-white shadow-md">119 急救</a>
                    </div>
                </div>
                <h3 className="font-black text-gray-800 border-l-8 border-pink-500 pl-4 mb-4 italic text-lg tracking-tighter">住宿地點導航</h3>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200">
                        <h4 className="text-gray-800 text-base mb-2 font-black">4/10 慶州新羅飯店</h4>
                        <p className="text-gray-500 font-bold leading-relaxed mb-4">200 Gangbyeon-ro, Noseo-dong, 慶州</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-54-7453500" className="bg-white border-2 border-pink-200 text-pink-800 p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-sm italic"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Gyeongju Silla Boutique Hotel", "_blank")} className="bg-pink-700 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-md italic"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200">
                        <h4 className="text-gray-800 text-base mb-2 font-black">4/11-14 大邱民宿</h4>
                        <p className="text-gray-500 font-bold leading-relaxed mb-4">42, Myeongnyun-ro 21-gil, Jung-gu, 大邱</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-10-2832-3882" className="bg-white border-2 border-pink-200 text-pink-800 p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-sm italic"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=42, Myeongnyun-ro 21-gil, Jung-gu, Daegu", "_blank")} className="bg-pink-700 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-md italic"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        {/* --- 4. 說韓語分頁 --- */}
        {activeTab === "phrases" && (
          <div className="space-y-6 animate-in slide-in-from-right font-black">
            <div className="bg-gradient-to-r from-pink-700 to-orange-400 text-white p-7 rounded-[32px] shadow-lg flex justify-between items-center">
              <div><h2 className="text-2xl font-black italic tracking-tighter italic">韓語隨身翻</h2><p className="text-xs opacity-90 mt-2 font-bold tracking-widest uppercase">Tap to speak</p></div>
              <Volume2 size={44} className="opacity-30" />
            </div>
            {[
              { cat: "問候與禮節", list: [{tw: "你好", ko: "안녕하세요"}, {tw: "謝謝", ko: "감사합니다"}, {tw: "那個.. 請問", ko: "저기요"}] },
              { cat: "購物用餐", list: [{tw: "多少錢？", ko: "얼마예요?"}, {tw: "不要辣", ko: "안 맵게 해주세요"}, {tw: "收據請給我", ko: "영수증 주세요"}] },
              { cat: "問路救急", list: [{tw: "廁所在哪？", ko: "화장실 어디예요?"}, {tw: "請幫我保管行李", ko: "짐 좀 맡겨주세요"}] }
            ].map((c, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-pink-900 text-sm font-black italic px-1 border-b-2 border-pink-200 pb-1 uppercase tracking-widest">{c.cat}</h3>
                {c.list.map((p, pi) => (
                  <div key={pi} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-pink-50 active:scale-95 transition-all">
                    <div><p className="text-gray-800 font-black text-xl">{p.ko}</p><p className="text-sm text-pink-800 font-bold mt-2 font-black tracking-widest">中文：{p.tw}</p></div>
                    <button onClick={() => speakKorean(p.ko)} className="bg-pink-600 text-white p-4 rounded-2xl shadow-lg active:bg-pink-700"><Volume2 size={26} /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- 全屏編輯表單 (對應動態行程管理) --- */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-white p-7 animate-in slide-in-from-bottom duration-300 overflow-y-auto font-black text-pink-900">
            <div className="flex justify-between items-center mb-8 border-b-4 border-pink-100 pb-5">
                <h2 className="text-2xl flex items-center gap-3 italic"><Edit2 /> {editingItem.isNew ? "新增" : "編輯"}行程內容</h2>
                <button onClick={() => setEditingItem(null)} className="bg-gray-100 p-4 rounded-full shadow-inner"><X /></button>
            </div>
            <div className="space-y-5 pb-20">
                <div><label className="text-xs mb-1 block italic underline underline-offset-4 decoration-pink-300 decoration-4">時間 (HH:MM)</label><input type="text" value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black" /></div>
                <div><label className="text-xs mb-1 block italic underline underline-offset-4 decoration-pink-300 decoration-4">標題名稱</label><input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black" /></div>
                <div><label className="text-xs mb-1 block italic">交通工具</label><input type="text" value={editingItem.transport} onChange={e => setEditingItem({...editingItem, transport: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs mb-1 block italic">停留多久</label><input type="text" value={editingItem.stay} onChange={e => setEditingItem({...editingItem, stay: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black" /></div>
                  <div><label className="text-xs mb-1 block italic">Map 搜尋關鍵字</label><input type="text" value={editingItem.nav} onChange={e => setEditingItem({...editingItem, nav: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black" /></div>
                </div>
                <div><label className="text-xs mb-1 block italic">類型</label><select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-sm focus:border-pink-500 outline-none font-black shadow-inner"><option value="spot">景點</option><option value="food">美食</option><option value="shop">購物</option><option value="transport">交通</option></select></div>
                <div><label className="text-xs mb-1 block italic">攻略點提示</label><textarea rows="3" value={editingItem.tip} onChange={e => setEditingItem({...editingItem, tip: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none shadow-inner font-black"></textarea></div>
                <button onClick={saveItem} className="w-full bg-pink-700 text-white py-5 rounded-[24px] text-xl shadow-2xl active:scale-95 transition-transform flex justify-center items-center gap-3 font-black italic tracking-widest"><Save /> 儲存變更行程</button>
            </div>
        </div>
      )}

      {/* --- TAB NAVIGATION --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-xl border-2 border-pink-200 shadow-2xl rounded-[35px] p-2 flex justify-around items-center z-50">
        {[
          { id: "itinerary", icon: MapPin, label: "行程" },
          { id: "phrases", icon: MessageCircle, label: "語音" },
          { id: "tools", icon: Info, label: "資訊" },
          { id: "accounting", icon: CreditCard, label: "記帳" }
        ].map((btn) => (
          <button key={btn.id} onClick={() => setActiveTab(btn.id)} className={`flex flex-col items-center py-4 px-5 rounded-[28px] transition-all duration-300 ${activeTab === btn.id ? "bg-pink-700 text-white shadow-lg scale-105" : "text-pink-300 hover:text-pink-600"}`}>
            <btn.icon size={22} />
            <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest leading-none">{btn.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TravelApp;