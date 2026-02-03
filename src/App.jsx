import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Video, Image as ImageIcon, Map, Phone, Lock, 
  Edit, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  LogOut, Send, PlusCircle, Compass, MessageSquare, 
  Heart, Share2, XCircle, CheckCircle, UploadCloud, ShieldCheck, Smartphone,
  Star, Loader, DollarSign, FileText, Trash2, CreditCard, Search,
  BarChart2, Users, Activity, PieChart
} from 'lucide-react';

// --- DATABASE 77 PROVINCES (FULL) ---
const THAILAND_DATA = {
  north: { name: 'ภาคเหนือ', color: 'bg-green-100 text-green-800', provinces: [{ name: 'เชียงใหม่', desc: 'ดอยอินทนนท์ ถนนคนเดิน', highlight: 'ดอยอินทนนท์' }, { name: 'เชียงราย', desc: 'วัดร่องขุ่น ดอยตุง สามเหลี่ยมทองคำ', highlight: 'วัดร่องขุ่น' }, { name: 'น่าน', desc: 'เมืองเก่ามีชีวิต กระซิบรักบันลือโลก', highlight: 'ดอยเสมอดาว' }, { name: 'แม่ฮ่องสอน', desc: 'เมืองสามหมอก ปาย ทุ่งดอกบัวตอง', highlight: 'ปางอุ๋ง' }, { name: 'แพร่', desc: 'เมืองไม้สักทอง พระธาตุช่อแฮ', highlight: 'แพะเมืองผี' }, { name: 'พะเยา', desc: 'กว๊านพะเยา งดงามวิถีล้านนา', highlight: 'กว๊านพะเยา' }, { name: 'ลำปาง', desc: 'เมืองรถม้า ถ้วยตราไก่', highlight: 'วัดพระธาตุลำปางหลวง' }, { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย เมืองลำไย', highlight: 'พระธาตุหริภุญชัย' }, { name: 'อุตรดิตถ์', desc: 'เมืองลับแล พระยาพิชัยดาบหัก', highlight: 'ภูสอยดาว' }] },
  northeast: { name: 'ภาคอีสาน', color: 'bg-orange-100 text-orange-800', provinces: [{ name: 'นครราชสีมา', desc: 'ประตูสู่อีสาน เขาใหญ่', highlight: 'อุทยานแห่งชาติเขาใหญ่' }, { name: 'ขอนแก่น', desc: 'เมืองไดโนเสาร์', highlight: 'เขื่อนอุบลรัตน์' }, { name: 'อุดรธานี', desc: 'คำชะโนด ทะเลบัวแดง', highlight: 'คำชะโนด' }, { name: 'อุบลราชธานี', desc: 'สามพันโบก ผาแต้ม', highlight: 'สามพันโบก' }, { name: 'หนองคาย', desc: 'บั้งไฟพญานาค', highlight: 'วัดผาตากเสื้อ' }, { name: 'เลย', desc: 'ภูกระดึง เชียงคาน', highlight: 'เชียงคาน' }, { name: 'บุรีรัมย์', desc: 'ปราสาทหินพนมรุ้ง', highlight: 'พนมรุ้ง' }, { name: 'สุรินทร์', desc: 'ถิ่นช้างใหญ่', highlight: 'หมู่บ้านช้าง' }, { name: 'ศรีสะเกษ', desc: 'ผามออีแดง', highlight: 'ผามออีแดง' }, { name: 'สกลนคร', desc: 'เมืองหนองหาร', highlight: 'วัดพระธาตุเชิงชุม' }] },
  central: { name: 'ภาคกลาง', color: 'bg-yellow-100 text-yellow-800', provinces: [{ name: 'กรุงเทพมหานคร', desc: 'เมืองหลวง วัดพระแก้ว', highlight: 'วัดอรุณฯ' }, { name: 'อยุธยา', desc: 'เมืองเก่ามรดกโลก', highlight: 'วัดมหาธาตุ' }, { name: 'กาญจนบุรี', desc: 'สะพานข้ามแม่น้ำแคว', highlight: 'สังขละบุรี' }, { name: 'ประจวบฯ', desc: 'หัวหิน อ่าวมะนาว', highlight: 'หัวหิน' }, { name: 'เพชรบุรี', desc: 'เขาวัง หาดชะอำ', highlight: 'อุทยานแห่งชาติแก่งกระจาน' }, { name: 'สมุทรสงคราม', desc: 'ตลาดน้ำอัมพวา', highlight: 'ตลาดร่มหุบ' }] },
  east: { name: 'ภาคตะวันออก', color: 'bg-blue-100 text-blue-800', provinces: [{ name: 'ชลบุรี', desc: 'พัทยา บางแสน', highlight: 'เกาะล้าน' }, { name: 'ระยอง', desc: 'เกาะเสม็ด ผลไม้', highlight: 'เกาะเสม็ด' }, { name: 'ตราด', desc: 'เกาะช้าง', highlight: 'เกาะกูด' }, { name: 'จันทบุรี', desc: 'เนินนางพญา', highlight: 'จุดชมวิวเนินนางพญา' }] },
  west: { name: 'ภาคตะวันตก', color: 'bg-amber-100 text-amber-800', provinces: [{ name: 'ตาก', desc: 'ทีลอซู เขื่อนภูมิพล', highlight: 'น้ำตกทีลอซู' }, { name: 'ราชบุรี', desc: 'สวนผึ้ง', highlight: 'ตลาดน้ำดำเนินสะดวก' }] },
  south: { name: 'ภาคใต้', color: 'bg-cyan-100 text-cyan-800', provinces: [{ name: 'ภูเก็ต', desc: 'ไข่มุกอันดามัน', highlight: 'แหลมพรหมเทพ' }, { name: 'สุราษฎร์ธานี', desc: 'สมุย พะงัน', highlight: 'เขื่อนเชี่ยวหลาน' }, { name: 'กระบี่', desc: 'พีพี อ่าวนาง', highlight: 'สระมรกต' }, { name: 'พังงา', desc: 'เสม็ดนางชี', highlight: 'หมู่เกาะสิมิลัน' }, { name: 'สงขลา', desc: 'หาดใหญ่', highlight: 'นางเงือกทอง' }] }
};

// --- STATS DATA (MOCK) ---
const TOURISM_STATS = [
  { province: 'กรุงเทพมหานคร', visitors: '22.5M', score: 98, color: 'bg-blue-500' },
  { province: 'ภูเก็ต', visitors: '14.2M', score: 85, color: 'bg-teal-500' },
  { province: 'ชลบุรี (พัทยา)', visitors: '12.8M', score: 78, color: 'bg-indigo-500' },
  { province: 'เชียงใหม่', visitors: '10.5M', score: 72, color: 'bg-green-500' },
  { province: 'สุราษฎร์ธานี', visitors: '8.9M', score: 65, color: 'bg-orange-500' },
];

// --- INITIAL DATA ---
const INITIAL_USERS = [
  { id: 1, username: 'traveler1', password: '123', role: 'traveler', name: 'นักเดินทาง Alex', status: 'verified', bio: 'ชอบภูเขาและกาแฟ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel', verifyRequest: '' },
  { id: 2, username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี', status: 'pending', bio: 'ประสบการณ์ 10 ปี เชี่ยวชาญทะเลใต้', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Line: @somsri', verifyRequest: 'ดิฉันเป็นไกด์ท้องถิ่นภูเก็ต ใบอนุญาตเลขที่ 123456 อยากเข้าร่วมแพลตฟอร์มค่ะ' },
  { id: 3, username: 'admin', password: '123', role: 'admin', name: 'Admin', status: 'verified', image: '', bio: 'System Admin', contact: '', verifyRequest: '' }
];

const INITIAL_POSTS = [
  { id: 1, title: '🔥 โปรฯ ภูเก็ต 3 วัน 2 คืน (พักศรีพันวา)', location: 'ภูเก็ต', author: 'ไกด์สมศรี', type: 'trip', media: 'https://images.unsplash.com/photo-1589394815804-989b3b785d51?w=600', chat: [], likes: 342, price: 4990 },
  { id: 2, title: 'หาเพื่อนเดินตลาดน้ำอัมพวา เสาร์นี้! 🚣', location: 'สมุทรสงคราม', author: 'นักเดินทาง Alex', type: 'trip', media: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600', chat: [{sender: 'ไกด์สมศรี', text: 'ไปกี่โมงคะ สนใจๆ', time: '10:00'}], likes: 12, price: 0 },
  { id: 3, title: 'Vlog: เชียงใหม่หน้าฝน 🌧️', location: 'เชียงใหม่', author: 'นักเดินทาง Alex', type: 'video', media: 'https://www.youtube.com/embed/dQw4w9WgXcQ', chat: [], likes: 88, price: 0 }
];

const INITIAL_TRANSACTIONS = [
  { id: 101, from: 'นักเดินทาง Alex', to: 'ไกด์สมศรี', amount: 4990, date: '2024-02-15', status: 'pending', slip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200' }
];

// --- COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>{children}</div>;

// --- NEW COMPONENT: TOURISM INSIGHTS ---
const TourismInsights = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left: Intro & Platform Stats */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
            <Compass className="text-blue-600 w-8 h-8"/> เกี่ยวกับ TripbuddyTH
          </h2>
          <p className="text-gray-500 leading-relaxed">
            TripbuddyTH คือคอมมูนิตี้สำหรับคนรักการท่องเที่ยวที่ครบวงจรที่สุด เชื่อมต่อนักเดินทางและไกด์ท้องถิ่นเข้าด้วยกัน 
            เรามุ่งมั่นที่จะส่งเสริมการท่องเที่ยวไทยให้ยั่งยืนและเข้าถึงง่ายสำหรับทุกคน
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-blue-800">12K+</div>
            <div className="text-xs text-blue-600">ผู้ใช้งาน</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <Map className="w-6 h-6 text-green-600 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-green-800">850+</div>
            <div className="text-xs text-green-600">ทริปที่สร้าง</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center">
            <Star className="w-6 h-6 text-orange-600 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-orange-800">4.8</div>
            <div className="text-xs text-orange-600">คะแนนรีวิว</div>
          </div>
        </div>
      </div>

      {/* Right: Top Destinations Scoreboard */}
      <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-600"/> 5 อันดับจังหวัดยอดฮิต (2024-25)
        </h3>
        <div className="space-y-4">
          {TOURISM_STATS.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${index < 3 ? 'bg-yellow-400 shadow-sm' : 'bg-gray-400'}`}>{index + 1}</span>
                  {item.province}
                </span>
                <span className="text-gray-500 text-xs">{item.visitors} คน/ปี</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-right text-gray-400 mt-4">*อ้างอิงจากสถิติการค้นหาและการจองบน TripbuddyTH</p>
      </div>
    </div>
  </div>
);

// --- SIDEBAR ---
const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-14 h-14 rounded-full bg-white/20 p-1">
                <img src={user.image || "https://ui-avatars.com/api/?name=" + user.name} className="w-full h-full rounded-full object-cover bg-white"/>
             </div>
             <div>
               <div className="font-bold text-lg truncate w-40 flex items-center gap-1">
                 {user.name} 
                 {user.status === 'verified' && <CheckCircle className="w-4 h-4 text-blue-200 fill-blue-500" />}
               </div>
               <div className="text-xs text-blue-200 uppercase tracking-wider">{user.role}</div>
             </div>
          </div>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors">
            <div className="bg-blue-100 p-2 rounded-lg"><Edit className="w-5 h-5 text-blue-600" /></div> แก้ไขโปรไฟล์
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors">
             <div className={`p-2 rounded-lg ${user.status === 'verified' ? 'bg-green-100' : user.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
               <ShieldCheck className={`w-5 h-5 ${user.status === 'verified' ? 'text-green-600' : user.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'}`} />
             </div> 
             สถานะบัญชี
             <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${user.status === 'verified' ? 'bg-green-100 text-green-700' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
               {user.status === 'verified' ? 'ยืนยันแล้ว' : user.status === 'pending' ? 'รอตรวจสอบ' : 'ทั่วไป'}
             </span>
          </button>
        </div>
        <div className="p-4 border-t">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 transition-colors">
            <LogOut className="w-5 h-5" /> ออกจากระบบ
          </button>
        </div>
      </div>
    </>
  );
};

// --- CHAT ROOM ---
const ChatRoom = ({ trip, currentUser, onBack, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [trip.chat]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:relative md:h-[600px] md:rounded-xl md:shadow-xl md:border md:overflow-hidden">
      <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">←</button>
           <div className="w-10 h-10 rounded-full overflow-hidden border">
             {trip.type === 'video' ? <div className="bg-red-100 w-full h-full flex items-center justify-center"><Video className="text-red-500"/></div> : <img src={trip.media} className="w-full h-full object-cover" />}
           </div>
           <div><h3 className="font-bold text-gray-800 line-clamp-1 text-sm md:text-base">{trip.title}</h3><p className="text-xs text-green-600 flex items-center gap-1">● ออนไลน์</p></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">
        {trip.chat.map((msg, i) => {
          const isMe = msg.sender === currentUser.name;
          return (
            <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 border border-white">{msg.sender[0]}</div>}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender}</span>}
                  <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>{msg.text}</div>
                  <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 bg-white border-t flex items-center gap-2 pb-safe">
        <input type="text" className="flex-1 bg-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="พิมพ์ข้อความ..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} />
        <button onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} className={`p-3 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}><Send className="w-5 h-5"/></button>
      </div>
    </div>
  );
};

// --- PROFILE & VERIFICATION ---
const ProfileModal = ({ user, onClose, onSave }) => {
  const [tab, setTab] = useState('info');
  const [formData, setFormData] = useState({ ...user });
  const [verifyText, setVerifyText] = useState(user.verifyRequest || '');

  const handleVerifySubmit = () => {
    if(!verifyText.trim()) return alert("กรุณากรอกข้อมูลเพื่อยืนยันตัวตน");
    onSave({ ...formData, verifyRequest: verifyText, status: 'pending' });
    alert("ส่งคำขอแล้ว! กรุณารอ Admin ตรวจสอบ");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
        <button onClick={() => setTab('info')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${tab === 'info' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>ข้อมูลส่วนตัว</button>
        <button onClick={() => setTab('verify')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${tab === 'verify' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>ยืนยันตัวตน</button>
      </div>

      {tab === 'info' ? (
        <div className="space-y-3 animate-in fade-in">
           <div className="flex justify-center mb-4"><div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md"><img src={formData.image || "https://ui-avatars.com/api/?name="+formData.name} className="w-full h-full object-cover"/></div></div>
           <input className="w-full border p-2 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ชื่อที่แสดง" />
           <input className="w-full border p-2 rounded-lg" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="URL รูปโปรไฟล์" />
           <textarea className="w-full border p-2 rounded-lg h-20" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="แนะนำตัว" />
           <input className="w-full border p-2 rounded-lg" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="ช่องทางติดต่อ" />
           <Button onClick={() => onSave(formData)} className="w-full mt-4">บันทึก</Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in text-center">
           {formData.status === 'verified' ? (
             <div className="text-green-600 py-6"><ShieldCheck className="w-16 h-16 mx-auto mb-2"/><h3>ยืนยันตัวตนแล้ว</h3></div>
           ) : formData.status === 'pending' ? (
             <div className="text-yellow-600 py-6"><Loader className="w-16 h-16 mx-auto mb-2 animate-spin"/><h3>รอ Admin ตรวจสอบ</h3><p className="text-xs text-gray-500 mt-2">"{formData.verifyRequest}"</p></div>
           ) : (
             <>
               <div className="bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-800"><p className="font-bold">สิ่งที่ต้องระบุ:</p><ul className="list-disc pl-4 mt-1"><li>ชื่อ-นามสกุล จริง</li><li>เลขใบอนุญาต (ถ้าเป็นไกด์)</li><li>ผลงานที่ผ่านมา / ประสบการณ์</li></ul></div>
               <textarea className="w-full border p-3 rounded-lg h-32 focus:ring-2 focus:ring-green-500" placeholder="พิมพ์ประวัติของคุณที่นี่..." value={verifyText} onChange={e => setVerifyText(e.target.value)} />
               <Button onClick={handleVerifySubmit} variant="success" className="w-full">ส่งตรวจสอบ</Button>
             </>
           )}
        </div>
      )}
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminPanel = ({ users, transactions, onVerifyUser, onDeleteUser, onApprovePayment }) => {
  const [tab, setTab] = useState('users');
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-full whitespace-nowrap ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>จัดการผู้ใช้ ({users.length})</button>
        <button onClick={() => setTab('verify')} className={`px-4 py-2 rounded-full whitespace-nowrap ${tab === 'verify' ? 'bg-yellow-500 text-white' : 'bg-white border text-gray-600'}`}>คำขออนุมัติ ({users.filter(u=>u.status==='pending').length})</button>
        <button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-full whitespace-nowrap ${tab === 'payments' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600'}`}>การเงิน ({transactions.filter(t=>t.status==='pending').length})</button>
      </div>
      {tab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"><img src={u.image || "https://ui-avatars.com/api/?name="+u.name} className="w-full h-full object-cover"/></div>
                <div><div className="font-bold">{u.name}</div><div className="text-xs text-gray-500 uppercase">{u.role} • {u.status}</div></div>
              </div>
              {u.role !== 'admin' && <button onClick={() => onDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>}
            </div>
          ))}
        </div>
      )}
      {tab === 'verify' && (
        <div className="space-y-4">
          {users.filter(u => u.status === 'pending').length === 0 && <div className="text-center text-gray-400 py-10">ไม่มีรายการรออนุมัติ</div>}
          {users.filter(u => u.status === 'pending').map(u => (
            <div key={u.id} className="bg-white p-5 rounded-xl border-l-4 border-yellow-500 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"><img src={u.image || "https://ui-avatars.com/api/?name="+u.name} className="w-full h-full object-cover"/></div>
                <div><div className="font-bold">{u.name}</div><div className="text-xs text-gray-500">ขอเป็น: {u.role.toUpperCase()}</div></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4 italic">"{u.verifyRequest}"</div>
              <div className="flex gap-2">
                <Button onClick={() => onVerifyUser(u.id, 'rejected')} variant="danger" className="flex-1 text-sm">ปฏิเสธ</Button>
                <Button onClick={() => onVerifyUser(u.id, 'verified')} variant="success" className="flex-1 text-sm">อนุมัติ</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'payments' && (
        <div className="space-y-4">
          {transactions.filter(t => t.status === 'pending').length === 0 && <div className="text-center text-gray-400 py-10">ไม่มีรายการโอนเงินใหม่</div>}
          {transactions.filter(t => t.status === 'pending').map(t => (
            <div key={t.id} className="bg-white p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div><div className="font-bold text-gray-800">฿{t.amount.toLocaleString()}</div><div className="text-xs text-gray-500">จาก: {t.from} → ถึง: {t.to}</div></div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">{t.date}</div>
              </div>
              {t.slip && <div className="h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden"><img src={t.slip} className="w-full h-full object-contain"/></div>}
              <Button onClick={() => onApprovePayment(t.id)} variant="success" className="w-full text-sm">ยืนยันยอดเงิน</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- THAILAND DISCOVERY ---
const ThailandDiscovery = () => {
  const [activeRegion, setActiveRegion] = useState('north');
  const [selectedProv, setSelectedProv] = useState(null);
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg"><h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"><Map className="w-8 h-8"/> 77 จังหวัดทั่วไทย</h2></div>
      <div className="flex flex-wrap gap-2 justify-center">{Object.keys(THAILAND_DATA).map(key => (<button key={key} onClick={() => setActiveRegion(key)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeRegion === key ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border'}`}>{THAILAND_DATA[key].name}</button>))}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">{THAILAND_DATA[activeRegion].provinces.map((prov, idx) => (<div key={idx} onClick={() => setSelectedProv(prov)} className={`cursor-pointer rounded-xl p-4 border bg-white hover:shadow-lg transition-all`}><div className="font-bold">{prov.name}</div><div className="text-xs opacity-70"><Star className="w-3 h-3 inline"/> {prov.highlight}</div></div>))}</div>
      {selectedProv && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProv(null)}><div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in zoom-in" onClick={e => e.stopPropagation()}><button onClick={() => setSelectedProv(null)} className="absolute top-4 right-4 text-gray-400"><XCircle/></button><div className="text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">{selectedProv.name[0]}</div><h3 className="text-2xl font-bold mb-2">{selectedProv.name}</h3><div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold mb-4">⭐ {selectedProv.highlight}</div><p className="text-gray-600">{selectedProv.desc}</p><Button className="w-full mt-6" onClick={() => window.open(`https://www.google.com/search?q=ที่เที่ยว${selectedProv.name}`, '_blank')}>ค้นหาข้อมูล</Button></div></div></div>}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [dbUsers, setDbUsers] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [view, setView] = useState('landing'); 
  const [activePost, setActivePost] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [newItem, setNewItem] = useState({});
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', name: '', role: 'traveler' });

  // Persistence
  useEffect(() => {
    const u = localStorage.getItem('tb_users_v5'); if(u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts_v5'); if(p) setPosts(JSON.parse(p));
    const t = localStorage.getItem('tb_trans_v5'); if(t) setTransactions(JSON.parse(t));
  }, []);
  useEffect(() => {
    localStorage.setItem('tb_users_v5', JSON.stringify(dbUsers));
    localStorage.setItem('tb_posts_v5', JSON.stringify(posts));
    localStorage.setItem('tb_trans_v5', JSON.stringify(transactions));
  }, [dbUsers, posts, transactions]);

  // Actions
  const login = (e) => { e.preventDefault(); const u = dbUsers.find(x => x.username === loginForm.username); if(u) { setCurrentUser(u); setView(u.role === 'admin' ? 'admin' : 'dashboard'); } else alert('ไม่พบผู้ใช้'); };
  const register = (e) => { e.preventDefault(); setDbUsers([...dbUsers, { ...regForm, id: Date.now(), status:'active', image:'', contact:'', verifyRequest:'' }]); setView('login'); alert('สมัครสำเร็จ'); };
  const updateProfile = (newData) => { const updated = dbUsers.map(u => u.username === currentUser.username ? newData : u); setDbUsers(updated); setCurrentUser(newData); setModal({open: false}); };
  const sendChat = (text) => { const msg = { sender: currentUser.name, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }; const updated = posts.map(p => p.id === activePost.id ? {...p, chat: [...p.chat, msg]} : p); setPosts(updated); setActivePost({...activePost, chat: [...activePost.chat, msg]}); };
  
  // Admin Actions
  const verifyUser = (id, status) => { setDbUsers(dbUsers.map(u => u.id === id ? { ...u, status } : u)); };
  const deleteUser = (id) => { if(confirm('ลบผู้ใช้นี้?')) setDbUsers(dbUsers.filter(u => u.id !== id)); };
  const approvePayment = (id) => { setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'approved' } : t)); alert("อนุมัติยอดเงินแล้ว"); };
  const createPayment = () => {
    const newTrans = { id: Date.now(), from: currentUser.name, to: modal.data.author, amount: modal.data.price || 500, date: new Date().toLocaleDateString(), status: 'pending', slip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200' };
    setTransactions([...transactions, newTrans]); setModal({open: false}); alert("แจ้งโอนเงินสำเร็จ รอ Admin ตรวจสอบ");
  };

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in duration-200 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={() => setModal({open: false})} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
        {modal.type === 'profile' && <ProfileModal user={currentUser} onClose={() => setModal({open: false})} onSave={updateProfile} />}
        {modal.type === 'payment' && (
          <div className="space-y-4 text-center">
            <div className="bg-blue-50 p-4 rounded-xl mb-2">
              <h3 className="font-bold text-gray-800">{modal.data.title}</h3>
              <div className="text-2xl font-bold text-blue-600 mt-2">฿{(modal.data.price || 500).toLocaleString()}</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-500">
               <UploadCloud className="w-10 h-10 mb-2"/> <span className="text-sm">จำลองการแนบสลิปโอนเงิน</span>
            </div>
            <Button onClick={createPayment} variant="success" className="w-full">แจ้งโอนเงิน</Button>
          </div>
        )}
        {modal.type === 'create_post' && (
          <div className="space-y-4">
             <h3 className="font-bold text-xl">สร้างโพสต์ใหม่</h3>
             <div className="flex gap-2"><button onClick={() => setNewItem({...newItem, type: 'video'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'video' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-gray-50'}`}><Video/> คลิป</button><button onClick={() => setNewItem({...newItem, type: 'trip'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'trip' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}><Map/> หาเพื่อน</button></div>
             <input className="w-full border p-2 rounded-lg" placeholder="หัวข้อโพสต์" onChange={e => setNewItem({...newItem, title: e.target.value})} />
             <input className="w-full border p-2 rounded-lg" placeholder="URL รูป/วิดีโอ" onChange={e => setNewItem({...newItem, media: e.target.value})} />
             <input className="w-full border p-2 rounded-lg" type="number" placeholder="ราคา (ถ้ามี)" onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} />
             <Button onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0 }, ...posts]); setModal({open: false}); setNewItem({}); }} className="w-full">โพสต์เลย</Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4"><Compass className="w-10 h-10 text-blue-600"/></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">TripbuddyTH</h1>
          <p className="text-gray-500 mb-6">Platinum Edition</p>
          {view === 'login' ? (
            <form onSubmit={login} className="space-y-3">
              <input required className="w-full border p-3 rounded-lg bg-gray-50" placeholder="ชื่อผู้ใช้ (admin / traveler1 / guide1)" onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input required type="password" className="w-full border p-3 rounded-lg bg-gray-50" placeholder="รหัสผ่าน (123)" onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <Button type="submit" className="w-full py-3">เข้าสู่ระบบ</Button>
              <div className="text-sm mt-4 text-gray-500">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('register')}>สมัครเลย</span></div>
            </form>
          ) : (
            <form onSubmit={register} className="space-y-3">
              <input required className="w-full border p-3 rounded-lg" placeholder="ชื่อผู้ใช้ใหม่" onChange={e => setRegForm({...regForm, username: e.target.value})} />
              <input required className="w-full border p-3 rounded-lg" placeholder="ชื่อที่แสดง" onChange={e => setRegForm({...regForm, name: e.target.value})} />
              <div className="flex gap-2"><button type="button" onClick={() => setRegForm({...regForm, role: 'traveler'})} className={`flex-1 py-2 rounded-lg border ${regForm.role === 'traveler' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''}`}>นักเดินทาง</button><button type="button" onClick={() => setRegForm({...regForm, role: 'guide'})} className={`flex-1 py-2 rounded-lg border ${regForm.role === 'guide' ? 'bg-green-50 border-green-500 text-green-700' : ''}`}>ไกด์</button></div>
              <Button type="submit" className="w-full py-3">สมัครสมาชิก</Button>
              <div className="text-sm mt-4 text-gray-500">มีบัญชีแล้ว? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('login')}>เข้าสู่ระบบ</span></div>
            </form>
          )}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6 text-gray-700"/></button>
           <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => { setActivePost(null); setView(currentUser.role === 'admin' ? 'admin' : 'dashboard'); }}>
              <Compass className="w-6 h-6"/> <span className="hidden sm:inline">TripbuddyTH</span>
           </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setModal({open: true, type: 'profile'})}>
           <div className="text-right hidden sm:block">
             <div className="font-bold text-sm flex items-center justify-end gap-1">{currentUser.name} {currentUser.status === 'verified' && <CheckCircle className="w-3 h-3 text-blue-500"/>}</div>
             <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
           </div>
           <div className="w-10 h-10 rounded-full border bg-gray-200 overflow-hidden"><img src={currentUser.image || "https://ui-avatars.com/api/?name="+currentUser.name} className="w-full h-full object-cover"/></div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={() => setModal({open: true, type: 'profile'})} onLogout={() => { setCurrentUser(null); setView('landing'); }} />

      <main className="max-w-5xl mx-auto p-4 mt-4">
        {currentUser.role === 'admin' && view === 'admin' ? (
           <AdminPanel users={dbUsers} transactions={transactions} onVerifyUser={verifyUser} onDeleteUser={deleteUser} onApprovePayment={approvePayment} />
        ) : activePost ? <ChatRoom trip={activePost} currentUser={currentUser} onBack={() => setActivePost(null)} onSendMessage={sendChat} /> : (
           view === 'discovery' ? (
             <div>
               <button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 hover:text-blue-600 flex items-center gap-1 font-bold">← กลับหน้าหลัก</button>
               <ThailandDiscovery />
             </div>
           ) : (
             <div className="space-y-6 animate-in fade-in duration-500">
               {/* HERO STATS SECTION (ADDED) */}
               <TourismInsights />

               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 <button onClick={() => setView('discovery')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center"><Map className="w-6 h-6 mb-1"/> <span className="font-bold">77 จังหวัด</span></button>
                 <button onClick={() => setModal({open: true, type: 'create_post'})} className="flex-shrink-0 w-36 h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-all flex flex-col items-center justify-center"><PlusCircle className="w-6 h-6 mb-1"/> <span className="font-bold">สร้างโพสต์</span></button>
               </div>
               
               <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><TrendingUp className="text-blue-500"/> ฟีดล่าสุด</h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {posts.map(post => (
                   <Card key={post.id} className="group hover:shadow-md transition-shadow">
                     <div className="p-3 flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-full h-full object-cover"/></div>
                       <div className="flex-1"><div className="text-sm font-bold text-gray-800">{post.author}</div><div className="text-xs text-gray-500">{post.type === 'video' ? 'Video Clip' : 'Trip Event'}</div></div>
                     </div>
                     {post.type === 'video' ? <div className="aspect-video bg-black"><iframe src={post.media} className="w-full h-full" allowFullScreen></iframe></div> : <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => setActivePost(post)}><img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><h4 className="text-white font-bold text-lg">{post.title}</h4></div></div>}
                     <div className="p-3 border-t flex justify-between items-center text-sm text-gray-500">
                        <div className="flex gap-4">
                           <button className="flex items-center gap-1 hover:text-red-500"><Heart className="w-4 h-4"/> {post.likes}</button>
                           <button className="flex items-center gap-1 hover:text-blue-500" onClick={() => setActivePost(post)}><MessageSquare className="w-4 h-4"/> {post.chat.length}</button>
                        </div>
                        {post.price > 0 && <button onClick={() => setModal({open: true, type: 'payment', data: post})} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-700">จอง ฿{post.price.toLocaleString()}</button>}
                     </div>
                   </Card>
                 ))}
               </div>
             </div>
           )
        )}
      </main>
      {modal.open && renderModal()}
    </div>
  );
}