import React, { useState, useEffect } from "react";
import {
  MapPin, Utensils, Car, ShoppingBag, CloudSun, Phone,
  Plane, CreditCard, ChevronRight, Info, Train, Camera, Star, Plus, Trash2, Building2, Volume2, Languages, MessageCircle, Clock, Thermometer, ShieldAlert, X, Save
} from "lucide-react";

const TravelApp = () => {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [currentDay, setCurrentDay] = useState(0);
  const [weather, setWeather] = useState({ max: "--", min: "--", code: 0 });
  const [expenses, setExpenses] = useState([]);
  
  // --- 表單與記帳狀態 ---
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ time: "", title: "", transport: "", stay: "", tip: "", type: "spot" });
  const [krwAmount, setKrwAmount] = useState("");
  const [twdAmount, setTwdAmount] = useState("");
  const [expNote, setExpNote] = useState("");

  // 1. 完全依照 PDF OCR 錄入的行程數據
  const initialSchedule = [
    {
      date: "4月10日", location: "慶州", items: [
        { time: "06:05", title: "金海機場 抵達", stay: "-", transport: "入境與拿行李", tip: "直接前往巴士站", type: "transport", nav: "Gimhae Airport" },
        { time: "07:30", title: "機場 -> 慶州", stay: "-", transport: "市外巴士(60m)", tip: "1樓3號月台搭乘", type: "transport", nav: "Gimhae Airport Bus Stop" },
        { time: "08:40", title: "慶州新羅高級精品飯店", stay: "30m", transport: "計程車(5m)", tip: "寄存行李，換輕便小包出發", type: "stay", nav: "Gyeongju Silla Boutique Hotel" },
        { time: "10:00", title: "普門亭 / 普門湖", stay: "3hr", transport: "計程車(15m)", tip: "慶州純豆腐。**櫻花環湖步道必走**", type: "spot", nav: "Bomun Pavilion" },
        { time: "13:30", title: "巨松排骨 (慶州店)", stay: "1.5hr", transport: "步行", tip: "排骨拌飯。**行程重點美食**", type: "food", nav: "Geosong Galbi Gyeongju" },
        { time: "15:30", title: "皇裡團路 / 半月城", stay: "2.5hr", transport: "步行", tip: "十元餅、咖啡廳。**韓屋建築群超好拍**", type: "spot", nav: "Hwangnidan-gil" },
        { time: "18:30", title: "東宮與月池", stay: "1.5hr", transport: "步行/計程車", tip: "炸雞晚餐。**夜櫻倒影是必拍點**", type: "spot", nav: "Donggung Palace" }
      ]
    },
    {
      date: "4月11日", location: "大邱", items: [
        { time: "09:00", title: "慶州中央市場", stay: "1.5hr", transport: "步行", tip: "市場早餐。體驗在地早市氛圍", type: "food", nav: "Gyeongju Central Market" },
        { time: "11:00", title: "慶州 -> 大邱", stay: "-", transport: "客運/巴士(60m)", tip: "回飯店取行李後前往車站", type: "transport", nav: "Gyeongju Terminal" },
        { time: "12:30", title: "大邱民宿 (半月堂旁)", stay: "30m", transport: "地鐵/步行", tip: "寄存行李後再進食", type: "stay", nav: "Banwoldang Station" },
        { time: "13:30", title: "大邱烤腸一條街", stay: "1.5hr", transport: "地鐵(15m)", tip: "大邱烤腸。**在地靈魂美食**", type: "food", nav: "Anjirang Gopchang Street" },
        { time: "15:00", title: "現代百貨 (The Hyundai)", stay: "2hr", transport: "步行", tip: "必逛 9 樓空中花園與設計師專櫃", type: "shop", nav: "The Hyundai Daegu" },
        { time: "17:00", title: "半月堂 & 東城路", stay: "3hr", transport: "步行", tip: "草莓蛋糕。大邱最熱鬧區，補貨 Olive Young", type: "shop", nav: "Dongseong-ro" },
        { time: "19:30", title: "壽城池 (水舞夜櫻)", stay: "2hr", transport: "地鐵3號線(20m)", tip: "部隊火鍋。**單軌電車風景極佳**", type: "spot", nav: "Suseongmot" }
      ]
    },
    {
      date: "4月12日", location: "大邱", items: [
        { time: "07:40", title: "半月堂18號出口", stay: "-", transport: "一日遊接駁車", tip: "**八公山賞櫻一日遊行程**", type: "transport", nav: "Banwoldang Exit 18" },
        { time: "18:00", title: "大邱大創 (Daiso)", stay: "1.5hr", transport: "步行", tip: "超大分店，買生活小物與零食", type: "shop", nav: "Daiso Daegu" }
      ]
    },
    {
      date: "4月13日", location: "大邱", items: [
        { time: "09:00", title: "西門市場", stay: "2hr", transport: "地鐵3號線(10m)", tip: "薄水餃、麵疙瘩。早餐解決", type: "food", nav: "Seomun Market" },
        { time: "11:30", title: "達城公園 / 桂山教堂", stay: "2.5hr", transport: "步行", tip: "藥令市咖啡。近代胡同歷史漫步", type: "spot", nav: "Gyesan Cathedral" },
        { time: "14:00", title: "中央地下街", stay: "2hr", transport: "步行", tip: "平價美妝與服飾。下午茶時間", type: "shop", nav: "Daegu Underground Mall" },
        { time: "16:30", title: "補漏網之魚購物", stay: "1.5hr", transport: "步行", tip: "再次掃貨 Olive Young 或大創", type: "shop", nav: "Dongseongro" },
        { time: "18:30", title: "大邱烤肉晚餐", stay: "1.5hr", transport: "步行", tip: "韓式烤肉。**最後一晚慶功宴**", type: "food", nav: "Daegu BBQ" }
      ]
    },
    {
      date: "4月14日", location: "釜山", weather: "17°C 晴 ✈️", items: [
        { time: "09:00", title: "民宿 Check-out", stay: "-", transport: "-", tip: "行李寄放在民宿或置物櫃", type: "stay", nav: "Banwoldang Station" },
        { time: "10:00", title: "大邱豬肉湯飯", stay: "1.5hr", transport: "步行", tip: "豬肉湯飯。回台前最後美味", type: "food", nav: "Daegu Pork Soup" },
        { time: "12:00", title: "大邱 -> 釜山機場", stay: "-", transport: "機場巴士(90m)", tip: "建議預留充足通勤時間", type: "transport", nav: "Gimhae Airport" },
        { time: "14:00", title: "機場寄存行李", stay: "15m", transport: "-", tip: "機場寄存櫃，空手做最後快閃", type: "transport", nav: "Gimhae Airport Storage" },
        { time: "15:00", title: "釜山市區 / 樂天百貨", stay: "4hr", transport: "輕軌(20m)", tip: "最後逛街與晚餐", type: "shop", nav: "Lotte Department Store Busan" },
        { time: "19:30", title: "回機場報到", stay: "2.5hr", transport: "-", tip: "22:00 準時起飛", type: "transport", nav: "Gimhae Airport" }
      ]
    }
  ];

  const [scheduleData, setScheduleData] = useState(initialSchedule);

  // 2. 天氣 API 與 語音
  useEffect(() => {
    const fetchWeather = async () => {
      const cityCoords = { 慶州: { lat: 35.85, lon: 129.21 }, 大邱: { lat: 35.87, lon: 128.6 }, 釜山: { lat: 35.17, lon: 129.07 } };
      const coord = cityCoords[scheduleData[currentDay].location] || cityCoords["大邱"];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FSeoul`);
        const data = await res.json();
        setWeather({ max: Math.round(data.daily.temperature_2m_max[0]), min: Math.round(data.daily.temperature_2m_min[0]), code: data.daily.weathercode[0] });
      } catch (e) { console.error(e); }
    };
    fetchWeather();
  }, [currentDay, scheduleData]);

  const speakKorean = (t) => {
    const u = new SpeechSynthesisUtterance(t); u.lang = "ko-KR"; u.rate = 0.85; window.speechSynthesis.speak(u);
  };

  // 3. 匯率同步邏輯 (1:40)
  const handleKrwChange = (v) => { setKrwAmount(v); setTwdAmount(v ? Math.round(v / 40) : ""); };
  const handleTwdChange = (v) => { setTwdAmount(v); setKrwAmount(v ? v * 40 : ""); };

  return (
    <div className="max-w-md mx-auto bg-[#FFF5F8] min-h-screen pb-28 font-sans text-gray-800 relative shadow-2xl overflow-hidden">
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md p-6 sticky top-0 z-20 border-b-4 border-pink-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 pr-4">
            <p className="text-pink-700 text-xs font-black tracking-widest mb-1 uppercase">2026 KOREA SPRING</p>
            <h1 className="text-2xl font-black text-gray-800 font-serif leading-tight">慶州大邱櫻花行</h1>
          </div>
          <div className="bg-pink-100 p-3 rounded-2xl border-2 border-pink-200 flex flex-col items-center min-w-[90px]">
            <CloudSun className="text-orange-500 mb-1" size={24} />
            <p className="text-sm font-black text-pink-800 leading-none">{weather.max}° / {weather.min}°</p>
            <p className="text-[10px] text-pink-600 font-bold mt-1 uppercase">{scheduleData[currentDay].location}</p>
          </div>
        </div>
        
        {/* 日期分頁 */}
        <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide">
          {scheduleData.map((day, idx) => (
            <button key={idx} onClick={() => setCurrentDay(idx)} className={`px-5 py-3 rounded-xl text-xs flex-shrink-0 font-bold transition-all border-2 ${currentDay === idx ? "bg-pink-700 text-white border-pink-700 shadow-md" : "bg-white text-pink-800 border-pink-100"}`}>
              {day.date}
            </button>
          ))}
        </div>
      </header>

      <main className="p-5">
        {/* --- 行程分頁 (完整呈現) --- */}
        {activeTab === "itinerary" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {scheduleData[currentDay].items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 relative flex gap-4 overflow-hidden">
                <div className={`absolute left-0 top-0 w-2 h-full ${item.type === "food" ? "bg-orange-400" : item.type === "transport" ? "bg-blue-400" : "bg-pink-400"}`} />
                <div className="min-w-[65px] text-center border-r-2 border-pink-50 pr-2">
                  <p className="font-mono font-black text-pink-800 text-base leading-none">{item.time}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter italic">{item.stay}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-base leading-tight mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-3 italic">
                    <Car size={14} className="text-blue-300" /> {item.transport}
                  </div>
                  {item.tip && <div className="bg-pink-50/50 p-3 rounded-xl text-sm text-gray-700 border border-pink-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.tip.replace(/\*\*(.*?)\*\*/g, '<b class="text-pink-900 font-black">$1</b>') }} />}
                </div>
                <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${item.nav}`, "_blank")} className="text-pink-300 self-start pt-1 hover:text-pink-700"><MapPin size={26} /></button>
              </div>
            ))}
            <button onClick={() => setIsAddingItem(true)} className="w-full py-5 bg-white rounded-2xl border-2 border-dashed border-pink-300 text-pink-800 font-black flex items-center justify-center gap-2 shadow-sm"><Plus size={24} /> 新增今日行程</button>
          </div>
        )}

        {/* --- 常用韓語 (擴充版) --- */}
        {activeTab === "phrases" && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-gradient-to-r from-pink-700 to-orange-400 text-white p-7 rounded-[32px] shadow-lg flex justify-between items-center">
              <div><h2 className="text-2xl font-black italic tracking-tighter">韓語即時通</h2><p className="text-xs opacity-90 mt-2 font-bold uppercase tracking-widest">Speak like a local</p></div>
              <Volume2 size={44} className="opacity-30" />
            </div>
            {[
              { cat: "基本問候", list: [{tw: "你好", ko: "안녕하세요"}, {tw: "謝謝", ko: "감사합니다"}, {tw: "不好意思/那個..", ko: "저기요"}] },
              { cat: "用餐買單", list: [{tw: "多少錢？", ko: "얼마예요?"}, {tw: "請給我收據", ko: "영수증 주세요"}, {tw: "不要太辣", ko: "덜 맵게 해주세요"}, {tw: "很好吃！", ko: "맛있어요!"}] },
              { cat: "交通問路", list: [{tw: "廁所在哪？", ko: "화장실 어디예요?"}, {tw: "請帶我去地址", ko: "이 주소로 가주세요"}] }
            ].map((c, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-pink-900 font-black text-sm flex items-center px-1 tracking-[0.2em] uppercase border-b-2 border-pink-200 pb-1">{c.cat}</h3>
                {c.list.map((p, pi) => (
                  <div key={pi} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-pink-50 active:scale-95 transition-all">
                    <div>
                      <p className="text-gray-800 font-black text-xl leading-none">{p.ko}</p>
                      <p className="text-sm text-pink-800 font-bold mt-3 tracking-wide italic">中文：{p.tw}</p>
                    </div>
                    <button onClick={() => speakKorean(p.ko)} className="bg-pink-600 text-white p-4 rounded-2xl shadow-lg active:bg-pink-700"><Volume2 size={26} /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* --- 資訊分頁 (航班、緊急、住宿一鍵導航) --- */}
        {activeTab === "tools" && (
          <div className="space-y-6 animate-in fade-in">
            {/* 航班 */}
            <section className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100">
                <h2 className="font-black flex items-center mb-5 text-pink-900 text-xl tracking-tighter underline decoration-pink-300 decoration-4"><Plane className="mr-3 text-pink-600" size={28} /> 易斯達航空資訊</h2>
                <div className="space-y-4">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Plane size={40} className="rotate-90"/></div>
                        <p className="text-xs text-blue-600 font-black mb-1 tracking-widest uppercase underline underline-offset-4 decoration-2">4/10 出發 (ZE988)</p>
                        <p className="font-black text-gray-800 text-base">02:35 TPE T1 → 06:05 PUS</p>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Plane size={40} className="-rotate-90"/></div>
                        <p className="text-xs text-orange-600 font-black mb-1 tracking-widest uppercase underline underline-offset-4 decoration-2">4/14 回程 (ZE983)</p>
                        <p className="font-black text-gray-800 text-base">22:00 PUS → 00:20(+1) TPE</p>
                    </div>
                </div>
            </section>

            {/* 緊急與住宿 */}
            <section className="bg-white rounded-[32px] p-6 border-4 border-pink-100 shadow-md">
                <h2 className="font-black text-pink-900 flex items-center mb-5 text-xl"><ShieldAlert className="mr-3 text-red-500" size={28} /> 緊急救援卡</h2>
                <div className="space-y-3 mb-8">
                    <a href="tel:1330" className="flex justify-between items-center bg-pink-600 text-white p-5 rounded-2xl font-black shadow-lg">1330 旅遊諮詢 (有中文) <Phone size={20}/></a>
                    <div className="grid grid-cols-2 gap-3">
                        <a href="tel:112" className="bg-red-500 p-4 rounded-2xl text-white text-center font-black shadow-md tracking-widest uppercase">112 警察</a>
                        <a href="tel:119" className="bg-red-500 p-4 rounded-2xl text-white text-center font-black shadow-md tracking-widest uppercase">119 急救</a>
                    </div>
                </div>
                
                <h3 className="font-black text-gray-800 flex items-center mt-8 mb-5 border-l-8 border-pink-500 pl-4 text-lg">住宿地址與導航</h3>
                
                <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200">
                        <h4 className="font-black text-gray-800 text-base mb-2">4/10 慶州新羅高級精品飯店</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-4">200 Gangbyeon-ro, Noseo-dong, 慶州市, 韓國</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-54-7453500" className="bg-white border-2 border-pink-200 text-pink-800 p-3 rounded-xl flex justify-center items-center gap-2 font-black text-xs shadow-sm"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Gyeongju Silla Boutique Hotel Premium", "_blank")} className="bg-pink-700 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-black text-xs shadow-md"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200">
                        <h4 className="font-black text-gray-800 text-base mb-2">4/11-14 大邱民宿</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-4">42, Myeongnyun-ro 21-gil, Jung-gu, 大邱, 韓國</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-10-2832-3882" className="bg-white border-2 border-pink-200 text-pink-800 p-3 rounded-xl flex justify-center items-center gap-2 font-black text-xs shadow-sm"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=42, Myeongnyun-ro 21-gil, Jung-gu, Daegu", "_blank")} className="bg-pink-700 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-black text-xs shadow-md"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        {/* --- 記帳分頁 (雙向換算、分類、刪除) --- */}
        {activeTab === "accounting" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-gradient-to-br from-pink-800 to-pink-500 rounded-[32px] p-8 shadow-xl text-white text-center">
              <p className="text-pink-100 text-xs font-black uppercase mb-2 tracking-widest tracking-widest">Spending Dashboard</p>
              <h2 className="text-5xl font-mono font-black tracking-tighter leading-none">₩ {expenses.reduce((acc, curr) => acc + (parseInt(curr.krw) || 0), 0).toLocaleString()}</h2>
              <div className="inline-block mt-5 px-6 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-bold border border-white/30 tracking-tight">約 NT${expenses.reduce((acc, curr) => acc + (parseInt(curr.twd) || 0), 0).toLocaleString()}</div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if(!krwAmount || !expNote) return; setExpenses([{id: Date.now(), krw: krwAmount, twd: twdAmount, note: expNote, date: scheduleData[currentDay].date}, ...expenses]); setKrwAmount(""); setTwdAmount(""); setExpNote(""); }} className="bg-white p-7 rounded-[32px] shadow-lg border-2 border-pink-100 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[11px] font-black text-pink-800 ml-2 italic underline underline-offset-4">KRW ₩</label>
                    <input type="number" value={krwAmount} onChange={(e) => handleKrwChange(e.target.value)} placeholder="₩ 0" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-lg font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
                <div className="space-y-1">
                    <label className="text-[11px] font-black text-pink-800 ml-2 italic underline underline-offset-4">TWD $</label>
                    <input type="number" value={twdAmount} onChange={(e) => handleTwdChange(e.target.value)} placeholder="$ 0" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-lg font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
              </div>
              <input type="text" value={expNote} onChange={(e) => setExpNote(e.target.value)} placeholder="消費內容 (例：烤腸晚餐)" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
              <button type="submit" className="w-full bg-pink-700 text-white py-5 rounded-[24px] font-black text-lg shadow-2xl active:scale-95 transition-transform tracking-widest underline decoration-2">儲存支出記錄</button>
            </form>

            <div className="space-y-3">
              {expenses.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center border-2 border-pink-50">
                  <div className="flex-1 pr-4">
                    <p className="font-black text-gray-800 text-base leading-tight">{item.note}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-black tracking-widest">{item.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                        <p className="font-mono font-black text-pink-800 text-base leading-none">₩{parseInt(item.krw).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-black mt-2">≈ ${parseInt(item.twd).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setExpenses(expenses.filter(x => x.id !== item.id))} className="text-red-200 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- 全螢幕新增行程 Overlay --- */}
      {isAddingItem && (
        <div className="fixed inset-0 z-[100] bg-white p-7 animate-in slide-in-from-bottom duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b-2 border-pink-100 pb-5">
                <h2 className="text-2xl font-black text-pink-800 flex items-center gap-3"><Plus /> 新增自訂行程</h2>
                <button onClick={() => setIsAddingItem(false)} className="bg-gray-100 p-4 rounded-full shadow-inner"><X /></button>
            </div>
            <div className="space-y-6 pb-28">
                <div className="space-y-2">
                    <label className="text-xs font-black text-pink-800 ml-2 italic">時間 (例 15:30)</label>
                    <input type="text" value={newItem.time} onChange={(e) => setNewItem({...newItem, time: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-pink-800 ml-2 italic">行程 / 地點名稱</label>
                    <input type="text" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-pink-800 ml-2 italic">交通方式 (例 步行、計程車)</label>
                    <input type="text" value={newItem.transport} onChange={(e) => setNewItem({...newItem, transport: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-pink-800 ml-2 italic">停留時長 (例 2hr)</label>
                        <input type="text" value={newItem.stay} onChange={(e) => setNewItem({...newItem, stay: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-pink-800 ml-2 italic">類型</label>
                        <select value={newItem.type} onChange={(e) => setNewItem({...newItem, type: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black outline-none shadow-inner">
                            <option value="spot">景點</option>
                            <option value="food">美食</option>
                            <option value="shop">購物</option>
                            <option value="transport">交通</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-pink-800 ml-2 italic">攻略備註</label>
                    <textarea rows="4" value={newItem.tip} onChange={(e) => setNewItem({...newItem, tip: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-base font-black outline-none focus:border-pink-500 shadow-inner" placeholder="必拍角度、必點美食..."></textarea>
                </div>
                <button onClick={() => { if(!newItem.time || !newItem.title) return; const newData=[...scheduleData]; newData[currentDay].items.push(newItem); newData[currentDay].items.sort((a,b)=>a.time.localeCompare(b.time)); setScheduleData(newData); setIsAddingItem(false); setNewItem({time:"",title:"",transport:"",stay:"",tip:"",type:"spot"}); }} className="w-full bg-pink-700 text-white py-5 rounded-[24px] font-black text-xl shadow-2xl active:scale-95 transition-transform flex justify-center items-center gap-3 tracking-widest"><Save size={24} /> 儲存行程資料</button>
            </div>
        </div>
      )}

      {/* 底部導覽欄 */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-xl border-2 border-pink-200 shadow-2xl rounded-[35px] p-2 flex justify-around items-center z-50">
        {[
          { id: "itinerary", icon: MapPin, label: "行程" },
          { id: "phrases", icon: MessageCircle, label: "韓語" },
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