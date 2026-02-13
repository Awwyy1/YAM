import React, { useState, useEffect, useRef } from 'react';
import {
  loginAdmin,
  logoutAdmin,
  onAuthChange,
  db,
  storage
} from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from 'firebase/auth';
import { LogOut, Plus, Trash2, Save, Coffee, Leaf, Cookie, Loader2, AlertCircle, Check, Image, ShoppingBag, Type, MapPin, Sparkles, Upload, Sun, Moon, Gamepad2, Eye } from 'lucide-react';

// Types
interface MenuItem {
  id: string;
  name_en: string;
  name_ge: string;
  price: string;
  desc_en: string;
  desc_ge: string;
  order: number;
}

interface DrinkItem {
  id: string;
  name_en: string;
  name_ge: string;
  note_en: string;
  note_ge: string;
  img: string;
  order: number;
}

interface ShopItem {
  id: string;
  name_en: string;
  name_ge: string;
  color_en: string;
  color_ge: string;
  price: string;
  img: string;
  desc_en: string;
  desc_ge: string;
  comingSoon: boolean;
  order: number;
}

interface HeroContent {
  since_en: string;
  since_ge: string;
  title1_en: string;
  title1_ge: string;
  title2_en: string;
  title2_ge: string;
  title3_en: string;
  title3_ge: string;
  cta_en: string;
  cta_ge: string;
}

interface ContactsContent {
  location_en: string;
  location_ge: string;
  city_en: string;
  city_ge: string;
  hours_week_en: string;
  hours_week_ge: string;
  hours_weekend_en: string;
  hours_weekend_ge: string;
  visit_desc_en: string;
  visit_desc_ge: string;
}

interface BrandContent {
  title1_en: string;
  title1_ge: string;
  title_accent_en: string;
  title_accent_ge: string;
  desc_en: string;
  desc_ge: string;
  stat1: string;
  stat1_label_en: string;
  stat1_label_ge: string;
  stat2: string;
  stat2_label_en: string;
  stat2_label_ge: string;
  feature1_title_en: string;
  feature1_title_ge: string;
  feature1_text_en: string;
  feature1_text_ge: string;
  feature2_title_en: string;
  feature2_title_ge: string;
  feature2_text_en: string;
  feature2_text_ge: string;
  feature3_title_en: string;
  feature3_title_ge: string;
  feature3_text_en: string;
  feature3_text_ge: string;
}

interface GameContent {
  label_en: string;
  label_ge: string;
  title1_en: string;
  title1_ge: string;
  title2_en: string;
  title2_ge: string;
  title_accent_en: string;
  title_accent_ge: string;
  desc_en: string;
  desc_ge: string;
  enter_code_en: string;
  enter_code_ge: string;
  get_code_en: string;
  get_code_ge: string;
  start_en: string;
  start_ge: string;
  locked_desc_en: string;
  locked_desc_ge: string;
  how_to_unlock_en: string;
  how_to_unlock_ge: string;
  step1_en: string;
  step1_ge: string;
  step2_en: string;
  step2_ge: string;
  step3_en: string;
  step3_ge: string;
  have_code_en: string;
  have_code_ge: string;
  code_placeholder_en: string;
  code_placeholder_ge: string;
  unlock_btn_en: string;
  unlock_btn_ge: string;
  row_en: string;
  row_ge: string;
  win_title_en: string;
  win_title_ge: string;
  win_desc_en: string;
  win_desc_ge: string;
  lose_title_en: string;
  lose_title_ge: string;
  lose_desc_en: string;
  lose_desc_ge: string;
  retry_en: string;
  retry_ge: string;
  ticket_id_en: string;
  ticket_id_ge: string;
  valid_until_en: string;
  valid_until_ge: string;
}

interface OracleContent {
  label_en: string;
  label_ge: string;
  title1_en: string;
  title1_ge: string;
  title_accent_en: string;
  title_accent_ge: string;
  desc_en: string;
  desc_ge: string;
  btn_sip_en: string;
  btn_sip_ge: string;
  btn_reading_en: string;
  btn_reading_ge: string;
  btn_retry_en: string;
  btn_retry_ge: string;
  instruction_en: string;
  instruction_ge: string;
  predictions_en: string[];
  predictions_ge: string[];
}

type Tab = 'menu' | 'drinks' | 'shop' | 'hero' | 'contacts' | 'brand' | 'game' | 'oracle';
type MenuCategory = 'coffee' | 'tea' | 'extra';

// Fallback data for initialization
const INIT_COFFEE = [
  { name_en: 'Espresso', name_ge: 'ესპრესო', price: '₾4.00', desc_en: 'Bold & intense signature blend', desc_ge: 'მკვეთრი და ინტენსიური ნაზავი' },
  { name_en: 'Espresso Macchiato', name_ge: 'ესპრესო მაკიატო', price: '₾4.50', desc_en: 'Espresso with a dollop of foam', desc_ge: 'ესპრესო ქაფის წვეთით' },
  { name_en: 'Americano', name_ge: 'ამერიკანო', price: '₾4.50', desc_en: 'Espresso with hot water', desc_ge: 'ესპრესო ცხელ წყალზე' },
  { name_en: 'Americano + Milk', name_ge: 'ამერიკანო + რძე', price: '₾5.00', desc_en: 'Americano with steamed milk', desc_ge: 'ამერიკანო ცხელი რძით' },
  { name_en: 'Cappuccino', name_ge: 'კაპუჩინო', price: '₾5.00', desc_en: 'Balanced espresso, milk and foam', desc_ge: 'ესპრესოსა და რძის ბალანსი' },
  { name_en: 'Raf Coffee', name_ge: 'რაფ ყავა', price: '₾6.00', desc_en: 'Espresso, cream and vanilla sugar', desc_ge: 'ესპრესო, ნაღები და ვანილის შაქარი' },
  { name_en: 'Latte Macchiato', name_ge: 'ლატე მაკიატო', price: '₾5.50', desc_en: 'Layered milk and espresso', desc_ge: 'რძის და ესპრესოს ფენები' },
  { name_en: 'Matcha Latte', name_ge: 'მატჩა ლატე', price: '₾6.00', desc_en: 'Ceremonial grade matcha with steamed milk', desc_ge: 'მატჩა ცხელი რძით' },
  { name_en: 'Cocoa', name_ge: 'კაკაო', price: '₾5.00', desc_en: 'Rich hot chocolate', desc_ge: 'მდიდარი ცხელი შოკოლადი' },
  { name_en: 'Double Espresso', name_ge: 'ორმაგი ესპრესო', price: '₾5.50', desc_en: 'Two shots of signature blend', desc_ge: 'ორი შოთი საფირმო ნაზავით' },
  { name_en: 'Double Espresso Macchiato', name_ge: 'ორმაგი ესპრესო მაკიატო', price: '₾6.00', desc_en: 'Double shot with foam', desc_ge: 'ორმაგი შოთი ქაფით' },
  { name_en: 'Double Americano', name_ge: 'ორმაგი ამერიკანო', price: '₾6.00', desc_en: 'Double shot with hot water', desc_ge: 'ორმაგი შოთი წყალზე' },
  { name_en: 'Double Americano + Milk', name_ge: 'ორმაგი ამერიკანო + რძე', price: '₾6.50', desc_en: 'Double americano with steamed milk', desc_ge: 'ორმაგი ამერიკანო რძით' },
  { name_en: 'Double Cappuccino', name_ge: 'ორმაგი კაპუჩინო', price: '₾6.50', desc_en: 'Double shot cappuccino', desc_ge: 'ორმაგი კაპუჩინო' },
];

const INIT_TEA = [
  { name_en: 'Green Tea', name_ge: 'მწვანე ჩაი', price: '₾3.50', desc_en: 'Classic Japanese sencha, light and grassy', desc_ge: 'კლასიკური იაპონური სენჩა' },
  { name_en: 'Earl Grey', name_ge: 'ერლ გრეი', price: '₾3.50', desc_en: 'Black tea with Italian bergamot oil', desc_ge: 'შავი ჩაი ბერგამოტის ზეთით' },
  { name_en: 'Matcha', name_ge: 'მატჩა', price: '₾5.00', desc_en: 'Ceremonial grade Japanese green tea powder', desc_ge: 'იაპონური მწვანე ჩაის ფხვნილი' },
  { name_en: 'Jasmine Oolong', name_ge: 'ჟასმინის ოლონგი', price: '₾4.00', desc_en: 'Semi-oxidized leaves with jasmine blossoms', desc_ge: 'ნახევრად ფერმენტირებული ჟასმინით' },
  { name_en: 'Fresh Mint', name_ge: 'ახალი პიტნა', price: '₾3.75', desc_en: 'Hand-picked garden mint, served hot', desc_ge: 'ბაღის პიტნა, ცხლად მიწოდებული' },
];

const INIT_EXTRA = [
  { name_en: 'Croissant', name_ge: 'კრუასანი', price: '₾4.50', desc_en: 'French butter croissant, baked fresh daily', desc_ge: 'ფრანგული კარაქის კრუასანი, ყოველდღე ახალი' },
  { name_en: 'Almond Croissant', name_ge: 'ნუშის კრუასანი', price: '₾5.50', desc_en: 'Filled with almond cream and toasted flakes', desc_ge: 'ნუშის კრემით და შემწვარი ფანტელებით' },
  { name_en: 'Banana Bread', name_ge: 'ბანანის პური', price: '₾4.00', desc_en: 'Homemade with walnuts and dark chocolate', desc_ge: 'ნიგვზით და შავი შოკოლადით' },
  { name_en: 'Cheesecake', name_ge: 'ჩიზქეიქი', price: '₾6.50', desc_en: 'New York style, creamy and dense', desc_ge: 'ნიუ-იორკის სტილი, კრემისებრი' },
  { name_en: 'Cookie', name_ge: 'ქუქი', price: '₾3.00', desc_en: 'Chunky chocolate chip, soft center', desc_ge: 'შოკოლადის ნატეხებით, რბილი შუაგული' },
  { name_en: 'Granola Bowl', name_ge: 'გრანოლა ბოულ', price: '₾7.00', desc_en: 'Greek yogurt, honey, seasonal fruits', desc_ge: 'ბერძნული იოგურტი, თაფლი, ხილი' },
  { name_en: 'Avocado Toast', name_ge: 'ავოკადო ტოსტი', price: '₾8.50', desc_en: 'Sourdough, smashed avo, chili flakes, egg', desc_ge: 'სოურდო, ავოკადო, ჩილი, კვერცხი' },
];

const INIT_DRINKS = [
  { name_en: 'YAM SPECIAL', name_ge: 'YAM სპეშალი', note_en: 'Honey-infused cold brew & sea salt.', note_ge: 'თაფლიანი ქოლდ ბრიუ და ზღვის მარილი.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' },
  { name_en: 'SILKY FLAT WHITE', name_ge: 'სილქი ფლეთ უაითი', note_en: 'Micro-foam over double ristretto.', note_ge: 'მიკრო-ქაფი ორმაგ რისტრეტოზე.', img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80' },
  { name_en: 'BATCH BREW', name_ge: 'ბეჩ ბრიუ', note_en: 'Ethiopia, floral & light body.', note_ge: 'ეთიოპია, ყვავილოვანი და მსუბუქი.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
];

const INIT_SHOP = [
  { name_en: 'YAM ARCHIVE TEE', name_ge: 'YAM არქივ TEE', color_en: 'BLAZE ORANGE', color_ge: 'მკვეთრი ნარინჯისფერი', price: '₾45.00', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', desc_en: 'Heavyweight cotton with puff print logo.', desc_ge: 'მძიმე ბამბა, მოცულობითი ლოგო.', comingSoon: true },
  { name_en: 'ABSTRACT NOIR', name_ge: 'აბსტრაქტ ნუარი', color_en: 'MIDNIGHT BLACK', color_ge: 'შუაღამის შავი', price: '₾50.00', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', desc_en: 'Oversized fit. Back abstract tonal print.', desc_ge: 'ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.', comingSoon: true },
  { name_en: 'YAM HOODIE', name_ge: 'YAM ჰუდი', color_en: 'VOID', color_ge: 'VOID', price: '₾85.00', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', desc_en: '', desc_ge: '', comingSoon: true },
  { name_en: 'CANVAS TOTE', name_ge: 'ტილოს ჩანთა', color_en: 'RAW', color_ge: 'RAW', price: '₾25.00', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', desc_en: '', desc_ge: '', comingSoon: true },
];

const INIT_HERO: HeroContent = {
  since_en: 'SINCE 2026',
  since_ge: '2026 წლიდან',
  title1_en: 'GOOD',
  title1_ge: 'კარგი',
  title2_en: 'MORNINGS',
  title2_ge: 'დილა იწყება',
  title3_en: 'START WITH',
  title3_ge: '',
  cta_en: "TODAY'S BREW",
  cta_ge: 'დღის ყავა',
};

const INIT_CONTACTS: ContactsContent = {
  location_en: 'Coming soon',
  location_ge: 'მალე',
  city_en: 'GE, Batumi',
  city_ge: 'საქართველო, ბათუმი',
  hours_week_en: 'Mon - Fri: 09:00 - 21:00',
  hours_week_ge: 'ორშ - პარ: 09:00 - 21:00',
  hours_weekend_en: 'Sat - Sun: 10:00 - 21:00',
  hours_weekend_ge: 'შაბ - კვი: 10:00 - 21:00',
  visit_desc_en: 'Experience the full sensory immersion of Yam Coffee at our flagship roastery and cafe.',
  visit_desc_ge: 'განიცადეთ Yam Coffee-ს სრული სენსორული გამოცდილება ჩვენს ფლაგმან როსტერიასა და კაფეში.',
};

const INIT_BRAND: BrandContent = {
  title1_en: "HEY, IT'S",
  title1_ge: 'ჰეი, ეს არის',
  title_accent_en: 'YAM.',
  title_accent_ge: 'YAM.',
  desc_en: "We opened in 2026 because we wanted a spot to hang out ourselves. Turns out, other people wanted that too. Now we make coffee and try not to overthink it.",
  desc_ge: 'გავხსენით 2026-ში, რადგან გვინდოდა ადგილი სადაც თვითონ დავსხდებოდით. აღმოჩნდა, რომ სხვებსაც იგივე უნდოდათ. ახლა ვამზადებთ ყავას და ვცდილობთ არ გადავაჭარბოთ.',
  stat1: '2026',
  stat1_label_en: 'BORN',
  stat1_label_ge: 'დაარსდა',
  stat2: 'BATUMI',
  stat2_label_en: 'BASED',
  stat2_label_ge: 'მდებარეობა',
  feature1_title_en: 'Friendly',
  feature1_title_ge: 'მეგობრული',
  feature1_text_en: 'We like people. Even before the first cup.',
  feature1_text_ge: 'გვიყვარს ხალხი. პირველ ფინჯანამდეც კი.',
  feature2_title_en: 'Honest',
  feature2_title_ge: 'გულწრფელი',
  feature2_text_en: 'Good beans. Fair prices. No gimmicks.',
  feature2_text_ge: 'კარგი მარცვალი. სამართლიანი ფასი. ხრიკების გარეშე.',
  feature3_title_en: 'Open',
  feature3_title_ge: 'ღია',
  feature3_text_en: 'Walk in as a stranger, leave as a regular.',
  feature3_text_ge: 'შემოდი უცხოდ, წადი როგორც მუდმივი.',
};

const INIT_GAME: GameContent = {
  label_en: 'YAM TOWER',
  label_ge: 'YAM TOWER',
  title1_en: 'PLAY',
  title1_ge: 'ითამაშე',
  title2_en: 'TO',
  title2_ge: 'და',
  title_accent_en: 'WIN.',
  title_accent_ge: 'მოიგე.',
  desc_en: 'Climb 8 rows without hitting a bomb. Reach the top to win a free signature coffee.',
  desc_ge: 'ავიდეთ 8 საფეხურზე ბომბის გარეშე. მიაღწიეთ მწვერვალს და მიიღეთ უფასო ყავა.',
  enter_code_en: 'Enter Access Code',
  enter_code_ge: 'შეიყვანეთ კოდი',
  get_code_en: 'Get Access Code',
  get_code_ge: 'მიიღეთ კოდი',
  start_en: 'Start Game',
  start_ge: 'დაწყება',
  locked_desc_en: 'This game is exclusive. Share to unlock.',
  locked_desc_ge: 'თამაში ექსკლუზიურია. გააზიარეთ გასახსნელად.',
  how_to_unlock_en: 'How to Unlock',
  how_to_unlock_ge: 'როგორ გავხსნათ',
  step1_en: 'Take a screenshot of this page.',
  step1_ge: 'გადაიღეთ ეკრანის სურათი (Screenshot).',
  step2_en: 'Post to your Instagram Story & tag @yam.coffee',
  step2_ge: 'დაპოსტეთ ინსტაგრამ სთორიში და მონიშნეთ @yam.coffee',
  step3_en: 'We will DM you the daily access code.',
  step3_ge: 'ჩვენ გამოგიგზავნით დღიურ კოდს პირადში.',
  have_code_en: 'I have a code',
  have_code_ge: 'მაქვს კოდი',
  code_placeholder_en: 'Enter code...',
  code_placeholder_ge: 'შეიყვანეთ კოდი...',
  unlock_btn_en: 'Unlock Game',
  unlock_btn_ge: 'გახსნა',
  row_en: 'Row',
  row_ge: 'რიგი',
  win_title_en: 'YOU WON!',
  win_title_ge: 'თქვენ მოიგეთ!',
  win_desc_en: 'Screenshot this ticket and show it to our barista.',
  win_desc_ge: 'გადაუღეთ ეკრანს სურათი და აჩვენეთ ბარისტას.',
  lose_title_en: 'BOOM!',
  lose_title_ge: 'ბუმ!',
  lose_desc_en: 'You hit a bad bean. Better luck next time.',
  lose_desc_ge: 'ცუდი მარცვალი შეგხვდათ. სცადეთ თავიდან.',
  retry_en: 'Try Again',
  retry_ge: 'თავიდან',
  ticket_id_en: 'TICKET ID',
  ticket_id_ge: 'ბილეთის ID',
  valid_until_en: 'VALID FOR 24H',
  valid_until_ge: 'აქტიურია 24სთ',
};

const INIT_ORACLE: OracleContent = {
  label_en: 'YAM ORACLE',
  label_ge: 'YAM ორაკული',
  title1_en: 'DIGITAL',
  title1_ge: 'ციფრული',
  title_accent_en: 'FATE.',
  title_accent_ge: 'ბედი.',
  desc_en: 'Read your coffee grounds and get a fortune told.',
  desc_ge: 'იმკითხავე ყავის ნალექზე და მიიღე წინასწარმეტყველება.',
  btn_sip_en: 'TAKE A SIP',
  btn_sip_ge: 'მოსვი ყავა',
  btn_reading_en: 'READING GROUNDS...',
  btn_reading_ge: 'ვიკვლევ ნალექს...',
  btn_retry_en: 'CONSULT AGAIN',
  btn_retry_ge: 'თავიდან',
  instruction_en: 'Focus on your question...',
  instruction_ge: 'კონცენტრირდი კითხვაზე...',
  predictions_en: [
    'Focus on the grind today. The results will brew.',
    'Unexpected sweetness is hiding in the bitter moments.',
    'Your energy is roasting perfectly. Don\'t burn it.',
    'A bold move will bring a rich finish.',
    'Let it steep a little longer. Patience is key.',
    'The sediment settles in your favor today.',
    'Like a good espresso, keep it short and strong.',
    'Clarity comes with the next cup.',
    'The foam of uncertainty will vanish soon.',
    'Trust your gut, it\'s caffeinated.',
  ],
  predictions_ge: [
    'ფოკუსირდი მთავარზე. შედეგი მოიხარშება.',
    'მოულოდნელი სიტკბო იმალება სიმწარეში.',
    'შენი ენერგია იდეალურად იხალება. არ დაწვა.',
    'თამამი ნაბიჯი მდიდარ გემოს მოიტანს.',
    'ცოტა ხანს კიდევ დაელოდე. მოთმინება გასაღებია.',
    'ნალექი შენს სასარგებლოდ ლაგდება.',
    'კარგი ესპრესოსავით, იყავი მოკლე და ძლიერი.',
    'სიმკვეთრე შემდეგ ჭიქასთან ერთად მოვა.',
    'გაურკვევლობის ქაფი მალე გაქრება.',
    'ენდე ინტუიციას, ის კოფეინითაა სავსე.',
  ],
};

// Theme colors
const THEME = {
  dark: {
    bg: '#0A0A0A',
    card: '#161616',
    border: '#333',
    text: '#FFFFFF',
    textMuted: '#9CA3AF',
    input: '#0A0A0A',
  },
  light: {
    bg: '#F4F4F2',
    card: '#FFFFFF',
    border: '#E5E5E5',
    text: '#0A0A0A',
    textMuted: '#6B7280',
    input: '#FFFFFF',
  },
};

// Image upload component
const ImageUpload: React.FC<{
  currentUrl: string;
  onUpload: (url: string) => void;
  folder: string;
  id: string;
}> = ({ currentUrl, onUpload, folder, id }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 uppercase">Image</label>
      <div className="flex gap-3 items-center">
        {currentUrl && (
          <img src={currentUrl} alt="" className="w-16 h-16 object-cover rounded" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] border border-gray-700 rounded text-sm hover:border-[#FF3B30] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      <input
        type="text"
        value={currentUrl}
        onChange={(e) => onUpload(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white text-sm focus:outline-none focus:border-[#FF3B30]"
      />
    </div>
  );
};

// Admin Panel Component
const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [menuCategory, setMenuCategory] = useState<MenuCategory>('coffee');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [hero, setHero] = useState<HeroContent>(INIT_HERO);
  const [contacts, setContacts] = useState<ContactsContent>(INIT_CONTACTS);
  const [brand, setBrand] = useState<BrandContent>(INIT_BRAND);
  const [game, setGame] = useState<GameContent>(INIT_GAME);
  const [oracle, setOracle] = useState<OracleContent>(INIT_ORACLE);

  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Theme state - read from localStorage
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-theme');
      return saved !== 'light';
    }
    return true;
  });
  const theme = isDark ? THEME.dark : THEME.light;

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('admin-theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab, menuCategory]);

  const loadData = async () => {
    try {
      if (activeTab === 'menu') {
        const snap = await getDocs(collection(db, `menu_${menuCategory}`));
        const items: MenuItem[] = [];
        snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as MenuItem));
        setMenuItems(items.sort((a, b) => a.order - b.order));
      } else if (activeTab === 'drinks') {
        const snap = await getDocs(collection(db, 'drinks'));
        const items: DrinkItem[] = [];
        snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as DrinkItem));
        setDrinks(items.sort((a, b) => a.order - b.order));
      } else if (activeTab === 'shop') {
        const snap = await getDocs(collection(db, 'shop'));
        const items: ShopItem[] = [];
        snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as ShopItem));
        setShopItems(items.sort((a, b) => a.order - b.order));
      } else if (activeTab === 'hero') {
        const snap = await getDocs(collection(db, 'content'));
        snap.forEach((doc) => {
          if (doc.id === 'hero') setHero(doc.data() as HeroContent);
        });
      } else if (activeTab === 'contacts') {
        const snap = await getDocs(collection(db, 'content'));
        snap.forEach((doc) => {
          if (doc.id === 'contacts') setContacts(doc.data() as ContactsContent);
        });
      } else if (activeTab === 'brand') {
        const snap = await getDocs(collection(db, 'content'));
        snap.forEach((doc) => {
          if (doc.id === 'brand') setBrand(doc.data() as BrandContent);
        });
      } else if (activeTab === 'game') {
        const snap = await getDocs(collection(db, 'content'));
        snap.forEach((doc) => {
          if (doc.id === 'game') setGame(doc.data() as GameContent);
        });
      } else if (activeTab === 'oracle') {
        const snap = await getDocs(collection(db, 'content'));
        snap.forEach((doc) => {
          if (doc.id === 'oracle') setOracle(doc.data() as OracleContent);
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await loginAdmin(email, password);
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Menu handlers
  const saveMenuItem = async (item: MenuItem) => {
    setSaving(item.id);
    try {
      await setDoc(doc(db, `menu_${menuCategory}`, item.id), {
        name_en: item.name_en,
        name_ge: item.name_ge,
        price: item.price,
        desc_en: item.desc_en,
        desc_ge: item.desc_ge,
        order: item.order
      });
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteDoc(doc(db, `menu_${menuCategory}`, id));
      showMessage('success', 'Deleted!');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `${menuCategory}_${Date.now()}`,
      name_en: 'New Item',
      name_ge: 'ახალი',
      price: '₾0.00',
      desc_en: 'Description',
      desc_ge: 'აღწერა',
      order: menuItems.length
    };
    setMenuItems([...menuItems, newItem]);
  };

  // Drink handlers
  const saveDrink = async (item: DrinkItem) => {
    setSaving(item.id);
    try {
      await setDoc(doc(db, 'drinks', item.id), {
        name_en: item.name_en,
        name_ge: item.name_ge,
        note_en: item.note_en,
        note_ge: item.note_ge,
        img: item.img,
        order: item.order
      });
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const deleteDrink = async (id: string) => {
    if (!confirm('Delete this drink?')) return;
    try {
      await deleteDoc(doc(db, 'drinks', id));
      showMessage('success', 'Deleted!');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const addDrink = () => {
    const newItem: DrinkItem = {
      id: `drink_${Date.now()}`,
      name_en: 'New Drink',
      name_ge: 'ახალი სასმელი',
      note_en: 'Description',
      note_ge: 'აღწერა',
      img: '',
      order: drinks.length
    };
    setDrinks([...drinks, newItem]);
  };

  // Shop handlers
  const saveShopItem = async (item: ShopItem) => {
    setSaving(item.id);
    try {
      await setDoc(doc(db, 'shop', item.id), {
        name_en: item.name_en,
        name_ge: item.name_ge,
        color_en: item.color_en,
        color_ge: item.color_ge,
        price: item.price,
        img: item.img,
        desc_en: item.desc_en,
        desc_ge: item.desc_ge,
        comingSoon: item.comingSoon,
        order: item.order
      });
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const deleteShopItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'shop', id));
      showMessage('success', 'Deleted!');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const addShopItem = () => {
    const newItem: ShopItem = {
      id: `shop_${Date.now()}`,
      name_en: 'New Item',
      name_ge: 'ახალი ნივთი',
      color_en: 'Color',
      color_ge: 'ფერი',
      price: '₾0.00',
      img: '',
      desc_en: '',
      desc_ge: '',
      comingSoon: true,
      order: shopItems.length
    };
    setShopItems([...shopItems, newItem]);
  };

  // Content handlers
  const saveHero = async () => {
    setSaving('hero');
    try {
      await setDoc(doc(db, 'content', 'hero'), hero);
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const saveContacts = async () => {
    setSaving('contacts');
    try {
      await setDoc(doc(db, 'content', 'contacts'), contacts);
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const saveBrand = async () => {
    setSaving('brand');
    try {
      await setDoc(doc(db, 'content', 'brand'), brand);
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const saveGame = async () => {
    setSaving('game');
    try {
      await setDoc(doc(db, 'content', 'game'), game);
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const saveOracle = async () => {
    setSaving('oracle');
    try {
      await setDoc(doc(db, 'content', 'oracle'), oracle);
      showMessage('success', 'Saved!');
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  // Initialize all data
  const initializeAllData = async () => {
    if (!confirm('Initialize all data? This will populate Firebase with default content.')) return;
    setIsInitializing(true);
    try {
      // Menu
      for (let i = 0; i < INIT_COFFEE.length; i++) {
        await setDoc(doc(db, 'menu_coffee', `coffee_${i}`), { ...INIT_COFFEE[i], order: i });
      }
      for (let i = 0; i < INIT_TEA.length; i++) {
        await setDoc(doc(db, 'menu_tea', `tea_${i}`), { ...INIT_TEA[i], order: i });
      }
      for (let i = 0; i < INIT_EXTRA.length; i++) {
        await setDoc(doc(db, 'menu_extra', `extra_${i}`), { ...INIT_EXTRA[i], order: i });
      }
      // Drinks
      for (let i = 0; i < INIT_DRINKS.length; i++) {
        await setDoc(doc(db, 'drinks', `drink_${i}`), { ...INIT_DRINKS[i], order: i });
      }
      // Shop
      for (let i = 0; i < INIT_SHOP.length; i++) {
        await setDoc(doc(db, 'shop', `shop_${i}`), { ...INIT_SHOP[i], order: i });
      }
      // Content
      await setDoc(doc(db, 'content', 'hero'), INIT_HERO);
      await setDoc(doc(db, 'content', 'contacts'), INIT_CONTACTS);
      await setDoc(doc(db, 'content', 'brand'), INIT_BRAND);
      await setDoc(doc(db, 'content', 'game'), INIT_GAME);
      await setDoc(doc(db, 'content', 'oracle'), INIT_ORACLE);

      showMessage('success', 'All data initialized!');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setIsInitializing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF3B30] animate-spin" />
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">YAM</h1>
            <p className="text-gray-500 mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#161616] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B30]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#161616] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B30]"
            />
            {loginError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-[#FF3B30] text-white font-bold rounded-lg hover:bg-[#FF3B30]/90 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">YAM Admin</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={initializeAllData}
              disabled={isInitializing}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-[#161616] border border-gray-700 rounded hover:border-[#FF3B30] transition-colors disabled:opacity-50"
            >
              {isInitializing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Init All Data
            </button>
            <button
              onClick={() => logoutAdmin()}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Main Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'menu', icon: Coffee, label: 'Menu' },
              { id: 'drinks', icon: Image, label: 'Drinks' },
              { id: 'shop', icon: ShoppingBag, label: 'Shop' },
              { id: 'hero', icon: Type, label: 'Hero' },
              { id: 'contacts', icon: MapPin, label: 'Contacts' },
              { id: 'brand', icon: Sparkles, label: 'Brand' },
              { id: 'game', icon: Gamepad2, label: 'Game' },
              { id: 'oracle', icon: Eye, label: 'Oracle' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-[#FF3B30] text-white' : 'text-gray-400 hover:text-white hover:bg-[#161616]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-4">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <>
            <div className="flex gap-2 mb-6">
              {(['coffee', 'tea', 'extra'] as MenuCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMenuCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    menuCategory === cat ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {cat === 'coffee' && <Coffee className="w-4 h-4" />}
                  {cat === 'tea' && <Leaf className="w-4 h-4" />}
                  {cat === 'extra' && <Cookie className="w-4 h-4" />}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 bg-[#161616] rounded-lg border border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (EN)</label>
                      <input
                        type="text"
                        value={item.name_en}
                        onChange={(e) => setMenuItems(items => items.map(i => i.id === item.id ? { ...i, name_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                      <input
                        type="text"
                        value={item.desc_en}
                        onChange={(e) => setMenuItems(items => items.map(i => i.id === item.id ? { ...i, desc_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (GE)</label>
                      <input
                        type="text"
                        value={item.name_ge}
                        onChange={(e) => setMenuItems(items => items.map(i => i.id === item.id ? { ...i, name_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                      <input
                        type="text"
                        value={item.desc_ge}
                        onChange={(e) => setMenuItems(items => items.map(i => i.id === item.id ? { ...i, desc_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 uppercase">Price</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => setMenuItems(items => items.map(i => i.id === item.id ? { ...i, price: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="flex gap-2 pt-5">
                      <button onClick={() => saveMenuItem(item)} disabled={saving === item.id} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                        {saving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                      </button>
                      <button onClick={() => deleteMenuItem(item.id)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addMenuItem} className="mt-4 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-[#FF3B30] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Item
            </button>
          </>
        )}

        {/* Drinks Tab */}
        {activeTab === 'drinks' && (
          <>
            <p className="text-gray-500 text-sm mb-6">Featured drinks on homepage with photos</p>
            <div className="space-y-4">
              {drinks.map((item) => (
                <div key={item.id} className="p-4 bg-[#161616] rounded-lg border border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (EN)</label>
                      <input
                        type="text"
                        value={item.name_en}
                        onChange={(e) => setDrinks(items => items.map(i => i.id === item.id ? { ...i, name_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Note (EN)</label>
                      <input
                        type="text"
                        value={item.note_en}
                        onChange={(e) => setDrinks(items => items.map(i => i.id === item.id ? { ...i, note_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (GE)</label>
                      <input
                        type="text"
                        value={item.name_ge}
                        onChange={(e) => setDrinks(items => items.map(i => i.id === item.id ? { ...i, name_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Note (GE)</label>
                      <input
                        type="text"
                        value={item.note_ge}
                        onChange={(e) => setDrinks(items => items.map(i => i.id === item.id ? { ...i, note_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        currentUrl={item.img}
                        onUpload={(url) => setDrinks(items => items.map(i => i.id === item.id ? { ...i, img: url } : i))}
                        folder="drinks"
                        id={item.id}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800">
                    <button onClick={() => saveDrink(item)} disabled={saving === item.id} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                      {saving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button onClick={() => deleteDrink(item.id)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addDrink} className="mt-4 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-[#FF3B30] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Drink
            </button>
          </>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <>
            <p className="text-gray-500 text-sm mb-6">Merchandise items</p>
            <div className="space-y-4">
              {shopItems.map((item) => (
                <div key={item.id} className="p-4 bg-[#161616] rounded-lg border border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (EN)</label>
                      <input
                        type="text"
                        value={item.name_en}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, name_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Color (EN)</label>
                      <input
                        type="text"
                        value={item.color_en}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, color_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                      <input
                        type="text"
                        value={item.desc_en}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, desc_en: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Name (GE)</label>
                      <input
                        type="text"
                        value={item.name_ge}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, name_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Color (GE)</label>
                      <input
                        type="text"
                        value={item.color_ge}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, color_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                      <input
                        type="text"
                        value={item.desc_ge}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, desc_ge: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <ImageUpload
                        currentUrl={item.img}
                        onUpload={(url) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, img: url } : i))}
                        folder="shop"
                        id={item.id}
                      />
                      <label className="text-xs text-gray-500 uppercase">Price</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, price: e.target.value } : i))}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={item.comingSoon}
                          onChange={(e) => setShopItems(items => items.map(i => i.id === item.id ? { ...i, comingSoon: e.target.checked } : i))}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-400">Coming Soon</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800">
                    <button onClick={() => saveShopItem(item)} disabled={saving === item.id} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                      {saving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button onClick={() => deleteShopItem(item.id)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addShopItem} className="mt-4 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-[#FF3B30] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Item
            </button>
          </>
        )}

        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">Homepage hero section texts</p>
            <div className="p-4 bg-[#161616] rounded-lg border border-gray-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Since (EN)</label>
                  <input type="text" value={hero.since_en} onChange={(e) => setHero({ ...hero, since_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Since (GE)</label>
                  <input type="text" value={hero.since_ge} onChange={(e) => setHero({ ...hero, since_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (EN)</label>
                  <input type="text" value={hero.title1_en} onChange={(e) => setHero({ ...hero, title1_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (GE)</label>
                  <input type="text" value={hero.title1_ge} onChange={(e) => setHero({ ...hero, title1_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 2 (EN)</label>
                  <input type="text" value={hero.title2_en} onChange={(e) => setHero({ ...hero, title2_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 2 (GE)</label>
                  <input type="text" value={hero.title2_ge} onChange={(e) => setHero({ ...hero, title2_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 3 (EN)</label>
                  <input type="text" value={hero.title3_en} onChange={(e) => setHero({ ...hero, title3_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 3 (GE)</label>
                  <input type="text" value={hero.title3_ge} onChange={(e) => setHero({ ...hero, title3_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">CTA Button (EN)</label>
                  <input type="text" value={hero.cta_en} onChange={(e) => setHero({ ...hero, cta_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">CTA Button (GE)</label>
                  <input type="text" value={hero.cta_ge} onChange={(e) => setHero({ ...hero, cta_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button onClick={saveHero} disabled={saving === 'hero'} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {saving === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Hero
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">Location and hours information</p>
            <div className="p-4 bg-[#161616] rounded-lg border border-gray-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Location (EN)</label>
                  <input type="text" value={contacts.location_en} onChange={(e) => setContacts({ ...contacts, location_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Location (GE)</label>
                  <input type="text" value={contacts.location_ge} onChange={(e) => setContacts({ ...contacts, location_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">City (EN)</label>
                  <input type="text" value={contacts.city_en} onChange={(e) => setContacts({ ...contacts, city_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">City (GE)</label>
                  <input type="text" value={contacts.city_ge} onChange={(e) => setContacts({ ...contacts, city_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Hours Weekday (EN)</label>
                  <input type="text" value={contacts.hours_week_en} onChange={(e) => setContacts({ ...contacts, hours_week_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Hours Weekday (GE)</label>
                  <input type="text" value={contacts.hours_week_ge} onChange={(e) => setContacts({ ...contacts, hours_week_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Hours Weekend (EN)</label>
                  <input type="text" value={contacts.hours_weekend_en} onChange={(e) => setContacts({ ...contacts, hours_weekend_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Hours Weekend (GE)</label>
                  <input type="text" value={contacts.hours_weekend_ge} onChange={(e) => setContacts({ ...contacts, hours_weekend_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Visit Description (EN)</label>
                  <textarea value={contacts.visit_desc_en} onChange={(e) => setContacts({ ...contacts, visit_desc_en: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Visit Description (GE)</label>
                  <textarea value={contacts.visit_desc_ge} onChange={(e) => setContacts({ ...contacts, visit_desc_ge: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button onClick={saveContacts} disabled={saving === 'contacts'} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {saving === 'contacts' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Contacts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brand Tab */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">Brand page content</p>
            <div className="p-4 bg-[#161616] rounded-lg border border-gray-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title (EN)</label>
                  <input type="text" value={brand.title1_en} onChange={(e) => setBrand({ ...brand, title1_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title (GE)</label>
                  <input type="text" value={brand.title1_ge} onChange={(e) => setBrand({ ...brand, title1_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (EN)</label>
                  <input type="text" value={brand.title_accent_en} onChange={(e) => setBrand({ ...brand, title_accent_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (GE)</label>
                  <input type="text" value={brand.title_accent_ge} onChange={(e) => setBrand({ ...brand, title_accent_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                  <textarea value={brand.desc_en} onChange={(e) => setBrand({ ...brand, desc_en: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                  <textarea value={brand.desc_ge} onChange={(e) => setBrand({ ...brand, desc_ge: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Stat 1 Value</label>
                    <input type="text" value={brand.stat1} onChange={(e) => setBrand({ ...brand, stat1: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Stat 1 Label (EN)</label>
                    <input type="text" value={brand.stat1_label_en} onChange={(e) => setBrand({ ...brand, stat1_label_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Stat 2 Value</label>
                    <input type="text" value={brand.stat2} onChange={(e) => setBrand({ ...brand, stat2: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Stat 2 Label (EN)</label>
                    <input type="text" value={brand.stat2_label_en} onChange={(e) => setBrand({ ...brand, stat2_label_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Features</h4>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Feature {num} Title (EN)</label>
                      <input
                        type="text"
                        value={(brand as any)[`feature${num}_title_en`]}
                        onChange={(e) => setBrand({ ...brand, [`feature${num}_title_en`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Feature {num} Text (EN)</label>
                      <input
                        type="text"
                        value={(brand as any)[`feature${num}_text_en`]}
                        onChange={(e) => setBrand({ ...brand, [`feature${num}_text_en`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Feature {num} Title (GE)</label>
                      <input
                        type="text"
                        value={(brand as any)[`feature${num}_title_ge`]}
                        onChange={(e) => setBrand({ ...brand, [`feature${num}_title_ge`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <label className="text-xs text-gray-500 uppercase">Feature {num} Text (GE)</label>
                      <input
                        type="text"
                        value={(brand as any)[`feature${num}_text_ge`]}
                        onChange={(e) => setBrand({ ...brand, [`feature${num}_text_ge`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button onClick={saveBrand} disabled={saving === 'brand'} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {saving === 'brand' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Brand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Tab */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">YAM Tower game content</p>
            <div className="p-4 bg-[#161616] rounded-lg border border-gray-800 space-y-4">
              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Label (EN)</label>
                  <input type="text" value={game.label_en} onChange={(e) => setGame({ ...game, label_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Label (GE)</label>
                  <input type="text" value={game.label_ge} onChange={(e) => setGame({ ...game, label_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (EN)</label>
                  <input type="text" value={game.title1_en} onChange={(e) => setGame({ ...game, title1_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (GE)</label>
                  <input type="text" value={game.title1_ge} onChange={(e) => setGame({ ...game, title1_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 2 (EN)</label>
                  <input type="text" value={game.title2_en} onChange={(e) => setGame({ ...game, title2_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 2 (GE)</label>
                  <input type="text" value={game.title2_ge} onChange={(e) => setGame({ ...game, title2_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (EN)</label>
                  <input type="text" value={game.title_accent_en} onChange={(e) => setGame({ ...game, title_accent_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (GE)</label>
                  <input type="text" value={game.title_accent_ge} onChange={(e) => setGame({ ...game, title_accent_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                  <textarea value={game.desc_en} onChange={(e) => setGame({ ...game, desc_en: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                  <textarea value={game.desc_ge} onChange={(e) => setGame({ ...game, desc_ge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              {/* Unlock Section */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Unlock / Access Code</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Enter Code (EN)</label>
                    <input type="text" value={game.enter_code_en} onChange={(e) => setGame({ ...game, enter_code_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Enter Code (GE)</label>
                    <input type="text" value={game.enter_code_ge} onChange={(e) => setGame({ ...game, enter_code_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Get Code (EN)</label>
                    <input type="text" value={game.get_code_en} onChange={(e) => setGame({ ...game, get_code_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Get Code (GE)</label>
                    <input type="text" value={game.get_code_ge} onChange={(e) => setGame({ ...game, get_code_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Locked Desc (EN)</label>
                    <textarea value={game.locked_desc_en} onChange={(e) => setGame({ ...game, locked_desc_en: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Locked Desc (GE)</label>
                    <textarea value={game.locked_desc_ge} onChange={(e) => setGame({ ...game, locked_desc_ge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* How to Unlock Steps */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">How to Unlock Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">How to Unlock Title (EN)</label>
                    <input type="text" value={game.how_to_unlock_en} onChange={(e) => setGame({ ...game, how_to_unlock_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">How to Unlock Title (GE)</label>
                    <input type="text" value={game.how_to_unlock_ge} onChange={(e) => setGame({ ...game, how_to_unlock_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Step {num} (EN)</label>
                      <input
                        type="text"
                        value={(game as any)[`step${num}_en`]}
                        onChange={(e) => setGame({ ...game, [`step${num}_en`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase">Step {num} (GE)</label>
                      <input
                        type="text"
                        value={(game as any)[`step${num}_ge`]}
                        onChange={(e) => setGame({ ...game, [`step${num}_ge`]: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Input */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Code Input</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Have Code (EN)</label>
                    <input type="text" value={game.have_code_en} onChange={(e) => setGame({ ...game, have_code_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Have Code (GE)</label>
                    <input type="text" value={game.have_code_ge} onChange={(e) => setGame({ ...game, have_code_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Code Placeholder (EN)</label>
                    <input type="text" value={game.code_placeholder_en} onChange={(e) => setGame({ ...game, code_placeholder_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Code Placeholder (GE)</label>
                    <input type="text" value={game.code_placeholder_ge} onChange={(e) => setGame({ ...game, code_placeholder_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Unlock Button (EN)</label>
                    <input type="text" value={game.unlock_btn_en} onChange={(e) => setGame({ ...game, unlock_btn_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Unlock Button (GE)</label>
                    <input type="text" value={game.unlock_btn_ge} onChange={(e) => setGame({ ...game, unlock_btn_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* Game Buttons */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Game UI</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Start Button (EN)</label>
                    <input type="text" value={game.start_en} onChange={(e) => setGame({ ...game, start_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Start Button (GE)</label>
                    <input type="text" value={game.start_ge} onChange={(e) => setGame({ ...game, start_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Row (EN)</label>
                    <input type="text" value={game.row_en} onChange={(e) => setGame({ ...game, row_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Row (GE)</label>
                    <input type="text" value={game.row_ge} onChange={(e) => setGame({ ...game, row_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Retry Button (EN)</label>
                    <input type="text" value={game.retry_en} onChange={(e) => setGame({ ...game, retry_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Retry Button (GE)</label>
                    <input type="text" value={game.retry_ge} onChange={(e) => setGame({ ...game, retry_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* Win/Lose Messages */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Win/Lose Messages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Win Title (EN)</label>
                    <input type="text" value={game.win_title_en} onChange={(e) => setGame({ ...game, win_title_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Win Title (GE)</label>
                    <input type="text" value={game.win_title_ge} onChange={(e) => setGame({ ...game, win_title_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Win Desc (EN)</label>
                    <textarea value={game.win_desc_en} onChange={(e) => setGame({ ...game, win_desc_en: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Win Desc (GE)</label>
                    <textarea value={game.win_desc_ge} onChange={(e) => setGame({ ...game, win_desc_ge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Lose Title (EN)</label>
                    <input type="text" value={game.lose_title_en} onChange={(e) => setGame({ ...game, lose_title_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Lose Title (GE)</label>
                    <input type="text" value={game.lose_title_ge} onChange={(e) => setGame({ ...game, lose_title_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Lose Desc (EN)</label>
                    <textarea value={game.lose_desc_en} onChange={(e) => setGame({ ...game, lose_desc_en: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Lose Desc (GE)</label>
                    <textarea value={game.lose_desc_ge} onChange={(e) => setGame({ ...game, lose_desc_ge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* Ticket */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Ticket</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Ticket ID Label (EN)</label>
                    <input type="text" value={game.ticket_id_en} onChange={(e) => setGame({ ...game, ticket_id_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Ticket ID Label (GE)</label>
                    <input type="text" value={game.ticket_id_ge} onChange={(e) => setGame({ ...game, ticket_id_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Valid Until (EN)</label>
                    <input type="text" value={game.valid_until_en} onChange={(e) => setGame({ ...game, valid_until_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Valid Until (GE)</label>
                    <input type="text" value={game.valid_until_ge} onChange={(e) => setGame({ ...game, valid_until_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button onClick={saveGame} disabled={saving === 'game'} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {saving === 'game' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Oracle Tab */}
        {activeTab === 'oracle' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">YAM Oracle fortune teller content</p>
            <div className="p-4 bg-[#161616] rounded-lg border border-gray-800 space-y-4">
              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Label (EN)</label>
                  <input type="text" value={oracle.label_en} onChange={(e) => setOracle({ ...oracle, label_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Label (GE)</label>
                  <input type="text" value={oracle.label_ge} onChange={(e) => setOracle({ ...oracle, label_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (EN)</label>
                  <input type="text" value={oracle.title1_en} onChange={(e) => setOracle({ ...oracle, title1_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Line 1 (GE)</label>
                  <input type="text" value={oracle.title1_ge} onChange={(e) => setOracle({ ...oracle, title1_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (EN)</label>
                  <input type="text" value={oracle.title_accent_en} onChange={(e) => setOracle({ ...oracle, title_accent_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Title Accent (GE)</label>
                  <input type="text" value={oracle.title_accent_ge} onChange={(e) => setOracle({ ...oracle, title_accent_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                  <textarea value={oracle.desc_en} onChange={(e) => setOracle({ ...oracle, desc_en: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                  <textarea value={oracle.desc_ge} onChange={(e) => setOracle({ ...oracle, desc_ge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                </div>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Buttons</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Sip Button (EN)</label>
                    <input type="text" value={oracle.btn_sip_en} onChange={(e) => setOracle({ ...oracle, btn_sip_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Sip Button (GE)</label>
                    <input type="text" value={oracle.btn_sip_ge} onChange={(e) => setOracle({ ...oracle, btn_sip_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Reading Button (EN)</label>
                    <input type="text" value={oracle.btn_reading_en} onChange={(e) => setOracle({ ...oracle, btn_reading_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Reading Button (GE)</label>
                    <input type="text" value={oracle.btn_reading_ge} onChange={(e) => setOracle({ ...oracle, btn_reading_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Retry Button (EN)</label>
                    <input type="text" value={oracle.btn_retry_en} onChange={(e) => setOracle({ ...oracle, btn_retry_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Retry Button (GE)</label>
                    <input type="text" value={oracle.btn_retry_ge} onChange={(e) => setOracle({ ...oracle, btn_retry_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* Instruction */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Instruction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Instruction (EN)</label>
                    <input type="text" value={oracle.instruction_en} onChange={(e) => setOracle({ ...oracle, instruction_en: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Instruction (GE)</label>
                    <input type="text" value={oracle.instruction_ge} onChange={(e) => setOracle({ ...oracle, instruction_ge: e.target.value })} className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]" />
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Predictions (EN)</h4>
                <div className="space-y-2">
                  {oracle.predictions_en.map((prediction, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={prediction}
                        onChange={(e) => {
                          const newPredictions = [...oracle.predictions_en];
                          newPredictions[index] = e.target.value;
                          setOracle({ ...oracle, predictions_en: newPredictions });
                        }}
                        className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                      <button
                        onClick={() => {
                          const newPredictions = oracle.predictions_en.filter((_, i) => i !== index);
                          const newPredictionsGe = oracle.predictions_ge.filter((_, i) => i !== index);
                          setOracle({ ...oracle, predictions_en: newPredictions, predictions_ge: newPredictionsGe });
                        }}
                        className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setOracle({
                        ...oracle,
                        predictions_en: [...oracle.predictions_en, 'New prediction...'],
                        predictions_ge: [...oracle.predictions_ge, 'ახალი წინასწარმეტყველება...']
                      });
                    }}
                    className="mt-2 w-full py-2 border-2 border-dashed border-gray-700 rounded text-gray-500 hover:text-white hover:border-[#FF3B30] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Prediction
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-bold text-gray-400 mb-4">Predictions (GE)</h4>
                <div className="space-y-2">
                  {oracle.predictions_ge.map((prediction, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={prediction}
                        onChange={(e) => {
                          const newPredictions = [...oracle.predictions_ge];
                          newPredictions[index] = e.target.value;
                          setOracle({ ...oracle, predictions_ge: newPredictions });
                        }}
                        className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button onClick={saveOracle} disabled={saving === 'oracle'} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {saving === 'oracle' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Oracle
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
