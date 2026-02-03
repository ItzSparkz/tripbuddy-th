import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Calendar, DollarSign, Send, 
  PlusCircle, Shield, Backpack, Compass, MessageSquare,
  LogOut, Star, CheckCircle, XCircle, CreditCard, Loader,
  Video, Image as ImageIcon, Map, Phone, Lock, FileText, Users,
  Edit, Camera, UserCircle, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  History, Settings, ChevronRight, PlayCircle, Heart, Share2, Info
} from 'lucide-react';

// --- DATABASE 77 PROVINCES (ข้อมูลครบ 77 จังหวัด) ---
const THAILAND_DATA = {
  north: {
    name: 'ภาคเหนือ',
    color: 'bg-green-100 text-green-800',
    provinces: [
      { name: 'เชียงใหม่', desc: 'เมืองยอดฮิต ดอยอินทนนท์ ถนนคนเดิน', highlight: 'ดอยอินทนนท์' },
      { name: 'เชียงราย', desc: 'วัดร่องขุ่น ดอยตุง สามเหลี่ยมทองคำ', highlight: 'วัดร่องขุ่น' },
      { name: 'น่าน', desc: 'เมืองเก่ามีชีวิต กระซิบรักบันลือโลก', highlight: 'ดอยเสมอดาว' },
      { name: 'แม่ฮ่องสอน', desc: 'เมืองสามหมอก ปาย ทุ่งดอกบัวตอง', highlight: 'ปางอุ๋ง' },
      { name: 'แพร่', desc: 'เมืองไม้สักทอง พระธาตุช่อแฮ', highlight: 'แพะเมืองผี' },
      { name: 'พะเยา', desc: 'กว๊านพะเยา งดงามวิถีล้านนา', highlight: 'กว๊านพะเยา' },
      { name: 'ลำปาง', desc: 'เมืองรถม้า ถ้วยตราไก่', highlight: 'วัดพระธาตุลำปางหลวง' },
      { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย เมืองลำไย', highlight: 'พระธาตุหริภุญชัย' },
      { name: 'อุตรดิตถ์', desc: 'เมืองลับแล พระยาพิชัยดาบหัก', highlight: 'ภูสอยดาว' }
    ]
  },
  northeast: {
    name: 'ภาคอีสาน',
    color: 'bg-orange-100 text-orange-800',
    provinces: [
      { name: 'นครราชสีมา', desc: 'ประตูสู่อีสาน เขาใหญ่ ผัดหมี่โคราช', highlight: 'อุทยานแห่งชาติเขาใหญ่' },
      { name: 'ขอนแก่น', desc: 'เมืองไดโนเสาร์ พระธาตุขามแก่น', highlight: 'เขื่อนอุบลรัตน์' },
      { name: 'อุดรธานี', desc: 'คำชะโนด ทะเลบัวแดง แหล่งธรรมะ', highlight: 'คำชะโนด' },
      { name: 'อุบลราชธานี', desc: 'สามพันโบก ผาแต้ม แสงแรกแห่งสยาม', highlight: 'สามพันโบก' },
      { name: 'หนองคาย', desc: 'บั้งไฟพญานาค สะพานมิตรภาพ', highlight: 'วัดผาตากเสื้อ' },
      { name: 'เลย', desc: 'เมืองแห่งทะเลภูเขา ภูกระดึง เชียงคาน', highlight: 'เชียงคาน' },
      { name: 'บุรีรัมย์', desc: 'ปราสาทหินพนมรุ้ง สนามช้างอารีน่า', highlight: 'พนมรุ้ง' },
      { name: 'สุรินทร์', desc: 'ถิ่นช้างใหญ่ ผ้าไหมงาม', highlight: 'หมู่บ้านช้าง' },
      { name: 'ศรีสะเกษ', desc: 'ผามออีแดง ปราสาทเขาพระวิหาร', highlight: 'ผามออีแดง' },
      { name: 'สกลนคร', desc: 'เมืองหนองหาร หลวงปู่มั่น', highlight: 'วัดพระธาตุเชิงชุม' },
      { name: 'นครพนม', desc: 'พระธาตุพนม ริมโขงสุดชิล', highlight: 'พญาศรีสัตตนาคราช' },
      { name: 'มุกดาหาร', desc: 'ตลาดอินโดจีน หอแก้ว', highlight: 'หอแก้วมุกดาหาร' },
      { name: 'ยโสธร', desc: 'ประเพณีบั้งไฟ เมืองพญาแถน', highlight: 'พญาคันคาก' },
      { name: 'ร้อยเอ็ด', desc: 'บึงพลาญชัย หอโหวต', highlight: 'เจดีย์มหามงคลบัว' },
      { name: 'กาฬสินธุ์', desc: 'ไดโนเสาร์ภูกุ้มข้าว ผ้าไหมแพรวา', highlight: 'พิพิธภัณฑ์สิรินธร' },
      { name: 'มหาสารคาม', desc: 'สะดืออีสาน พระธาตุนาดูน', highlight: 'พระธาตุนาดูน' },
      { name: 'ชัยภูมิ', desc: 'ทุ่งดอกกระเจียว มอหินขาว', highlight: 'มอหินขาว' },
      { name: 'อำนาจเจริญ', desc: 'พระมงคลมิ่งเมือง ภูสิงห์', highlight: 'พุทธอุทยาน' },
      { name: 'หนองบัวลำภู', desc: 'ศาลสมเด็จพระนเรศวร ถ้ำเอราวัณ', highlight: 'วัดถ้ำกลองเพล' },
      { name: 'บึงกาฬ', desc: 'ภูทอก หินสามวาฬ', highlight: 'ถ้ำนาคา' }
    ]
  },
  central: {
    name: 'ภาคกลาง',
    color: 'bg-yellow-100 text-yellow-800',
    provinces: [
      { name: 'กรุงเทพมหานคร', desc: 'เมืองหลวง วัดพระแก้ว สตรีทฟู้ดระดับโลก', highlight: 'วัดอรุณฯ' },
      { name: 'พระนครศรีอยุธยา', desc: 'เมืองเก่ามรดกโลก กุ้งแม่น้ำ', highlight: 'วัดมหาธาตุ' },
      { name: 'สระบุรี', desc: 'รอยพระพุทธบาท น้ำตกเจ็ดสาวน้อย', highlight: 'น้ำตกเจ็ดสาวน้อย' },
      { name: 'ลพบุรี', desc: 'เมืองลิง พระปรางค์สามยอด ทุ่งทานตะวัน', highlight: 'พระนารายณ์ราชนิเวศน์' },
      { name: 'สิงห์บุรี', desc: 'วีรชนบางระจัน ปลาช่อนแม่ลา', highlight: 'วัดพิกุลทอง' },
      { name: 'ชัยนาท', desc: 'สวนนกชัยนาท เขื่อนเจ้าพระยา', highlight: 'สวนนกชัยนาท' },
      { name: 'อ่างทอง', desc: 'พระพุทธรูปองค์ใหญ่ ตุ๊กตาชาววัง', highlight: 'วัดม่วง' },
      { name: 'นครสวรรค์', desc: 'ต้นแม่น้ำเจ้าพระยา บึงบอระเพ็ด', highlight: 'พาสาน' },
      { name: 'อุทัยธานี', desc: 'หุบป่าตาด วัดท่าซุง', highlight: 'วัดท่าซุง' },
      { name: 'กำแพงเพชร', desc: 'อุทยานประวัติศาสตร์ กล้วยไข่', highlight: 'น้ำตกคลองลาน' },
      { name: 'สุโขทัย', desc: 'รุ่งอรุณแห่งความสุข มรดกโลก', highlight: 'อุทยานประวัติศาสตร์สุโขทัย' },
      { name: 'พิษณุโลก', desc: 'พระพุทธชินราช ภูหินร่องกล้า', highlight: 'วัดพระศรีรัตนมหาธาตุ' },
      { name: 'พิจิตร', desc: 'เมืองชาละวัน หลวงพ่อเงิน', highlight: 'บึงสีไฟ' },
      { name: 'เพชรบูรณ์', desc: 'เขาค้อ ภูทับเบิก ทะเลหมอก', highlight: 'เขาค้อ' },
      { name: 'สุพรรณบุรี', desc: 'มังกรสวรรค์ ตลาดสามชุก', highlight: 'บึงฉวาก' },
      { name: 'นครปฐม', desc: 'พระปฐมเจดีย์ ส้มโอหวาน', highlight: 'พระปฐมเจดีย์' },
      { name: 'สมุทรสาคร', desc: 'ตลาดทะเลไทย ศาลพันท้ายนรสิงห์', highlight: 'สะพานแดง' },
      { name: 'สมุทรสงคราม', desc: 'ตลาดน้ำอัมพวา ดอนหอยหลอด', highlight: 'ตลาดร่มหุบ' },
      { name: 'นนทบุรี', desc: 'เกาะเกร็ด ทุเรียนนนท์', highlight: 'เกาะเกร็ด' },
      { name: 'ปทุมธานี', desc: 'พิพิธภัณฑ์วิทยาศาสตร์ ตลาดไท', highlight: 'วัดเจดีย์หอย' },
      { name: 'สมุทรปราการ', desc: 'เมืองปากน้ำ เมืองโบราณ', highlight: 'บางกระเจ้า' }
    ]
  },
  east: {
    name: 'ภาคตะวันออก',
    color: 'bg-blue-100 text-blue-800',
    provinces: [
      { name: 'ชลบุรี', desc: 'พัทยา บางแสน เกาะล้าน', highlight: 'หาดบางแสน' },
      { name: 'ระยอง', desc: 'เกาะเสม็ด ผลไม้รสล้ำ', highlight: 'เกาะเสม็ด' },
      { name: 'จันทบุรี', desc: 'เมืองผลไม้ อัญมณี เนินนางพญา', highlight: 'จุดชมวิวเนินนางพญา' },
      { name: 'ตราด', desc: 'เกาะช้าง หมู่เกาะทะเลตราด', highlight: 'เกาะช้าง' },
      { name: 'ฉะเชิงเทรา', desc: 'หลวงพ่อโสธร ตลาดน้ำบางคล้า', highlight: 'วัดโสธรวรารามวรวิหาร' },
      { name: 'ปราจีนบุรี', desc: 'แก่งหินเพิง สมุนไพรอภัยภูเบศร', highlight: 'เวโรน่า ทับลาน' },
      { name: 'สระแก้ว', desc: 'ตลาดโรงเกลือ ปราสาทสด๊กก๊อกธม', highlight: 'ละลุ' }
    ]
  },
  west: {
    name: 'ภาคตะวันตก',
    color: 'bg-amber-100 text-amber-800',
    provinces: [
      { name: 'กาญจนบุรี', desc: 'สะพานข้ามแม่น้ำแคว น้ำตกเอราวัณ', highlight: 'สังขละบุรี' },
      { name: 'ตาก', desc: 'ทีลอซู เขื่อนภูมิพล แม่สอด', highlight: 'น้ำตกทีลอซู' },
      { name: 'ประจวบคีรีขันธ์', desc: 'หัวหิน อ่าวมะนาว สามร้อยยอด', highlight: 'หัวหิน' },
      { name: 'เพชรบุรี', desc: 'เขาวัง หาดชะอำ ขนมหวาน', highlight: 'อุทยานแห่งชาติแก่งกระจาน' },
      { name: 'ราชบุรี', desc: 'สวนผึ้ง ตลาดน้ำดำเนินสะดวก', highlight: 'สวนผึ้ง' }
    ]
  },
  south: {
    name: 'ภาคใต้',
    color: 'bg-cyan-100 text-cyan-800',
    provinces: [
      { name: 'ภูเก็ต', desc: 'ไข่มุกอันดามัน แหลมพรหมเทพ เมืองเก่า', highlight: 'หาดป่าตอง' },
      { name: 'สุราษฎร์ธานี', desc: 'เกาะสมุย เกาะเต่า เขื่อนเชี่ยวหลาน', highlight: 'เขื่อนเชี่ยวหลาน' },
      { name: 'นครศรีธรรมราช', desc: 'วัดพระมหาธาตุ หมู่บ้านคีรีวง', highlight: 'ไอไข่ วัดเจดีย์' },
      { name: 'สงขลา', desc: 'หาดใหญ่ นางเงือกทอง', highlight: 'ย่านเมืองเก่าสงขลา' },
      { name: 'กระบี่', desc: 'สระมรกต อ่าวนาง เกาะพีพี', highlight: 'อ่าวนาง' },
      { name: 'พังงา', desc: 'เสม็ดนางชี เกาะสิมิลัน', highlight: 'เสม็ดนางชี' },
      { name: 'ตรัง', desc: 'เมืองหมูย่าง ถ้ำมรกต', highlight: 'เกาะกระดาน' },
      { name: 'สตูล', desc: 'เกาะหลีเป๊ะ อุทยานธรณีโลก', highlight: 'เกาะหลีเป๊ะ' },
      { name: 'ชุมพร', desc: 'ประตูสู่ภาคใต้ หาดทรายรี', highlight: 'หมู่เกาะชุมพร' },
      { name: 'ระนอง', desc: 'เมืองฝนแปดแดดสี่ บ่อน้ำร้อน', highlight: 'ภูเขาหญ้า' },
      { name: 'พัทลุง', desc: 'ทะเลน้อย นาโปแก', highlight: 'สะพานเฉลิมพระเกียรติ' },
      { name: 'ยะลา', desc: 'เบตง ผังเมืองสวยที่สุด', highlight: 'Skywalk อัยเยอร์เวง' },
      { name: 'ปัตตานี', desc: 'มัสยิดกลาง ศาลเจ้าแม่ลิ้มกอเหนี่ยว', highlight: 'สกายวอล์คปัตตานี' },
      { name: 'นราธิวาส', desc: 'ป่าฮาลาบาลา น้ำตกปาโจ', highlight: 'อ่าวมะนาว' }
    ]
  }
};

// --- INITIAL MOCK DATA ---
const INITIAL_USERS = [
  { username: 'admin', password: '123', role: 'admin', name: 'Admin Somchai', status: 'active', image: '', bio: 'ผู้ดูแลระบบ', contact: 'admin@tripbuddy.th' },
  { username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี', status: 'active', bio: 'เชี่ยวชาญภาคเหนือ', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Line: guide_somsri' },
  { username: 'traveler1', password: '123', role: 'traveler', name: 'นักเดินทาง Alex', status: 'active', bio: 'ชอบเที่ยวภูเขา', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel' }
];

const INITIAL_POSTS = [
  { 
    id: 1, title: 'Vlog: พาเที่ยวเชียงใหม่ 3 วัน 2 คืน', location: 'เชียงใหม่', date: '2024-11-20', budget: '5000', 
    author: 'นักเดินทาง Alex', type: 'video', 
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Demo Link
    participants: ['นักเดินทาง Alex'],
    chat: [
      { sender: 'นักเดินทาง Alex', text: 'ทริปนี้สนุกมาก! ใครมีคำถามถามได้เลย', type: 'text', time: '10:00' },
      { sender: 'ไกด์สมศรี', text: 'ภาพสวยมากค่ะ', type: 'text', time: '10:05' }
    ],
    likes: 124
  },
  { 
    id: 2, title: 'หาเพื่อนดำน้ำเกาะเต่า', location: 'สุราษฎร์ธานี', date: '2024-12-05', budget: '8000', 
    author: 'นักเดินทาง Alex', type: 'trip', 
    media: 'https://images.unsplash.com/photo-1533227977699-dbd12d09df22?w=600',
    participants: ['นักเดินทาง Alex'],
    chat: [],
    likes: 45
  }
];

const INITIAL_PACKAGES = [
  { 
    id: 101, title: 'วางแผนเที่ยวภูเก็ต (Online Support)', location: 'ภูเก็ต', price: '1500', 
    guide: 'ไกด์สมศรี', status: 'approved', type: 'virtual',
    image: 'https://images.unsplash.com/photo-1589394815804-989b3b785d51?w=600'
  }
];

const ROLES = { TRAVELER: 'traveler', GUIDE: 'guide', ADMIN: 'admin' };

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
  const styles = { approved: "bg-green-100 text-green-700", active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", virtual: "bg-purple-100 text-purple-700", onsite: "bg-blue-100 text-blue-700", video: "bg-red-100 text-red-700", trip: "bg-blue-100 text-blue-700" };
  return <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${styles[status] || 'bg-gray-100'}`}>{text || status}</span>;
};

// --- SIDEBAR ---
const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout, setView }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-64 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="p-6 bg-blue-600 text-white">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden border-2 border-white/50">{user.image ? <img src={user.image} className="w-full h-full object-cover"/> : <User className="w-6 h-6 m-3 text-white"/>}</div>
             <div><div className="font-bold truncate w-32">{user.name}</div><div className="text-xs text-blue-100 uppercase">{user.role}</div></div>
          </div>
        </div>
        <div className="p-4 space-y-1">
          <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700"><Edit className="w-5 h-5 text-blue-500" /> แก้ไขโปรไฟล์</button>
          <div className="my-2 border-t border-gray-100"></div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-red-600"><LogOut className="w-5 h-5" /> ออกจากระบบ</button>
        </div>
      </div>
    </>
  );
};

// --- AUTH SCREEN ---
const AuthScreen = ({ view, setView, loginForm, setLoginForm, regForm, setRegForm, handleLogin, handleRegister }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div className="text-center mb-6"><div className="inline-flex p-3 bg-blue-100 rounded-full mb-3"><Compass className="w-8 h-8 text-blue-600"/></div><h1 className="text-2xl font-bold text-gray-800">TripbuddyTH</h1><p className="text-gray-500">แพลตฟอร์มท่องเที่ยวครบวงจร</p></div>
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

// --- CHAT ROOM ---
const ChatRoom = ({ trip, currentUser, onBack, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [trip.chat]);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="text-gray-500 hover:text-gray-700">← กลับ</button>
           <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">{trip.type === 'video' ? <Video className="w-5 h-5 m-2.5 text-gray-500"/> : <img src={trip.media} className="w-full h-full object-cover" />}</div>
           <div><h3 className="font-bold text-gray-800 line-clamp-1">{trip.title}</h3><p className="text-xs text-gray-500">{trip.chat.length} ความคิดเห็น</p></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {trip.chat.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
            <div className="flex items-end gap-2">
               {msg.sender !== currentUser.name && <div className="w-6 h-6 rounded-full bg-blue-100 text-xs flex items-center justify-center text-blue-600 font-bold">{msg.sender[0]}</div>}
               <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border shadow-sm rounded-bl-none'}`}>
                 {msg.sender !== currentUser.name && <div className="text-xs font-bold text-gray-400 mb-1">{msg.sender}</div>}
                 {msg.text}
               </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
          </div>
        ))}
        {trip.chat.length === 0 && <div className="text-center text-gray-400 mt-10">ยังไม่มีความคิดเห็น เริ่มคุยเลย!</div>}
      </div>
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input type="text" className="flex-1 border bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="แสดงความคิดเห็น..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} />
        <button onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send className="w-5 h-5"/></button>
      </div>
    </div>
  );
};

// --- NEW FEATURE: THAILAND DISCOVERY (77 Provinces) ---
const ThailandDiscovery = () => {
  const [activeRegion, setActiveRegion] = useState('north');
  const [selectedProv, setSelectedProv] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"><Map className="w-8 h-8"/> 77 จังหวัดทั่วไทย</h2>
        <p className="text-teal-100">ค้นหาจุดเด่นและสถานที่ท่องเที่ยวครบทุกจังหวัด</p>
      </div>

      {/* Region Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(THAILAND_DATA).map(key => (
          <button 
            key={key}
            onClick={() => setActiveRegion(key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeRegion === key ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            {THAILAND_DATA[key].name}
          </button>
        ))}
      </div>

      {/* Provinces Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {THAILAND_DATA[activeRegion].provinces.map((prov, idx) => (
          <div key={idx} onClick={() => setSelectedProv(prov)} className={`cursor-pointer rounded-xl p-4 border border-transparent hover:border-blue-200 hover:shadow-lg transition-all ${THAILAND_DATA[activeRegion].color} bg-opacity-30`}>
            <div className="font-bold text-lg mb-1">{prov.name}</div>
            <div className="text-xs opacity-70 mb-2 flex items-center gap-1"><Star className="w-3 h-3"/> {prov.highlight}</div>
            <div className="text-xs text-gray-600 line-clamp-2">{prov.desc}</div>
          </div>
        ))}
      </div>

      {/* Province Detail Modal */}
      {selectedProv && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProv(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProv(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
            <div className="text-center">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">{selectedProv.name[0]}</div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProv.name}</h3>
               <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold mb-4">⭐ {selectedProv.highlight}</div>
               <p className="text-gray-600">{selectedProv.desc}</p>
               <Button className="w-full mt-6" onClick={() => window.open(`https://www.google.com/search?q=ที่เที่ยว${selectedProv.name}`, '_blank')}>ค้นหาข้อมูลเพิ่มเติม</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [dbUsers, setDbUsers] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS); // Combined Trips & Clips
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [view, setView] = useState('landing'); 
  const [activePost, setActivePost] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', name: '', role: 'traveler' });
  const [newItem, setNewItem] = useState({}); // Shared form state

  // Persistence
  useEffect(() => {
    const u = localStorage.getItem('tb_users'); if(u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts'); if(p) setPosts(JSON.parse(p));
  }, []);
  useEffect(() => {
    localStorage.setItem('tb_users', JSON.stringify(dbUsers));
    localStorage.setItem('tb_posts', JSON.stringify(posts));
  }, [dbUsers, posts]);

  // Actions
  const handleLogin = (e) => { e.preventDefault(); const u = dbUsers.find(x => x.username === loginForm.username); if(u) { setCurrentUser(u); setView('dashboard'); } };
  const handleRegister = (e) => { e.preventDefault(); setDbUsers([...dbUsers, {...regForm, status:'active'}]); setView('login'); };
  const handleLogout = () => { setCurrentUser(null); setView('landing'); };
  const handleChat = (text) => {
    const msg = { sender: currentUser.name, text, time: 'Now' };
    const updated = posts.map(p => p.id === activePost.id ? {...p, chat: [...p.chat, msg]} : p);
    setPosts(updated); setActivePost({...activePost, chat: [...activePost.chat, msg]});
  };

  const renderModal = () => {
    if (modalType === 'create_post') return (
      <div className="space-y-4">
        <h3 className="font-bold text-xl">สร้างโพสต์ใหม่</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setNewItem({...newItem, type: 'video'})} className={`p-3 border rounded flex flex-col items-center gap-2 ${newItem.type === 'video' ? 'bg-red-50 border-red-500 text-red-700' : ''}`}><Video/> คลิปวิดีโอ</button>
          <button onClick={() => setNewItem({...newItem, type: 'trip'})} className={`p-3 border rounded flex flex-col items-center gap-2 ${newItem.type === 'trip' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''}`}><Map/> หาเพื่อนเที่ยว</button>
        </div>
        <input className="w-full border p-2 rounded" placeholder={newItem.type === 'video' ? "ชื่อคลิป..." : "ชื่อทริป..."} onChange={e => setNewItem({...newItem, title: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder={newItem.type === 'video' ? "ลิงก์ YouTube Embed / Video URL" : "ลิงก์รูปปก"} onChange={e => setNewItem({...newItem, media: e.target.value})} />
        {newItem.type === 'trip' && <input className="w-full border p-2 rounded" placeholder="สถานที่" onChange={e => setNewItem({...newItem, location: e.target.value})} />}
        <Button onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0 }, ...posts]); setIsModalOpen(false); setNewItem({}); }} className="w-full">โพสต์เลย</Button>
      </div>
    );
    return null;
  };

  // --- DASHBOARDS ---
  const TravelerFeed = () => (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button onClick={() => setView('discovery')} className="flex-shrink-0 w-32 h-40 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex flex-col items-center justify-center text-white shadow-md hover:scale-105 transition-transform">
           <Map className="w-8 h-8 mb-2"/>
           <span className="font-bold text-sm">77 จังหวัด</span>
           <span className="text-xs opacity-80">ข้อมูลท่องเที่ยว</span>
        </button>
        <button onClick={() => { setModalType('create_post'); setIsModalOpen(true); }} className="flex-shrink-0 w-32 h-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 hover:bg-gray-200">
           <PlusCircle className="w-8 h-8 mb-2"/>
           <span className="font-bold text-sm">สร้างโพสต์</span>
        </button>
      </div>

      <h3 className="font-bold text-gray-800 text-lg">ฟีดล่าสุด (Feed)</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="group">
            <div className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">{post.author[0]}</div>
              <div className="flex-1"><div className="text-sm font-bold">{post.author}</div><div className="text-xs text-gray-500">{post.type === 'video' ? 'โพสต์คลิปวิดีโอ' : 'ประกาศหาเพื่อนเที่ยว'}</div></div>
            </div>
            {post.type === 'video' ? (
              <div className="aspect-video bg-black relative">
                 <iframe src={post.media} className="w-full h-full" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => setActivePost(post)}>
                 <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                 <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MapPin className="w-3 h-3"/> {post.location}</div>
              </div>
            )}
            <div className="p-3">
              <h4 className="font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600" onClick={() => setActivePost(post)}>{post.title}</h4>
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                 <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500"><Heart className="w-4 h-4"/> {post.likes || 0}</button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500" onClick={() => setActivePost(post)}><MessageSquare className="w-4 h-4"/> {post.chat.length}</button>
                 </div>
                 <button className="text-gray-400 hover:text-gray-600"><Share2 className="w-4 h-4"/></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // --- RENDER MAIN ---
  if (!currentUser) return <AuthScreen view={view} setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6 text-gray-700"/></button>
           <div className="font-bold text-xl text-blue-600 cursor-pointer flex items-center gap-2" onClick={() => { setActivePost(null); setView('dashboard'); }}>
              <Compass className="w-6 h-6"/> TripbuddyTH <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">Ultimate</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">{currentUser.name[0]}</div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={() => alert('Demo Profile')} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-4 mt-4">
        {activePost ? <ChatRoom trip={activePost} currentUser={currentUser} onBack={() => setActivePost(null)} onSendMessage={handleChat} /> : (
           view === 'discovery' ? 
             <div><button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 hover:text-blue-600 flex items-center gap-1">← กลับหน้าหลัก</button><ThailandDiscovery /></div> 
           : <TravelerFeed />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
}