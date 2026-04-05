import React, { useState, useEffect } from "react";
import {
  MapPin, Utensils, Car, ShoppingBag, CloudSun, Phone, Plane, CreditCard, 
  ChevronRight, Info, Train, Camera, Star, Plus, Trash2, Building2, 
  Volume2, MessageCircle, Clock, ShieldAlert, X, Save, Edit2, GripVertical, 
  ShoppingCart, Image as ImageIcon, CheckCircle2, Circle, Languages, ZoomIn
} from "lucide-react";

const TravelApp = () => {
  // --- 基礎持久化讀取 ---
  const getSaved = (k, def) => {
    const s = localStorage.getItem(k);
    return s ? JSON.parse(s) : def;
  };

  const [activeTab, setActiveTab] = useState("itinerary");
  const [currentDay, setCurrentDay] = useState(0);
  const [weather, setWeather] = useState({ max: "--", min: "--", code: 0 });
  const [zoomedImg, setZoomedImg] = useState(null);

  // --- 1. 行程數據 (PDF 100% 完整呈現) ---
  const [schedule, setSchedule] = useState(() => getSaved("mySchedule_v4", [
    { date: "4月10日", location: "慶州", items: [
      { id: "1", time: "06:05", title: "金海機場 抵達", stay: "-", transport: "入境拿行李", tip: "直接前往巴士站", type: "transport", nav: "Gimhae Airport" },
      { id: "2", time: "07:30", title: "機場 -> 慶州", stay: "-", transport: "市外巴士(60m)", tip: "1樓3號月台搭乘", type: "transport", nav: "Gimhae Airport Bus Stop" },
      { id: "3", time: "08:40", title: "慶州新羅高級精品飯店", stay: "30m", transport: "計程車(5m)", tip: "寄存行李換小包", type: "stay", nav: "Gyeongju Silla Boutique Hotel" },
      { id: "4", time: "10:00", title: "普門亭 / 普門湖", stay: "3hr", transport: "計程車(15m)", tip: "慶州純豆腐。**櫻花環湖步道必走**", type: "spot", nav: "Bomun Pavilion" },
      { id: "5", time: "13:30", title: "巨松排骨 (慶州店)", stay: "1.5hr", transport: "步行", tip: "排骨拌飯。**行程重點美食**", type: "food", nav: "Geosong Galbi" },
      { id: "6", time: "15:30", title: "皇裡團路 / 半月城", stay: "2.5hr", transport: "步行", tip: "十元餅、咖啡廳。**韓屋超好拍**", type: "spot", nav: "Hwangnidan-gil" },
      { id: "7", time: "18:30", title: "東宮與月池", stay: "1.5hr", transport: "步行/計程車", tip: "炸雞晚餐。**夜櫻倒影必拍點**", type: "spot", nav: "Donggung Palace" }
    ]},
    { date: "4月11日", location: "大邱", items: [
      { id: "8", time: "09:00", title: "慶州中央市場", stay: "1.5hr", transport: "步行", tip: "市場早餐。體驗在地早市", type: "food", nav: "Gyeongju Market" },
      { id: "9", time: "11:00", title: "慶州 -> 大邱", stay: "-", transport: "客運(60m)", tip: "取行李前往車站", type: "transport", nav: "Gyeongju Terminal" },
      { id: "10", time: "12:30", title: "大邱民宿 (半月堂旁)", stay: "30m", transport: "地鐵/步行", tip: "寄存行李後再進食", type: "stay", nav: "Banwoldang Station" },
      { id: "11", time: "13:30", title: "大邱烤腸一條街", stay: "1.5hr", transport: "地鐵(15m)", tip: "**在地靈魂美食**：烤粉腸", type: "food", nav: "Anjirang Gopchang" },
      { id: "12", time: "15:00", title: "現代百貨 / 東城路", stay: "5hr", transport: "步行", tip: "9樓空中花園。Olive Young補貨", type: "shop", nav: "The Hyundai Daegu" },
      { id: "13", time: "19:30", title: "壽城池 (水舞夜櫻)", stay: "2hr", transport: "地鐵3號線(20m)", tip: "部隊火鍋。**單軌電車風景極佳**", type: "spot", nav: "Suseongmot" }
    ]},
    { date: "4月12日", location: "大邱", items: [
      { id: "14", time: "07:40", title: "半月堂18號出口", stay: "-", transport: "接駁車", tip: "**八公山賞櫻一日遊**", type: "transport", nav: "Banwoldang Exit 18" },
      { id: "15", time: "18:00", title: "大邱大創 (Daiso)", stay: "1.5hr", transport: "步行", tip: "超大分店，買生活小物", type: "shop", nav: "Daiso Daegu" }
    ]},
    { date: "4月13日", location: "大邱", items: [
      { id: "16", time: "09:00", title: "西門市場", stay: "2hr", transport: "地鐵3號線(10m)", tip: "薄水餃、麵疙瘩", type: "food", nav: "Seomun Market" },
      { id: "17", time: "11:30", title: "達城公園 / 桂山教堂", stay: "2.5hr", transport: "步行", tip: "藥令市咖啡。胡同漫步", type: "spot", nav: "Gyesan Cathedral" },
      { id: "18", time: "14:00", title: "中央地下街", stay: "2hr", transport: "步行", tip: "平價美妝與服飾", type: "shop", nav: "Daegu Underground" },
      { id: "19", time: "16:30", title: "補漏網購物", stay: "1.5hr", transport: "步行", tip: "再次掃貨 Olive Young", type: "shop", nav: "Dongseongro" },
      { id: "20", time: "18:30", title: "大邱烤肉晚餐", stay: "1.5hr", transport: "步行", tip: "**最後一晚慶功宴**", type: "food", nav: "Daegu BBQ" }
    ]},
    { date: "4月14日", location: "釜山", items: [
      { id: "21", time: "09:00", title: "民宿 Check-out", stay: "-", transport: "-", tip: "行李寄存置物櫃", type: "stay", nav: "Banwoldang Station" },
      { id: "22", time: "10:00", title: "大邱豬肉湯飯", stay: "1.5hr", transport: "步行", tip: "**回台前最後美味**", type: "food", nav: "Daegu Pork Soup" },
      { id: "23", time: "12:00", title: "大邱 -> 釜山機場", stay: "-", transport: "巴士(90m)", tip: "預留充足通勤時間", type: "transport", nav: "Gimhae Airport Bus" },
      { id: "24", time: "14:00", title: "機場寄存行李", stay: "15m", transport: "-", tip: "機場寄存櫃最後快閃", type: "transport", nav: "Gimhae Airport Storage" },
      { id: "25", time: "15:00", title: "釜山市區 / 樂天百貨", stay: "4hr", transport: "輕軌(20m)", tip: "最後逛街與晚餐", type: "shop", nav: "Lotte Busan" },
      { id: "26", time: "19:30", title: "回機場報到", stay: "2.5hr", transport: "-", tip: "22:00 準時起飛", type: "transport", nav: "Gimhae Airport" }
    ]}
  ]));

  // --- 2. 狀態同步 ---
  const [expenses, setExpenses] = useState(() => getSaved("myExpenses_v4", []));
  const [shoppingList, setShoppingList] = useState(() => getSaved("myShopping_v4", []));
  const [editingItem, setEditingItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [shopFilter, setShopFilter] = useState("all");

  // 表單狀態
  const [sName, setSName] = useState("");
  const [sNote, setSNote] = useState("");
  const [sImage, setSImage] = useState(null);
  const [krw, setKrw] = useState("");
  const [twd, setTwd] = useState("");
  const [expNote, setExpNote] = useState("");
  const [expDate, setExpDate] = useState("4月10日");

  // --- 3. 韓語隨身翻數據 ---
  const phraseCategories = [
    { cat: "🌸 基本禮貌", items: [
      { tw: "你好", ko: "안녕하세요", rom: "An-nyeong-ha-se-yo" },
      { tw: "謝謝", ko: "감사합니다", rom: "Gam-sa-ham-ni-da" },
      { tw: "不好意思 (叫人)", ko: "저기요", rom: "Jeo-gi-yo" },
      { tw: "對不起", ko: "죄송합니다", rom: "Joe-song-ham-ni-da" }
    ]},
    { cat: "🍛 餐廳用餐", items: [
      { tw: "請給我菜單", ko: "메뉴판 주세요", rom: "Me-nyu-pan ju-se-yo" },
      { tw: "多少錢？", ko: "얼마예요?", rom: "Eol-ma-ye-yo?" },
      { tw: "不要太辣", ko: "덜 맵게 해주세요", rom: "Deol maep-ge hae-ju-se-yo" },
      { tw: "請給我收據", ko: "영수증 주세요", rom: "Yeong-su-jeung ju-se-yo" },
      { tw: "好好吃喔！", ko: "맛있어요!", rom: "Ma-si-sseo-yo!" }
    ]},
    { cat: "🛍️ 購物買單", items: [
      { tw: "可以刷卡嗎？", ko: "카드 돼요?", rom: "Ka-deu dwae-yo?" },
      { tw: "可以退稅嗎？", ko: "텍스 리펀 돼요?", rom: "Tek-seu ri-peon dwae-yo?" },
      { tw: "這是有名的嗎？", ko: "이거 유명해요?", rom: "I-geo yu-myeong-hae-yo?" }
    ]},
    { cat: "🚕 交通問路", items: [
      { tw: "廁所在哪裡？", ko: "화장실 어디예요?", rom: "Hwa-jang-sil eo-di-ye-yo?" },
      { tw: "請帶我去這地址", ko: "이 주소로 가주세요", rom: "I ju-so-ro ga-ju-se-yo" },
      { tw: "請幫我保管行李", ko: "짐 좀 맡겨주세요", rom: "Jim jom mat-gyeo-ju-se-yo" }
    ]}
  ];

  // --- 自動存檔 ---
  useEffect(() => { localStorage.setItem("mySchedule_v4", JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem("myExpenses_v4", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("myShopping_v4", JSON.stringify(shoppingList)); }, [shoppingList]);

  // 天氣抓取
  useEffect(() => {
    const fetchW = async () => {
      const cityCoords = { 慶州: { lat: 35.85, lon: 129.21 }, 大邱: { lat: 35.87, lon: 128.6 }, 釜山: { lat: 35.17, lon: 129.07 } };
      const coord = cityCoords[schedule[currentDay].location] || cityCoords["大邱"];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FSeoul`);
        const data = await res.json();
        setWeather({ max: Math.round(data.daily.temperature_2m_max[0]), min: Math.round(data.daily.temperature_2m_min[0]), code: data.daily.weathercode[0] });
      } catch (e) { console.error(e); }
    };
    fetchW();
    setExpDate(schedule[currentDay].date);
  }, [currentDay, schedule]);

  const speak = (t) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = "ko-KR"; u.rate = 0.85; window.speechSynthesis.speak(u);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    const newS = [...schedule];
    const items = newS[currentDay].items;
    const moved = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(idx, 0, moved);
    setDraggedIndex(idx); setSchedule(newS);
  };

  return (
    <div className="max-w-md mx-auto bg-[#FFF5F8] min-h-screen pb-32 font-sans text-gray-800 relative shadow-2xl overflow-x-hidden">
      
      {/* 🌸 HEADER 🌸 */}
      <header className="bg-white/95 backdrop-blur-md p-6 sticky top-0 z-20 border-b-4 border-pink-200">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-serif font-black text-pink-950 leading-tight flex-1 pr-4 tracking-widest italic underline decoration-pink-300">２０２６大邱＆慶州 🌸</h1>
          <div className="bg-pink-100 p-2 px-3 rounded-2xl border-2 border-pink-200 flex flex-col items-center min-w-[85px] shrink-0">
            <CloudSun className="text-orange-500 mb-1" size={20} />
            <p className="text-sm font-black text-pink-900 leading-none">{weather.max}° / {weather.min}°</p>
            <p className="text-[10px] text-pink-500 font-bold mt-1 uppercase tracking-widest">{schedule[currentDay].location}</p>
          </div>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide">
          {schedule.map((day, idx) => (
            <button key={idx} onClick={() => setCurrentDay(idx)} className={`px-5 py-3 rounded-xl text-xs flex-shrink-0 font-black transition-all border-2 ${currentDay === idx ? "bg-pink-700 text-white border-pink-700 shadow-md scale-105" : "bg-white text-pink-800 border-pink-100"}`}>
              {day.date}
            </button>
          ))}
        </div>
      </header>

      <main className="p-5 space-y-6">
        {/* --- 1. 行程 (支援編輯、排序、刪除) --- */}
        {activeTab === "itinerary" && (
          <div className="space-y-4 animate-in fade-in">
            {schedule[currentDay].items.map((item, idx) => (
              <div 
                key={item.id} draggable
                onDragStart={() => setDraggedIndex(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`bg-white rounded-2xl p-5 border-2 border-pink-50 relative flex gap-4 transition-all shadow-sm ${draggedIndex === idx ? "opacity-30 scale-95" : "opacity-100"}`}
              >
                <div className="flex items-center text-pink-200 cursor-grab active:cursor-grabbing"><GripVertical size={24} /></div>
                <div className={`absolute left-0 top-0 w-2 h-full ${item.type === "food" ? "bg-orange-400" : item.type === "transport" ? "bg-blue-400" : "bg-pink-400"}`} />
                <div className="min-w-[65px] text-center border-r-2 border-pink-50 pr-2">
                  <p className="font-mono font-black text-pink-800 text-base leading-none">{item.time}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase italic">{item.stay}</p>
                </div>
                <div className="flex-1 font-black" onClick={() => setEditingItem(item)}>
                  <h3 className="text-gray-900 text-base leading-tight mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-2 font-black italic tracking-widest uppercase tracking-tighter"><Car size={14}/> {item.transport}</p>
                  {item.tip && <div className="bg-pink-50/50 p-2 rounded-xl text-sm text-pink-900 border border-pink-100 font-black shadow-inner leading-relaxed" dangerouslySetInnerHTML={{ __html: item.tip.replace(/\*\*(.*?)\*\*/g, '<b class="text-pink-950">$1</b>') }} />}
                </div>
                <div className="flex flex-col justify-between items-center">
                  <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${item.nav}`, "_blank")} className="text-pink-300 pt-1 hover:text-pink-600 transition-colors"><MapPin size={26} /></button>
                  <button onClick={() => { if(window.confirm("刪除行程？")) { const n=[...schedule]; n[currentDay].items=n[currentDay].items.filter(i=>i.id!==item.id); setSchedule(n); } }} className="text-gray-200 mt-4 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
            <button onClick={() => setEditingItem({ isNew: true, time: "12:00", title: "", transport: "步行", stay: "1hr", tip: "", type: "spot", nav: "" })} className="w-full py-5 bg-white/60 rounded-2xl border-2 border-dashed border-pink-300 text-pink-800 font-black flex items-center justify-center gap-2 italic shadow-sm uppercase"><Plus size={24} /> 新增行程</button>
          </div>
        )}

        {/* --- 2. 購物 (篩選、放大、備註) --- */}
        {activeTab === "shopping" && (
          <div className="space-y-6 animate-in slide-in-from-right font-black">
            <div className="bg-white p-7 rounded-[32px] shadow-lg border-2 border-pink-100 space-y-4">
              <input type="text" value={sName} onChange={e=>setSName(e.target.value)} placeholder="想買什麼？" className="w-full bg-gray-50 border-2 rounded-2xl p-4 font-black focus:border-pink-500 outline-none shadow-inner" />
              <input type="text" value={sNote} onChange={e=>setSNote(e.target.value)} placeholder="備註 (加大顯示)..." className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base font-black outline-none shadow-inner" />
              <div className="flex gap-4 font-black">
                <label className="flex-1 bg-pink-50 text-pink-800 p-4 rounded-2xl border-2 border-pink-200 flex justify-center items-center gap-2 cursor-pointer text-sm shadow-sm">
                   <ImageIcon size={20} /> {sImage ? "照片已就緒" : "上傳照片"}
                   <input type="file" accept="image/*" className="hidden" onChange={e=>{
                      const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setSImage(r.result); r.readAsDataURL(f); }
                   }} />
                </label>
                <button onClick={() => { if(!sName) return; setShoppingList([{name:sName, note:sNote, image:sImage, id:Date.now(), purchased:false}, ...shoppingList]); setSName(""); setSNote(""); setSImage(null); }} className="bg-pink-800 text-white p-4 rounded-2xl shadow-xl hover:bg-pink-900"><Plus size={26}/></button>
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-pink-100 rounded-2xl font-black">
              {["all", "todo", "done"].map(f=>(<button key={f} onClick={()=>setShopFilter(f)} className={`flex-1 py-3 text-xs rounded-xl transition-all ${shopFilter===f ? "bg-white text-pink-900 shadow-sm" : "text-pink-400"}`}>{f==="all"?"全部":f==="todo"?"未買":"已買"}</button>))}
            </div>

            <div className="space-y-3 pb-8">
              {shoppingList.filter(i=> shopFilter==="all"?true:shopFilter==="todo"?!i.purchased:i.purchased).map(item=>(
                <div key={item.id} className={`bg-white p-5 rounded-2xl flex items-center gap-4 border-2 shadow-md ${item.purchased?"opacity-50 grayscale shadow-inner":"border-pink-50"}`}>
                  <button onClick={() => setShoppingList(shoppingList.map(s=>s.id===item.id?{...s, purchased:!s.purchased}:s))} className="text-pink-700">
                    {item.purchased ? <CheckCircle2 size={32}/> : <Circle size={32}/>}
                  </button>
                  {item.image && (
                    <div className="relative shrink-0" onClick={()=>setZoomedImg(item.image)}>
                      <img src={item.image} className="w-16 h-16 object-cover rounded-xl border-2 border-pink-100 cursor-zoom-in shadow-sm" />
                      <div className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100"><ZoomIn className="text-white" size={14}/></div>
                    </div>
                  )}
                  <div className="flex-1 font-black leading-tight">
                    <p className={`text-base ${item.purchased?"line-through text-gray-400":"text-gray-900"}`}>{item.name}</p>
                    {item.note && <p className="text-sm text-pink-800 italic mt-1.5 underline underline-offset-4 decoration-pink-200">{item.note}</p>}
                  </div>
                  <button onClick={()=>setShoppingList(shoppingList.filter(s=>s.id!==item.id))} className="text-red-200 hover:text-red-500"><Trash2 size={22}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. 韓語 (分類大庫) --- */}
        {activeTab === "phrases" && (
          <div className="space-y-6 animate-in slide-in-from-right font-black">
            <div className="bg-gradient-to-r from-pink-800 to-orange-400 text-white p-7 rounded-[32px] shadow-lg flex justify-between items-center">
              <div><h2 className="text-2xl font-black italic tracking-tighter leading-none">韓語百科 💬</h2><p className="text-xs opacity-90 mt-2 font-bold uppercase tracking-widest leading-none">Tap to Hear</p></div>
              <Languages size={44} className="opacity-30" />
            </div>
            {phraseCategories.map((c, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-pink-900 text-sm px-1 border-b-2 border-pink-200 pb-1 uppercase italic tracking-widest">{c.cat}</h3>
                {c.items.map((p, pi) => (
                  <div key={pi} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-md border border-pink-50 active:scale-95 transition-all">
                    <div className="flex-1">
                      <p className="text-xs text-orange-500 font-black mb-1 italic tracking-widest leading-none">{p.rom}</p>
                      <p className="text-gray-900 font-black text-xl leading-tight font-serif mb-2">{p.ko}</p>
                      <p className="text-sm text-pink-800 font-bold uppercase border-t border-pink-50 pt-2">中文：{p.tw}</p>
                    </div>
                    <button onClick={() => speak(p.ko)} className="bg-pink-700 text-white p-4 rounded-2xl shadow-lg scale-110 ml-4"><Volume2 size={28}/></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* --- 4. 記帳 (選日期、換算) --- */}
        {activeTab === "accounting" && (
          <div className="space-y-6 animate-in fade-in font-black">
            <div className="bg-gradient-to-br from-pink-900 to-pink-600 rounded-[32px] p-8 shadow-xl text-white text-center border-b-8 border-pink-950">
               <div className="flex justify-between items-end text-left leading-none font-black tracking-widest">
                  <div>
                    <p className="text-pink-200 text-[10px] uppercase mb-2 tracking-widest underline decoration-pink-400 underline-offset-4 font-black">Daily ({expDate})</p>
                    <h2 className="text-2xl font-mono italic">₩ {expenses.filter(e=>e.date===expDate).reduce((a,c)=>a+parseInt(c.krw||0),0).toLocaleString()}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-200 text-[10px] uppercase mb-2 tracking-tighter italic font-black">Total</p>
                    <h2 className="text-3xl font-mono">₩ {expenses.reduce((a,c)=>a+parseInt(c.krw||0),0).toLocaleString()}</h2>
                  </div>
               </div>
            </div>
            <form onSubmit={e=>{e.preventDefault(); if(!krw || !expNote) return; setExpenses([{id:Date.now(), krw, twd, note:expNote, date:expDate}, ...expenses]); setKrw(""); setTwd(""); setExpNote("");}} className="bg-white p-7 rounded-[32px] shadow-lg border-2 border-pink-100 space-y-4">
              <div className="space-y-1 mb-2 font-black tracking-widest uppercase">
                <label className="text-[10px] text-pink-700 ml-2 font-black uppercase">記帳日期：</label>
                <select value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-pink-50 border-2 border-pink-100 rounded-xl p-3 text-sm font-black outline-none shadow-inner font-black">{schedule.map(d=>(<option key={d.date} value={d.date}>{d.date}</option>))}</select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={krw} onChange={e=>{setKrw(e.target.value); setTwd(e.target.value?Math.round(e.target.value/40):"");}} placeholder="韓元 ₩" className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-lg font-black focus:border-pink-500 outline-none shadow-inner font-black" />
                <input type="number" value={twd} onChange={e=>{setTwd(e.target.value); setKrw(e.target.value?e.target.value*40:"");}} placeholder="台幣 $" className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-lg font-black focus:border-pink-500 outline-none shadow-inner font-black" />
              </div>
              <input type="text" value={expNote} onChange={e=>setExpNote(e.target.value)} placeholder="支出備註..." className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base font-black shadow-inner outline-none font-black" />
              <button type="submit" className="w-full bg-pink-800 text-white py-4 rounded-2xl font-black text-lg shadow-md italic tracking-widest uppercase shadow-pink-200"><Save className="inline mr-2"/> 儲存支出記錄</button>
            </form>
            <div className="space-y-3 pb-8 font-black">
              {expenses.filter(e=>e.date===expDate).map(item=>(
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-md flex justify-between items-center border-2 border-pink-50">
                  <div className="flex-1 pr-4 leading-tight font-black"><p className="text-gray-900 text-base">{item.note}</p><p className="text-[10px] text-gray-400 mt-1 italic">{item.date}</p></div>
                  <div className="text-right flex items-center gap-4 text-pink-900 font-black">
                    <div><p className="text-base font-mono">₩{parseInt(item.krw).toLocaleString()}</p><p className="text-[10px] text-gray-400 mt-1 italic opacity-60">≈ ${parseInt(item.twd).toLocaleString()}</p></div>
                    <button onClick={()=>setExpenses(expenses.filter(x=>x.id!==item.id))} className="text-red-200"><Trash2 size={22} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 5. 資訊 (航班、緊急聯絡、導覽) --- */}
        {activeTab === "tools" && (
          <div className="space-y-6 animate-in fade-in font-black text-sm">
            {/* 航班卡片 */}
            <section className="bg-white rounded-[32px] p-6 border-4 border-pink-100 shadow-md">
                <h2 className="text-pink-950 flex items-center mb-5 text-xl font-serif italic underline decoration-pink-300 decoration-4 tracking-tighter"><Plane className="mr-3 text-pink-700" size={28} /> 易斯達航空航班</h2>
                <div className="space-y-4 font-black">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden shadow-inner font-black italic uppercase">
                        <p className="text-xs text-blue-600 font-black mb-1 tracking-widest underline decoration-2">4/10 去程 (ZE988)</p>
                        <p className="text-gray-900 text-base">02:35 TPE T1 → 06:05 PUS I</p>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 relative overflow-hidden shadow-inner font-black italic uppercase">
                        <p className="text-xs text-orange-600 font-black mb-1 tracking-widest underline decoration-2">4/14 回程 (ZE983)</p>
                        <p className="text-gray-900 text-base font-mono italic">22:00 PUS I → 00:20(+1) TPE</p>
                    </div>
                </div>
            </section>

            {/* 緊急與住宿 */}
            <section className="bg-white rounded-[32px] p-6 border-4 border-pink-100 shadow-md">
                <h2 className="text-pink-950 flex items-center mb-5 text-xl font-serif italic tracking-tighter font-black"><ShieldAlert className="mr-3 text-red-600" size={28} /> 緊急救援與住宿</h2>
                <div className="grid grid-cols-1 gap-4 mb-6 font-black tracking-widest font-black uppercase">
                    <a href="tel:1330" className="flex justify-between items-center bg-pink-700 text-white p-5 rounded-2xl shadow-xl italic leading-none font-black">1330 旅遊諮詢 (繁中) <Phone size={20}/></a>
                    <div className="grid grid-cols-2 gap-4 font-black italic uppercase tracking-widest">
                        <a href="tel:112" className="bg-red-500 p-5 rounded-2xl text-white text-center shadow-lg border-b-4 border-red-800 active:translate-y-1 transition-all">112 報警</a>
                        <a href="tel:119" className="bg-red-500 p-5 rounded-2xl text-white text-center shadow-lg border-b-4 border-red-800 active:translate-y-1 transition-all">119 急救</a>
                    </div>
                </div>
                <h3 className="text-gray-900 border-l-8 border-pink-600 pl-4 mb-5 italic text-lg uppercase tracking-widest font-black leading-none uppercase font-black">住宿地點導航</h3>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200 font-black shadow-inner">
                        <h4 className="text-gray-900 text-base mb-2 italic underline decoration-pink-300">慶州：新羅高級精品飯店</h4>
                        <p className="text-gray-600 text-[11px] font-bold leading-relaxed mb-4 italic tracking-tight uppercase">200 Gangbyeon-ro, Noseo-dong, 慶州</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-54-7453500" className="bg-white border-2 border-pink-200 text-pink-900 p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-sm italic"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Gyeongju Silla Boutique Hotel Premium", "_blank")} className="bg-pink-800 text-white p-3 rounded-xl flex justify-center items-center gap-2 shadow-md italic font-black"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-200 font-black shadow-inner">
                        <h4 className="text-gray-900 text-base mb-2 italic underline decoration-pink-300">大邱：民宿 (近半月堂)</h4>
                        <p className="text-gray-600 text-[11px] font-bold leading-relaxed mb-4 italic tracking-tight uppercase">42, Myeongnyun-ro 21-gil, 大邱</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="tel:+82-10-2832-3882" className="bg-white border-2 border-pink-200 text-pink-900 p-3 rounded-xl flex justify-center items-center gap-2 font-black shadow-sm italic"><Phone size={14}/> 撥打</a>
                            <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=42, Myeongnyun-ro 21-gil, Jung-gu, Daegu", "_blank")} className="bg-pink-800 text-white p-3 rounded-xl flex justify-center items-center gap-2 shadow-md italic font-black"><MapPin size={14}/> 導航</button>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}
      </main>

      {/* --- 行程編輯彈窗 --- */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-white p-7 animate-in slide-in-from-bottom duration-300 overflow-y-auto font-black text-pink-950">
            <div className="flex justify-between items-center mb-8 border-b-4 border-pink-200 pb-5">
                <h2 className="text-2xl font-black italic underline decoration-pink-300 decoration-4 uppercase tracking-widest font-black font-black">編輯行程</h2>
                <button onClick={() => setEditingItem(null)} className="bg-gray-100 p-4 rounded-full shadow-inner"><X /></button>
            </div>
            <div className="space-y-5 pb-20 font-black text-pink-900">
                <div><label className="text-xs mb-1 block italic underline underline-offset-4 decoration-pink-300 font-black uppercase tracking-widest">時間 (HH:MM)</label><input type="text" value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none font-black shadow-inner" /></div>
                <div><label className="text-xs mb-1 block italic underline underline-offset-4 decoration-pink-300 font-black uppercase tracking-widest">行程名稱</label><input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none font-black shadow-inner" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs mb-1 block italic uppercase tracking-widest">停留時間</label><input type="text" value={editingItem.stay} onChange={e => setEditingItem({...editingItem, stay: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none font-black shadow-inner" /></div>
                  <div><label className="text-xs mb-1 block italic uppercase tracking-widest">Map 搜尋</label><input type="text" value={editingItem.nav} onChange={e => setEditingItem({...editingItem, nav: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none font-black shadow-inner" /></div>
                </div>
                <div><label className="text-xs mb-1 block italic uppercase font-black underline underline-offset-4 decoration-pink-300 tracking-widest uppercase font-black">攻略點備忘</label><textarea rows="3" value={editingItem.tip} onChange={e => setEditingItem({...editingItem, tip: e.target.value})} className="w-full bg-gray-50 border-2 rounded-2xl p-4 text-base focus:border-pink-500 outline-none font-black shadow-inner"></textarea></div>
                <button onClick={() => { const n=[...schedule]; const dI=n[currentDay].items; if(editingItem.isNew){ const {isNew,...rest}=editingItem; dI.push({...rest,id:Date.now().toString()}); }else{ const idx=dI.findIndex(i=>i.id===editingItem.id); dI[idx]=editingItem; } dI.sort((a,b)=>a.time.localeCompare(b.time)); setSchedule(n); setEditingItem(null); }} className="w-full bg-pink-800 text-white py-5 rounded-[24px] text-xl shadow-2xl active:scale-95 transition-transform font-black italic tracking-widest uppercase tracking-widest shadow-pink-200"><Save className="inline mr-2"/> 儲存變更資料</button>
            </div>
        </div>
      )}

      {/* --- 照片滿版放大 Modal --- */}
      {zoomedImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-200" onClick={()=>setZoomedImg(null)}>
          <button className="absolute top-10 right-10 text-white bg-white/20 p-4 rounded-full shadow-2xl"><X size={32}/></button>
          <img src={zoomedImg} className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-white/10 shadow-2xl" />
          <p className="text-white/50 text-sm mt-8 font-black uppercase tracking-[0.4em] italic font-black uppercase tracking-widest">Click Anywhere to Close</p>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-white/95 backdrop-blur-xl border-2 border-pink-200 shadow-2xl rounded-[35px] p-2 flex justify-around items-center z-50">
        {[
          { id: "itinerary", icon: MapPin, label: "行程" },
          { id: "shopping", icon: ShoppingCart, label: "購物" },
          { id: "phrases", icon: Languages, label: "韓語" },
          { id: "accounting", icon: CreditCard, label: "記帳" },
          { id: "tools", icon: Info, label: "資訊" }
        ].map((btn) => (
          <button key={btn.id} onClick={() => setActiveTab(btn.id)} className={`flex flex-col items-center py-4 px-3 rounded-[28px] transition-all duration-300 ${activeTab === btn.id ? "bg-pink-900 text-white shadow-lg scale-110" : "text-pink-300 hover:text-pink-600"}`}>
            <btn.icon size={22} />
            <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest leading-none tracking-tighter">{btn.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TravelApp;