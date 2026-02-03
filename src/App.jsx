import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Calendar, DollarSign, Send, 
  PlusCircle, Shield, Backpack, Compass, MessageSquare,
  LogOut, Star, CheckCircle, XCircle, CreditCard, Loader,
  Video, Image as ImageIcon, Map, Phone, Lock, FileText, Users,
  Edit, Camera, UserCircle, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  History, Settings, ChevronRight
} from 'lucide-react';

// --- MOCK DATABASE ---
const INITIAL_USERS = [
  { username: 'admin', password: '123', role: 'admin', name: 'Admin Somchai', status: 'active', image: '', bio: 'ผู้ดูแลระบบ', contact: 'admin@tripbuddy.th' },
  { username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี (ยืนยันแล้ว)', status: 'active', bio: 'เชี่ยวชาญภาคเหนือ ประสบการณ์ 10 ปี', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', contact: 'Line: guide_somsri' },
  { username: 'guide2', password: '123', role: 'guide', name: 'ไกด์มือใหม่ (รออนุมัติ)', status: 'pending', bio: 'เพิ่งจบใหม่ครับ อยากหาประสบการณ์', image: '', contact: '089-999-9999' },
  { username: 'traveler1', password: '123', role: 'traveler', name: 'นักเดินทาง Alex', status: 'active', bio: 'ชอบเที่ยวภูเขาและถ่ายรูปครับ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', contact: 'IG: alex_travel' }
];

const INITIAL_TRIPS = [
  { 
    id: 1, title: 'แบกเป้เที่ยวเชียงใหม่', location: 'เชียงใหม่', date: '2024-11-20', budget: '5000', 
    author: 'นักเดินทาง Alex', type: 'trip', image: 'https://images.unsplash.com/photo-1598226068694-526487e937d5?auto=format&fit=crop&q=80&w=600', 
    participants: ['นักเดินทาง Alex'],
    chat: [
      { sender: 'นักเดินทาง Alex', text: 'ใครสนใจไปด้วยกันทักมาได้เลยครับ!', type: 'text', time: '10:00' }
    ]
  }
];

const INITIAL_PACKAGES = [
  { 
    id: 101, title: 'วางแผนเที่ยวภูเก็ต (Online Support)', location: 'ภูเก็ต', price: '1500', duration: '3 วัน 2 คืน', 
    guide: 'ไกด์สมศรี (ยืนยันแล้ว)', status: 'approved', type: 'virtual',
    image: 'https://images.unsplash.com/photo-1589394815804-989b3b785d51?auto=format&fit=crop&q=80&w=600',
    description: 'ผมจะวางแผนให้ จองที่พักราคาถูก ดำน้ำดูปะการัง และคอลวิดีโอแนะนำตลอดทริปครับ'
  }
];

// ข้อมูลสถานที่แนะนำ (Mock Data)
const SEASONAL_HITS = [
  { id: 1, name: 'ดอยอินทนนท์', province: 'เชียงใหม่', season: 'winter', month: 'พ.ย. - ก.พ.', popularity: 98, image: 'https://images.unsplash.com/photo-1586944365922-04961d2d380e?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'เกาะล้าน', province: 'ชลบุรี', season: 'summer', month: 'มี.ค. - พ.ค.', popularity: 92, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'ภูทับเบิก', province: 'เพชรบูรณ์', season: 'rainy', month: 'ก.ค. - ต.ค.', popularity: 85, image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300' },
];

const ROLES = {
  TRAVELER: 'traveler',
  GUIDE: 'guide',
  ADMIN: 'admin'
};

// --- UI COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = "button" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>{children}</div>;

const Badge = ({ status, text }) => {
  const styles = { approved: "bg-green-100 text-green-700", active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", rejected: "bg-red-100 text-red-700", virtual: "bg-purple-100 text-purple-700", onsite: "bg-blue-100 text-blue-700" };
  return <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${styles[status] || 'bg-gray-100'}`}>{text || status}</span>;
};

// --- SIDEBAR COMPONENT (NEW FEATURE) ---
const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout, setView }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-64 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="p-6 bg-blue-600 text-white">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden border-2 border-white/50">
                {user.image ? <img src={user.image} className="w-full h-full object-cover"/> : <User className="w-6 h-6 m-3 text-white"/>}
             </div>
             <div>
               <div className="font-bold truncate w-32">{user.name}</div>
               <div className="text-xs text-blue-100 uppercase">{user.role}</div>
             </div>
          </div>
        </div>
        
        <div className="p-4 space-y-1">
          <div className="text-xs font-bold text-gray-400 mb-2 px-3">การจัดการ</div>
          <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
            <Edit className="w-5 h-5 text-blue-500" /> แก้ไขโปรไฟล์
          </button>
          
          {user.role === 'guide' && (
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
               <DollarSign className="w-5 h-5 text-green-500" /> รายได้ของฉัน
            </button>
          )}
          
          {user.role === 'traveler' && (
             <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
               <History className="w-5 h-5 text-purple-500" /> ประวัติการจอง
            </button>
          )}

          <div className="my-2 border-t border-gray-100"></div>
          
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
            <LogOut className="w-5 h-5" /> ออกจากระบบ
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">Version 1.0.0 (Final)</div>
      </div>
    </>
  );
};

// --- SUB-COMPONENTS ---
const AuthScreen = ({ view, setView, loginForm, setLoginForm, regForm, setRegForm, handleLogin, handleRegister }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3"><Compass className="w-8 h-8 text-blue-600"/></div>
        <h1 className="text-2xl font-bold text-gray-800">TripbuddyTH</h1>
        <p className="text-gray-500">แพลตฟอร์มท่องเที่ยวครบวงจร</p>
      </div>
      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="text" placeholder="ชื่อผู้ใช้" className="w-full border p-2 rounded-lg" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
          <input required type="password" placeholder="รหัสผ่าน" className="w-full border p-2 rounded-lg" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
          <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
          <div className="text-center text-sm text-gray-500 mt-2">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer" onClick={() => setView('register')}>สมัครสมาชิก</span></div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-2 mb-2 p-1 bg-gray-100 rounded-lg">
            <button type="button" onClick={() => setRegForm({...regForm, role: 'traveler'})} className={`flex-1 py-1 rounded-md text-sm ${regForm.role === 'traveler' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>นักเดินทาง</button>
            <button type="button" onClick={() => setRegForm({...regForm, role: 'guide'})} className={`flex-1 py-1 rounded-md text-sm ${regForm.role === 'guide' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>ไกด์</button>
          </div>
          <input required type="text" placeholder="ชื่อผู้ใช้" className="w-full border p-2 rounded-lg" value={regForm.username} onChange={e => setRegForm({...regForm, username: e.target.value})} />
          <input required type="password" placeholder="รหัสผ่าน" className="w-full border p-2 rounded-lg" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
          <input required type="text" placeholder="ชื่อที่ใช้แสดง" className="w-full border p-2 rounded-lg" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
          <Button type="submit" className="w-full" variant={regForm.role === 'guide' ? 'success' : 'primary'}>{regForm.role === 'guide' ? 'สมัครเป็นไกด์' : 'สมัครสมาชิก'}</Button>
          <div className="text-center text-sm text-gray-500 mt-2">มีบัญชีแล้ว? <span className="text-blue-600 cursor-pointer" onClick={() => setView('login')}>เข้าสู่ระบบ</span></div>
        </form>
      )}
    </div>
  </div>
);

const ChatRoom = ({ trip, currentUser, onBack, onSendMessage, onSendMedia }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [trip.chat]);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="text-gray-500 hover:text-gray-700">← กลับ</button>
           <img src={trip.image} className="w-10 h-10 rounded-full object-cover" />
           <div><h3 className="font-bold text-gray-800">{trip.title}</h3><p className="text-xs text-gray-500">{trip.participants.length} สมาชิก</p></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {trip.chat.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
            <div className="flex items-end gap-2">
               {msg.sender !== currentUser.name && <div className="w-6 h-6 rounded-full bg-blue-100 text-xs flex items-center justify-center text-blue-600 font-bold">{msg.sender[0]}</div>}
               <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border shadow-sm rounded-bl-none'}`}>
                 {msg.sender !== currentUser.name && <div className="text-xs font-bold text-gray-400 mb-1">{msg.sender}</div>}
                 {msg.type === 'text' && msg.text}
                 {msg.type === 'image' && <img src={msg.text} className="w-full rounded-lg mt-1" />}
                 {msg.type === 'video' && <div className="bg-black/10 p-2 rounded flex items-center gap-2"><Video className="w-4 h-4"/> <a href={msg.text} target="_blank" className="underline">ดูวิดีโอคลิป</a></div>}
               </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <div className="flex gap-1">
           <button onClick={() => onSendMedia('image')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><ImageIcon className="w-5 h-5"/></button>
           <button onClick={() => onSendMedia('video')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5"/></button>
        </div>
        <input type="text" className="flex-1 border bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="พิมพ์ข้อความ..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} />
        <button onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send className="w-5 h-5"/></button>
      </div>
    </div>
  );
};

// --- SECTIONS (NEW FEATURE) ---
const SeasonalRecommendations = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <TrendingUp className="text-blue-600"/> ที่เที่ยวแนะนำ & จัดอันดับยอดนิยม
    </h3>
    <div className="grid md:grid-cols-3 gap-4">
      {SEASONAL_HITS.map((place, idx) => (
        <div key={place.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg z-10">#{idx + 1}</div>
          <div className="h-32 overflow-hidden">
            <img src={place.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-3">
             <h4 className="font-bold text-gray-800">{place.name}</h4>
             <div className="text-xs text-gray-500 mb-2">{place.province}</div>
             <div className="flex justify-between items-center text-xs">
               <div className="flex items-center gap-1 text-gray-600">
                  {place.season === 'winter' && <Snowflake className="w-3 h-3 text-blue-400" />}
                  {place.season === 'summer' && <Sun className="w-3 h-3 text-orange-400" />}
                  {place.season === 'rainy' && <CloudRain className="w-3 h-3 text-cyan-400" />}
                  {place.month}
               </div>
               <div className="font-bold text-green-600">{place.popularity}% ฮิต</div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [dbUsers, setDbUsers] = useState(INITIAL_USERS);
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [view, setView] = useState('landing'); 
  const [activeTrip, setActiveTrip] = useState(null); 
  
  // Sidebar & Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [paymentItem, setPaymentItem] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', password: '', name: '', role: 'traveler', bio: '' });
  const [newItem, setNewItem] = useState({});
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    const savedUsers = localStorage.getItem('tb_users');
    const savedTrips = localStorage.getItem('tb_trips');
    const savedPkgs = localStorage.getItem('tb_packages');
    if (savedUsers) setDbUsers(JSON.parse(savedUsers));
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedPkgs) setPackages(JSON.parse(savedPkgs));
  }, []);

  useEffect(() => {
    localStorage.setItem('tb_users', JSON.stringify(dbUsers));
    localStorage.setItem('tb_trips', JSON.stringify(trips));
    localStorage.setItem('tb_packages', JSON.stringify(packages));
  }, [dbUsers, trips, packages]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = dbUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) { setCurrentUser(user); setView('dashboard'); } else { alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"); }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (dbUsers.find(u => u.username === regForm.username)) { alert("ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว"); return; }
    const newUser = { ...regForm, status: regForm.role === 'guide' ? 'pending' : 'active', image: '', contact: '' };
    setDbUsers([...dbUsers, newUser]);
    alert("สมัครสมาชิกสำเร็จ!"); setLoginForm({ username: regForm.username, password: regForm.password }); setView('login');
  };

  const handleLogout = () => { setCurrentUser(null); setView('landing'); setActiveTrip(null); setIsSidebarOpen(false); };
  const handleSendChat = (text) => { const newMessage = { sender: currentUser.name, text, type: 'text', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; updateTripChat(newMessage); };
  const handleSendMedia = (type) => { const url = prompt(`ใส่ลิงก์ ${type}:`); if (url) { const newMessage = { sender: currentUser.name, text: url, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; updateTripChat(newMessage); } };
  const updateTripChat = (msg) => { const updatedTrips = trips.map(t => t.id === activeTrip.id ? { ...t, chat: [...t.chat, msg] } : t); setTrips(updatedTrips); setActiveTrip({ ...activeTrip, chat: [...activeTrip.chat, msg] }); };
  const handleBooking = (pkg) => { setPaymentItem(pkg); setModalType('payment'); setIsModalOpen(true); };
  const confirmPayment = () => { alert(`ระบบ: ชำระเงินเรียบร้อย (Demo)`); setIsModalOpen(false); };
  
  // Profile & Admin Actions
  const openEditProfile = () => { setProfileForm({ name: currentUser.name, bio: currentUser.bio || '', image: currentUser.image || '', contact: currentUser.contact || '' }); setModalType('edit_profile'); setIsModalOpen(true); };
  const saveProfile = () => { const updatedUser = { ...currentUser, ...profileForm }; setCurrentUser(updatedUser); setDbUsers(dbUsers.map(u => u.username === currentUser.username ? updatedUser : u)); setIsModalOpen(false); };
  const adminVerifyGuide = (username, approve) => { setDbUsers(dbUsers.map(u => u.username === username ? { ...u, status: approve ? 'active' : 'rejected' } : u)); };
  const adminApprovePackage = (pkgId, approve) => { setPackages(packages.map(p => p.id === pkgId ? { ...p, status: approve ? 'approved' : 'rejected' } : p)); };

  const renderModalContent = () => {
    if (modalType === 'edit_profile') return (
      <div className="space-y-4">
        <h3 className="font-bold text-xl flex items-center gap-2"><UserCircle className="text-blue-600"/> แก้ไขโปรไฟล์</h3>
        <div className="flex justify-center mb-4"><div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative border-2 border-blue-100">{profileForm.image ? <img src={profileForm.image} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}</div></div>
        <input className="w-full border p-2 rounded" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} placeholder="ชื่อที่แสดง" />
        <input className="w-full border p-2 rounded" placeholder="URL รูปโปรไฟล์" value={profileForm.image} onChange={e => setProfileForm({...profileForm, image: e.target.value})} />
        <textarea className="w-full border p-2 rounded h-20" placeholder="แนะนำตัว" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="ช่องทางติดต่อ (Line/เบอร์)" value={profileForm.contact} onChange={e => setProfileForm({...profileForm, contact: e.target.value})} />
        <Button onClick={saveProfile} className="w-full mt-2">บันทึกข้อมูล</Button>
      </div>
    );
    if (modalType === 'create_trip') return (
      <div className="space-y-4"><h3 className="font-bold text-xl">สร้างโพสต์หาเพื่อน</h3><input className="w-full border p-2 rounded" placeholder="ชื่อทริป" onChange={e => setNewItem({...newItem, title: e.target.value})} /><input className="w-full border p-2 rounded" placeholder="สถานที่" onChange={e => setNewItem({...newItem, location: e.target.value})} /><input className="w-full border p-2 rounded" placeholder="URL รูปปก" onChange={e => setNewItem({...newItem, image: e.target.value})} /><Button onClick={() => { setTrips([...trips, { ...newItem, id: Date.now(), author: currentUser.name, participants: [currentUser.name], chat: [] }]); setIsModalOpen(false); setNewItem({}); }} className="w-full">โพสต์เลย</Button></div>
    );
    if (modalType === 'create_package') return (
       <div className="space-y-4"><h3 className="font-bold text-xl">สร้างแพ็คเกจ</h3><div className="grid grid-cols-2 gap-3"><button onClick={() => setNewItem({...newItem, type: 'virtual'})} className={`p-3 border rounded ${newItem.type === 'virtual' ? 'bg-purple-50 border-purple-500' : ''}`}>Online</button><button onClick={() => setNewItem({...newItem, type: 'onsite'})} className={`p-3 border rounded ${newItem.type === 'onsite' ? 'bg-blue-50 border-blue-500' : ''}`}>On-site</button></div><input className="w-full border p-2 rounded" placeholder="ชื่อแพ็คเกจ" onChange={e => setNewItem({...newItem, title: e.target.value})} /><input className="w-full border p-2 rounded" placeholder="สถานที่" onChange={e => setNewItem({...newItem, location: e.target.value})} /><input className="w-full border p-2 rounded" placeholder="ราคา" type="number" onChange={e => setNewItem({...newItem, price: e.target.value})} /><Button onClick={() => { if(!newItem.type) return alert("เลือกรูปแบบบริการ"); setPackages([...packages, { ...newItem, id: Date.now(), guide: currentUser.name, status: 'pending' }]); setIsModalOpen(false); }} className="w-full bg-purple-600 hover:bg-purple-700">ส่งให้ Admin</Button></div>
    );
    if (modalType === 'payment') return <div className="space-y-4 text-center"><h3 className="font-bold">ชำระเงิน: {paymentItem.title}</h3><div className="text-2xl font-bold text-blue-600">฿{paymentItem.price}</div><Button onClick={confirmPayment} className="w-full" variant="success">ยืนยันการชำระเงิน (Demo)</Button></div>;
    return null;
  };

  const renderTravelerDashboard = () => (
    <div className="space-y-8">
      <SeasonalRecommendations />
      <div><h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Backpack className="text-blue-600"/> โพสต์หาเพื่อนเที่ยว</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{trips.map(trip => (<Card key={trip.id} className="group hover:shadow-lg transition-all"><div className="h-40 overflow-hidden relative"><img src={trip.image} className="w-full h-full object-cover" /><div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-blue-600">{trip.participants.length} คน</div></div><div className="p-4"><h4 className="font-bold text-gray-800 mb-1">{trip.title}</h4><div className="text-sm text-gray-500 mb-3 flex gap-2"><MapPin className="w-4 h-4"/> {trip.location}</div>{trip.participants.includes(currentUser.name) ? (<Button onClick={() => setActiveTrip(trip)} variant="primary" className="w-full bg-blue-100 !text-blue-700 hover:!bg-blue-200"><MessageSquare className="w-4 h-4"/> ห้องแชท</Button>) : (<Button onClick={() => { const updated = trips.map(t => t.id === trip.id ? {...t, participants: [...t.participants, currentUser.name]} : t); setTrips(updated); }} variant="outline" className="w-full">ขอเข้าร่วม</Button>)}</div></Card>))}</div></div>
      <div><h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Compass className="text-purple-600"/> แพ็คเกจไกด์</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{packages.filter(p => p.status === 'approved').map(pkg => (<Card key={pkg.id} className="border-purple-100"><div className="h-40 relative"><img src={pkg.image} className="w-full h-full object-cover" /><div className="absolute top-2 left-2"><Badge status={pkg.type} text={pkg.type === 'virtual' ? 'Online' : 'On-site'} /></div></div><div className="p-4"><h4 className="font-bold text-gray-800">{pkg.title}</h4><div className="text-xs text-gray-500 mb-2">โดย {pkg.guide}</div><div className="flex justify-between items-center mt-2"><span className="font-bold text-purple-600">฿{pkg.price}</span><Button onClick={() => handleBooking(pkg)} className="!px-3 !py-1 text-sm bg-purple-600 hover:bg-purple-700">จองเลย</Button></div></div></Card>))}</div></div>
    </div>
  );

  const renderGuideDashboard = () => (
    <div className="space-y-6">
      {currentUser.status === 'pending' ? <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-xl text-center"><Lock className="w-8 h-8 text-yellow-600 mx-auto mb-2"/><h2 className="font-bold text-yellow-800">รอการยืนยันตัวตน</h2></div> : 
      <><div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">จัดการแพ็คเกจ</h2><Button onClick={() => { setModalType('create_package'); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700"><PlusCircle className="w-4 h-4"/> สร้างแพ็คเกจ</Button></div><div className="grid gap-4">{packages.filter(p => p.guide === currentUser.name).map(pkg => (<div key={pkg.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm"><div className="flex gap-4 items-center"><img src={pkg.image} className="w-20 h-20 rounded-lg object-cover" /><div><h4 className="font-bold text-gray-800">{pkg.title}</h4><div className="flex gap-2 mt-1"><Badge status={pkg.type} text={pkg.type === 'virtual' ? 'Online' : 'On-site'} /><Badge status={pkg.status} /></div></div></div><div className="text-right"><div className="font-bold text-lg text-gray-800">฿{pkg.price}</div></div></div>))}</div></>}
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div><h3 className="font-bold text-gray-800 mb-4">ไกด์รอการยืนยัน</h3><div className="space-y-3">{dbUsers.filter(u => u.role === 'guide' && u.status === 'pending').map(user => (<div key={user.username} className="bg-white p-4 rounded-lg border-l-4 border-orange-500 shadow-sm flex justify-between items-center"><div><div className="font-bold">{user.name}</div><div className="text-sm text-gray-600">{user.bio}</div></div><div className="flex gap-2"><Button variant="danger" onClick={() => adminVerifyGuide(user.username, false)} className="text-xs">ไม่อนุมัติ</Button><Button variant="success" onClick={() => adminVerifyGuide(user.username, true)} className="text-xs">อนุมัติ</Button></div></div>))}</div></div>
      <div><h3 className="font-bold text-gray-800 mb-4">แพ็คเกจรอตรวจสอบ</h3><div className="space-y-3">{packages.filter(p => p.status === 'pending').map(pkg => (<div key={pkg.id} className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm flex justify-between items-center"><div className="flex gap-3"><img src={pkg.image} className="w-16 h-16 rounded object-cover"/><div><div className="font-bold">{pkg.title}</div><div className="text-xs text-gray-500">โดย {pkg.guide} • ฿{pkg.price}</div></div></div><div className="flex gap-2"><Button variant="danger" onClick={() => adminApprovePackage(pkg.id, false)} className="text-xs">ไม่อนุมัติ</Button><Button variant="success" onClick={() => adminApprovePackage(pkg.id, true)} className="text-xs">อนุมัติขาย</Button></div></div>))}</div></div>
    </div>
  );

  if (!currentUser) return <AuthScreen view={view} setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6 text-gray-700"/></button>
           <div className="font-bold text-xl text-blue-600 cursor-pointer flex items-center gap-2" onClick={() => { setActiveTrip(null); setView('dashboard'); }}>
              <Compass className="w-6 h-6"/> TripbuddyTH
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:block text-right cursor-pointer" onClick={openEditProfile}>
             <div className="font-bold text-sm">{currentUser.name}</div>
             <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border hover:border-blue-500" onClick={openEditProfile}>
             {currentUser.image ? <img src={currentUser.image} className="w-full h-full object-cover" /> : <User className="w-6 h-6 m-2 text-gray-400"/>}
           </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={openEditProfile} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-4 mt-4">
        {activeTrip ? <ChatRoom trip={activeTrip} currentUser={currentUser} onBack={() => setActiveTrip(null)} onSendMessage={handleSendChat} onSendMedia={handleSendMedia} /> : (
           <>
             {currentUser.role === ROLES.TRAVELER && renderTravelerDashboard()}
             {currentUser.role === ROLES.GUIDE && renderGuideDashboard()}
             {currentUser.role === ROLES.ADMIN && renderAdminDashboard()}
           </>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}