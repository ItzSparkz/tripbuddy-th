import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Video, Image as ImageIcon, Map, Phone, Lock, 
  Edit, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  LogOut, Send, PlusCircle, Compass, MessageSquare, 
  Heart, Share2, XCircle, CheckCircle, UploadCloud, ShieldCheck, Smartphone,
  Star, Loader, DollarSign, FileText, Trash2, CreditCard, Search,
  BarChart2, Users, AlertCircle, Database, CalendarCheck, Clock, Ticket, Plane,
  Navigation, Calendar, Info, Building, Bus, Briefcase, Tag, FileImage
} from 'lucide-react';

// ==========================================
// 1. ASSETS & HELPERS
// ==========================================

// Logo Component
const Logo = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs><linearGradient id="tripGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#2563EB" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
    <path d="M100 20C65 20 35 45 35 85C35 125 100 190 100 190C100 190 165 125 165 85C165 45 135 20 100 20Z" fill="url(#tripGradient)" />
    <path d="M70 75C70 75 80 95 100 95C120 95 130 75 130 75" stroke="white" strokeWidth="12" strokeLinecap="round" />
    <circle cx="70" cy="65" r="8" fill="white" /><circle cx="130" cy="65" r="8" fill="white" />
  </svg>
);

// UI Components
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = { primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md", secondary: "bg-white text-gray-700 border hover:bg-gray-50", success: "bg-green-600 text-white hover:bg-green-700 shadow-md", danger: "bg-red-50 text-red-600 hover:bg-red-100", outline: "border border-blue-600 text-blue-600 hover:bg-blue-50" };
  return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '', onClick }) => <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer ${className}`}>{children}</div>;

const Badge = ({ status }) => {
  const styles = { verified: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', active: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'}`}>{status === 'approved' ? 'อนุมัติแล้ว' : status === 'pending' ? 'รอตรวจสอบ' : status === 'verified' ? 'ยืนยันแล้ว' : status}</span>;
};

const calculateCountdown = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  if (diff < 0) return "ออกเดินทางแล้ว";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `อีก ${days} วัน`;
};

// File Uploader
const FileUploader = ({ label, onUpload, value, type = 'image' }) => {
  const [uploading, setUploading] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        const mockUrl = type === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'; 
        onUpload(mockUrl);
        alert('อัปโหลดสำเร็จ!');
      }, 1500);
    }
  };
  return (
    <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative"><input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={type === 'video' ? "video/*" : "image/*"} />{uploading ? <div className="flex flex-col items-center text-blue-600"><Loader className="w-8 h-8 animate-spin mb-2"/><span className="text-xs">กำลังอัปโหลด...</span></div> : value ? <div className="flex items-center gap-3 bg-green-50 p-2 rounded-lg border border-green-200"><div className="text-xs text-green-800 font-bold">อัปโหลดสำเร็จ</div></div> : <div className="flex flex-col items-center text-gray-400"><UploadCloud className="w-8 h-8 mb-2"/><span className="text-sm">คลิกเพื่อเลือกไฟล์{type === 'video' ? 'วิดีโอ' : 'รูปภาพ'}</span></div>}</div></div>
  );
};

// --- 2. DATA CONSTANTS (FULL 77 PROVINCES) ---
const THAILAND_DATA = {
  north: {
    name: 'ภาคเหนือ (9)',
    color: 'bg-green-100 text-green-800',
    provinces: [
      { name: 'เชียงใหม่', desc: 'ดอยอินทนนท์ ถนนคนเดิน', highlight: 'ดอยอินทนนท์' },
      { name: 'เชียงราย', desc: 'วัดร่องขุ่น ดอยตุง', highlight: 'วัดร่องขุ่น' },
      { name: 'น่าน', desc: 'กระซิบรัก ดอยเสมอดาว', highlight: 'ดอยเสมอดาว' },
      { name: 'แม่ฮ่องสอน', desc: 'ปางอุ๋ง ทุ่งดอกบัวตอง', highlight: 'ปางอุ๋ง' },
      { name: 'แพร่', desc: 'พระธาตุช่อแฮ แพะเมืองผี', highlight: 'แพะเมืองผี' },
      { name: 'พะเยา', desc: 'กว๊านพะเยา', highlight: 'กว๊านพะเยา' },
      { name: 'ลำปาง', desc: 'เมืองรถม้า', highlight: 'วัดพระธาตุลำปางหลวง' },
      { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย', highlight: 'พระธาตุหริภุญชัย' },
      { name: 'อุตรดิตถ์', desc: 'เมืองลับแล', highlight: 'ภูสอยดาว' }
    ]
  },
  northeast: {
    name: 'ภาคอีสาน (20)',
    color: 'bg-orange-100 text-orange-800',
    provinces: [
      { name: 'นครราชสีมา', desc: 'เขาใหญ่ วังน้ำเขียว', highlight: 'อุทยานแห่งชาติเขาใหญ่' },
      { name: 'ขอนแก่น', desc: 'เมืองไดโนเสาร์', highlight: 'เขื่อนอุบลรัตน์' },
      { name: 'อุดรธานี', desc: 'คำชะโนด ทะเลบัวแดง', highlight: 'คำชะโนด' },
      { name: 'อุบลราชธานี', desc: 'สามพันโบก ผาแต้ม', highlight: 'สามพันโบก' },
      { name: 'หนองคาย', desc: 'บั้งไฟพญานาค', highlight: 'วัดผาตากเสื้อ' },
      { name: 'เลย', desc: 'เชียงคาน ภูกระดึง', highlight: 'เชียงคาน' },
      { name: 'บุรีรัมย์', desc: 'ปราสาทพนมรุ้ง', highlight: 'สนามช้างอารีน่า' },
      { name: 'สุรินทร์', desc: 'ถิ่นช้างใหญ่', highlight: 'หมู่บ้านช้าง' },
      { name: 'ศรีสะเกษ', desc: 'ผามออีแดง', highlight: 'ผามออีแดง' },
      { name: 'สกลนคร', desc: 'เมืองหนองหาร', highlight: 'วัดพระธาตุเชิงชุม' },
      { name: 'นครพนม', desc: 'พระธาตุพนม', highlight: 'พญาศรีสัตตนาคราช' },
      { name: 'มุกดาหาร', desc: 'ตลาดอินโดจีน', highlight: 'หอแก้วมุกดาหาร' },
      { name: 'ยโสธร', desc: 'เมืองบั้งไฟ', highlight: 'พญาคันคาก' },
      { name: 'ร้อยเอ็ด', desc: 'บึงพลาญชัย', highlight: 'เจดีย์มหามงคลบัว' },
      { name: 'กาฬสินธุ์', desc: 'ไดโนเสาร์ภูกุ้มข้าว', highlight: 'พิพิธภัณฑ์สิรินธร' },
      { name: 'มหาสารคาม', desc: 'สะดืออีสาน', highlight: 'พระธาตุนาดูน' },
      { name: 'ชัยภูมิ', desc: 'ทุ่งดอกกระเจียว', highlight: 'มอหินขาว' },
      { name: 'อำนาจเจริญ', desc: 'พระมงคลมิ่งเมือง', highlight: 'พุทธอุทยาน' },
      { name: 'หนองบัวลำภู', desc: 'ถ้ำเอราวัณ', highlight: 'วัดถ้ำกลองเพล' },
      { name: 'บึงกาฬ', desc: 'ภูทอก หินสามวาฬ', highlight: 'ถ้ำนาคา' }
    ]
  },
  central: {
    name: 'ภาคกลาง (22)',
    color: 'bg-yellow-100 text-yellow-800',
    provinces: [
      { name: 'กรุงเทพมหานคร', desc: 'เมืองหลวง วัดพระแก้ว', highlight: 'วัดอรุณฯ' },
      { name: 'พระนครศรีอยุธยา', desc: 'เมืองเก่ามรดกโลก', highlight: 'วัดมหาธาตุ' },
      { name: 'สระบุรี', desc: 'รอยพระพุทธบาท', highlight: 'น้ำตกเจ็ดสาวน้อย' },
      { name: 'ลพบุรี', desc: 'เมืองลิง', highlight: 'พระปรางค์สามยอด' },
      { name: 'สิงห์บุรี', desc: 'วีรชนบางระจัน', highlight: 'วัดพิกุลทอง' },
      { name: 'ชัยนาท', desc: 'สวนนกชัยนาท', highlight: 'เขื่อนเจ้าพระยา' },
      { name: 'อ่างทอง', desc: 'ตุ๊กตาชาววัง', highlight: 'วัดม่วง' },
      { name: 'นครสวรรค์', desc: 'ปากน้ำโพ', highlight: 'บึงบอระเพ็ด' },
      { name: 'อุทัยธานี', desc: 'เมืองพระชนกจักรี', highlight: 'วัดท่าซุง' },
      { name: 'กำแพงเพชร', desc: 'กล้วยไข่เมืองกำแพง', highlight: 'น้ำตกคลองลาน' },
      { name: 'สุโขทัย', desc: 'เมืองเก่าสุโขทัย', highlight: 'อุทยานประวัติศาสตร์' },
      { name: 'พิษณุโลก', desc: 'พระพุทธชินราช', highlight: 'วัดพระศรีรัตนมหาธาตุ' },
      { name: 'พิจิตร', desc: 'เมืองชาละวัน', highlight: 'บึงสีไฟ' },
      { name: 'เพชรบูรณ์', desc: 'เขาค้อ ภูทับเบิก', highlight: 'เขาค้อ' },
      { name: 'สุพรรณบุรี', desc: 'มังกรสวรรค์', highlight: 'บึงฉวาก' },
      { name: 'นครปฐม', desc: 'พระปฐมเจดีย์', highlight: 'องค์พระปฐมเจดีย์' },
      { name: 'สมุทรสาคร', desc: 'มหาชัย', highlight: 'ตลาดทะเลไทย' },
      { name: 'สมุทรสงคราม', desc: 'อัมพวา', highlight: 'ตลาดร่มหุบ' },
      { name: 'นนทบุรี', desc: 'ทุเรียนนนท์', highlight: 'เกาะเกร็ด' },
      { name: 'ปทุมธานี', desc: 'เมืองบัว', highlight: 'วัดเจดีย์หอย' },
      { name: 'สมุทรปราการ', desc: 'เมืองปากน้ำ', highlight: 'บางกระเจ้า' },
      { name: 'นครนายก', desc: 'เมืองในฝันใกล้กรุง', highlight: 'เขื่อนขุนด่านฯ' }
    ]
  },
  east: {
    name: 'ภาคตะวันออก (7)',
    color: 'bg-blue-100 text-blue-800',
    provinces: [
      { name: 'ชลบุรี', desc: 'พัทยา บางแสน', highlight: 'เกาะล้าน' },
      { name: 'ระยอง', desc: 'เกาะเสม็ด', highlight: 'สวนผลไม้' },
      { name: 'จันทบุรี', desc: 'เมืองผลไม้', highlight: 'เนินนางพญา' },
      { name: 'ตราด', desc: 'เกาะช้าง', highlight: 'เกาะกูด' },
      { name: 'ฉะเชิงเทรา', desc: 'หลวงพ่อโสธร', highlight: 'วัดโสธรวราราม' },
      { name: 'ปราจีนบุรี', desc: 'เมืองสมุนไพร', highlight: 'แก่งหินเพิง' },
      { name: 'สระแก้ว', desc: 'ตลาดโรงเกลือ', highlight: 'ละลุ' }
    ]
  },
  west: {
    name: 'ภาคตะวันตก (5)',
    color: 'bg-amber-100 text-amber-800',
    provinces: [
      { name: 'กาญจนบุรี', desc: 'สะพานข้ามแม่น้ำแคว', highlight: 'สังขละบุรี' },
      { name: 'ตาก', desc: 'ทีลอซู', highlight: 'น้ำตกทีลอซู' },
      { name: 'ประจวบคีรีขันธ์', desc: 'หัวหิน', highlight: 'อ่าวมะนาว' },
      { name: 'เพชรบุรี', desc: 'เขาวัง ขนมหวาน', highlight: 'หาดชะอำ' },
      { name: 'ราชบุรี', desc: 'โอ่งมังกร', highlight: 'สวนผึ้ง' }
    ]
  },
  south: {
    name: 'ภาคใต้ (14)',
    color: 'bg-cyan-100 text-cyan-800',
    provinces: [
      { name: 'ภูเก็ต', desc: 'ไข่มุกอันดามัน', highlight: 'แหลมพรหมเทพ' },
      { name: 'สุราษฎร์ธานี', desc: 'เมืองร้อยเกาะ', highlight: 'เขื่อนเชี่ยวหลาน' },
      { name: 'นครศรีธรรมราช', desc: 'วัดพระมหาธาตุ', highlight: 'วัดเจดีย์ (ไอ้ไข่)' },
      { name: 'สงขลา', desc: 'หาดใหญ่', highlight: 'นางเงือกทอง' },
      { name: 'กระบี่', desc: 'พีพี อ่าวนาง', highlight: 'สระมรกต' },
      { name: 'พังงา', desc: 'เสม็ดนางชี', highlight: 'หมู่เกาะสิมิลัน' },
      { name: 'ตรัง', desc: 'เมืองหมูย่าง', highlight: 'ถ้ำมรกต' },
      { name: 'สตูล', desc: 'อุทยานธรณีโลก', highlight: 'เกาะหลีเป๊ะ' },
      { name: 'ชุมพร', desc: 'ประตูสู่ภาคใต้', highlight: 'หาดทรายรี' },
      { name: 'ระนอง', desc: 'เมืองฝนแปดแดดสี่', highlight: 'ภูเขาหญ้า' },
      { name: 'พัทลุง', desc: 'ล่องแก่ง', highlight: 'ทะเลน้อย' },
      { name: 'ยะลา', desc: 'เบตง', highlight: 'Skywalk อัยเยอร์เวง' },
      { name: 'ปัตตานี', desc: 'เมืองงามสามวัฒนธรรม', highlight: 'มัสยิดกลาง' },
      { name: 'นราธิวาส', desc: 'ทักษิณราชตำหนัก', highlight: 'น้ำตกปาโจ' }
    ]
  }
};
const TOURISM_STATS = [{ province: 'กรุงเทพฯ', visitors: '22.5M', score: 98, color: 'bg-blue-500' }, { province: 'ภูเก็ต', visitors: '14.2M', score: 85, color: 'bg-teal-500' }, { province: 'ชลบุรี', visitors: '12.8M', score: 78, color: 'bg-indigo-500' }, { province: 'เชียงใหม่', visitors: '10.5M', score: 72, color: 'bg-green-500' }, { province: 'สุราษฎร์ฯ', visitors: '8.9M', score: 65, color: 'bg-orange-500' }];
const DREAM_DESTINATIONS = [{ id: 1, name: 'คัปปาโดเกีย', location: 'ตุรกี', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=300', desc: 'ดินแดนบอลลูน' }, { id: 2, name: 'ซานโตรินี', location: 'กรีซ', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300', desc: 'เกาะขาวฟ้า' }, { id: 3, name: 'มัลดีฟส์', location: 'มัลดีฟส์', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300', desc: 'ทะเลสีคราม' }, { id: 4, name: 'แสงเหนือ', location: 'ไอซ์แลนด์', image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=300', desc: 'มหัศจรรย์น่านฟ้า' }, { id: 5, name: 'ฮัลล์สตัทท์', location: 'ออสเตรีย', image: 'https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?w=300', desc: 'หมู่บ้านริมน้ำ' }];

// --- 3. MOCK DATA ---
const INITIAL_USERS = [
  { id: 1, username: 'traveler1', password: '123', role: 'traveler', name: 'Alex Explorer', status: 'verified', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel' },
  { id: 2, username: 'guide1', password: '123', role: 'guide', name: 'ไกด์สมศรี', status: 'verified', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Line: @somsri', verifyRequest: 'ไกด์เชียงใหม่' },
  { id: 3, username: 'admin', password: '123', role: 'admin', name: 'Admin', status: 'verified', image: '', contact: '' },
  { id: 4, username: 'hotel1', password: '123', role: 'business', name: 'The View Hotel', status: 'verified', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200', contact: '02-999-9999', bizType: 'accommodation', verifyRequest: 'โรงแรม 5 ดาวใจกลางเมือง' }
];

const INITIAL_POSTS = [
  { id: 1, title: '🔥 โปรฯ ภูเก็ต 3 วัน 2 คืน', location: 'ภูเก็ต', author: 'ไกด์สมศรี', type: 'trip', media: 'https://images.unsplash.com/photo-1589394815804-989b3b785d51?w=600', chat: [], likes: 342, price: 4990, participants: [], desc: 'รวมที่พัก + ดำน้ำ', date: '2025-05-15', maxPeople: 10, gps: '7.88, 98.39' },
  { id: 2, title: 'หาเพื่อนเดินตลาดอัมพวา', location: 'สมุทรสงคราม', author: 'Alex Explorer', type: 'trip', media: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600', chat: [], likes: 12, price: 0, participants: ['Alex Explorer'], desc: 'หารค่าน้ำมัน', date: '2025-02-20', maxPeople: 4, gps: '13.42, 99.95' }
];

const INITIAL_SERVICES = [
  { id: 201, type: 'accommodation', name: 'ศรีพันวา ภูเก็ต', location: 'ภูเก็ต', price: 12000, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600', owner: 'The View Hotel', status: 'approved', desc: 'พูลวิลล่าหรู วิวทะเลอันดามัน' },
  { id: 202, type: 'transport', name: 'รถแดงนำเที่ยว ดอยสุเทพ', location: 'เชียงใหม่', price: 500, image: 'https://images.unsplash.com/photo-1596423736737-12d8a7c29377?w=600', owner: 'ลุงตู่ รถตู้ซิ่ง', status: 'approved', desc: 'เหมาวัน พาเที่ยวรอบเมือง' }
];

const INITIAL_TRANSACTIONS = [];

// --- 4. SUB-COMPONENTS ---

const ServiceCard = ({ service, onBook }) => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all group">
    <div className="h-40 overflow-hidden relative">
      <img src={service.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
        {service.type === 'accommodation' ? <Building className="w-3 h-3 text-blue-600"/> : <Bus className="w-3 h-3 text-orange-600"/>}
        {service.type === 'accommodation' ? 'ที่พัก' : 'เดินทาง'}
      </div>
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"><MapPin className="w-3 h-3"/> {service.location}</div>
    </div>
    <div className="p-3">
      <h4 className="font-bold text-gray-800 line-clamp-1">{service.name}</h4>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">{service.desc}</p>
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <div className="text-xs text-gray-400">โดย {service.owner}</div>
        <div className="font-bold text-blue-600">฿{service.price.toLocaleString()}</div>
      </div>
      <Button className="w-full mt-2 text-xs py-1.5" onClick={() => onBook(service)}>จอง / ติดต่อ</Button>
    </div>
  </div>
);

const TripDetailModal = ({ post, user, onClose, onJoin, onChat, usersDb }) => {
  const countdown = calculateCountdown(post.date);
  const isJoined = post.participants?.includes(user.name) || false;
  const participantAvatars = (post.participants || []).map(name => {
    const u = usersDb.find(u => u.name === name);
    return u?.image || `https://ui-avatars.com/api/?name=${name}`;
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="h-48 relative bg-gray-200">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full z-10"><XCircle /></button>
          {post.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white w-12 h-12 opacity-50"/></div> : <img src={post.media} className="w-full h-full object-cover" />}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6"><h2 className="text-2xl font-bold text-white">{post.title}</h2></div>
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
          <div><div className="flex justify-between text-sm font-bold mb-2"><span>ผู้เข้าร่วม ({post.participants?.length || 0})</span></div><div className="flex -space-x-2">{participantAvatars.map((img, i) => (<img key={i} className="h-8 w-8 rounded-full border-2 border-white object-cover" src={img} />))}</div></div>
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
        <div><h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2"><Compass className="text-blue-600 w-8 h-8"/> เกี่ยวกับ TripbuddyTH</h2><p className="text-gray-500 leading-relaxed">แพลตฟอร์มท่องเที่ยวครบวงจร เชื่อมต่อนักเดินทาง ไกด์ และผู้ประกอบการ</p></div>
        <div className="grid grid-cols-3 gap-4"><div className="bg-blue-50 p-4 rounded-xl text-center"><Users className="w-6 h-6 text-blue-600 mx-auto mb-2"/><div className="text-2xl font-bold text-blue-800">12K+</div><div className="text-xs text-blue-600">ผู้ใช้งาน</div></div><div className="bg-green-50 p-4 rounded-xl text-center"><Map className="w-6 h-6 text-green-600 mx-auto mb-2"/><div className="text-2xl font-bold text-green-800">850+</div><div className="text-xs text-green-600">ทริป</div></div><div className="bg-orange-50 p-4 rounded-xl text-center"><Star className="w-6 h-6 text-orange-600 mx-auto mb-2"/><div className="text-2xl font-bold text-orange-800">4.8</div><div className="text-xs text-orange-600">รีวิว</div></div></div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600"/> 5 อันดับจังหวัดยอดฮิต</h3><div className="space-y-4">{TOURISM_STATS.map((item, index) => (<div key={index} className="space-y-1"><div className="flex justify-between text-sm"><span className="font-medium text-gray-700 flex items-center gap-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${index < 3 ? 'bg-yellow-400' : 'bg-gray-400'}`}>{index + 1}</span>{item.province}</span><span className="text-gray-500 text-xs">{item.visitors}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div></div></div>))}</div></div>
    </div>
  </div>
);

const DreamDestinations = () => (
  <div className="mb-8"><h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2"><Plane className="w-6 h-6 text-sky-500"/> Dream Destinations</h3><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">{DREAM_DESTINATIONS.map((p,i)=>(<div key={i} className="flex-shrink-0 w-60 bg-white rounded-xl shadow-sm overflow-hidden snap-center group border hover:shadow-md transition-all"><div className="h-32 overflow-hidden relative"><img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {p.location}</div></div><div className="p-3"><div className="font-bold text-sm truncate">{p.name}</div><div className="text-xs text-gray-500 mt-1 line-clamp-1">{p.desc}</div></div></div>))}</div></div>
);

const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout, setView }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-4 mb-4"><div className="w-14 h-14 rounded-full bg-white/20 p-1"><img src={user.image||`https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full rounded-full object-cover bg-white"/></div><div><div className="font-bold text-lg truncate w-40 flex items-center gap-1">{user.name} {user.status==='verified'&&<CheckCircle className="w-4 h-4 text-blue-200 fill-blue-500" />}</div><div className="text-xs text-blue-200 uppercase">{user.role}</div></div></div>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"><Edit className="w-5 h-5 text-blue-600" /> แก้ไขโปรไฟล์</button>
          
          {user.role === 'business' && (
             <button onClick={() => { setView('business_dash'); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl text-gray-700 transition-colors"><Briefcase className="w-5 h-5 text-indigo-600" /> จัดการธุรกิจ</button>
          )}

          <button onClick={() => { setView('my_activity'); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl text-gray-700 transition-colors"><CalendarCheck className="w-5 h-5 text-purple-600" /> ประวัติการจอง</button>
          {user.role === 'admin' && <button onClick={() => { setView('admin'); onClose(); }} className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl text-gray-700 transition-colors"><Database className="w-5 h-5 text-orange-600" /> ระบบหลังบ้าน</button>}
        </div>
        <div className="p-4 border-t"><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 transition-colors"><LogOut className="w-5 h-5" /> ออกจากระบบ</button></div>
      </div>
    </>
  );
};

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

const AdminPanel = ({ users, transactions, services, onVerifyUser, onDeleteUser, onApprovePayment, onApproveService }) => {
  const [tab, setTab] = useState('users');
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2"><button onClick={() => setTab('users')} className={`px-4 py-2 rounded-full ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>ลูกค้า</button><button onClick={() => setTab('verify')} className={`px-4 py-2 rounded-full ${tab === 'verify' ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>คำขอสมัคร</button><button onClick={() => setTab('services')} className={`px-4 py-2 rounded-full ${tab === 'services' ? 'bg-indigo-500 text-white' : 'bg-white border'}`}>ตรวจสอบบริการ</button><button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-full ${tab === 'payments' ? 'bg-green-600 text-white' : 'bg-white border'}`}>การเงิน</button></div>
      {tab === 'users' && <div className="bg-white rounded-xl border overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y">{users.map(u => (<tr key={u.id}><td className="p-3 flex items-center gap-2"><img src={u.image} className="w-6 h-6 rounded-full"/>{u.name}</td><td className="p-3 uppercase">{u.role}</td><td className="p-3"><Badge status={u.status}/></td><td className="p-3">{u.role!=='admin'&&<button onClick={()=>onDeleteUser(u.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>}</td></tr>))}</tbody></table></div>}
      {tab === 'verify' && <div className="space-y-4">{users.filter(u => u.status === 'pending').map(u => (<div key={u.id} className="bg-white p-4 border rounded-xl shadow-sm"><div className="font-bold mb-2">{u.name} ({u.role})</div><div className="text-sm bg-gray-50 p-2 rounded italic mb-3">"{u.verifyRequest}"</div><div className="flex gap-2"><Button onClick={() => onVerifyUser(u.id, 'rejected')} variant="danger" className="text-xs">ปัดตก</Button><Button onClick={() => onVerifyUser(u.id, 'verified')} variant="success" className="text-xs">อนุมัติ</Button></div></div>))}</div>}
      {tab === 'services' && <div className="space-y-4">{services.filter(s => s.status === 'pending').length===0?<div className="text-center text-gray-400 py-4">ไม่มีรายการใหม่</div>:services.filter(s => s.status === 'pending').map(s => (<div key={s.id} className="bg-white p-4 border rounded-xl shadow-sm flex gap-4"><img src={s.image} className="w-24 h-24 rounded-lg object-cover"/><div className="flex-1"><div className="font-bold">{s.name}</div><div className="text-sm text-gray-500">โดย {s.owner} • {s.location}</div><div className="flex gap-2 mt-2"><Button onClick={() => onApproveService(s.id, 'rejected')} variant="danger" className="text-xs">ไม่อนุมัติ</Button><Button onClick={() => onApproveService(s.id, 'approved')} variant="success" className="text-xs">อนุมัติลงเว็บ</Button></div></div></div>))}</div>}
      {tab === 'payments' && <div className="space-y-4">{transactions.filter(t => t.status === 'pending').map(t => (<div key={t.id} className="bg-white p-4 border rounded-xl shadow-sm"><div className="flex justify-between mb-2"><div><div className="font-bold text-blue-600">฿{t.amount}</div><div className="text-xs">{t.from}</div></div><div className="text-xs text-gray-500">{t.date}</div></div><Button onClick={() => onApprovePayment(t.id, t.from, t.postId)} variant="success" className="w-full text-xs">ยืนยันยอด</Button></div>))}</div>}
    </div>
  );
};

const BusinessDashboard = ({ user, services, onCreateService }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Briefcase className="text-blue-600"/> จัดการธุรกิจ</h2>
        <p className="text-gray-500">จัดการข้อมูลที่พัก หรือบริการรถเช่า</p>
      </div>
      <Button onClick={onCreateService}><PlusCircle className="w-4 h-4"/> เพิ่มรายการใหม่</Button>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {services.filter(s => s.owner === user.name).map(s => (
        <div key={s.id} className="bg-white p-4 rounded-xl border relative">
           <div className="absolute top-4 right-4"><Badge status={s.status}/></div>
           <img src={s.image} className="w-full h-32 object-cover rounded-lg mb-3 bg-gray-100" />
           <h4 className="font-bold text-lg">{s.name}</h4>
           <div className="flex justify-between text-sm text-gray-500 mt-2">
             <span>{s.location}</span>
             <span className="font-bold text-blue-600">฿{s.price.toLocaleString()}</span>
           </div>
        </div>
      ))}
      {services.filter(s => s.owner === user.name).length === 0 && <div className="col-span-3 text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">ไม่มีรายการบริการ</div>}
    </div>
  </div>
);

const ServiceMarketplace = ({ services, onBook }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-lg mb-6">
      <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><Tag className="w-8 h-8"/> จองที่พัก & การเดินทาง</h2>
      <p className="text-indigo-100">รวมดีลเด็ดจากผู้ประกอบการท้องถิ่นทั่วไทย</p>
    </div>
    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2"><Building className="w-5 h-5 text-blue-500"/> ที่พัก (Accommodation)</h3>
    <div className="grid md:grid-cols-4 gap-4">
      {services.filter(s => s.status === 'approved' && s.type === 'accommodation').map(s => <ServiceCard key={s.id} service={s} onBook={onBook}/>)}
    </div>
    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2 mt-8"><Bus className="w-5 h-5 text-orange-500"/> รถเช่า (Transport)</h3>
    <div className="grid md:grid-cols-4 gap-4">
      {services.filter(s => s.status === 'approved' && s.type === 'transport').map(s => <ServiceCard key={s.id} service={s} onBook={onBook}/>)}
    </div>
  </div>
);

const AuthScreen = ({ view, setView, loginForm, setLoginForm, regForm, setRegForm, handleLogin, handleRegister, notification }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div className="text-center mb-6"><div className="inline-block mb-2"><Logo className="w-20 h-20 drop-shadow-md"/></div><h1 className="text-2xl font-bold text-gray-800">TripbuddyTH</h1></div>
      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4"><input required placeholder="ชื่อผู้ใช้" className="w-full border p-3 rounded-lg" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} /><input required type="password" placeholder="รหัสผ่าน" className="w-full border p-3 rounded-lg" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} /><Button type="submit" className="w-full py-3">เข้าสู่ระบบ</Button><div className="text-center text-sm text-gray-500 mt-2">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('register')}>สมัครสมาชิก</span></div></form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">{notification && <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{notification.message}</div>}<input required placeholder="ชื่อผู้ใช้" className="w-full border p-3 rounded-lg" value={regForm.username || ''} onChange={e => setRegForm({...regForm, username: e.target.value})} /><div className="grid grid-cols-2 gap-3"><input required type="password" placeholder="รหัสผ่าน" className="w-full border p-3 rounded-lg" value={regForm.password || ''} onChange={e => setRegForm({...regForm, password: e.target.value})} /><input required type="password" placeholder="ยืนยันรหัส" className="w-full border p-3 rounded-lg" value={regForm.confirmPassword || ''} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} /></div><input required placeholder="ชื่อที่แสดง" className="w-full border p-3 rounded-lg" value={regForm.name || ''} onChange={e => setRegForm({...regForm, name: e.target.value})} /><div className="flex gap-2"><button type="button" onClick={() => setRegForm({...regForm, role: 'traveler'})} className={`flex-1 py-3 border rounded-lg text-sm flex flex-col items-center justify-center ${regForm.role === 'traveler' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''}`}><User className="w-4 h-4"/> นักเดินทาง</button><button type="button" onClick={() => setRegForm({...regForm, role: 'guide'})} className={`flex-1 py-3 border rounded-lg text-sm flex flex-col items-center justify-center ${regForm.role === 'guide' ? 'bg-green-50 border-green-500 text-green-700' : ''}`}><Map className="w-4 h-4"/> ไกด์</button><button type="button" onClick={() => setRegForm({...regForm, role: 'business'})} className={`flex-1 py-3 border rounded-lg text-sm flex flex-col items-center justify-center ${regForm.role === 'business' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : ''}`}><Briefcase className="w-4 h-4"/> ผู้ประกอบการ</button></div><Button type="submit" className="w-full py-3">สมัครสมาชิก</Button><div className="text-center text-sm text-gray-500 mt-2">มีบัญชีแล้ว? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => setView('login')}>เข้าสู่ระบบ</span></div></form>
      )}
    </div>
  </div>
);

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
  const [services, setServices] = useState(INITIAL_SERVICES);
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

  // Persistence V25
  useEffect(() => {
    const s = localStorage.getItem('tb_session_v25'); if (s) setCurrentUser(JSON.parse(s));
    const u = localStorage.getItem('tb_users_v25'); if (u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts_v25'); if (p) setPosts(JSON.parse(p));
    const sv = localStorage.getItem('tb_services_v25'); if (sv) setServices(JSON.parse(sv));
    const t = localStorage.getItem('tb_trans_v25'); if (t) setTransactions(JSON.parse(t));
  }, []);
  useEffect(() => { localStorage.setItem('tb_users_v25', JSON.stringify(dbUsers)); }, [dbUsers]);
  useEffect(() => { localStorage.setItem('tb_posts_v25', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('tb_services_v25', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('tb_trans_v25', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { if (currentUser) { localStorage.setItem('tb_session_v25', JSON.stringify(currentUser)); if(view==='landing') setView(currentUser.role==='admin'?'admin':currentUser.role==='business'?'business_dash':'dashboard'); } else { localStorage.removeItem('tb_session_v25'); } }, [currentUser]);

  // Handlers
  const handleLogin = (e) => { e.preventDefault(); const u = dbUsers.find(x => x.username === loginForm.username && x.password === loginForm.password); if (u) setCurrentUser(u); else alert('ผิดพลาด'); };
  const handleRegister = (e) => { e.preventDefault(); if (regForm.password !== regForm.confirmPassword) return setNotification({message:'รหัสไม่ตรง',type:'error'}); setDbUsers([...dbUsers, { ...regForm, id: Date.now(), status: regForm.role==='traveler'?'verified':'pending', joinedAt: new Date().toLocaleDateString() }]); setNotification({message:'สำเร็จ!',type:'success'}); setTimeout(()=>setView('login'),1500); };
  const handleLogout = () => { setCurrentUser(null); setView('landing'); };
  const createService = () => { setServices([...services, {...newItem, id: Date.now(), owner: currentUser.name, status: 'pending'}]); setModal({open: false}); };
  const createPost = () => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0, participants: [], type: 'trip' }, ...posts]); setModal({open: false}); };
  const verifyUser = (id, status) => { setDbUsers(dbUsers.map(u => u.id === id ? { ...u, status } : u)); };
  const approveService = (id, status) => { setServices(services.map(s => s.id === id ? { ...s, status } : s)); };
  
  const handleJoin = (post) => {
    if (post.participants.includes(currentUser.name)) return alert("เข้าร่วมแล้ว");
    if (post.price > 0) return setModal({ open: true, type: 'payment', data: post });
    const updated = posts.map(p => p.id === post.id ? { ...p, participants: [...p.participants, currentUser.name] } : p);
    setPosts(updated); setActiveTripDetail({ ...post, participants: [...post.participants, currentUser.name] });
  };
  const handleApprovePayment = (tid, userName, pid) => {
    setTransactions(transactions.map(t => t.id === tid ? { ...t, status: 'approved' } : t));
    if(pid) setPosts(posts.map(p => p.id === pid ? { ...p, participants: [...p.participants, userName] } : p));
  };
  const createPayment = () => {
    const newTrans = { 
       id: Date.now(), from: currentUser.name, to: modal.data.owner || modal.data.author, 
       amount: modal.data.price, date: new Date().toLocaleDateString(), status: 'pending', slip: 'https://via.placeholder.com/150', itemId: modal.data.id
    };
    setTransactions([...transactions, newTrans]); setModal({open: false}); alert("แจ้งโอนสำเร็จ!");
  };
  const handleServiceUpload = (url) => {
    setNewItem({ ...newItem, image: url });
  }

  const renderView = () => {
    if (view === 'admin') return <AdminPanel users={dbUsers} services={services} transactions={transactions} onVerifyUser={verifyUser} onDeleteUser={(id)=>setDbUsers(dbUsers.filter(u=>u.id!==id))} onApprovePayment={handleApprovePayment} onApproveService={approveService} />;
    if (view === 'business_dash') return <BusinessDashboard user={currentUser} services={services} onCreateService={()=>{setModal({open:true, type:'create_service'}); setNewItem({});}} />;
    if (view === 'services') return <ServiceMarketplace services={services} onBook={(s) => setModal({open: true, type: 'payment', data: s})} />;
    if (view === 'my_activity') return <MyActivity user={currentUser} posts={posts} transactions={transactions} />;
    if (view === 'discovery') return <div><button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 font-bold">← กลับ</button><ThailandDiscovery /></div>;
    return (
      <div className="space-y-6 animate-in fade-in">
        <TourismInsights />
        <DreamDestinations />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setView('discovery')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg flex flex-col items-center justify-center"><Map className="w-6 h-6 mb-1"/> <span className="font-bold">77 จังหวัด</span></button>
          <button onClick={() => setView('services')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg flex flex-col items-center justify-center"><Tag className="w-6 h-6 mb-1"/> <span className="font-bold">จองบริการ</span></button>
          <button onClick={() => setModal({open: true, type: 'create_post'})} className="flex-shrink-0 w-36 h-24 bg-white border-2 border-dashed border-blue-300 rounded-xl text-blue-500 flex flex-col items-center justify-center hover:bg-blue-50"><PlusCircle className="w-6 h-6 mb-1"/> <span className="font-bold">สร้างทริป</span></button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">{posts.map(post => (<Card key={post.id} onClick={()=>{setActiveTripDetail(post);}}><div className="h-48 relative"><img src={post.media} className="w-full h-full object-cover"/><div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded"><MapPin className="w-3 h-3 inline"/> {post.location}</div></div><div className="p-3"><h4 className="font-bold">{post.title}</h4><div className="flex justify-between items-center mt-2 text-sm text-gray-500"><span>{post.author}</span><span className="text-blue-600 font-bold">{post.price>0?`฿${post.price}`:'ฟรี'}</span></div></div></Card>))}</div>
      </div>
    );
  };

  if (!currentUser) return <AuthScreen view={view} setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} notification={notification} />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-20">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
           <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => { setView('dashboard'); setActiveChat(null); setActiveTripDetail(null); }}><Logo className="w-8 h-8"/> <span className="hidden sm:inline">TripbuddyTH</span></div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setModal({open: true, type: 'profile'})}>
           <div className="text-right hidden sm:block"><div className="font-bold text-sm">{currentUser.name}</div><div className="text-xs text-gray-500 capitalize">{currentUser.role}</div></div>
           <div className="w-10 h-10 rounded-full border bg-gray-200 overflow-hidden"><img src={currentUser.image || "https://ui-avatars.com/api/?name="+currentUser.name} className="w-full h-full object-cover"/></div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={() => setModal({open: true, type: 'profile'})} onLogout={handleLogout} setView={setView} />

      <main className="max-w-5xl mx-auto p-4 mt-4">
        {activeChat ? <ChatRoom trip={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} onSendMessage={(t) => { const msg = { sender: currentUser.name, text: t, time: 'Now' }; setPosts(posts.map(p => p.id === activeChat.id ? { ...p, chat: [...p.chat, msg] } : p)); setActiveChat({ ...activeChat, chat: [...activeChat.chat, msg] }); }} /> :
         activeTripDetail ? <TripDetailModal post={activeTripDetail} user={currentUser} onClose={() => setActiveTripDetail(null)} onChat={() => { setActiveChat(activeTripDetail); setActiveTripDetail(null); }} onJoin={() => handleJoin(activeTripDetail)} usersDb={dbUsers} /> : 
         renderView()}
      </main>
      
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in zoom-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setModal({open: false})} className="absolute top-4 right-4 text-gray-400"><XCircle /></button>
            {modal.type === 'profile' && <ProfileModal user={currentUser} onClose={() => setModal({open: false})} onSave={(d) => { setDbUsers(dbUsers.map(u => u.id === currentUser.id ? d : u)); setCurrentUser(d); setModal({ open: false }); }} />}
            {modal.type === 'payment' && (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl font-bold text-blue-800">฿{modal.data.price.toLocaleString()}</div>
                <div className="border-2 border-dashed p-10 rounded-xl text-gray-400">แนบสลิปที่นี่ (Demo)</div>
                <Button variant="success" className="w-full" onClick={createPayment}>ส่งหลักฐาน</Button>
              </div>
            )}
            {modal.type === 'create_service' && (
              <div className="space-y-4"><h3 className="font-bold text-xl">เพิ่มบริการใหม่</h3><div className="flex gap-2"><button onClick={() => setNewItem({...newItem, type: 'accommodation'})} className="flex-1 p-3 border rounded-xl flex flex-col items-center bg-blue-50 text-blue-600"><Building/> ที่พัก</button><button onClick={() => setNewItem({...newItem, type: 'transport'})} className="flex-1 p-3 border rounded-xl flex flex-col items-center bg-orange-50 text-orange-600"><Bus/> รถเช่า</button></div><input className="w-full border p-2 rounded-lg" placeholder="ชื่อบริการ" onChange={e => setNewItem({...newItem, name: e.target.value})} /><input className="w-full border p-2 rounded-lg" placeholder="สถานที่ (จังหวัด)" onChange={e => setNewItem({...newItem, location: e.target.value})} /><input className="w-full border p-2 rounded-lg" type="number" placeholder="ราคาเริ่มต้น" onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} /><textarea className="w-full border p-2 rounded-lg" placeholder="รายละเอียด" onChange={e => setNewItem({...newItem, desc: e.target.value})} /><input className="w-full border p-2 rounded-lg" placeholder="URL รูป" onChange={e => setNewItem({...newItem, image: e.target.value})} /><Button onClick={createService} className="w-full">สร้างรายการ</Button></div>
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
                <Button className="w-full" onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0, participants: [], type: 'trip' }, ...posts]); setModal({open: false}); }}>โพสต์เลย</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}