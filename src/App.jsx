import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Video, Image as ImageIcon, Map, Phone, Lock, 
  Edit, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  LogOut, Send, PlusCircle, Compass, MessageSquare, 
  Heart, Share2, XCircle, CheckCircle, UploadCloud, ShieldCheck, Smartphone
} from 'lucide-react';

// --- DATA: 77 PROVINCES ---
const THAILAND_DATA = {
  north: { name: 'ภาคเหนือ', color: 'bg-green-100 text-green-800', provinces: [{ name: 'เชียงใหม่', desc: 'ดอยอินทนนท์', highlight: 'ดอยอินทนนท์' }, { name: 'เชียงราย', desc: 'วัดร่องขุ่น', highlight: 'วัดร่องขุ่น' }, { name: 'น่าน', desc: 'ดอยเสมอดาว', highlight: 'กระซิบรัก' }, { name: 'แม่ฮ่องสอน', desc: 'ปางอุ๋ง', highlight: 'ทุ่งดอกบัวตอง' }, { name: 'แพร่', desc: 'พระธาตุช่อแฮ', highlight: 'แพะเมืองผี' }, { name: 'พะเยา', desc: 'กว๊านพะเยา', highlight: 'กว๊านพะเยา' }, { name: 'ลำปาง', desc: 'รถม้า', highlight: 'ธาตุลำปางหลวง' }, { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย', highlight: 'พระธาตุหริภุญชัย' }, { name: 'อุตรดิตถ์', desc: 'ลับแล', highlight: 'ภูสอยดาว' }] },
  northeast: { name: 'ภาคอีสาน', color: 'bg-orange-100 text-orange-800', provinces: [{ name: 'นครราชสีมา', desc: 'เขาใหญ่', highlight: 'อุทยานเขาใหญ่' }, { name: 'ขอนแก่น', desc: 'ไดโนเสาร์', highlight: 'เขื่อนอุบลรัตน์' }, { name: 'อุดรธานี', desc: 'คำชะโนด', highlight: 'ทะเลบัวแดง' }, { name: 'อุบลราชธานี', desc: 'สามพันโบก', highlight: 'ผาแต้ม' }, { name: 'เลย', desc: 'เชียงคาน', highlight: 'ภูกระดึง' }, { name: 'บุรีรัมย์', desc: 'พนมรุ้ง', highlight: 'สนามช้าง' }, { name: 'หนองคาย', desc: 'พญานาค', highlight: 'ริมโขง' }, { name: 'สุรินทร์', desc: 'ช้าง', highlight: 'หมู่บ้านช้าง' }, { name: 'ศรีสะเกษ', desc: 'ผามออีแดง', highlight: 'เขาพระวิหาร' }, { name: 'สกลนคร', desc: 'หนองหาร', highlight: 'พระธาตุเชิงชุม' }] }, // (ย่อบางส่วนเพื่อความกระชับ แต่ระบบยังรองรับโครงสร้างเดิม)
  central: { name: 'ภาคกลาง', color: 'bg-yellow-100 text-yellow-800', provinces: [{ name: 'กรุงเทพฯ', desc: 'วัดพระแก้ว', highlight: 'วัดอรุณ' }, { name: 'อยุธยา', desc: 'เมืองเก่า', highlight: 'วัดมหาธาตุ' }, { name: 'กาญจนบุรี', desc: 'สะพานมอญ', highlight: 'น้ำตกเอราวัณ' }, { name: 'ประจวบฯ', desc: 'หัวหิน', highlight: 'อ่าวมะนาว' }, { name: 'เพชรบุรี', desc: 'เขาวัง', highlight: 'หาดชะอำ' }, { name: 'สมุทรสงคราม', desc: 'อัมพวา', highlight: 'ตลาดร่มหุบ' }] },
  south: { name: 'ภาคใต้', color: 'bg-cyan-100 text-cyan-800', provinces: [{ name: 'ภูเก็ต', desc: 'เมืองเก่า', highlight: 'แหลมพรหมเทพ' }, { name: 'สุราษฎร์ธานี', desc: 'สมุย', highlight: 'เขื่อนเชี่ยวหลาน' }, { name: 'กระบี่', desc: 'พีพี', highlight: 'สระมรกต' }, { name: 'พังงา', desc: 'เสม็ดนางชี', highlight: 'หมู่เกาะสิมิลัน' }, { name: 'สงขลา', desc: 'หาดใหญ่', highlight: 'นางเงือกทอง' }] }
};

// --- INITIAL DATA ---
const INITIAL_USERS = [
  { username: 'traveler1', password: '123', role: 'traveler', name: 'นักเดินทาง Alex', status: 'verified', bio: 'ชอบภูเขาและกาแฟ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel' },
  { username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี', status: 'verified', bio: 'ประสบการณ์ 10 ปี', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Line: @somsri' },
  { username: 'admin', password: '123', role: 'admin', name: 'Admin', status: 'verified', image: '', bio: 'System Admin', contact: '' }
];

const INITIAL_POSTS = [
  { id: 1, title: 'Vlog: เชียงใหม่หน้าฝน', location: 'เชียงใหม่', author: 'นักเดินทาง Alex', type: 'video', media: 'https://www.youtube.com/embed/dQw4w9WgXcQ', chat: [], likes: 88 },
  { id: 2, title: 'หาเพื่อนดำน้ำเกาะเต่า', location: 'สุราษฎร์ธานี', author: 'นักเดินทาง Alex', type: 'trip', media: 'https://images.unsplash.com/photo-1533227977699-dbd12d09df22?w=600', chat: [{sender: 'ไกด์สมศรี', text: 'สนใจค่ะ ช่วงไหนคะ?', time: '10:00'}], likes: 45 }
];

// --- COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>{children}</div>;

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
             <div className="bg-green-100 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-green-600" /></div> สถานะบัญชี
             <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${user.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{user.status === 'verified' ? 'ยืนยันแล้ว' : 'ทั่วไป'}</span>
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

// --- CHAT ROOM (REDESIGNED) ---
const ChatRoom = ({ trip, currentUser, onBack, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [trip.chat]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:relative md:h-[600px] md:rounded-xl md:shadow-xl md:border md:overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">←</button>
           <div className="w-10 h-10 rounded-full overflow-hidden border">
             {trip.type === 'video' ? <div className="bg-red-100 w-full h-full flex items-center justify-center"><Video className="text-red-500"/></div> : <img src={trip.media} className="w-full h-full object-cover" />}
           </div>
           <div>
             <h3 className="font-bold text-gray-800 line-clamp-1 text-sm md:text-base">{trip.title}</h3>
             <p className="text-xs text-green-600 flex items-center gap-1">● ออนไลน์</p>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">
        {trip.chat.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <MessageSquare className="w-12 h-12 mx-auto mb-2"/>
            <p>ยังไม่มีข้อความ เริ่มคุยได้เลย!</p>
          </div>
        )}
        {trip.chat.map((msg, i) => {
          const isMe = msg.sender === currentUser.name;
          return (
            <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] md:max-w-[70%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar (Only for others) */}
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden border border-white">
                    {msg.sender[0]}
                  </div>
                )}
                
                {/* Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender}</span>}
                  <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex items-center gap-2 pb-safe">
        <input 
          type="text" 
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" 
          placeholder="พิมพ์ข้อความ..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} 
        />
        <button 
          onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} 
          className={`p-3 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-lg hover:scale-105' : 'bg-gray-200 text-gray-400'}`}
          disabled={!input.trim()}
        >
          <Send className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

// --- NEW PROFILE & VERIFICATION MODAL ---
const ProfileModal = ({ user, onClose, onSave }) => {
  const [tab, setTab] = useState('info'); // info, verify
  const [formData, setFormData] = useState({ ...user });
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, status: 'verified' }));
      setVerifying(false);
      alert("ระบบจำลอง: ยืนยันตัวตนสำเร็จแล้ว!");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
        <button onClick={() => setTab('info')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${tab === 'info' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>ข้อมูลส่วนตัว</button>
        <button onClick={() => setTab('verify')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${tab === 'verify' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>ยืนยันตัวตน (Demo)</button>
      </div>

      {tab === 'info' ? (
        <div className="space-y-3 animate-in fade-in duration-300">
           <div className="flex justify-center mb-4">
             <div className="relative group cursor-pointer">
               <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                 <img src={formData.image || "https://ui-avatars.com/api/?name="+formData.name} className="w-full h-full object-cover"/>
               </div>
               <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs">เปลี่ยนรูป</span>
               </div>
             </div>
           </div>
           
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase">ชื่อที่แสดง</label>
             <input className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           </div>
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase">รูปโปรไฟล์ (URL)</label>
             <input className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
           </div>
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase">แนะนำตัว (Bio)</label>
             <textarea className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
           </div>
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Smartphone className="w-3 h-3"/> ช่องทางติดต่อ (ไม่บังคับ)</label>
             <input className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Line ID, เบอร์โทร, Facebook" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
           </div>
           
           <Button onClick={() => onSave(formData)} className="w-full mt-4">บันทึกการเปลี่ยนแปลง</Button>
        </div>
      ) : (
        <div className="text-center space-y-6 py-4 animate-in fade-in duration-300">
           {formData.status === 'verified' ? (
             <div className="flex flex-col items-center text-green-600">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="w-10 h-10"/>
               </div>
               <h3 className="text-xl font-bold">ยืนยันตัวตนแล้ว</h3>
               <p className="text-sm text-gray-500 mt-2">บัญชีของคุณมีความน่าเชื่อถือสูง</p>
             </div>
           ) : (
             <>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => !verifying && handleVerify()}>
                  {verifying ? <Loader className="w-10 h-10 text-blue-500 animate-spin"/> : <UploadCloud className="w-10 h-10 text-gray-400 mb-2"/>}
                  <p className="text-sm text-gray-500">{verifying ? "กำลังตรวจสอบ..." : "คลิกเพื่อจำลองการอัปโหลดบัตรประชาชน"}</p>
               </div>
               <p className="text-xs text-gray-400">นี่คือระบบจำลอง (Demo) การกดปุ่มด้านบนจะเปลี่ยนสถานะบัญชีของคุณเป็น "Verified" โดยอัตโนมัติ</p>
             </>
           )}
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [dbUsers, setDbUsers] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [view, setView] = useState('landing'); 
  const [activePost, setActivePost] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, type: '' });
  const [newItem, setNewItem] = useState({});
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', name: '', role: 'traveler' });

  // Init Data
  useEffect(() => {
    const u = localStorage.getItem('tb_users_v2'); if(u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts_v2'); if(p) setPosts(JSON.parse(p));
  }, []);
  useEffect(() => {
    localStorage.setItem('tb_users_v2', JSON.stringify(dbUsers));
    localStorage.setItem('tb_posts_v2', JSON.stringify(posts));
  }, [dbUsers, posts]);

  // Actions
  const login = (e) => { e.preventDefault(); const u = dbUsers.find(x => x.username === loginForm.username); if(u) { setCurrentUser(u); setView('dashboard'); } else alert('User not found (Try: traveler1 / 123)'); };
  const register = (e) => { e.preventDefault(); setDbUsers([...dbUsers, {...regForm, status:'active', image:'', contact:''}]); setView('login'); alert('Register Success!'); };
  const updateProfile = (newData) => {
    const updatedUsers = dbUsers.map(u => u.username === currentUser.username ? newData : u);
    setDbUsers(updatedUsers); setCurrentUser(newData); setModal({open: false, type:''});
  };
  const sendChat = (text) => {
    const msg = { sender: currentUser.name, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    const updated = posts.map(p => p.id === activePost.id ? {...p, chat: [...p.chat, msg]} : p);
    setPosts(updated); setActivePost({...activePost, chat: [...activePost.chat, msg]});
  };

  // Renderers
  const renderModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in duration-200 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={() => setModal({open: false})} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
        {modal.type === 'profile' && <ProfileModal user={currentUser} onClose={() => setModal({open: false})} onSave={updateProfile} />}
        {modal.type === 'create_post' && (
          <div className="space-y-4">
             <h3 className="font-bold text-xl">สร้างโพสต์ใหม่</h3>
             <div className="flex gap-2">
                <button onClick={() => setNewItem({...newItem, type: 'video'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'video' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-gray-50'}`}><Video/> คลิปวิดีโอ</button>
                <button onClick={() => setNewItem({...newItem, type: 'trip'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'trip' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}><Map/> หาเพื่อนเที่ยว</button>
             </div>
             <input className="w-full border p-2 rounded-lg" placeholder="หัวข้อโพสต์..." onChange={e => setNewItem({...newItem, title: e.target.value})} />
             <input className="w-full border p-2 rounded-lg" placeholder="URL รูปปก / วิดีโอ..." onChange={e => setNewItem({...newItem, media: e.target.value})} />
             <Button onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0 }, ...posts]); setModal({open: false}); setNewItem({}); }} className="w-full">โพสต์เลย</Button>
          </div>
        )}
      </div>
    </div>
  );

  // Screens
  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4"><Compass className="w-10 h-10 text-blue-600"/></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">TripbuddyTH</h1>
          <p className="text-gray-500 mb-6">Polished Edition</p>
          {view === 'login' ? (
            <form onSubmit={login} className="space-y-3">
              <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition-all" placeholder="ชื่อผู้ใช้" onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input required type="password" className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition-all" placeholder="รหัสผ่าน" onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <Button type="submit" className="w-full py-3">เข้าสู่ระบบ</Button>
              <div className="text-sm mt-4 text-gray-500">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('register')}>สมัครเลย</span></div>
            </form>
          ) : (
            <form onSubmit={register} className="space-y-3">
              <input required className="w-full border p-3 rounded-lg" placeholder="ชื่อผู้ใช้ใหม่" onChange={e => setRegForm({...regForm, username: e.target.value})} />
              <input required className="w-full border p-3 rounded-lg" placeholder="ชื่อที่แสดง (Display Name)" onChange={e => setRegForm({...regForm, name: e.target.value})} />
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
           <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => { setActivePost(null); setView('dashboard'); }}>
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
        {activePost ? <ChatRoom trip={activePost} currentUser={currentUser} onBack={() => setActivePost(null)} onSendMessage={sendChat} /> : (
           view === 'discovery' ? (
             <div className="animate-in slide-in-from-bottom duration-300">
               <button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 hover:text-blue-600 flex items-center gap-1 font-bold">← กลับหน้าหลัก</button>
               <div className="space-y-6">
                 {Object.values(THAILAND_DATA).map((region, idx) => (
                   <div key={idx}>
                     <h3 className="font-bold text-xl mb-3 text-gray-700 border-l-4 border-blue-500 pl-3">{region.name}</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                       {region.provinces.map((p, i) => (
                         <div key={i} className={`p-3 rounded-xl border bg-white hover:shadow-lg transition-all cursor-pointer group`}>
                            <div className="font-bold text-gray-800">{p.name}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 group-hover:text-blue-600"><Star className="w-3 h-3"/> {p.highlight}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ) : (
             <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 <button onClick={() => setView('discovery')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center">
                    <Map className="w-6 h-6 mb-1"/> <span className="font-bold">77 จังหวัด</span>
                 </button>
                 <button onClick={() => setModal({open: true, type: 'create_post'})} className="flex-shrink-0 w-36 h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-all flex flex-col items-center justify-center">
                    <PlusCircle className="w-6 h-6 mb-1"/> <span className="font-bold">สร้างโพสต์</span>
                 </button>
               </div>
               <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><TrendingUp className="text-blue-500"/> ฟีดล่าสุด</h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {posts.map(post => (
                   <Card key={post.id} className="group hover:shadow-md transition-shadow">
                     <div className="p-3 flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-full h-full object-cover"/></div>
                       <div className="flex-1"><div className="text-sm font-bold text-gray-800">{post.author}</div><div className="text-xs text-gray-500">{post.type === 'video' ? 'Video Clip' : 'Trip Event'}</div></div>
                     </div>
                     {post.type === 'video' ? (
                       <div className="aspect-video bg-black"><iframe src={post.media} className="w-full h-full" allowFullScreen></iframe></div>
                     ) : (
                       <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => setActivePost(post)}>
                          <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <h4 className="text-white font-bold text-lg">{post.title}</h4>
                          </div>
                       </div>
                     )}
                     <div className="p-3 border-t flex justify-between items-center text-sm text-gray-500">
                        <div className="flex gap-4">
                           <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart className="w-4 h-4"/> {post.likes}</button>
                           <button className="flex items-center gap-1 hover:text-blue-500 transition-colors" onClick={() => setActivePost(post)}><MessageSquare className="w-4 h-4"/> {post.chat.length} คอมเมนต์</button>
                        </div>
                        <button className="hover:text-gray-800"><Share2 className="w-4 h-4"/></button>
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