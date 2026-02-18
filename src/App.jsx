import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Video, Image as ImageIcon, Map, Phone, Lock, 
  Edit, Menu, TrendingUp, Sun, CloudRain, Snowflake,
  LogOut, Send, PlusCircle, Compass, MessageSquare, 
  Heart, Share2, XCircle, CheckCircle, UploadCloud, ShieldCheck, Smartphone,
  Star, Loader, DollarSign, FileText, Trash2, CreditCard, Search,
  BarChart2, Users, AlertCircle, Database, CalendarCheck, Clock, Ticket, Plane,
  Navigation, Calendar, Info, Building, Bus, Briefcase, Tag, FileImage, ExternalLink,
  BedDouble, Car, Filter, Check, Upload, PlayCircle, ArrowRight, LogIn, Eye, Image, Save, Home
} from 'lucide-react';

// ==========================================
// 1. ASSETS & STYLES (3D GEOMETRIC THEME)
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Kanit:wght@300;400;600&display=swap');
    
    body {
      font-family: 'Kanit', sans-serif;
      background-color: #f8f9fa;
    }
    
    h1, h2, h3, h4, h5, .font-geo {
      font-family: 'Chakra Petch', sans-serif;
    }

    /* 3D Text Effect */
    .text-3d {
      text-shadow: 
        1px 1px 0px #0ea5e9,
        2px 2px 0px #0284c7;
      transition: all 0.3s ease;
    }

    .card-hover {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    /* Hide scrollbar */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `}</style>
);

const Logo = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs><linearGradient id="tripGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#2563EB" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
    <path d="M100 20C65 20 35 45 35 85C35 125 100 190 100 190C100 190 165 125 165 85C165 45 135 20 100 20Z" fill="url(#tripGradient)" />
    <path d="M70 75C70 75 80 95 100 95C120 95 130 75 130 75" stroke="white" strokeWidth="12" strokeLinecap="round" />
    <circle cx="70" cy="65" r="8" fill="white" /><circle cx="130" cy="65" r="8" fill="white" />
  </svg>
);

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = { 
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1", 
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50", 
    success: "bg-green-600 text-white hover:bg-green-700 shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1", 
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50" 
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer card-hover ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
  const styles = { verified: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', active: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  const labels = { verified: 'ยืนยันแล้ว', pending: 'รอตรวจสอบ', active: 'ใช้งานปกติ', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'} font-geo`}>{labels[status] || status}</span>;
};

const calculateCountdown = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  if (diff < 0) return "ออกเดินทางแล้ว";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `อีก ${days} วัน`;
};

// --- FILE UPLOADER (Local Preview) ---
const FileUploader = ({ label, onUpload, value, type = 'image' }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          onUpload(reader.result); 
          setLoading(false);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2 font-geo">{label}</label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group bg-gray-50"
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileChange} 
          accept={type === 'video' ? "video/*" : "image/*"} 
        />
        
        {loading ? (
          <div className="flex flex-col items-center text-blue-600"><Loader className="w-8 h-8 animate-spin mb-2"/><span className="text-xs font-bold">กำลังประมวลผล...</span></div>
        ) : value ? (
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden group/preview shadow-inner">
            {type === 'video' ? <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white"><Video className="w-12 h-12 mb-2"/><span className="text-xs">วิดีโอพร้อมใช้งาน</span></div> : <img src={value} className="w-full h-full object-contain bg-gray-100" alt="Preview" />}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity"><span className="text-white text-sm font-bold bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm"><Edit className="w-4 h-4"/> เปลี่ยนรูปภาพ</span></div>
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md"><CheckCircle className="w-4 h-4"/></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-gray-400 group-hover:text-blue-600 transition-colors">
            <div className="bg-white p-4 rounded-full mb-3 shadow-sm border border-gray-200 group-hover:border-blue-400 group-hover:scale-110 transition-all"><Upload className="w-8 h-8"/></div>
            <span className="text-sm font-bold font-geo">คลิกเพื่ออัปโหลด{type === 'video' ? 'วิดีโอ' : 'รูปภาพ'}</span>
            <span className="text-xs opacity-70 mt-1">รองรับไฟล์จากเครื่องของคุณ</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. DATASETS (FULL 77 PROVINCES)
// ==========================================
const THAILAND_DATA = {
  north: { 
      name: 'ภาคเหนือ (9)', 
      color: 'bg-green-100 text-green-800', 
      provinces: [
          { name: 'เชียงใหม่', desc: 'ดอยอินทนนท์ ถนนคนเดินท่าแพ', highlight: 'ดอยอินทนนท์' },
          { name: 'เชียงราย', desc: 'วัดร่องขุ่น ดอยตุง', highlight: 'วัดร่องขุ่น' },
          { name: 'น่าน', desc: 'ดอยเสมอดาว กระซิบรัก', highlight: 'ดอยเสมอดาว' },
          { name: 'แม่ฮ่องสอน', desc: 'ปางอุ๋ง ทุ่งดอกบัวตอง', highlight: 'ปางอุ๋ง' },
          { name: 'แพร่', desc: 'พระธาตุช่อแฮ แพะเมืองผี', highlight: 'แพะเมืองผี' },
          { name: 'พะเยา', desc: 'กว๊านพะเยา วัดติโลกอาราม', highlight: 'กว๊านพะเยา' },
          { name: 'ลำปาง', desc: 'วัดพระธาตุลำปางหลวง เมืองรถม้า', highlight: 'วัดพระธาตุลำปางหลวง' },
          { name: 'ลำพูน', desc: 'พระธาตุหริภุญชัย', highlight: 'พระธาตุหริภุญชัย' },
          { name: 'อุตรดิตถ์', desc: 'ภูสอยดาว เมืองลับแล', highlight: 'ภูสอยดาว' }
      ]
  },
  northeast: { 
      name: 'ภาคอีสาน (20)', 
      color: 'bg-orange-100 text-orange-800', 
      provinces: [
          { name: 'นครราชสีมา', desc: 'อุทยานแห่งชาติเขาใหญ่', highlight: 'เขาใหญ่' },
          { name: 'ขอนแก่น', desc: 'เขื่อนอุบลรัตน์ ไดโนเสาร์', highlight: 'เขื่อนอุบลรัตน์' },
          { name: 'อุดรธานี', desc: 'คำชะโนด ทะเลบัวแดง', highlight: 'คำชะโนด' },
          { name: 'อุบลราชธานี', desc: 'สามพันโบก ผาแต้ม', highlight: 'สามพันโบก' },
          { name: 'หนองคาย', desc: 'พญานาค วัดผาตากเสื้อ', highlight: 'วัดผาตากเสื้อ' },
          { name: 'เลย', desc: 'เชียงคาน ภูกระดึง', highlight: 'เชียงคาน' },
          { name: 'บุรีรัมย์', desc: 'ปราสาทพนมรุ้ง สนามช้าง', highlight: 'พนมรุ้ง' },
          { name: 'สุรินทร์', desc: 'หมู่บ้านช้าง งานช้างแฟร์', highlight: 'หมู่บ้านช้าง' },
          { name: 'ศรีสะเกษ', desc: 'ผามออีแดง ปราสาทสระกำแพงใหญ่', highlight: 'ผามออีแดง' },
          { name: 'สกลนคร', desc: 'วัดพระธาตุเชิงชุม หนองหาร', highlight: 'วัดพระธาตุเชิงชุม' },
          { name: 'นครพนม', desc: 'พระธาตุพนม พญาศรีสัตตนาคราช', highlight: 'พระธาตุพนม' },
          { name: 'มุกดาหาร', desc: 'หอแก้วมุกดาหาร ตลาดอินโดจีน', highlight: 'หอแก้ว' },
          { name: 'ยโสธร', desc: 'ประเพณีบั้งไฟ พญาคันคาก', highlight: 'พญาคันคาก' },
          { name: 'ร้อยเอ็ด', desc: 'บึงพลาญชัย เจดีย์มหามงคลบัว', highlight: 'เจดีย์มหามงคลบัว' },
          { name: 'กาฬสินธุ์', desc: 'พิพิธภัณฑ์สิรินธร ไดโนเสาร์', highlight: 'พิพิธภัณฑ์สิรินธร' },
          { name: 'มหาสารคาม', desc: 'พระธาตุนาดูน สะดืออีสาน', highlight: 'พระธาตุนาดูน' },
          { name: 'ชัยภูมิ', desc: 'ทุ่งดอกกระเจียว มอหินขาว', highlight: 'มอหินขาว' },
          { name: 'อำนาจเจริญ', desc: 'พระมงคลมิ่งเมือง', highlight: 'พุทธอุทยาน' },
          { name: 'หนองบัวลำภู', desc: 'วัดถ้ำกลองเพล', highlight: 'วัดถ้ำกลองเพล' },
          { name: 'บึงกาฬ', desc: 'ภูทอก ถ้ำนาคา', highlight: 'ถ้ำนาคา' }
      ]
  },
  central: { 
      name: 'ภาคกลาง (22)', 
      color: 'bg-yellow-100 text-yellow-800', 
      provinces: [
          { name: 'กรุงเทพมหานคร', desc: 'วัดพระแก้ว วัดอรุณฯ', highlight: 'วัดอรุณฯ' },
          { name: 'พระนครศรีอยุธยา', desc: 'อุทยานประวัติศาสตร์', highlight: 'วัดมหาธาตุ' },
          { name: 'สระบุรี', desc: 'น้ำตกเจ็ดสาวน้อย รอยพระพุทธบาท', highlight: 'น้ำตกเจ็ดสาวน้อย' },
          { name: 'ลพบุรี', desc: 'พระปรางค์สามยอด เมืองลิง', highlight: 'พระปรางค์สามยอด' },
          { name: 'สิงห์บุรี', desc: 'วัดพิกุลทอง ค่ายบางระจัน', highlight: 'วัดพิกุลทอง' },
          { name: 'ชัยนาท', desc: 'สวนนกชัยนาท เขื่อนเจ้าพระยา', highlight: 'เขื่อนเจ้าพระยา' },
          { name: 'อ่างทอง', desc: 'วัดม่วง พระพุทธรูปองค์ใหญ่', highlight: 'วัดม่วง' },
          { name: 'นครสวรรค์', desc: 'บึงบอระเพ็ด ตรุษจีนปากน้ำโพ', highlight: 'บึงบอระเพ็ด' },
          { name: 'อุทัยธานี', desc: 'วัดท่าซุง หุบป่าตาด', highlight: 'วัดท่าซุง' },
          { name: 'กำแพงเพชร', desc: 'อุทยานประวัติศาสตร์ น้ำตกคลองลาน', highlight: 'น้ำตกคลองลาน' },
          { name: 'สุโขทัย', desc: 'อุทยานประวัติศาสตร์สุโขทัย', highlight: 'อุทยานประวัติศาสตร์' },
          { name: 'พิษณุโลก', desc: 'พระพุทธชินราช', highlight: 'วัดพระศรีรัตนมหาธาตุ' },
          { name: 'พิจิตร', desc: 'บึงสีไฟ ชาละวัน', highlight: 'บึงสีไฟ' },
          { name: 'เพชรบูรณ์', desc: 'เขาค้อ ภูทับเบิก', highlight: 'เขาค้อ' },
          { name: 'สุพรรณบุรี', desc: 'บึงฉวาก ตลาดสามชุก', highlight: 'บึงฉวาก' },
          { name: 'นครปฐม', desc: 'พระปฐมเจดีย์', highlight: 'องค์พระปฐมเจดีย์' },
          { name: 'สมุทรสาคร', desc: 'ตลาดมหาชัย', highlight: 'ตลาดทะเลไทย' },
          { name: 'สมุทรสงคราม', desc: 'ตลาดน้ำอัมพวา ดอนหอยหลอด', highlight: 'อัมพวา' },
          { name: 'นนทบุรี', desc: 'เกาะเกร็ด', highlight: 'เกาะเกร็ด' },
          { name: 'ปทุมธานี', desc: 'วัดเจดีย์หอย', highlight: 'วัดเจดีย์หอย' },
          { name: 'สมุทรปราการ', desc: 'บางกระเจ้า เมืองโบราณ', highlight: 'บางกระเจ้า' },
          { name: 'นครนายก', desc: 'เขื่อนขุนด่านปราการชล', highlight: 'เขื่อนขุนด่านฯ' }
      ]
  },
  east: { 
      name: 'ภาคตะวันออก (7)', 
      color: 'bg-blue-100 text-blue-800', 
      provinces: [
          { name: 'ชลบุรี', desc: 'พัทยา บางแสน เกาะล้าน', highlight: 'เกาะล้าน' },
          { name: 'ระยอง', desc: 'เกาะเสม็ด ทุ่งโปรงทอง', highlight: 'เกาะเสม็ด' },
          { name: 'จันทบุรี', desc: 'เนินนางพญา ชุมชนริมน้ำจันทบูร', highlight: 'เนินนางพญา' },
          { name: 'ตราด', desc: 'เกาะช้าง เกาะกูด', highlight: 'เกาะช้าง' },
          { name: 'ฉะเชิงเทรา', desc: 'วัดโสธรวรารามวรวิหาร', highlight: 'วัดโสธรวราราม' },
          { name: 'ปราจีนบุรี', desc: 'แก่งหินเพิง เวโรน่าทับลาน', highlight: 'แก่งหินเพิง' },
          { name: 'สระแก้ว', desc: 'ตลาดโรงเกลือ ละลุ', highlight: 'ละลุ' }
      ]
  },
  west: { 
      name: 'ภาคตะวันตก (5)', 
      color: 'bg-amber-100 text-amber-800', 
      provinces: [
          { name: 'กาญจนบุรี', desc: 'สะพานข้ามแม่น้ำแคว สังขละบุรี', highlight: 'สังขละบุรี' },
          { name: 'ตาก', desc: 'น้ำตกทีลอซู เขื่อนภูมิพล', highlight: 'น้ำตกทีลอซู' },
          { name: 'ประจวบคีรีขันธ์', desc: 'หัวหิน อ่าวมะนาว', highlight: 'หัวหิน' },
          { name: 'เพชรบุรี', desc: 'หาดชะอำ เขาวัง', highlight: 'หาดชะอำ' },
          { name: 'ราชบุรี', desc: 'สวนผึ้ง ตลาดน้ำดำเนินสะดวก', highlight: 'สวนผึ้ง' }
      ]
  },
  south: { 
      name: 'ภาคใต้ (14)', 
      color: 'bg-cyan-100 text-cyan-800', 
      provinces: [
          { name: 'ภูเก็ต', desc: 'แหลมพรหมเทพ หาดป่าตอง', highlight: 'แหลมพรหมเทพ' },
          { name: 'สุราษฎร์ธานี', desc: 'เกาะสมุย เขื่อนเชี่ยวหลาน', highlight: 'เขื่อนเชี่ยวหลาน' },
          { name: 'นครศรีธรรมราช', desc: 'วัดเจดีย์ (ไอ้ไข่) คีรีวง', highlight: 'วัดเจดีย์ (ไอ้ไข่)' },
          { name: 'สงขลา', desc: 'หาดใหญ่ แหลมสมิหลา', highlight: 'นางเงือกทอง' },
          { name: 'กระบี่', desc: 'หมู่เกาะพีพี สระมรกต', highlight: 'สระมรกต' },
          { name: 'พังงา', desc: 'เสม็ดนางชี หมู่เกาะสิมิลัน', highlight: 'หมู่เกาะสิมิลัน' },
          { name: 'ตรัง', desc: 'เมืองหมูย่าง', highlight: 'ถ้ำมรกต' },
          { name: 'สตูล', desc: 'เกาะหลีเป๊ะ อุทยานธรณี', highlight: 'เกาะหลีเป๊ะ' },
          { name: 'ชุมพร', desc: 'หาดทรายรี จุดชมวิวเขามัทรี', highlight: 'หาดทรายรี' },
          { name: 'ระนอง', desc: 'เมืองฝนแปดแดดสี่', highlight: 'ภูเขาหญ้า' },
          { name: 'พัทลุง', desc: 'ล่องแก่ง', highlight: 'ทะเลน้อย' },
          { name: 'ยะลา', desc: 'เบตง สกายวอล์คอัยเยอร์เวง', highlight: 'Skywalk อัยเยอร์เวง' },
          { name: 'ปัตตานี', desc: 'เมืองงามสามวัฒนธรรม', highlight: 'มัสยิดกลาง' },
          { name: 'นราธิวาส', desc: 'น้ำตกปาโจ ป่าพรุโต๊ะแดง', highlight: 'น้ำตกปาโจ' }
      ]
  }
};

const TOURISM_STATS = [
  { province: 'สุราษฎร์ธานี', visitors: '15.5M', score: 95, color: 'bg-orange-500' },
  { province: 'ภูเก็ต', visitors: '14.2M', score: 90, color: 'bg-teal-500' },
  { province: 'กรุงเทพมหานคร', visitors: '22.5M', score: 85, color: 'bg-blue-500' },
  { province: 'เชียงใหม่', visitors: '10.5M', score: 72, color: 'bg-green-500' },
];

// --- 3. MOCK DATA (Demo State) ---
const INITIAL_USERS = [
  { id: 1, username: 'traveler1', password: '123', role: 'traveler', name: 'Alex Explorer', status: 'verified', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', contact: 'IG: alex_travel' },
  { id: 2, username: 'guide_surat', password: '123', role: 'guide', name: 'ไกด์พี่บ่าว สุราษฎร์', status: 'verified', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', contact: 'Tel: 081-xxx-xxxx', verifyRequest: 'ไกด์ท้องถิ่นเชี่ยวชาญเขื่อนเชี่ยวหลาน' },
  { id: 3, username: 'admin', password: '123', role: 'admin', name: 'Admin', status: 'verified', image: '', contact: '' },
  { id: 4, username: 'homestay_surat', password: '123', role: 'business', name: 'บ้านสวนโฮมสเตย์ คลองร้อยสาย', status: 'verified', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=200', contact: '077-xxx-xxxx', bizType: 'accommodation' },
  { id: 5, username: 'van_surat', password: '123', role: 'business', name: 'โกไข่ รถเช่าสุราษฎร์', status: 'pending', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200', contact: '089-xxx-xxxx', bizType: 'transport', verifyRequest: 'บริการรถตู้ VIP รับส่งสนามบิน-ท่าเรือ' }
];

const INITIAL_POSTS = [
  { 
    id: 1, 
    title: '🛶 Unseen สุราษฎร์ฯ: กุ้ยหลินเมืองไทย เขื่อนเชี่ยวหลาน 2 วัน 1 คืน', 
    location: 'สุราษฎร์ธานี', 
    gps: '8.9754, 98.8228',
    date: '2026-05-20', 
    maxPeople: 10,
    desc: 'ชวนเพื่อนเที่ยวเขื่อนเชี่ยวหลาน นอนแพนางไพร สัมผัสบรรยากาศธรรมชาติสุดฟิน \n- ล่องเรือชมเขาสามเกลอ \n- เดินป่าถ้ำปะการัง \n- อาหารพื้นบ้านปักษ์ใต้รสเด็ด \nราคานี้รวมค่าเรือและที่พักแล้วครับ',
    author: 'ไกด์พี่บ่าว สุราษฎร์', 
    type: 'trip', 
    media: 'https://www.hashcorner.com/wp-content/uploads/2020/07/Chiewlarn-lake-surat-thani.jpg?w=800', 
    chat: [], 
    likes: 1089, 
    price: 3500, 
    participants: [] 
  },
    { 
    id: 2, 
    title: '🏝️ ทริปภูเก็ต 3 วัน 2 คืน (ดำน้ำ + พักหรู)', 
    location: 'ภูเก็ต', 
    gps: '7.8804, 98.3923',
    date: '2026-04-15', 
    maxPeople: 15,
    desc: 'แพ็คเกจสุดคุ้ม! เที่ยวภูเก็ตแบบจัดเต็ม 3 วัน 2 คืน \n- ที่พัก: The SIS KATA (2 คืน พร้อมอาหารเช้า) \n- เดินทาง: รถเช่าขับเอง 48 ชม. + Speed Boat ทัวร์เกาะพีพี-เกาะไข่ \n- ไฮไลท์: ดำน้ำอ่าวมาหยา, เล่นน้องแมวเกาะไข่, เช็คอินคาเฟ่ Bookhemian 2521 \n- ราคาเพียง 4,599 บาท/ท่าน (รวมทุกอย่างแล้ว!)',
    author: 'ไกด์สมศรี', 
    type: 'trip', 
    media: 'https://www.chillpainai.com/src/wewakeup/scoop/images/eb1a9862e7917fa926385a434856060ab0455aae.jpg?w=800', 
    chat: [], 
    likes: 890, 
    price: 4599, 
    participants: [] 
  },
    { 
    id: 3, 
    title: 'หาเพื่อนเดินตลาดน้ำอัมพวา เสาร์นี้! 🚣', 
    location: 'สมุทรสงคราม', 
    gps: '13.4258, 99.9554', 
    date: '2026-02-20',
    maxPeople: 5,
    desc: 'เน้นหาของกิน ถ่ายรูปชิลๆ หารค่าน้ำมันกันครับ ออกเดินทางจากอนุสาวรีย์ฯ 9 โมงเช้า',
    author: 'Alex Explorer', 
    type: 'trip', 
    media: 'https://cms.dmpcdn.com/travel/2020/06/17/9481e0a0-b085-11ea-8fac-236a281cd6c5_original.JPG?w=600', 
    chat: [{sender: 'ไกด์สมศรี', text: 'ไปกี่โมงคะ สนใจๆ', time: '10:00'}], 
    likes: 12, 
    price: 0, 
    participants: ['Alex Explorer'] 
  },
];

const INITIAL_SERVICES = [
  { id: 301, type: 'accommodation', name: 'แพนางไพร เขื่อนเชี่ยวหลาน', location: 'สุราษฎร์ธานี', price: 1500, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600', owner: 'อุทยานแห่งชาติ', status: 'approved', desc: 'ที่พักกลางน้ำ วิวหลักล้าน ราคาหลักร้อย' },
  { id: 302, type: 'transport', name: 'รถเช่าโกไข่ สุราษฎร์ฯ', location: 'สุราษฎร์ธานี', price: 1800, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600', owner: 'โกไข่ รถเช่าสุราษฎร์', status: 'approved', desc: 'รถตู้ VIP 9 ที่นั่ง พร้อมคนขับชำนาญทาง รับส่งสนามบิน-ท่าเรือ' },
  { id: 201, type: 'accommodation', name: 'ศรีพันวา ภูเก็ต', location: 'ภูเก็ต', price: 12000, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600', owner: 'The View Hotel', status: 'approved', desc: 'พูลวิลล่าหรู วิวทะเลอันดามัน' },
];

const INITIAL_TRANSACTIONS = [
  { id: 101, from: 'นักเดินทาง Alex', to: 'ไกด์สมศรี', amount: 4990, date: '2024-02-15', status: 'pending', slip: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200', postId: 1, title: 'โปรฯ ภูเก็ต 3 วัน 2 คืน' }
];
const DREAM_DESTINATIONS = [
  { id: 1, name: 'คัปปาโดเกีย', location: 'ตุรกี', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400', desc: 'ดินแดนบอลลูนสีสวย' },
  { id: 2, name: 'ซานโตรินี', location: 'กรีซ', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', desc: 'เกาะสวรรค์สีขาวฟ้า' },
  { id: 3, name: 'มัลดีฟส์', location: 'มัลดีฟส์', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', desc: 'ทะเลสีครามสุดพักผ่อน' },
  { id: 4, name: 'แสงเหนือ', location: 'ไอซ์แลนด์', image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=400', desc: 'มหัศจรรย์น่านฟ้า' },
  { id: 5, name: 'ฮัลล์สตัทท์', location: 'ออสเตรีย', image: 'https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?w=400', desc: 'หมู่บ้านริมน้ำสุดสวย' },
];

// --- SUB-COMPONENTS ---
const ServiceCard = ({ service, onBook }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group duration-300">
    <div className="h-48 overflow-hidden relative">
      <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm font-geo">
        {service.type === 'accommodation' ? <BedDouble className="w-3 h-3 text-blue-600"/> : <Car className="w-3 h-3 text-orange-600"/>}
        {service.type === 'accommodation' ? 'ที่พักชุมชน' : 'รถเช่าท้องถิ่น'}
      </div>
      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm"><MapPin className="w-3 h-3"/> {service.location}</div>
    </div>
    <div className="p-5">
      <h4 className="font-bold text-xl text-gray-800 line-clamp-1 font-geo">{service.name}</h4>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">{service.desc}</p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">โดย <span className="text-gray-600 font-bold">{service.owner}</span></div>
        <div className="font-bold text-2xl text-blue-600 font-geo">฿{service.price.toLocaleString()}</div>
      </div>
      <Button className="w-full mt-3" onClick={() => onBook(service)}>จอง / ติดต่อเจ้าของ</Button>
    </div>
  </div>
);

const TripDetailModal = ({ post, user, onClose, onJoin, onChat, usersDb }) => {
  const countdown = calculateCountdown(post.date);
  const isJoined = post.participants?.includes(user?.name) || false;
  const participantAvatars = (post.participants || []).map(name => {
    const u = usersDb.find(u => u.name === name);
    return u?.image || `https://ui-avatars.com/api/?name=${name}`;
  });

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${post.gps ? post.gps.replace(/\s/g, '') : ''}`;

  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="h-64 relative bg-gray-900 group">
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full z-10 hover:bg-white/20 transition-colors backdrop-blur-sm"><XCircle className="w-8 h-8"/></button>
          {post.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white w-16 h-16 opacity-50"/></div> : <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8 pt-32">
             <div className="flex items-center gap-2 mb-2"><span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">TRIP</span><span className="text-gray-300 text-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {post.location}</span></div>
             <h2 className="text-3xl font-bold text-white drop-shadow-lg font-geo leading-tight">{post.title}</h2>
          </div>
        </div>
        <div className="p-8 overflow-y-auto flex-1 space-y-8 bg-white">
          <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center">
                    <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">วันออกเดินทาง</div>
                        <div className="text-2xl font-bold text-gray-800 font-geo">{post.date || "ไม่ระบุ"}</div>
                        <div className="text-xs text-gray-500 mt-1">{countdown}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">ค่าใช้จ่าย/ท่าน</div>
                        <div className="text-4xl font-bold text-blue-600 font-geo">{post.price > 0 ? `฿${post.price.toLocaleString()}` : 'ฟรี'}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2 font-geo"><Info className="w-5 h-5 text-blue-500"/> รายละเอียดการเดินทาง</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm">{post.desc}</p>
                  </div>
              </div>
              <div className="md:w-64 space-y-4">
                 <div className="border p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group/map" onClick={()=>window.open(googleMapsUrl)}>
                    <div className="text-xs text-gray-400 mb-2 font-bold uppercase">แผนที่ & พิกัด</div>
                    <div className="h-32 bg-gray-200 rounded-xl mb-3 relative overflow-hidden">
                        {/* Fake Map */}
                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center text-blue-300"><Map className="w-12 h-12"/></div>
                        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded shadow text-xs font-bold text-black flex items-center gap-1 group-hover/map:scale-105 transition-transform"><Navigation className="w-3 h-3"/> นำทาง</div>
                    </div>
                    <div className="text-xs text-blue-600 font-bold truncate">{post.gps}</div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm font-bold mb-2 text-gray-700"><span>เพื่อนร่วมทริป</span> <span>{post.participants?.length || 0}/{post.maxPeople}</span></div>
                    <div className="flex -space-x-2 overflow-hidden py-2 pl-2">
                        {participantAvatars.length > 0 ? participantAvatars.map((img, i) => (<img key={i} className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" src={img} />)) : <span className="text-sm text-gray-400 italic">ยังไม่มีผู้เข้าร่วม เป็นคนแรกสิ!</span>}
                        {participantAvatars.length > 0 && <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+</div>}
                    </div>
                 </div>
              </div>
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50 flex gap-4">
          <button onClick={onChat} className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center gap-2 transition-all"><MessageSquare className="w-5 h-5"/> สอบถามข้อมูล</button>
          {!isJoined ? 
            <button onClick={onJoin} className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2 shadow-blue-200"><Ticket className="w-5 h-5"/> {post.price > 0 ? 'จองที่นั่งทันที' : 'ขอเข้าร่วมฟรี'}</button> 
            : <button className="flex-[2] py-4 bg-green-500 text-white rounded-xl font-bold cursor-default flex items-center justify-center gap-2"><CheckCircle className="w-6 h-6"/> เข้าร่วมแล้ว</button>
          }
        </div>
      </div>
    </div>
  );
};

const TourismInsights = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-in fade-in slide-in-from-bottom duration-500 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
    <div className="flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1 space-y-6">
        <div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mb-3"><Compass className="w-3 h-3"/> Travel Community</div><h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">ยินดีต้อนรับสู่ <span className="text-blue-600">ThaiBuddy</span> <br/>เพื่อนร่วมทางที่ดีที่สุดของคุณ</h2><p className="text-gray-600 leading-relaxed text-sm md:text-base">ThaiBuddy เกิดขึ้นจากความตั้งใจที่จะสนับสนุนการท่องเที่ยวไทย โดยเป็นสื่อกลางเชื่อมโยงระหว่าง <strong>"นักเดินทาง"</strong> ที่ต้องการประสบการณ์แปลกใหม่ กับ <strong>"ไกด์ท้องถิ่น"</strong> และ <strong>"ผู้ประกอบการ"</strong> ที่มีความเชี่ยวชาญในพื้นที่ เพื่อให้ทุกการเดินทางมีความหมาย สะดวกปลอดภัย และสร้างรายได้สู่ชุมชนอย่างยั่งยืน</p></div>
        <div className="flex gap-8 border-t pt-6"><div><div className="text-3xl font-bold text-gray-900">77</div><div className="text-xs text-gray-500 mt-1">จังหวัดทั่วไทย</div></div><div><div className="text-3xl font-bold text-gray-900">100+</div><div className="text-xs text-gray-500 mt-1">ทริปและกิจกรรม</div></div><div><div className="text-3xl font-bold text-gray-900">24<span className="text-sm">/7</span></div><div className="text-xs text-gray-500 mt-1">พร้อมดูแลคุณ</div></div></div>
      </div>
      <div className="flex-1 w-full"><div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600"/> จังหวัดยอดนิยมประจำเดือน</h3><div className="space-y-4">{TOURISM_STATS.map((item, index) => (<div key={index} className="space-y-1"><div className="flex justify-between text-sm"><span className="font-medium text-gray-700 flex items-center gap-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${index < 3 ? 'bg-yellow-400' : 'bg-gray-400'}`}>{index + 1}</span>{item.province}</span><span className="text-gray-500 text-xs">{item.visitors}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div></div></div>))}</div></div></div>
    </div>
  </div>
);

const DreamDestinations = () => (
  <div className="mb-8"><h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2"><Plane className="w-6 h-6 text-sky-500"/> Dream Destinations</h3><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">{DREAM_DESTINATIONS.map((p,i)=>(<div key={i} className="flex-shrink-0 w-60 bg-white rounded-xl shadow-sm overflow-hidden snap-center group border hover:shadow-md transition-all"><div className="h-40 overflow-hidden relative"><img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {p.location}</div></div><div className="p-3"><div className="font-bold text-sm truncate">{p.name}</div><div className="text-xs text-gray-500 mt-1 line-clamp-1">{p.desc}</div></div></div>))}</div></div>
);

const ThailandDiscovery = () => {
  const [region, setRegion] = useState('all');
  const [keyword, setKeyword] = useState('');
  const regionEntries = Object.entries(THAILAND_DATA);
  const totalProvinces = regionEntries.reduce((sum, [, r]) => sum + r.provinces.length, 0);

  const displayedRegions = regionEntries
    .filter(([key]) => region === 'all' || key === region)
    .map(([key, data]) => {
      const matchedProvinces = data.provinces.filter(p => {
        if (!keyword.trim()) return true;
        const k = keyword.trim().toLowerCase();
        return [p.name, p.desc, p.highlight].some(field => field.toLowerCase().includes(k));
      });
      return { key, data, provinces: matchedProvinces };
    })
    .filter(r => r.provinces.length > 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"><Compass className="w-4 h-4"/> Explore Thailand</div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 font-geo">สำรวจ 77 จังหวัดทั่วไทย</h2>
          <p className="text-gray-600 text-sm mt-1">เลือกภาคหรือค้นหาชื่อจังหวัด/ไฮไลต์เพื่อดูข้อมูลอย่างรวดเร็ว</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">รวม {totalProvinces} จังหวัด</div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"><Check className="w-4 h-4"/> ครบทุกภาค</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setRegion('all')} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${region === 'all' ? 'bg-blue-600 text-white shadow-md border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}>ทั้งหมด</button>
        {regionEntries.map(([key, data]) => (
          <button key={key} onClick={() => setRegion(key)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${region === key ? `${data.color.replace('bg-', 'bg-').split(' ')[0]} text-gray-900 shadow-sm` : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}>{data.name}</button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-3">
        <div className="p-3 bg-gray-100 rounded-xl text-gray-500"><Search className="w-5 h-5"/></div>
        <input value={keyword} onChange={e => setKeyword(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="ค้นหาจังหวัด สถานที่ หรือไฮไลต์ (เช่น ดอย, เกาะ, น้ำตก)" />
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border"><Filter className="w-4 h-4"/> รองรับภาษาไทย</div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRegions.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-white border rounded-2xl text-gray-400">ไม่พบผลการค้นหา</div>
        ) : (
          displayedRegions.map(({ key, data, provinces }) => (
            <div key={key} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className={`px-5 py-4 flex items-center justify-between ${data.color}`}>
                <div>
                  <div className="font-bold text-base font-geo">{data.name}</div>
                  <div className="text-xs opacity-80">จังหวัดทั้งหมด {data.provinces.length} แห่ง</div>
                </div>
                <span className="text-xs font-bold bg-white/80 px-3 py-1 rounded-full text-gray-700 border">{provinces.length} พบ</span>
              </div>
              <div className="p-5 space-y-3">
                {provinces.map((p, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs font-geo">{p.name.slice(0,2)}</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{p.desc}</div>
                      <div className="text-[11px] text-blue-600 mt-1 inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full"><MapPin className="w-3 h-3"/> ไฮไลต์: {p.highlight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, user, onEditProfile, onLogout, setView, onLoginClick }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          {user ? (
             <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/20 p-1 mb-4 backdrop-blur-sm"><img src={user.image||`https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full rounded-full object-cover bg-white"/></div>
                <div className="font-bold text-xl truncate font-geo">{user.name}</div>
                <div className="text-sm text-blue-200 uppercase tracking-wider font-bold mt-1 flex items-center gap-1">{user.role} {user.status==='verified' && <CheckCircle className="w-3 h-3 text-green-400"/>}</div>
             </div>
          ) : (
             <div className="text-center py-6 relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm"><User className="w-10 h-10"/></div>
                <div className="font-bold text-xl font-geo">ผู้เยี่ยมชม</div>
                <p className="text-xs opacity-70 mt-2">เข้าสู่ระบบเพื่อใช้งานเต็มรูปแบบ</p>
             </div>
          )}
        </div>
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {user ? (
             <>
                <button onClick={() => { onEditProfile(); onClose(); }} className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl text-gray-700 transition-all font-bold group"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Edit className="w-5 h-5" /></div> แก้ไขโปรไฟล์</button>
                {user.role === 'business' && <button onClick={() => { setView('business_dash'); onClose(); }} className="w-full flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl text-gray-700 transition-all font-bold group"><div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Briefcase className="w-5 h-5" /></div> จัดการธุรกิจ</button>}
                <button onClick={() => { setView('my_activity'); onClose(); }} className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 rounded-2xl text-gray-700 transition-all font-bold group"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><CalendarCheck className="w-5 h-5" /></div> ข้อมูลการจองของฉัน</button>
                {user.role === 'admin' && <button onClick={() => { setView('admin'); onClose(); }} className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 rounded-2xl text-gray-700 transition-all font-bold group"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors"><Database className="w-5 h-5" /></div> Admin Dashboard</button>}
             </>
          ) : (
             <div className="space-y-4 px-2">
                <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 font-geo">ยินดีต้อนรับ!</h4>
                    <p className="text-xs text-gray-600 mb-4">สมัครสมาชิกเพื่อสร้างทริป จองที่พัก และพูดคุยกับเพื่อนใหม่</p>
                    <button onClick={() => { onLoginClick(); onClose(); }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95">เข้าสู่ระบบ / สมัครสมาชิก</button>
                </div>
             </div>
          )}
        </div>
        {user && <div className="p-6 border-t"><button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 hover:bg-red-50 rounded-2xl text-red-600 transition-colors font-bold border-2 border-transparent hover:border-red-100"><LogOut className="w-5 h-5" /> ออกจากระบบ</button></div>}
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
      <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center z-10"><div className="flex items-center gap-3"><button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">←</button><div className="w-10 h-10 rounded-full overflow-hidden border">{trip.type === 'video' ? <div className="bg-red-100 w-full h-full flex items-center justify-center"><Video className="text-red-500"/></div> : <img src={trip.media} className="w-full h-full object-cover" />}</div><div><h3 className="font-bold text-gray-800 line-clamp-1 text-sm md:text-base font-geo">{trip.title}</h3><p className="text-xs text-green-600 flex items-center gap-1 font-bold">● ออนไลน์</p></div></div></div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">{trip.chat && trip.chat.map((msg, i) => { const isMe = msg.sender === currentUser.name; return (<div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}><div className={`flex max-w-[80%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>{!isMe && <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 border border-white">{msg.sender[0]}</div>}<div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>{!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender}</span>}<div className={`px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>{msg.text}</div><span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span></div></div></div>); })}</div>
      <div className="p-3 bg-white border-t flex items-center gap-2 pb-safe"><input type="text" className="flex-1 bg-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="พิมพ์ข้อความ..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))} /><button onClick={() => { if(input.trim()) { onSendMessage(input); setInput(''); }}} className={`p-3 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}><Send className="w-5 h-5"/></button></div>
    </div>
  );
};

const MyActivity = ({ user, posts, transactions }) => {
  const myTrips = posts.filter(p => p.author === user.name || (p.participants && p.participants.includes(user.name)));
  const myTrans = transactions.filter(t => t.from === user.name);
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6 bg-purple-50 p-4 rounded-2xl border border-purple-100">
        <div className="bg-white p-3 rounded-xl shadow-sm"><CalendarCheck className="w-8 h-8 text-purple-600"/></div>
        <div><h2 className="text-2xl font-bold text-gray-800 font-geo">ข้อมูลการจองของฉัน</h2><p className="text-gray-500 text-sm">ประวัติการเดินทางและรายการชำระเงินทั้งหมด</p></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-700 border-l-4 border-blue-500 pl-3 font-geo">ทริปที่เข้าร่วม</h3>
            {myTrips.length > 0 ? myTrips.map(trip => (
                <div key={trip.id} className="bg-white p-4 rounded-xl border shadow-sm flex gap-4 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {trip.type==='video'?<div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white w-8 h-8"/></div>:<img src={trip.media} className="w-full h-full object-cover"/>}
                        <div className="absolute top-1 right-1"><Badge status={trip.participants.includes(user.name) ? 'active' : 'pending'} /></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div><div className="font-bold text-lg line-clamp-1 text-gray-800 font-geo">{trip.title}</div><div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {trip.location}</div></div>
                        <div className="flex justify-between items-end"><div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {trip.date}</div><div className="font-bold text-blue-600">{trip.price > 0 ? `฿${trip.price.toLocaleString()}` : 'ฟรี'}</div></div>
                    </div>
                </div>
            )) : <div className="text-gray-400 text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">ยังไม่มีทริปที่เข้าร่วม<br/><span className="text-xs">ไปหน้าแรกเพื่อหาทริปเที่ยวกันเถอะ!</span></div>}
        </div>
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-700 border-l-4 border-green-500 pl-3 font-geo">ประวัติการชำระเงิน</h3>
            {myTrans.length > 0 ? myTrans.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                    <div><div className="font-bold text-xl text-gray-800 font-geo">฿{t.amount.toLocaleString()}</div><div className="text-xs text-gray-500">{t.title || 'รายการชำระเงิน'}</div><div className="text-[10px] text-gray-400 mt-1">{t.date}</div></div><div className="text-right"><Badge status={t.status} /></div>
                </div>
            )) : <div className="text-gray-400 text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">ไม่มีประวัติการชำระเงิน</div>}
        </div>
      </div>
    </div>
  );
};

// ** ADMIN PANEL WITH EDIT FEATURE **
const AdminPanel = ({ users, transactions, services, onVerifyUser, onDeleteUser, onApprovePayment, onApproveService, onUpdateUser }) => {
  const [tab, setTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: 'traveler', status: 'verified' });

  useEffect(() => {
    if (editingUser) setEditForm(editingUser);
  }, [editingUser]);

  return (
    <div className="space-y-6">
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in">
                <h3 className="text-2xl font-bold mb-6 font-geo text-gray-800">✏️ แก้ไขข้อมูลผู้ใช้</h3>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-500">ชื่อ-นามสกุล</label><input className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500">บทบาท (Role)</label><select className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none" value={editForm.role || 'traveler'} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                        <option value="traveler">Traveler (นักท่องเที่ยว)</option><option value="guide">Guide (ไกด์)</option><option value="business">Business (ธุรกิจ)</option><option value="admin">Admin (ผู้ดูแล)</option></select></div>
                    <div><label className="text-xs font-bold text-gray-500">สถานะ</label><select className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none" value={editForm.status || 'verified'} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                        <option value="verified">Verified (ยืนยันแล้ว)</option><option value="pending">Pending (รอตรวจสอบ)</option></select></div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button onClick={() => setEditingUser(null)} variant="secondary" className="flex-1">ยกเลิก</Button>
                    <Button onClick={() => { onUpdateUser(editingUser.id, editForm); setEditingUser(null); }} className="flex-1">บันทึก</Button>
                </div>
            </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6 bg-orange-50 p-6 rounded-2xl border border-orange-100"><div className="bg-white p-3 rounded-xl shadow-sm"><Database className="w-8 h-8 text-orange-600"/></div><div><h2 className="text-2xl font-bold text-gray-800 font-geo">Admin Dashboard</h2><p className="text-gray-500 text-sm">จัดการระบบ อนุมัติผู้ใช้ และตรวจสอบการชำระเงิน</p></div></div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
         <button onClick={() => setTab('users')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${tab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}>สมาชิกทั้งหมด ({users.length})</button>
         <button onClick={() => setTab('verify')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${tab === 'verify' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}>รออนุมัติ ({users.filter(u=>u.status==='pending').length}) {users.filter(u=>u.status==='pending').length>0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}</button>
         <button onClick={() => setTab('services')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${tab === 'services' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}>บริการ ({services.length})</button>
         <button onClick={() => setTab('payments')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${tab === 'payments' ? 'bg-green-600 text-white shadow-lg' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}>การเงิน ({transactions.length})</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden min-h-[400px]">
        {tab === 'users' && <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600 font-geo uppercase text-xs"><tr><th className="p-5">User</th><th className="p-5">Role</th><th className="p-5">Status</th><th className="p-5 text-right">Action</th></tr></thead><tbody className="divide-y">{users.map(u => (<tr key={u.id} className="hover:bg-gray-50 transition-colors"><td className="p-5 flex items-center gap-4"><img src={u.image||"https://ui-avatars.com/api/?name="+u.name} className="w-10 h-10 rounded-full bg-gray-200 shadow-sm border-2 border-white"/> <div><div className="font-bold text-gray-800">{u.name}</div><div className="text-xs text-gray-500">@{u.username}</div></div></td><td className="p-5"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role==='admin'?'bg-red-100 text-red-700':u.role==='business'?'bg-indigo-100 text-indigo-700':u.role==='guide'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{u.role}</span></td><td className="p-5"><Badge status={u.status}/></td><td className="p-5 text-right flex justify-end gap-2"><button onClick={() => setEditingUser(u)} className="bg-white border hover:bg-blue-50 text-blue-600 p-2 rounded-lg shadow-sm"><Edit className="w-4 h-4"/></button>{u.role!=='admin'&&<button onClick={()=>onDeleteUser('users', u.id)} className="bg-white border hover:bg-red-50 text-red-600 p-2 rounded-lg shadow-sm"><Trash2 className="w-4 h-4"/></button>}</td></tr>))}</tbody></table></div>}
        
        {tab === 'verify' && <div className="divide-y">{users.filter(u => u.status === 'pending').length === 0 ? <div className="p-12 text-center text-gray-400 flex flex-col items-center"><CheckCircle className="w-16 h-16 mb-4 text-green-200"/><span className="text-lg">ไม่มีรายการรออนุมัติ</span></div> : users.filter(u => u.status === 'pending').map(u => (<div key={u.id} className="p-6 flex flex-col gap-4 hover:bg-gray-50 border-b">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"><img src={u.image} className="w-full h-full object-cover"/></div>
                 <div><div className="font-bold text-xl text-gray-800">{u.name}</div><div className="text-sm text-gray-500 flex items-center gap-1 uppercase font-bold"><User className="w-3 h-3"/> {u.role} • <span className="normal-case font-normal">{u.verifyRequest}</span></div></div>
             </div>
             <div className="flex gap-2"><Button onClick={() => onVerifyUser(u.id, 'rejected')} variant="danger" className="text-xs px-4">ปัดตก</Button><Button onClick={() => onVerifyUser(u.id, 'verified')} variant="success" className="text-xs px-4">อนุมัติ</Button></div>
          </div>
          {u.idCardImage ? <div className="bg-gray-100 p-4 rounded-xl border border-gray-200"><p className="text-xs text-gray-500 mb-3 font-bold flex items-center gap-2 uppercase tracking-wide"><CreditCard className="w-4 h-4 text-blue-500"/> หลักฐานยืนยันตัวตน (บัตรประชาชน)</p><div className="relative group w-full max-w-md"><img src={u.idCardImage} className="w-full h-64 object-contain rounded-lg border bg-white shadow-sm cursor-zoom-in" onClick={() => { const w = window.open(""); w.document.write(`<img src="${u.idCardImage}" style="width:100%"/>`); }}/><div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-lg"></div></div></div> : <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100"><AlertCircle className="w-5 h-5"/> ผู้ใช้นี้ไม่ได้แนบรูปบัตรประชาชน</div>}
        </div>))}</div>}
        
        {tab === 'services' && <div className="divide-y">{services.filter(s => s.status === 'pending').length===0?<div className="p-12 text-center text-gray-400">ไม่มีบริการใหม่รอตรวจสอบ</div>:services.filter(s => s.status === 'pending').map(s => (<div key={s.id} className="p-6 flex gap-6 hover:bg-gray-50 items-start"><img src={s.image} className="w-32 h-32 rounded-xl object-cover bg-gray-200 shadow-md"/><div className="flex-1"> <div className="font-bold text-xl text-gray-800">{s.name}</div><div className="text-sm text-gray-500 mb-4 flex items-center gap-2"><User className="w-4 h-4"/> {s.owner} • <MapPin className="w-4 h-4"/> {s.location}</div><p className="text-gray-600 text-sm mb-4 bg-white p-3 rounded border">{s.desc}</p><div className="flex gap-3"><Button onClick={() => onApproveService(s.id, 'rejected')} variant="danger" className="text-xs">ไม่อนุมัติ</Button><Button onClick={() => onApproveService(s.id, 'approved')} variant="success" className="text-xs">อนุมัติลงเว็บ</Button></div></div></div>))}</div>}
        
        {tab === 'payments' && <div className="divide-y">{transactions.filter(t => t.status === 'pending').length===0?<div className="p-12 text-center text-gray-400">ไม่มีรายการโอนเงินใหม่</div>:transactions.filter(t => t.status === 'pending').map(t => (<div key={t.id} className="p-6 flex justify-between items-center hover:bg-gray-50"><div><div className="font-bold text-blue-600 text-2xl font-geo">฿{t.amount.toLocaleString()}</div><div className="text-sm text-gray-600 font-bold mt-1">จาก {t.from}</div><div className="text-xs text-gray-400">{t.date} • {t.title}</div></div><Button onClick={() => onApprovePayment(t.id, t.from, t.postId)} variant="success" className="w-32 text-xs">ยืนยันยอด</Button></div>))}</div>}
      </div>
    </div>
  );
};

const BusinessDashboard = ({ user, services, onCreateService }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-lg text-white"><div><h2 className="text-3xl font-bold flex items-center gap-3 font-geo"><Briefcase className="w-8 h-8"/> จัดการธุรกิจ</h2><p className="opacity-80 mt-1">จัดการข้อมูลที่พัก หรือบริการรถเช่าของคุณ</p></div><button onClick={onCreateService} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-md"><PlusCircle className="w-5 h-5"/> เพิ่มรายการใหม่</button></div>
    {services.filter(s => s.owner === user.name).length === 0 ? <div className="text-center py-20 border-2 border-dashed rounded-2xl text-gray-400 bg-gray-50 flex flex-col items-center"><Briefcase className="w-16 h-16 mb-4 opacity-20"/><span className="text-lg">คุณยังไม่มีรายการบริการ</span><span className="text-sm">สร้างเลยเพื่อเริ่มรับลูกค้า!</span></div> : <div className="grid md:grid-cols-3 gap-6">{services.filter(s => s.owner === user.name).map(s => (<div key={s.id} className="bg-white p-4 rounded-xl border shadow-sm relative group hover:shadow-md transition-all"><div className="absolute top-4 right-4 z-10"><Badge status={s.status}/></div><img src={s.image} className="w-full h-40 object-cover rounded-lg mb-3 bg-gray-100" /><h4 className="font-bold text-lg text-gray-800">{s.name}</h4><div className="flex justify-between text-sm text-gray-500 mt-2 border-t pt-2"><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {s.location}</span><span className="font-bold text-blue-600">฿{s.price.toLocaleString()}</span></div></div>))}</div>}
  </div>
);

// Updated ServiceMarketplace with Tabs
const ServiceMarketplace = ({ services, onBook }) => {
  const [category, setCategory] = useState('all'); // all, accommodation, transport
  const filteredServices = services.filter(s => s.status === 'approved' && (category === 'all' || s.type === category));

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-10 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div><div className="relative z-10"><h2 className="text-4xl font-bold mb-3 flex items-center gap-3 font-geo"><Tag className="w-10 h-10"/> จองที่พัก & การเดินทาง</h2><p className="text-indigo-100 text-lg opacity-90 max-w-xl">รวมดีลเด็ดจากผู้ประกอบการท้องถิ่นทั่วไทย สนับสนุนรายได้สู่ชุมชนโดยตรง</p></div></div>
      
      {/* Category Tabs */}
      <div className="flex justify-center mb-8"><div className="bg-white p-1.5 rounded-full shadow-sm border inline-flex gap-1">
         <button onClick={() => setCategory('all')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${category === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>ทั้งหมด</button>
         <button onClick={() => setCategory('accommodation')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${category === 'accommodation' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Building className="w-4 h-4"/> ที่พัก</button>
         <button onClick={() => setCategory('transport')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${category === 'transport' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Bus className="w-4 h-4"/> รถเช่า</button>
      </div></div>

      <div className="grid md:grid-cols-4 gap-6">
        {filteredServices.length > 0 ? filteredServices.map(s => <ServiceCard key={s.id} service={s} onBook={onBook}/>) : <div className="col-span-4 text-center py-20 text-gray-400 border-2 border-dashed rounded-2xl bg-gray-50 flex flex-col items-center"><Search className="w-12 h-12 mb-3 opacity-20"/>ไม่พบรายการในหมวดหมู่นี้</div>}
      </div>
    </div>
  );
};

const AuthScreen = ({ view, setView, loginForm, setLoginForm, regForm, setRegForm, handleLogin, handleRegister, notification }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      <div className="text-center mb-8"><div className="inline-flex items-center justify-center p-5 bg-blue-50 rounded-full mb-5 shadow-inner"><Logo className="w-20 h-20 drop-shadow-md"/></div><h1 className="text-3xl font-bold text-gray-800 font-geo tracking-tight">TripbuddyTH</h1><p className="text-gray-500 mt-2">เพื่อนร่วมทาง...รู้ใจคุณ</p></div>
      {notification && <div className={`p-4 rounded-xl text-sm flex items-center gap-3 mb-6 animate-in fade-in shadow-sm ${notification.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>{notification.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0"/> : <CheckCircle className="w-5 h-5 flex-shrink-0"/>} {notification.message}</div>}
      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
            <div><label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">ชื่อผู้ใช้</label><input required className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="กรอกชื่อผู้ใช้..." /></div>
            <div><label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">รหัสผ่าน</label><input required type="password" className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" /></div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 shadow-blue-200">เข้าสู่ระบบ</button>
            <div className="text-center text-sm text-gray-500 mt-6 pt-6 border-t">ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer font-bold hover:underline" onClick={() => setView('register')}>สมัครสมาชิกฟรี</span></div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
            <input required placeholder="ตั้งชื่อผู้ใช้" className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:border-blue-500 outline-none transition-all" value={regForm.username || ''} onChange={e => setRegForm({...regForm, username: e.target.value})} />
            <div className="grid grid-cols-2 gap-3"><input required type="password" placeholder="รหัสผ่าน" className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:border-blue-500 outline-none" value={regForm.password || ''} onChange={e => setRegForm({...regForm, password: e.target.value})} /><input required type="password" placeholder="ยืนยันรหัส" className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:border-blue-500 outline-none" value={regForm.confirmPassword || ''} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} /></div>
            <input required placeholder="ชื่อที่แสดง (เช่น นักเดินทาง Alex)" className="w-full border-2 border-gray-100 bg-gray-50 p-3.5 rounded-xl focus:border-blue-500 outline-none" value={regForm.name || ''} onChange={e => setRegForm({...regForm, name: e.target.value})} />
            <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setRegForm({...regForm, role: 'traveler'})} className={`p-3 border-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${regForm.role === 'traveler' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}><User className="w-5 h-5 mb-1"/> นักเดินทาง</button>
                <button type="button" onClick={() => setRegForm({...regForm, role: 'guide'})} className={`p-3 border-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${regForm.role === 'guide' ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}><Map className="w-5 h-5 mb-1"/> ไกด์</button>
                <button type="button" onClick={() => setRegForm({...regForm, role: 'business'})} className={`p-3 border-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${regForm.role === 'business' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}><Briefcase className="w-5 h-5 mb-1"/> ธุรกิจ</button>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 shadow-blue-200">สมัครสมาชิก</button>
            <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t">มีบัญชีแล้ว? <span className="text-blue-600 cursor-pointer font-bold hover:underline" onClick={() => setView('login')}>เข้าสู่ระบบ</span></div>
        </form>
      )}
    </div>
  </div>
);

// --- HERO SECTION ---
const HeroSection = ({ onExplore }) => (
  <div className="relative h-[450px] rounded-3xl overflow-hidden mb-10 shadow-2xl group border-4 border-white/50">
    <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1600&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
      <div className="animate-in slide-in-from-bottom duration-700 fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">เที่ยวไทย...ไปกับเพื่อนรู้ใจ</h1>
        <p className="text-lg md:text-2xl mb-8 font-light opacity-90 max-w-2xl mx-auto drop-shadow-md">ค้นหาประสบการณ์การเดินทางใหม่ๆ จองที่พักและรถเช่าท้องถิ่น หรือหาเพื่อนร่วมทริปได้ง่ายๆ ที่นี่</p>
        <button onClick={onExplore} className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto transform hover:-translate-y-1">
          เริ่มออกเดินทาง <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  </div>
);

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

  // Persistence V41 (Final Complete Fix)
  useEffect(() => {
    const s = localStorage.getItem('tb_session_v41'); if (s) setCurrentUser(JSON.parse(s));
    const u = localStorage.getItem('tb_users_v41'); if (u) setDbUsers(JSON.parse(u));
    const p = localStorage.getItem('tb_posts_v41'); if (p) setPosts(JSON.parse(p));
    const sv = localStorage.getItem('tb_services_v41'); if (sv) setServices(JSON.parse(sv));
    const t = localStorage.getItem('tb_trans_v41'); if (t) setTransactions(JSON.parse(t));
  }, []);

  useEffect(() => { localStorage.setItem('tb_users_v41', JSON.stringify(dbUsers)); }, [dbUsers]);
  useEffect(() => { localStorage.setItem('tb_posts_v41', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('tb_services_v41', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('tb_trans_v41', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { if (currentUser) { localStorage.setItem('tb_session_v41', JSON.stringify(currentUser)); } else { localStorage.removeItem('tb_session_v41'); } }, [currentUser]);

  // Handlers
  const handleLogin = (e) => { 
      e.preventDefault(); 
      const u = dbUsers.find(x => x.username === loginForm.username && x.password === loginForm.password); 
      if (u) { setCurrentUser(u); setView('dashboard'); } 
      else alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); 
  };
  
  const handleRegister = (e) => { 
      e.preventDefault(); 
      if (regForm.password !== regForm.confirmPassword) return setNotification({message:'รหัสไม่ตรง',type:'error'}); 
      
      const newUser = { 
          ...regForm, 
          id: Date.now(), 
          status: regForm.role==='traveler'?'verified':'pending', 
          joinedAt: new Date().toLocaleDateString(), 
          image:'', 
          contact:'' 
      };
      
      const updatedUsers = [...dbUsers, newUser];
      setDbUsers(updatedUsers);
      localStorage.setItem('tb_users_v41', JSON.stringify(updatedUsers));
      
      setNotification({message:'สำเร็จ! กรุณาเข้าสู่ระบบ',type:'success'}); 
      setTimeout(() => {
          setView('login'); 
          setNotification(null);
      }, 1500); 
  };
  
  const handleLogout = () => { setCurrentUser(null); setView('landing'); };
  
  const createService = () => { setServices([...services, {...newItem, id: Date.now(), owner: currentUser.name, status: 'pending'}]); setModal({open: false}); };
  const createPost = () => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0, participants: [], type: 'trip' }, ...posts]); setModal({open: false}); };
  
  const verifyUser = (id, status) => { setDbUsers(dbUsers.map(u => u.id === id ? { ...u, status } : u)); };
  const handleAdminUpdateUser = (id, updatedData) => { setDbUsers(dbUsers.map(u => u.id === id ? { ...u, ...updatedData } : u)); };
  const onDeleteUser = (type, id) => { if(confirm('ลบ?')) setDbUsers(dbUsers.filter(u => u.id !== id)); };
  const approveService = (id, status) => { setServices(services.map(s => s.id === id ? { ...s, status } : s)); };
  
  const handleJoin = (post) => {
    if (!currentUser) return setView('auth');
    if (post.participants.includes(currentUser.name)) return alert("เข้าร่วมแล้ว");
    if (post.price > 0) return setModal({ open: true, type: 'payment', data: post });
    const updated = posts.map(p => p.id === post.id ? { ...p, participants: [...p.participants, currentUser.name] } : p);
    setPosts(updated); setActiveTripDetail({ ...post, participants: [...post.participants, currentUser.name] });
  };
  
  const handleApprovePayment = (tid, userName, pid) => {
    setTransactions(transactions.map(t => t.id === tid ? { ...t, status: 'approved' } : t));
    if(pid) {
       const post = posts.find(p => p.id === pid);
       if(post) {
         const updated = posts.map(p => p.id === pid ? { ...p, participants: [...p.participants, userName] } : p);
         setPosts(updated);
       }
    }
  };
  
  const createPayment = () => {
    const newTrans = { 
       id: Date.now(), from: currentUser.name, to: modal.data.owner || modal.data.author, 
       amount: modal.data.price, date: new Date().toLocaleDateString(), status: 'pending', slip: 'https://via.placeholder.com/150', itemId: modal.data.id, title: modal.data.title || modal.data.name
    };
    setTransactions([...transactions, newTrans]); setModal({open: false}); alert("แจ้งโอนสำเร็จ!");
  };

  const handleServiceUpload = (url) => {
    setNewItem({ ...newItem, image: url });
  }
  
  const requireAuth = (action) => {
    if (!currentUser) {
       setModal({ open: false });
       setView('auth');
    } else {
       action();
    }
  };

  const renderView = () => {
    if (view === 'auth') return <AuthScreen view="login" setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} notification={notification} />;
    if (view === 'login') return <AuthScreen view="login" setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} notification={notification} />;
    
    if (currentUser?.role === 'admin' && view === 'admin') return <AdminPanel users={dbUsers} services={services} transactions={transactions} onVerifyUser={verifyUser} onDeleteUser={onDeleteUser} onApprovePayment={handleApprovePayment} onApproveService={approveService} onUpdateUser={handleAdminUpdateUser} />;
    if (currentUser?.role === 'business' && view === 'business_dash') return <BusinessDashboard user={currentUser} services={services} onCreateService={()=>{setModal({open:true, type:'create_service'}); setNewItem({});}} />;
    if (view === 'services') return <ServiceMarketplace services={services} onBook={(s) => requireAuth(() => setModal({open: true, type: 'payment', data: s}))} />;
    if (currentUser && view === 'my_activity') return <MyActivity user={currentUser} posts={posts} transactions={transactions} />;
    if (view === 'discovery') return <div><button onClick={() => setView('dashboard')} className="mb-4 text-gray-500 font-bold">← กลับ</button><ThailandDiscovery /></div>;
    
    // Default: Dashboard / Landing Page
    return (
      <div className="space-y-6 animate-in fade-in">
        {!currentUser && <HeroSection onExplore={() => document.getElementById('feed').scrollIntoView({behavior: 'smooth'})} />}
        
        {currentUser && (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex items-center justify-between">
              <div><h2 className="text-2xl font-bold text-gray-800">สวัสดี, {currentUser.name}! 👋</h2><p className="text-gray-500">พร้อมออกเดินทางครั้งใหม่หรือยัง?</p></div>
              <button onClick={() => setModal({open: true, type: 'create_post'})} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"><PlusCircle className="w-5 h-5"/> สร้างโพสต์หาเพื่อน</button>
           </div>
        )}
        
        <TourismInsights />
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setView('discovery')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg flex flex-col items-center justify-center"><Map className="w-6 h-6 mb-1"/> <span className="font-bold">77 จังหวัด</span></button>
          <button onClick={() => setView('services')} className="flex-shrink-0 w-36 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg flex flex-col items-center justify-center"><Tag className="w-6 h-6 mb-1"/> <span className="font-bold">จองบริการ</span></button>
          <button onClick={() => setModal({open: true, type: 'create_post'})} className="flex-shrink-0 w-36 h-24 bg-white border-2 border-dashed border-blue-300 rounded-xl text-blue-500 flex flex-col items-center justify-center hover:bg-blue-50"><PlusCircle className="w-6 h-6 mb-1"/> <span className="font-bold">สร้างทริป</span></button>
        </div>

        <div id="feed">
           <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2 mb-4"><TrendingUp className="text-blue-500"/> ทริปหาเพื่อนเที่ยวล่าสุด</h3>
           <div className="grid md:grid-cols-2 gap-6">
             {posts.map(post => (
               <Card key={post.id} onClick={()=>{setActiveTripDetail(post);}}>
                  <div className="h-56 relative group">
                     {post.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center group-hover:opacity-90 transition-opacity">
                           <PlayCircle className="text-white w-16 h-16 opacity-80 group-hover:scale-110 transition-transform"/>
                        </div> 
                     ) : (
                        <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                     )}
                     <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="text-white text-xs bg-black/50 px-2 py-1 rounded-full inline-flex items-center gap-1 mb-2 backdrop-blur-sm"><MapPin className="w-3 h-3"/> {post.location}</div>
                        <h4 className="text-white font-bold text-lg leading-tight drop-shadow-md">{post.title}</h4>
                     </div>
                  </div>
                  <div className="p-4">
                     <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-2"><img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-6 h-6 rounded-full"/> <span className="font-medium text-gray-700">{post.author}</span></div>
                        <div className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{post.price>0?`฿${post.price.toLocaleString()}`:'หารเฉลี่ย'}</div>
                     </div>
                  </div>
               </Card>
             ))}
           </div>
        </div>

        <div className="mt-12">
            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2 mb-4"><Plane className="text-sky-500"/> Dream Destinations</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                 {DREAM_DESTINATIONS.map((p,i)=>(<div key={i} className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm overflow-hidden snap-center group border hover:shadow-md transition-all"><div className="h-40 overflow-hidden relative"><img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {p.location}</div></div><div className="p-4"><div className="font-bold text-base truncate">{p.name}</div><div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.desc}</div></div></div>))}
            </div>
        </div>
      </div>
    );
  };

  if (!currentUser) return <AuthScreen view={view} setView={setView} loginForm={loginForm} setLoginForm={setLoginForm} regForm={regForm} setRegForm={setRegForm} handleLogin={handleLogin} handleRegister={handleRegister} notification={notification} />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-20">
      <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm px-4 h-16 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
           <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => { setView('dashboard'); setActiveChat(null); setActiveTripDetail(null); }}><Logo className="w-8 h-8"/> <span className="hidden sm:inline">ThaiBuddy</span></div>
        </div>
        <div className="flex items-center gap-3">
           {currentUser ? (
             <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-3 transition-colors" onClick={() => setModal({open: true, type: 'profile'})}>
                <div className="text-right hidden sm:block"><div className="font-bold text-sm">{currentUser.name}</div><div className="text-xs text-gray-500 capitalize">{currentUser.role}</div></div>
                <div className="w-10 h-10 rounded-full border bg-gray-200 overflow-hidden"><img src={currentUser.image || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-full h-full object-cover"/></div>
             </div>
           ) : (
             <button onClick={() => setView('auth')} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"><LogIn className="w-4 h-4"/> เข้าสู่ระบบ</button>
           )}
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={currentUser} onEditProfile={() => setModal({open: true, type: 'profile'})} onLogout={handleLogout} setView={setView} onLoginClick={() => setView('auth')} />

      <main className="max-w-6xl mx-auto p-4 md:p-6 mt-2">
        {activeChat ? <ChatRoom trip={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} onSendMessage={(t) => { const msg = { sender: currentUser.name, text: t, time: 'Now' }; const updated = posts.map(p => p.id === activeChat.id ? { ...p, chat: [...(p.chat||[]), msg] } : p); setPosts(updated); setActiveChat({...activeChat, chat: [...(activeChat.chat||[]), msg]}); }} /> :
         activeTripDetail ? <TripDetailModal post={activeTripDetail} user={currentUser} onClose={() => setActiveTripDetail(null)} onChat={() => requireAuth(() => {setActiveChat(activeTripDetail); setActiveTripDetail(null);})} onJoin={() => requireAuth(() => handleJoin(activeTripDetail))} usersDb={dbUsers} /> : 
         renderView()}
      </main>
      
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in zoom-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh] shadow-2xl">
            <button onClick={() => setModal({open: false})} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><XCircle/></button>
            {modal.type === 'profile' && <ProfileModal user={currentUser} onClose={() => setModal({open: false})} onSave={(d) => { 
                const upd = dbUsers.map(u => u.id === currentUser.id ? d : u); 
                setDbUsers(upd); 
                localStorage.setItem('tb_users_v41', JSON.stringify(upd)); // Update global DB
                setCurrentUser({...currentUser, ...d}); 
                setModal({ open: false }); 
            }} />}
            {modal.type === 'payment' && (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="text-sm text-gray-500 mb-1">ยอดชำระทั้งหมด</div>
                    <div className="text-4xl font-bold text-blue-600">฿{(modal.data.price || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-2">{modal.data.title}</div>
                </div>
                <div className="text-left">
                    <FileUploader label="หลักฐานการโอนเงิน (สลิป)" type="image" onUpload={(url)=>{ }} />
                </div>
                <Button variant="success" className="w-full py-3 text-lg shadow-lg" onClick={createPayment}>ยืนยันการแจ้งโอน</Button>
              </div>
            )}
            {modal.type === 'create_service' && (
              <div className="space-y-4"><h3 className="font-bold text-xl text-gray-800">ลงประกาศบริการ</h3><div className="flex gap-2 p-1 bg-gray-100 rounded-lg"><button onClick={() => setNewItem({...newItem, type: 'accommodation'})} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${newItem.type !== 'transport' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>ที่พัก</button><button onClick={() => setNewItem({...newItem, type: 'transport'})} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${newItem.type === 'transport' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}>รถเช่า</button></div><input className="w-full border p-3 rounded-lg" placeholder="ชื่อบริการ / ที่พัก" onChange={e => setNewItem({...newItem, name: e.target.value})} /><div className="grid grid-cols-2 gap-3"><input className="w-full border p-3 rounded-lg" placeholder="จังหวัด" onChange={e => setNewItem({...newItem, location: e.target.value})} /><input className="w-full border p-3 rounded-lg" type="number" placeholder="ราคาเริ่มต้น" onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} /></div><textarea className="w-full border p-3 rounded-lg h-24 resize-none" placeholder="รายละเอียดบริการ..." onChange={e => setNewItem({...newItem, desc: e.target.value})} /><FileUploader label="รูปภาพประกอบ" type="image" onUpload={handleServiceUpload}/><Button onClick={createService} className="w-full py-3 shadow-lg">ส่งตรวจสอบ</Button></div>
            )}
            {modal.type === 'create_post' && (
              <div className="space-y-5">
                <h3 className="font-bold text-xl text-gray-800">สร้างทริปหาเพื่อน</h3>
                <div className="flex gap-3">
                    <button onClick={() => setNewItem({...newItem, type: 'trip'})} className={`flex-1 py-3 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${newItem.type !== 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}><Map className="w-5 h-5"/> ทริปเที่ยว</button>
                    <button onClick={() => setNewItem({...newItem, type: 'video'})} className={`flex-1 py-3 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${newItem.type === 'video' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'}`}><Video className="w-5 h-5"/> คลิปวิดีโอ</button>
                </div>
                <div className="space-y-3">
                    <input className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition-colors" placeholder="ชื่อทริปที่อยากไป..." onChange={e => setNewItem({...newItem, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                        <input className="w-full border p-3 rounded-lg" placeholder="สถานที่" onChange={e => setNewItem({...newItem, location: e.target.value})} />
                        {newItem.type !== 'video' && <input className="w-full border p-3 rounded-lg" type="date" onChange={e => setNewItem({...newItem, date: e.target.value})} />}
                    </div>
                    {newItem.type !== 'video' && (
                        <div className="grid grid-cols-2 gap-3">
                            <input className="w-full border p-3 rounded-lg" type="number" placeholder="ค่าใช้จ่าย (บาท)" onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} />
                            <input className="w-full border p-3 rounded-lg" type="number" placeholder="รับกี่คน" onChange={e => setNewItem({...newItem, maxPeople: e.target.value})} />
                        </div>
                    )}
                    <textarea className="w-full border p-3 rounded-lg h-24 bg-gray-50 focus:bg-white resize-none" placeholder="รายละเอียดการเดินทาง..." value={newItem.desc || ''} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
                    <FileUploader label={newItem.type === 'video' ? "อัปโหลดวิดีโอ" : "รูปปกทริป"} type={newItem.type==='video'?'video':'image'} onUpload={(url)=>setNewItem({...newItem, media:url})}/>
                </div>
                <Button className="w-full py-3 shadow-lg font-bold text-lg" onClick={() => { setPosts([{...newItem, id: Date.now(), author: currentUser.name, chat: [], likes: 0, participants: [], price: newItem.price || 0 }, ...posts]); setModal({open: false}); }}>โพสต์เลย</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}