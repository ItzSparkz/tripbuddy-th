import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Video, Image as ImageIcon, Map, Phone, Lock, 
  Edit, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  LogOut, Send, PlusCircle, Compass, MessageSquare, 
  Heart, Share2, XCircle, CheckCircle, UploadCloud, ShieldCheck, Smartphone,
  Star, Loader, DollarSign, FileText, Trash2, CreditCard, Search,
  BarChart2, Users, AlertCircle, Database, CalendarCheck, Clock, Ticket, Plane,
  Navigation, Calendar, Info
} from 'lucide-react';

// --- 1. LOGO COMPONENT ---
const Logo = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="tripGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M100 20C65 20 35 45 35 85C35 125 100 190 100 190C100 190 165 125 165 85C165 45 135 20 100 20Z" fill="url(#tripGradient)" />
    <path d="M70 75C70 75 80 95 100 95C120 95 130 75 130 75" stroke="white" strokeWidth="12" strokeLinecap="round" />
    <circle cx="70" cy="65" r="8" fill="white" />
    <circle cx="130" cy="65" r="8" fill="white" />
  </svg>
);

// --- 2. DATABASE ---
const THAILAND_DATA = {
  north: { name: 'ภาคเหนือ (9)', color: 'bg-green-100 text-green-800', provinces: [{ name: 'เชียงใหม่', desc: 'ดอยอินทนนท์ ถนนคนเดิน', highlight: 'ดอยอินทนนท์' }, { name: 'เชียงราย', desc: 'วัดร่องขุ่น ดอยตุง', highlight: 'วัดร่องขุ่น' }, { name: 'น่าน', desc: 'กระซิบรัก ดอยเสมอดาว', highlight: 'ดอยเสมอดาว' }, { name: 'แม่ฮ่องสอน', desc: 'ปางอุ๋ง', highlight: 'ปางอุ๋ง' }, { name: 'แพร่', desc: 'แพะเมืองผี', highlight: 'แพะเมืองผี' }, { name: 'พะเยา', desc: 'กว๊านพะเยา', highlight: 'กว๊านพะเยา' }, { name: 'ลำปาง', desc: 'เมืองรถม้า', highlight: 'วัดพระธาตุลำปางหลวง' }, { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย', highlight: 'พระธาตุหริภุญชัย' }, { name: 'อุตรดิตถ์', desc: 'ภูสอยดาว', highlight: 'ภูสอยดาว' }] },
  northeast: { name: 'ภาคอีสาน (20)', color: 'bg-orange-100 text-orange-800', provinces: [{ name: 'นครราชสีมา', desc: 'เขาใหญ่', highlight: 'เขาใหญ่' }, { name: 'ขอนแก่น', desc: 'ไดโนเสาร์', highlight: 'เขื่อนอุบลรัตน์' }, { name: 'อุดรธานี', desc: 'คำชะโนด', highlight: 'คำชะโนด' }, { name: 'อุบลราชธานี', desc: 'สามพันโบก', highlight: 'สามพันโบก' }, { name: 'หนองคาย', desc: 'พญานาค', highlight: 'วัดผาตากเสื้อ' }, { name: 'เลย', desc: 'เชียงคาน', highlight: 'เชียงคาน' }, { name: 'บุรีรัมย์', desc: 'พนมรุ้ง', highlight: 'สนามช้างอารีน่า' }, { name: 'สุรินทร์', desc: 'ช้าง', highlight: 'หมู่บ้านช้าง' }, { name: 'ศรีสะเกษ', desc: 'ผามออีแดง', highlight: 'ผามออีแดง' }, { name: 'สกลนคร', desc: 'หนองหาร', highlight: 'วัดพระธาตุเชิงชุม' }, { name: 'นครพนม', desc: 'พระธาตุพนม', highlight: 'พญาศรีสัตตนาคราช' }, { name: 'มุกดาหาร', desc: 'หอแก้ว', highlight: 'หอแก้ว' }, { name: 'ยโสธร', desc: 'บั้งไฟ', highlight: 'พญาคันคาก' }, { name: 'ร้อยเอ็ด', desc: 'บึงพลาญชัย', highlight: 'เจดีย์มหามงคลบัว' }, { name: 'กาฬสินธุ์', desc: 'ไดโนเสาร์', highlight: 'พิพิธภัณฑ์สิรินธร' }, { name: 'มหาสารคาม', desc: 'สะดืออีสาน', highlight: 'พระธาตุนาดูน' }, { name: 'ชัยภูมิ', desc: 'ทุ่งดอกกระเจียว', highlight: 'มอหินขาว' }, { name: 'อำนาจเจริญ', desc: 'พระมงคล', highlight: 'พุทธอุทยาน' }, { name: 'หนองบัวลำภู', desc: 'ถ้ำเอราวัณ', highlight: 'วัดถ้ำกลองเพล' }, { name: 'บึงกาฬ', desc: 'ภูทอก', highlight: 'ถ้ำนาคา' }] },
  central: { name: 'ภาคกลาง (22)', color: 'bg-yellow-100 text-yellow-800', provinces: [{ name: 'กรุงเทพมหานคร', desc: 'วัดพระแก้ว', highlight: 'วัดอรุณฯ' }, { name: 'พระนครศรีอยุธยา', desc: 'เมืองเก่า', highlight: 'วัดมหาธาตุ' }, { name: 'สระบุรี', desc: 'น้ำตก', highlight: 'น้ำตกเจ็ดสาวน้อย' }, { name: 'ลพบุรี', desc: 'ลิง', highlight: 'พระปรางค์สามยอด' }, { name: 'สิงห์บุรี', desc: 'บางระจัน', highlight: 'วัดพิกุลทอง' }, { name: 'ชัยนาท', desc: 'สวนนก', highlight: 'เขื่อนเจ้าพระยา' }, { name: 'อ่างทอง', desc: 'ตุ๊กตาชาววัง', highlight: 'วัดม่วง' }, { name: 'นครสวรรค์', desc: 'ปากน้ำโพ', highlight: 'บึงบอระเพ็ด' }, { name: 'อุทัยธานี', desc: 'วัดท่าซุง', highlight: 'วัดท่าซุง' }, { name: 'กำแพงเพชร', desc: 'กล้วยไข่', highlight: 'น้ำตกคลองลาน' }, { name: 'สุโขทัย', desc: 'มรดกโลก', highlight: 'อุทยานประวัติศาสตร์' }, { name: 'พิษณุโลก', desc: 'พระพุทธชินราช', highlight: 'วัดพระศรีรัตนมหาธาตุ' }, { name: 'พิจิตร', desc: 'ชาละวัน', highlight: 'บึงสีไฟ' }, { name: 'เพชรบูรณ์', desc: 'เขาค้อ', highlight: 'เขาค้อ' }, { name: 'สุพรรณบุรี', desc: 'มังกร', highlight: 'บึงฉวาก' }, { name: 'นครปฐม', desc: 'เจดีย์', highlight: 'องค์พระปฐมเจดีย์' }, { name: 'สมุทรสาคร', desc: 'มหาชัย', highlight: 'ตลาดทะเลไทย' }, { name: 'สมุทรสงคราม', desc: 'อัมพวา', highlight: 'ตลาดร่มหุบ' }, { name: 'นนทบุรี', desc: 'เกาะเกร็ด', highlight: 'เกาะเกร็ด' }, { name: 'ปทุมธานี', desc: 'เมืองบัว', highlight: 'วัดเจดีย์หอย' }, { name: 'สมุทรปราการ', desc: 'ปากน้ำ', highlight: 'บางกระเจ้า' }, { name: 'นครนายก', desc: 'เขื่อน', highlight: 'เขื่อนขุนด่านฯ' }] },
  east: { name: 'ภาคตะวันออก (7)', color: 'bg-blue-100 text-blue-800', provinces: [{ name: 'ชลบุรี', desc: 'พัทยา', highlight: 'เกาะล้าน' }, { name: 'ระยอง', desc: 'เสม็ด', highlight: 'สวนผลไม้' }, { name: 'จันทบุรี', desc: 'เนินนางพญา', highlight: 'จุดชมวิวเนินนางพญา' }, { name: 'ตราด', desc: 'เกาะช้าง', highlight: 'เกาะกูด' }, { name: 'ฉะเชิงเทรา', desc: 'หลวงพ่อโสธร', highlight: 'วัดโสธรวราราม' }, { name: 'ปราจีนบุรี', desc: 'ล่องแก่ง', highlight: 'แก่งหินเพิง' }, { name: 'สระแก้ว', desc: 'โรงเกลือ', highlight: 'ละลุ' }] },
  west: { name: 'ภาคตะวันตก (5)', color: 'bg-amber-100 text-amber-800', provinces: [{ name: 'กาญจนบุรี', desc: 'สะพานมอญ', highlight: 'สังขละบุรี' }, { name: 'ตาก', desc: 'ทีลอซู', highlight: 'น้ำตกทีลอซู' }, { name: 'ประจวบคีรีขันธ์', desc: 'หัวหิน', highlight: 'อ่าวมะนาว' }, { name: 'เพชรบุรี', desc: 'ชะอำ', highlight: 'หาดชะอำ' }, { name: 'ราชบุรี', desc: 'สวนผึ้ง', highlight: 'สวนผึ้ง' }] },
  south: { name: 'ภาคใต้ (14)', color: 'bg-cyan-100 text-cyan-800', provinces: [{ name: 'ภูเก็ต', desc: 'แหลมพรหมเทพ', highlight: 'แหลมพรหมเทพ' }, { name: 'สุราษฎร์ธานี', desc: 'สมุย', highlight: 'เขื่อนเชี่ยวหลาน' }, { name: 'นครศรีธรรมราช', desc: 'ไอ้ไข่', highlight: 'วัดเจดีย์ (ไอ้ไข่)' }, { name: 'สงขลา', desc: 'หาดใหญ่', highlight: 'นางเงือกทอง' }, { name: 'กระบี่', desc: 'พีพี', highlight: 'สระมรกต' }, { name: 'พังงา', desc: 'เสม็ดนางชี', highlight: 'หมู่เกาะสิมิลัน' }, { name: 'ตรัง', desc: 'หมูย่าง', highlight: 'ถ้ำมรกต' }, { name: 'สตูล', desc: 'หลีเป๊ะ', highlight: 'เกาะหลีเป๊ะ' }, { name: 'ชุมพร', desc: 'หาดทรายรี', highlight: 'หาดทรายรี' }, { name: 'ระนอง', desc: 'บ่อน้ำร้อน', highlight: 'ภูเขาหญ้า' }, { name: 'พัทลุง', desc: 'ทะเลน้อย', highlight: 'ทะเลน้อย' }, { name: 'ยะลา', desc: 'เบตง', highlight: 'Skywalk อัยเยอร์เวง' }, { name: 'ปัตตานี', desc: 'มัสยิดกลาง', highlight: 'มัสยิดกลาง' }, { name: 'นราธิวาส', desc: 'น้ำตก', highlight: 'น้ำตกปาโจ' }] }
};

// --- STATS DATA ---
const TOURISM_STATS = [
  { province: 'กรุงเทพมหานคร', visitors: '22.5M', score: 98, color: 'bg-blue-500' },
  { province: 'ภูเก็ต', visitors: '14.2M', score: 85, color: 'bg-teal-500' },
  { province: 'ชลบุรี (พัทยา)', visitors: '12.8M', score: 78, color: 'bg-indigo-500' },
  { province: 'เชียงใหม่', visitors: '10.5M', score: 72, color: 'bg-green-500' },
  { province: 'สุราษฎร์ธานี', visitors: '8.9M', score: 65, color: 'bg-orange-500' },
];

const DREAM_DESTINATIONS = [
  { id: 1, name: 'คัปปาโดเกีย', location: 'ตุรกี', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=500', desc: 'ดินแดนบอลลูนสีสวย' },
  { id: 2, name: 'ซานโตรินี', location: 'กรีซ', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500', desc: 'เกาะสวรรค์สีขาวฟ้า' },
  { id: 3, name: 'มัลดีฟส์', location: 'มัลดีฟส์', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500', desc: 'ทะเลสีครามสุดพักผ่อน' },
  { id: 4, name: 'แสงเหนือ', location: 'ไอซ์แลนด์', image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=500', desc: 'มหัศจรรย์น่านฟ้า' },
  { id: 5, name: 'ฮัลล์สตัทท์', location: 'ออสเตรีย', image: 'https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?w=500', desc: 'หมู่บ้านริมน้ำสุดสวย' },
];

// --- INITIAL MOCK DATA ---
const INITIAL_USERS = [
  { id: 1, username: 'traveler1', password: '123', role: 'traveler', name: 'นักเดินทาง Alex', status: 'verified', bio: 'ชอบภูเขาและกาแฟ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel', verifyRequest: '', joinedAt: '2024-01-15' },
  { id: 2, username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี', status: 'pending', bio: 'ประสบการณ์ 10 ปี เชี่ยวชาญทะเลใต้', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Line: @somsri', verifyRequest: 'ดิฉันเป็นไกด์ท้องถิ่นภูเก็ต ใบอนุญาตเลขที่ 123456 อยากเข้าร่วมแพลตฟอร์มค่ะ', joinedAt: '2024-02-01' },
  { id: 3, username: 'admin', password: '123', role: 'admin', name: 'Admin', status: 'verified', image: '', bio: 'System Admin', contact: '', verifyRequest: '', joinedAt: '2023-12-01' }
];

const INITIAL_POSTS = [
  { 
    id: 1, 
    title: '🔥 โปรฯ ภูเก็ต 3 วัน 2 คืน (พักศรีพันวา)', 
    location: 'ภูเก็ต', 
    gps: '7.8804, 98.3923',
    date: '2026-04-12', 
    maxPeople: 20,
    desc: 'แพ็คเกจสุดคุ้มรวมที่พัก อาหารเช้า และทัวร์เกาะพีพีโดยเรือสปีดโบ๊ท VIP',
    author: 'ไกด์สมศรี', 
    type: 'trip', 
    media: 'https://images.unsplash.com/photo-1589394815804-989b3b785d51?w=600', 
    chat: [], 
    likes: 342, 
    price: 4990, 
    participants: [] 
  },
  { 
    id: 2, 
    title: 'หาเพื่อนเดินตลาดน้ำอัมพวา เสาร์นี้! 🚣', 
    location: 'สมุทรสงคราม', 
    gps: '13.4258, 99.9554',
    date: '2026-02-20',
    maxPeople: 5,
    desc: 'เน้นหาของกิน ถ่ายรูปชิลๆ หารค่าน้ำมันกันครับ ออกเดินทางจากอนุสาวรีย์ฯ 9 โมงเช้า',
    author: 'นักเดินทาง Alex', 
    type: 'trip', 
    media: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600', 
    chat: [{sender: 'ไกด์สมศรี', text: 'ไปกี่โมงคะ สนใจๆ', time: '10:00'}], 
    likes: 12, 
    price: 0, 
    participants: ['นักเดินทาง Alex'] 
  },
  { 
    id: 3, 
    title: 'Vlog: เชียงใหม่หน้าฝน 🌧️', 
    location: 'เชียงใหม่', 
    author: 'นักเดินทาง Alex', 
    type: 'video', 
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
    desc: 'พาไปดูนาขั้นบันไดที่ป่าบงเปียง สวยมากกก',
    chat: [], 
    likes: 88, 
    price: 0, 
    participants: [] 
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 101, from: 'นักเดินทาง Alex', to: 'ไกด์สมศรี', amount: 4990, date: '2024-02-15', status: 'pending', slip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200', postId: 1, title: 'โปรฯ ภูเก็ต 3 วัน 2 คืน' }
];

// --- 4. HELPER COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = { primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md", secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50", success: "bg-green-600 text-white hover:bg-green-700 shadow-md", danger: "bg-red-50 text-red-600 hover:bg-red-100", outline: "border border-blue-600 text-blue-600 hover:bg-blue-50" };
  return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>{children}</button>;
};
const Card = ({ children, className = '', onClick }) => <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer ${className}`}>{children}</div>;
const Badge = ({ status }) => {
  const styles = { verified: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', active: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', approved: 'bg-green-100 text-green-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'}`}>{status === 'approved' ? 'อนุมัติแล้ว' : status === 'pending' ? 'รอตรวจสอบ' : status === 'verified' ? 'ยืนยันแล้ว' : status}</span>;
};
const calculateCountdown = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  if (diff < 0) return "ออกเดินทางแล้ว";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `อีก ${days} วัน จะถึงวันเดินทาง`;
};

// --- 5. MAIN SUB-COMPONENTS ---
const TripDetailModal = ({ post, user, onClose, onJoin, onChat, usersDb }) => {
  const countdown = calculateCountdown(post.date);
  const isJoined = post.participants.includes(user.name);
  const participantAvatars = post.participants.map(name => {
    const u = usersDb.find(u => u.name === name);
    return u?.image || `https://ui-avatars.com/api/?name=${name}`;
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="h-48 relative bg-gray-200">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full z-10"><XCircle /></button>
          {post.type === 'video' ? (
             <div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white w-12 h-12 opacity-50"/></div>
          ) : (
             <img src={post.media} className="w-full h-full object-cover" />
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white">{post.title}</h2>
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div><div className="text-xs text-blue-600 font-bold uppercase tracking-wider">สถานะทริป</div><div className="font-bold text-gray-800">{countdown || "ยังไม่ระบุวัน"}</div></div>
            {post.price > 0 && <div className="text-right font-bold text-blue-600 text-xl">฿{post.price.toLocaleString()}</div>}
          </div>
          <div><h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Info className="w-4 h-4"/> รายละเอียด</h3><p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{post.desc}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3 rounded-xl"><div className="text-xs text-gray-400">สถานที่</div><div className="text-sm font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500"/>{post.location}</div></div>
            <div className="border p-3 rounded-xl"><div className="text-xs text-gray-400">พิกัด GPS</div><div className="text-sm font-bold flex items-center gap-1"><Navigation className="w-3 h-3 text-blue-500"/>{post.gps}</div></div>
          </div>
          <div><div className="flex justify-between text-sm font-bold mb-2"><span>ผู้เข้าร่วม ({post.participants.length}/{post.maxPeople || 'ไม่จำกัด'})</span></div><div className="flex -space-x-2">{participantAvatars.map((img, i) => (<img key={i} className="h-8 w-8 rounded-full border-2 border-white object-cover" src={img} />))}</div></div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onChat}><MessageSquare className="w-4 h-4"/> แชท</Button>
          {!isJoined ? <Button className="flex-[2]" onClick={onJoin}>{post.price > 0 ? 'จองทริป' : 'เข้าร่วมฟรี'}</Button> : <Button variant="success" className="flex-[2]"><CheckCircle className="w-4 h-4"/> เข้าร่วมแล้ว</Button>}
        </div>
      </div>
    </div>
  );
};

const TourismInsights = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div><h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2"><Compass className="text-blue-600 w-8 h-8"/> เกี่ยวกับ TripbuddyTH</h2><p className="text-gray-500 leading-relaxed">แพลตฟอร์มท่องเที่ยวครบวงจร เชื่อมต่อนักเดินทางและไกด์ท้องถิ่น</p></div>
        <div className="grid grid-cols-3 gap-4"><div className="bg-blue-50 p-4 rounded-xl text-center"><Users className="w-6 h-6 text-blue-600 mx-auto mb-2"/><div className="text-2xl font-bold text-blue-800">12K+</div><div className="text-xs text-blue-600">ผู้ใช้งาน</div></div><div className="bg-green-50 p-4 rounded-xl text-center"><Map className="w-6 h-6 text-green-600 mx-auto mb-2"/><div className="text-2xl font-bold text-green-800">850+</div><div className="text-xs text-green-600">ทริป</div></div><div className="bg-orange-50 p-4 rounded-xl text-center"><Star className="w-6 h-6 text-orange-600 mx-auto mb-2"/><div className="text-2xl font-bold text-orange-800">4.8</div><div className="text-xs text-orange-600">รีวิว</div></div></div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600"/> 5 อันดับจังหวัดยอดฮิต</h3><div className="space-y-4">{TOURISM_STATS.map((item, index) => (<div key={index} className="space-y-1"><div className="flex justify-between text-sm"><span className="font-medium text-gray-700 flex items-center gap-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${index < 3 ? 'bg-yellow-400' : 'bg-gray-400'}`}>{index + 1}</span>{item.province}</span><span className="text-gray-500 text-xs">{item.visitors}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div></div></div>))}</div></div>
    </div>
  </div>
);

const DreamDestinations = () => (
  <div className="mb-8"><h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2"><Plane className="w-6 h-6 text-sky-500"/> Dream Destinations</h3><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">{DREAM_DESTINATIONS.map((p,i)=>(<div key={i} className="flex-shrink-0 w-60 bg-white rounded-xl shadow-sm overflow-hidden snap-center group border hover:shadow-md transition-all"><div className="h-32 overflow-hidden relative"><img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {p.location}</div></div><div className="p-3"><div className="font-bold text-sm truncate">{p.name}</div><div className="text-xs text-gray-500 mt-1 line-clamp-1">{p.desc}</div></div></div>))}</div></div>
);

const ChatRoom = ({ trip, currentUser, onBack, onSendMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [trip.chat]);
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col md:relative md:h-[600px] md:rounded-xl md:shadow-xl md:border md:overflow-hidden">
      <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center z-10"><div className="flex items-center gap-3"><button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">←</button><div className="w-10 h-10 rounded-full overflow-hidden border">{trip.type === 'video' ? <div className="bg-red-100 w-full h-full flex items-center justify-center"><Video className="text-red-500"/></div> : <img src={trip.media} className="w-full h-full object-cover" />}</div><div><h3 className="font-bold text-gray-800 line-clamp-1 text-sm md:text-base">{trip.title}</h3><p className="text-xs text-green-600 flex items-center gap-1">● ออนไลน์</p></div></div></div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">{trip.chat.map((msg, i) => { const isMe = msg.sender === currentUser.name; return (<div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}><div className={`flex max-w-[80%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>{!isMe && <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 border border-white">{msg.sender[0]}</div>}<div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>{!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender}</span>}<div className={`px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>{msg.text}</div><span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span></div></div></div>); })}</div>
      <div className="p-3 bg-white border-t flex items-center gap-2 pb-safe"><input type="text" className="flex-1 bg-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="พิมพ์ข้อความ..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} /><button onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} className={`p-3 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}><Send className="w-5 h-5"/></button></div>
    </div>
  );
};

const MyActivity = ({ user, posts, transactions }) => {
  const myTrips = posts.filter(p => p.author === user.name || p.participants.includes(user.name));
  const myTrans = transactions.filter(t => t.from === user.name);
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><CalendarCheck className="w-8 h-8 text-purple-600"/> ประวัติและกิจกรรมของฉัน</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div><h3 className="font-bold text-lg mb-4 text-gray-700">ทริปที่เข้าร่วม/สร้าง ({myTrips.length})</h3>{myTrips.map(trip => (<div key={trip.id} className="bg-white p-4 rounded-xl border mb-3 shadow-sm flex gap-3"><div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">{trip.type==='video'?<div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white w-6 h-6"/></div>:<img src={trip.media} className="w-full h-full object-cover"/>}</div><div className="flex-1"><div className="font-bold line-clamp-1">{trip.title}</div><div className="text-xs text-gray-500 mb-1">{trip.date || 'ไม่ระบุ'} • {trip.location}</div><Badge status={trip.participants.includes(user.name) ? 'active' : 'pending'} /></div></div>))}</div>
        <div><h3 className="font-bold text-lg mb-4 text-gray-700">ประวัติการชำระเงิน ({myTrans.length})</h3>{myTrans.map(t => (<div key={t.id} className="bg-white p-4 rounded-xl border mb-3 shadow-sm flex justify-between items-center"><div><div className="font-bold">฿{t.amount.toLocaleString()}</div><div className="text-xs text-gray-500">{t.date} → {t.to}</div></div><Badge status={t.status} /></div>))}</div>
      </div>
    </div>
  );
};

const AdminPanel = ({ users, transactions, onVerifyUser, onDeleteUser, onApprovePayment }) => {
  const [tab, setTab] = useState('users');
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2"><button onClick={() => setTab('users')} className={`px-4 py-2 rounded-full ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>ลูกค้า</button><button onClick={() => setTab('verify')} className={`px-4 py-2 rounded-full ${tab === 'verify' ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>คำขอ</button><button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-full ${tab === 'payments' ? 'bg-green-600 text-white' : 'bg-white border'}`}>การเงิน</button></div>
      {tab === 'users' && <div className="bg-white rounded-xl border overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y">{users.map(u => (<tr key={u.id}><td className="p-3 flex items-center gap-2"><img src={u.image||"https://ui-avatars.com/api/?name="+u.name} className="w-6 h-6 rounded-full"/>{u.name}</td><td className="p-3">{u.role}</td><td className="p-3"><Badge status={u.status}/></td><td className="p-3">{u.role!=='admin'&&<button onClick={()=>onDeleteUser(u.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>}</td></tr>))}</tbody></table></div>}
      {tab === 'verify' && <div className="space-y-4">{users.filter(u => u.status === 'pending').map(u => (<div key={u.id} className="bg-white p-4 border rounded-xl shadow-sm"><div className="font-bold mb-2">{u.name} ({u.role})</div><div className="text-sm bg-gray-50 p-2 rounded italic mb-3">"{u.verifyRequest}"</div><div className="flex gap-2"><Button onClick={() => onVerifyUser(u.id, 'rejected')} variant="danger" className="text-xs">ปัดตก</Button><Button onClick={() => onVerifyUser(u.id, 'verified')} variant="success" className="text-xs">อนุมัติ</Button></div></div>))}</div>}
      {tab === 'payments' && <div className="space-y-4">{transactions.filter(t => t.status === 'pending').map(t => (<div key={t.id} className="bg-white p-4 border rounded-xl shadow-sm"><div className="flex justify-between mb-2"><div><div className="font-bold text-blue-600">฿{t.amount}</div><div className="text-xs">{t.from}</div></div><div className="text-xs text-gray-500">{t.date}</div></div><Button onClick={() => onApprovePayment(t.id, t.from, t.postId)} variant="success" className="w-full text-xs">ยืนยันยอด</Button></div>))}</div>}
    </div>
  );
};

const AuthScreen = ({ view, setView, loginForm, setLoginForm, regForm, setRegForm, handleLogin, handleRegister, notification }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div className="text-center mb-6"><div className="inline-block mb-2"><Logo className="w-20 h-20 drop-shadow-md"/></div><h1 className="text-2xl font-bold text-gray-800">TripbuddyTH</h1></div>
      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4"><input required placeholder="ชื่อผู้ใช้" className="w-full border p-3 rounded-lg" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} /><input required type="password" placeholder="รหัสผ่าน" className="w-full border p-3 rounded-lg" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} /><Button type="submit" className="w-full py-3">เข้าสู่ระบบ</Button><div className="text-center text-sm text-gray-500 mt-2">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('register')}>สมัครสมาชิก</span></div></form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">{notification && <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{notification.message}</div>}<input required placeholder="ชื่อผู้ใช้" className="w-full border p-3 rounded-lg" value={regForm.username || ''} onChange={e => setRegForm({...regForm, username: e.target.value})} /><div className="grid grid-cols-2 gap-3"><input required type="password" placeholder="รหัสผ่าน" className="w-full border p-3 rounded-lg" value={regForm.password || ''} onChange={e => setRegForm({...regForm, password: e.target.value})} /><input required type="password" placeholder="ยืนยันรหัส" className="w-full border p-3 rounded-lg" value={regForm.confirmPassword || ''} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} /></div><input required placeholder="ชื่อที่แสดง" className="w-full border p-3 rounded-lg" value={regForm.name || ''} onChange={e => setRegForm({...regForm, name: e.target.value})} /><div className="flex gap-2"><button type="button" onClick={() => setRegForm({...regForm, role: 'traveler'})} className={`flex-1 py-3 border rounded-lg ${regForm.role === 'traveler' ? 'bg-blue-50 border-blue-500' : ''}`}>นักเดินทาง</button><button type="button" onClick={() => setRegForm({...regForm, role: 'guide'})} className={`flex-1 py-3 border rounded-lg ${regForm.role === 'guide' ? 'bg-green-50 border-green-500' : ''}`}>ไกด์</button></div><Button type="submit" className="w-full py-3">สมัครสมาชิก</Button><div className="text-center text-sm text-gray-500 mt-2">มีบัญชีแล้ว? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('login')}>เข้าสู่ระบบ</span></div></form>
      )}
    </div>
  </div>
);

// --- SIDEBAR ---
const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout, setView }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-14 h-14 rounded-full bg-white/20 p-1"><img src={user.image || "https://ui-avatars.com/api/?name=" + user.name} className="w-full h-full rounded-full object-cover bg-white"/></div>
             <div><div className="font-bold text-lg truncate w-40 flex items-center gap-1">{user.name} {user.status === 'verified' && <CheckCircle className="w-4 h-4 text-blue-200 fill-blue-500" />}</div><div className="text-xs text-blue-200 uppercase tracking-wider">{user.role}</div></div>
          </div>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"><div className="bg-blue-100 p-2 rounded-lg"><Edit className="w-5 h-5 text-blue-600" /></div> แก้ไขโปรไฟล์</button>
          <button onClick={() => { setView('my_activity'); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl text-gray-700 transition-colors"><div className="bg-purple-100 p-2 rounded-lg"><CalendarCheck className="w-5 h-5 text-purple-600" /></div> ประวัติการจอง & ทริป</button>
          {user.role === 'admin' && <button onClick={() => { setView('admin'); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700 transition-colors"><Database className="w-5 h-5 text-orange-600" /> ระบบหลังบ้าน (Admin)</button>}
        </div>
        <div className="p-4 border-t"><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 transition-colors"><LogOut className="w-5 h-5" /> ออกจากระบบ</button></div>
      </div>
    </>
  );
};

const ProfileModal = ({ user, onClose, onSave }) => {
  const [tab, setTab] = useState('info');
  const [formData, setFormData] = useState({ ...user });
  const [verifyText, setVerifyText] = useState(user.verifyRequest || '');
  const handleVerifySubmit = () => { if(!verifyText.trim()) return alert("กรอกข้อมูลให้ครบ"); onSave({ ...formData, verifyRequest: verifyText, status: 'pending' }); alert("ส่งตรวจสอบแล้ว"); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4"><button onClick={() => setTab('info')} className={`flex-1 py-1.5 text-sm font-bold rounded-md ${tab === 'info' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>ข้อมูลส่วนตัว</button><button onClick={() => setTab('verify')} className={`flex-1 py-1.5 text-sm font-bold rounded-md ${tab === 'verify' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>ยืนยันตัวตน</button></div>
      {tab === 'info' ? (
        <div className="space-y-3"><div className="flex justify-center mb-4"><div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md"><img src={formData.image || "https://ui-avatars.com/api/?name="+formData.name} className="w-full h-full object-cover"/></div></div><input className="w-full border p-2 rounded-lg" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /><input className="w-full border p-2 rounded-lg" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="URL รูป" /><textarea className="w-full border p-2 rounded-lg h-20" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} /><input className="w-full border p-2 rounded-lg" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="ติดต่อ" /><Button onClick={() => onSave(formData)} className="w-full mt-4">บันทึก</Button></div>
      ) : (
        <div className="text-center space-y-4">{formData.status === 'verified' ? <div className="text-green-600 py-6"><ShieldCheck className="w-16 h-16 mx-auto mb-2"/><h3>ยืนยันแล้ว</h3></div> : formData.status === 'pending' ? <div className="text-yellow-600 py-6"><Loader className="w-16 h-16 mx-auto mb-2 animate-spin"/><h3>รอตรวจสอบ</h3></div> : <><textarea className="w-full border p-3 rounded-lg h-32" placeholder="พิมพ์ประวัติ..." value={verifyText} onChange={e => setVerifyText(e.target.value)} /><Button onClick={handleVerifySubmit} variant="success" className="w-full">ส่งตรวจสอบ</Button></>}</div>
      )}
    </div>
  );
};

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

// --- CORE LOGIC (APP COMPONENT) ---
export default function App() {
  const [dbUsers, setDbUsers] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('landing');
  const [activeTripDetail, setActiveTripDetail] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [newItem, setNewItem] = useState({});
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', name: '', role: 'traveler', password: '', confirmPassword: '' });
  const [notification, setNotification] = useState(null);

  // Persistence V14
  useEffect(() => {
    const s = localStorage.getItem('tb_session_v14'); if (s) setCurrentUser(JSON.parse(s));
    const u = localStorage.getItem('tb_users_v14'); if (u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts_v14'); if (p) setPosts(JSON.parse(p));
    const t = localStorage.getItem('tb_trans_v14'); if (t) setTransactions(JSON.parse(t));
  }, []);
  useEffect(() => { localStorage.setItem('tb_users_v14', JSON.stringify(dbUsers)); }, [dbUsers]);
  useEffect(() => { localStorage.setItem('tb_posts_v14', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('tb_trans_v14', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { if (currentUser) { localStorage.setItem('tb_session_v14', JSON.stringify(currentUser)); if(view==='landing') setView(currentUser.role==='admin'?'admin':'dashboard'); } else { localStorage.removeItem('tb_session_v14'); } }, [currentUser]);

  // Handlers
  const handleLogin = (e) => { e.preventDefault(); const u = dbUsers.find(x => x.username === loginForm.username && x.password === loginForm.password); if (u) setCurrentUser(u); else alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); };
  const handleRegister = (e) => { e.preventDefault(); if (regForm.password !== regForm.confirmPassword) return setNotification({ message: 'รหัสผ่านไม่ตรงกัน', type: 'error' }); setDbUsers([...dbUsers, { ...regForm, id: Date.now(), status: 'verified', joinedAt: new Date().toLocaleDateString() }]); setView('login'); setNotification({ message: 'สมัครสมาชิกสำเร็จ!', type: 'success' }); };
  const handleLogout = () => { setCurrentUser(null); setView('landing'); setActiveTripDetail(null); setActiveChat(null); };
  const handleJoin = (post) => {
    if (post.participants.includes(currentUser.name)) return alert("คุณเข้าร่วมแล้ว");
    if (post.price > 0) return setModal({ open: true, type: 'payment', data: post });
    const updated = posts.map(p => p.id === post.id ? { ...p, participants: [...p.participants, currentUser.name] } : p);
    setPosts(updated); setActiveTripDetail({ ...post, participants: [...post.participants, currentUser.name] });
  };
  const handleApprovePayment = (tid, userName, pid) => {
    setTransactions(transactions.map(t => t.id === tid ? { ...t, status: 'approved' } : t));
    setPosts(posts.map(p => p.id === pid ? { ...p, participants: [...p.participants, userName] } : p));
  };

  const verifyUser = (id, status) => { setDbUsers(dbUsers.map(u => u.id === id ? { ...u, status } : u)); };
  const deleteUser = (id) => { if(confirm('ลบ?')) setDbUsers(dbUsers.filter(u => u.id !== id)); };

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={() => setModal({open: false})} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle/></button>
        {modal.type === 'profile' && <ProfileModal user={currentUser} onClose={() => setModal({open: false})} onSave={(d) => { setDbUsers(dbUsers.map(u => u.id === currentUser.id ? d : u)); setCurrentUser(d); setModal({ open: false }); }} />}
        {modal.type === 'payment' && (
          <div className="space-y-4 text-center">
            <div className="bg-blue-50 p-4 rounded-xl mb-2"><h3 className="font-bold text-gray-800">{modal.data.title}</h3><div className="text-2xl font-bold text-blue-600 mt-2">฿{(modal.data.price).toLocaleString()}</div></div>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-500"><UploadCloud className="w-10 h-10 mb-2"/> <span className="text-sm">แนบสลิป</span></div>
            <Button onClick={() => { setTransactions([...transactions, { id: Date.now(), from: currentUser.name, amount: modal.data.price, postId: modal.data.id, to: modal.data.author, status: 'pending', date: new Date().toLocaleDateString() }]); setModal({ open: false }); setActiveTripDetail(null); alert('แจ้งชำระเงินแล้ว!'); }} variant="success" className="w-full">แจ้งโอนเงิน</Button>
          </div>
        )}
        {modal.type === 'create_post' && (
          <div className="space-y-4">
             <h3 className="font-bold text-xl">สร้างทริปใหม่</h3>
             <div className="flex gap-2"><button onClick={() => setNewItem({...newItem, type: 'video'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'video' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-gray-50'}`}><Video/> คลิป</button><button onClick={() => setNewItem({...newItem, type: 'trip'})} className={`flex-1 p-3 border rounded-xl flex flex-col items-center gap-2 ${newItem.type === 'trip' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}><Map/> ทริป</button></div>
             <input className="w-full border p-2 rounded-lg" placeholder="หัวข้อ" value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} />
             <input className="w-full border p-2 rounded-lg" placeholder="สถานที่" value={newItem.location || ''} onChange={e => setNewItem({...newItem, location: e.target.value})} />
             {newItem.type === 'trip' && (<><input className="w-full border p-2 rounded-lg" type="date" value={newItem.date || ''} onChange={e => setNewItem({...newItem, date: e.target.value})} /><input className="w-full border p-2 rounded-lg" placeholder="GPS" value={newItem.gps || ''} onChange={e => setNewItem({...newItem, gps: e.target.value})} /><input className="w-full border p-2 rounded-lg" type="number" placeholder="จำนวนคนสูงสุด" value={newItem.maxPeople || ''} onChange={e => setNewItem({...newItem, maxPeople: e.target.value})} /></>)}
             <input className="w-full border p-2 rounded-lg" type="number" placeholder="ราคา (ใส่ 0 หากฟรี)" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} />
             <textarea className="w-full border p-2 rounded-lg h-24" placeholder="รายละเอียด" value={newItem.desc || ''} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
             <input className="w-full border p-2 rounded-lg" placeholder="URL รูป" value={newItem.media || ''} onChange={e => setNewItem({...newItem, media: e.target.value})} />
             <Button onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0, participants: [], type: 'trip' }, ...posts]); setModal({open: false}); }}>โพสต์เลย</Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!currentUser) return <AuthScreen view={view} setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} notification={notification} />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-20">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
           <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => { setView('dashboard'); setActiveChat(null); setActiveTripDetail(null); }}>
              <Logo className="w-8 h-8"/> <span className="hidden sm:inline">TripbuddyTH</span>
           </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setModal({open: true, type: 'profile'})}>
           <div className="text-right hidden sm:block"><div className="font-bold text-sm flex items-center justify-end gap-1">{currentUser.name} {currentUser.status === 'verified' && <CheckCircle className="w-3 h-3 text-blue-500"/>}</div><div className="text-xs text-gray-500 capitalize">{currentUser.role}</div></div>
           <div className="w-10 h-10 rounded-full border bg-gray-200 overflow-hidden"><img src={currentUser.image || "https://ui-avatars.com/api/?name="+currentUser.name} className="w-full h-full object-cover"/></div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={() => setModal({open: true, type: 'profile'})} onLogout={handleLogout} setView={setView} />

      <main className="max-w-5xl mx-auto p-4 mt-4">
        {currentUser.role === 'admin' && view === 'admin' ? (
           <AdminPanel users={dbUsers} transactions={transactions} onVerifyUser={verifyUser} onDeleteUser={deleteUser} onApprovePayment={handleApprovePayment} />
        ) : view === 'my_activity' ? (
           <MyActivity user={currentUser} posts={posts} transactions={transactions} />
        ) : activeChat ? (
           <ChatRoom trip={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} onSendMessage={(t) => { const msg = { sender: currentUser.name, text: t, time: 'Now' }; setPosts(posts.map(p => p.id === activeChat.id ? { ...p, chat: [...p.chat, msg] } : p)); setActiveChat({...activeChat, chat: [...activeChat.chat, msg]}); }} />
        ) : (
           view === 'discovery' ? (
             <div><button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 hover:text-blue-600 flex items-center gap-1 font-bold">← กลับหน้าหลัก</button><ThailandDiscovery /></div>
           ) : (
             <div className="space-y-6 animate-in fade-in duration-500">
               <TourismInsights />
               <DreamDestinations />
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 <button onClick={() => setView('discovery')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center"><Map className="w-6 h-6 mb-1"/> <span className="font-bold">77 จังหวัด</span></button>
                 <button onClick={() => setModal({open: true, type: 'create_post'})} className="flex-shrink-0 w-36 h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-all flex flex-col items-center justify-center"><PlusCircle className="w-6 h-6 mb-1"/> <span className="font-bold">สร้างทริป</span></button>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                 {posts.map(post => (
                   <Card key={post.id} className="group hover:shadow-md transition-shadow" onClick={() => setActiveTripDetail(post)}>
                     <div className="p-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-full h-full object-cover"/></div><div className="flex-1"><div className="text-sm font-bold text-gray-800">{post.author}</div><div className="text-xs text-gray-500">{post.type === 'video' ? 'Video Clip' : 'Trip Event'}</div></div></div>
                     {post.type === 'video' ? <div className="aspect-video bg-black pointer-events-none"><iframe src={post.media} className="w-full h-full" allowFullScreen></iframe></div> : <div className="h-56 overflow-hidden relative"><img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><h4 className="text-white font-bold text-lg">{post.title}</h4></div></div>}
                     <div className="p-3 border-t flex justify-between items-center text-sm text-gray-500">
                        <div className="flex gap-4"><button className="flex items-center gap-1 hover:text-red-500"><Heart className="w-4 h-4"/> {post.likes}</button><button className="flex items-center gap-1 hover:text-blue-500"><MessageSquare className="w-4 h-4"/> {post.chat.length}</button></div>
                        <span className="text-xs text-gray-400">แตะเพื่อดูรายละเอียด</span>
                     </div>
                   </Card>
                 ))}
               </div>
             </div>
           )
        )}
      </main>
      
      {activeTripDetail && <TripDetailModal post={activeTripDetail} user={currentUser} onClose={() => setActiveTripDetail(null)} onChat={() => { setActiveChat(activeTripDetail); setActiveTripDetail(null); }} onJoin={() => handleJoin(activeTripDetail)} usersDb={dbUsers} />}
      {modal.open && renderModal()}
    </div>
  );
}