import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

type Lang = 'en' | 'ge';

// Simple menu item
interface MenuItemSimple {
  name: string;
  price: string;
  desc: string;
}

// Drink item for homepage
interface DrinkItemSimple {
  id: number;
  name: string;
  note: string;
  img: string;
}

// Shop item
interface ShopItemSimple {
  id: number;
  name: string;
  color: string;
  price: string;
  img: string;
  desc?: string;
  comingSoon?: boolean;
}

// Firebase types
interface FirebaseMenuItem {
  name_en: string;
  name_ge: string;
  price: string;
  desc_en: string;
  desc_ge: string;
  order: number;
}

interface FirebaseDrinkItem {
  name_en: string;
  name_ge: string;
  note_en: string;
  note_ge: string;
  img: string;
  order: number;
}

interface FirebaseShopItem {
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
  image_url?: string;
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

// ============ FALLBACK DATA ============

const FALLBACK_COFFEE: Record<Lang, MenuItemSimple[]> = {
  en: [
    { name: 'Espresso', price: '₾4.00', desc: 'Bold & intense signature blend' },
    { name: 'Espresso Macchiato', price: '₾4.50', desc: 'Espresso with a dollop of foam' },
    { name: 'Americano', price: '₾4.50', desc: 'Espresso with hot water' },
    { name: 'Americano + Milk', price: '₾5.00', desc: 'Americano with steamed milk' },
    { name: 'Cappuccino', price: '₾5.00', desc: 'Balanced espresso, milk and foam' },
    { name: 'Raf Coffee', price: '₾6.00', desc: 'Espresso, cream and vanilla sugar' },
    { name: 'Latte Macchiato', price: '₾5.50', desc: 'Layered milk and espresso' },
    { name: 'Matcha Latte', price: '₾6.00', desc: 'Ceremonial grade matcha with steamed milk' },
    { name: 'Cocoa', price: '₾5.00', desc: 'Rich hot chocolate' },
    { name: 'Double Espresso', price: '₾5.50', desc: 'Two shots of signature blend' },
    { name: 'Double Espresso Macchiato', price: '₾6.00', desc: 'Double shot with foam' },
    { name: 'Double Americano', price: '₾6.00', desc: 'Double shot with hot water' },
    { name: 'Double Americano + Milk', price: '₾6.50', desc: 'Double americano with steamed milk' },
    { name: 'Double Cappuccino', price: '₾6.50', desc: 'Double shot cappuccino' },
  ],
  ge: [
    { name: 'ესპრესო', price: '₾4.00', desc: 'მკვეთრი და ინტენსიური ნაზავი' },
    { name: 'ესპრესო მაკიატო', price: '₾4.50', desc: 'ესპრესო ქაფის წვეთით' },
    { name: 'ამერიკანო', price: '₾4.50', desc: 'ესპრესო ცხელ წყალზე' },
    { name: 'ამერიკანო + რძე', price: '₾5.00', desc: 'ამერიკანო ცხელი რძით' },
    { name: 'კაპუჩინო', price: '₾5.00', desc: 'ესპრესოსა და რძის ბალანსი' },
    { name: 'რაფ ყავა', price: '₾6.00', desc: 'ესპრესო, ნაღები და ვანილის შაქარი' },
    { name: 'ლატე მაკიატო', price: '₾5.50', desc: 'რძის და ესპრესოს ფენები' },
    { name: 'მატჩა ლატე', price: '₾6.00', desc: 'მატჩა ცხელი რძით' },
    { name: 'კაკაო', price: '₾5.00', desc: 'მდიდარი ცხელი შოკოლადი' },
    { name: 'ორმაგი ესპრესო', price: '₾5.50', desc: 'ორი შოთი საფირმო ნაზავით' },
    { name: 'ორმაგი ესპრესო მაკიატო', price: '₾6.00', desc: 'ორმაგი შოთი ქაფით' },
    { name: 'ორმაგი ამერიკანო', price: '₾6.00', desc: 'ორმაგი შოთი წყალზე' },
    { name: 'ორმაგი ამერიკანო + რძე', price: '₾6.50', desc: 'ორმაგი ამერიკანო რძით' },
    { name: 'ორმაგი კაპუჩინო', price: '₾6.50', desc: 'ორმაგი კაპუჩინო' },
  ]
};

const FALLBACK_TEA: Record<Lang, MenuItemSimple[]> = {
  en: [
    { name: 'Green Tea', price: '₾3.50', desc: 'Classic Japanese sencha, light and grassy' },
    { name: 'Earl Grey', price: '₾3.50', desc: 'Black tea with Italian bergamot oil' },
    { name: 'Matcha', price: '₾5.00', desc: 'Ceremonial grade Japanese green tea powder' },
    { name: 'Jasmine Oolong', price: '₾4.00', desc: 'Semi-oxidized leaves with jasmine blossoms' },
    { name: 'Fresh Mint', price: '₾3.75', desc: 'Hand-picked garden mint, served hot' },
  ],
  ge: [
    { name: 'მწვანე ჩაი', price: '₾3.50', desc: 'კლასიკური იაპონური სენჩა' },
    { name: 'ერლ გრეი', price: '₾3.50', desc: 'შავი ჩაი ბერგამოტის ზეთით' },
    { name: 'მატჩა', price: '₾5.00', desc: 'იაპონური მწვანე ჩაის ფხვნილი' },
    { name: 'ჟასმინის ოლონგი', price: '₾4.00', desc: 'ნახევრად ფერმენტირებული ჟასმინით' },
    { name: 'ახალი პიტნა', price: '₾3.75', desc: 'ბაღის პიტნა, ცხლად მიწოდებული' },
  ]
};

const FALLBACK_EXTRA: Record<Lang, MenuItemSimple[]> = {
  en: [
    { name: 'Croissant', price: '₾4.50', desc: 'French butter croissant, baked fresh daily' },
    { name: 'Almond Croissant', price: '₾5.50', desc: 'Filled with almond cream and toasted flakes' },
    { name: 'Banana Bread', price: '₾4.00', desc: 'Homemade with walnuts and dark chocolate' },
    { name: 'Cheesecake', price: '₾6.50', desc: 'New York style, creamy and dense' },
    { name: 'Cookie', price: '₾3.00', desc: 'Chunky chocolate chip, soft center' },
    { name: 'Granola Bowl', price: '₾7.00', desc: 'Greek yogurt, honey, seasonal fruits' },
    { name: 'Avocado Toast', price: '₾8.50', desc: 'Sourdough, smashed avo, chili flakes, egg' },
  ],
  ge: [
    { name: 'კრუასანი', price: '₾4.50', desc: 'ფრანგული კარაქის კრუასანი, ყოველდღე ახალი' },
    { name: 'ნუშის კრუასანი', price: '₾5.50', desc: 'ნუშის კრემით და შემწვარი ფანტელებით' },
    { name: 'ბანანის პური', price: '₾4.00', desc: 'ნიგვზით და შავი შოკოლადით' },
    { name: 'ჩიზქეიქი', price: '₾6.50', desc: 'ნიუ-იორკის სტილი, კრემისებრი' },
    { name: 'ქუქი', price: '₾3.00', desc: 'შოკოლადის ნატეხებით, რბილი შუაგული' },
    { name: 'გრანოლა ბოულ', price: '₾7.00', desc: 'ბერძნული იოგურტი, თაფლი, ხილი' },
    { name: 'ავოკადო ტოსტი', price: '₾8.50', desc: 'სოურდო, ავოკადო, ჩილი, კვერცხი' },
  ]
};

const FALLBACK_DRINKS: Record<Lang, DrinkItemSimple[]> = {
  en: [
    { id: 1, name: 'YAM SPECIAL', note: 'Honey-infused cold brew & sea salt.', img: '/images/drinks/drink-1.jpg' },
    { id: 2, name: 'SILKY FLAT WHITE', note: 'Micro-foam over double ristretto.', img: '/images/drinks/drink-2.jpg' },
    { id: 3, name: 'BATCH BREW', note: 'Ethiopia, floral & light body.', img: '/images/drinks/drink-3.jpg' },
  ],
  ge: [
    { id: 1, name: 'YAM სპეშალი', note: 'თაფლიანი ქოლდ ბრიუ და ზღვის მარილი.', img: '/images/drinks/drink-1.jpg' },
    { id: 2, name: 'სილქი ფლეთ უაითი', note: 'მიკრო-ქაფი ორმაგ რისტრეტოზე.', img: '/images/drinks/drink-2.jpg' },
    { id: 3, name: 'ბეჩ ბრიუ', note: 'ეთიოპია, ყვავილოვანი და მსუბუქი.', img: '/images/drinks/drink-3.jpg' },
  ]
};

const FALLBACK_SHOP: Record<Lang, ShopItemSimple[]> = {
  en: [
    { id: 101, name: 'YAM ARCHIVE TEE', color: 'BLAZE ORANGE', price: '₾45.00', img: '/images/shop/shop-101.jpg', desc: 'Heavyweight cotton with puff print logo.', comingSoon: true },
    { id: 102, name: 'ABSTRACT NOIR', color: 'MIDNIGHT BLACK', price: '₾50.00', img: '/images/shop/shop-102.jpg', desc: 'Oversized fit. Back abstract tonal print.', comingSoon: true },
    { id: 103, name: 'YAM HOODIE', color: 'VOID', price: '₾85.00', img: '/images/shop/shop-103.jpg', comingSoon: true },
    { id: 104, name: 'CANVAS TOTE', color: 'RAW', price: '₾25.00', img: '/images/shop/shop-104.jpg', comingSoon: true },
  ],
  ge: [
    { id: 101, name: 'YAM არქივ TEE', color: 'მკვეთრი ნარინჯისფერი', price: '₾45.00', img: '/images/shop/shop-101.jpg', desc: 'მძიმე ბამბა, მოცულობითი ლოგო.', comingSoon: true },
    { id: 102, name: 'აბსტრაქტ ნუარი', color: 'შუაღამის შავი', price: '₾50.00', img: '/images/shop/shop-102.jpg', desc: 'ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.', comingSoon: true },
    { id: 103, name: 'YAM ჰუდი', color: 'VOID', price: '₾85.00', img: '/images/shop/shop-103.jpg', comingSoon: true },
    { id: 104, name: 'ტილოს ჩანთა', color: 'RAW', price: '₾25.00', img: '/images/shop/shop-104.jpg', comingSoon: true },
  ]
};

const FALLBACK_HERO: HeroContent = {
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

const FALLBACK_CONTACTS: ContactsContent = {
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

const FALLBACK_BRAND: BrandContent = {
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

// ============ HOOKS ============

// Menu hook (coffee, tea, extra) with real-time updates
export function useMenuData(lang: Lang) {
  const [coffee, setCoffee] = useState<MenuItemSimple[]>(FALLBACK_COFFEE[lang]);
  const [tea, setTea] = useState<MenuItemSimple[]>(FALLBACK_TEA[lang]);
  const [extra, setExtra] = useState<MenuItemSimple[]>(FALLBACK_EXTRA[lang]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loadingCount = 3;
    const checkLoading = () => {
      loadingCount--;
      if (loadingCount === 0) setIsLoading(false);
    };

    // Real-time listener for coffee menu
    const unsubCoffee = onSnapshot(
      collection(db, 'menu_coffee'),
      (snapshot) => {
        const coffeeItems: FirebaseMenuItem[] = [];
        snapshot.forEach(d => coffeeItems.push(d.data() as FirebaseMenuItem));
        if (coffeeItems.length > 0) {
          setCoffee(coffeeItems.sort((a, b) => a.order - b.order).map(i => ({
            name: lang === 'en' ? i.name_en : i.name_ge,
            price: i.price,
            desc: lang === 'en' ? i.desc_en : i.desc_ge,
          })));
        }
        checkLoading();
      },
      () => checkLoading()
    );

    // Real-time listener for tea menu
    const unsubTea = onSnapshot(
      collection(db, 'menu_tea'),
      (snapshot) => {
        const teaItems: FirebaseMenuItem[] = [];
        snapshot.forEach(d => teaItems.push(d.data() as FirebaseMenuItem));
        if (teaItems.length > 0) {
          setTea(teaItems.sort((a, b) => a.order - b.order).map(i => ({
            name: lang === 'en' ? i.name_en : i.name_ge,
            price: i.price,
            desc: lang === 'en' ? i.desc_en : i.desc_ge,
          })));
        }
        checkLoading();
      },
      () => checkLoading()
    );

    // Real-time listener for extra menu
    const unsubExtra = onSnapshot(
      collection(db, 'menu_extra'),
      (snapshot) => {
        const extraItems: FirebaseMenuItem[] = [];
        snapshot.forEach(d => extraItems.push(d.data() as FirebaseMenuItem));
        if (extraItems.length > 0) {
          setExtra(extraItems.sort((a, b) => a.order - b.order).map(i => ({
            name: lang === 'en' ? i.name_en : i.name_ge,
            price: i.price,
            desc: lang === 'en' ? i.desc_en : i.desc_ge,
          })));
        }
        checkLoading();
      },
      () => checkLoading()
    );

    return () => {
      unsubCoffee();
      unsubTea();
      unsubExtra();
    };
  }, [lang]);

  return { coffee, tea, extra, isLoading };
}

// Drinks hook (featured drinks with photos) with real-time updates
// Initializes with local fallback images for instant display.
// Firebase data updates text immediately; images swap as browser loads them.
export function useDrinksData(lang: Lang) {
  const [drinks, setDrinks] = useState<DrinkItemSimple[]>(FALLBACK_DRINKS[lang]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'drinks'),
      (snapshot) => {
        const items: FirebaseDrinkItem[] = [];
        snapshot.forEach(d => items.push(d.data() as FirebaseDrinkItem));

        if (items.length > 0) {
          setDrinks(items.sort((a, b) => a.order - b.order).map((i, idx) => ({
            id: idx + 1,
            name: lang === 'en' ? i.name_en : i.name_ge,
            note: lang === 'en' ? i.note_en : i.note_ge,
            img: i.img,
          })));
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firebase drinks unavailable, using fallback:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return { drinks, isLoading };
}

// Shop hook with real-time updates
// Initializes with local fallback images for instant display.
// Firebase data updates text immediately; images swap as browser loads them.
export function useShopData(lang: Lang) {
  const [items, setItems] = useState<ShopItemSimple[]>(FALLBACK_SHOP[lang]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'shop'),
      (snapshot) => {
        const shopItems: FirebaseShopItem[] = [];
        snapshot.forEach(d => shopItems.push(d.data() as FirebaseShopItem));

        if (shopItems.length > 0) {
          setItems(shopItems.sort((a, b) => a.order - b.order).map((i, idx) => ({
            id: 100 + idx + 1,
            name: lang === 'en' ? i.name_en : i.name_ge,
            color: lang === 'en' ? i.color_en : i.color_ge,
            price: i.price,
            img: i.img,
            desc: lang === 'en' ? i.desc_en : i.desc_ge,
            comingSoon: i.comingSoon,
          })));
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firebase shop unavailable, using fallback:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return { items, isLoading };
}

// Hero content hook with real-time updates
export function useHeroContent(lang: Lang) {
  const [content, setContent] = useState({
    since: lang === 'en' ? FALLBACK_HERO.since_en : FALLBACK_HERO.since_ge,
    title1: lang === 'en' ? FALLBACK_HERO.title1_en : FALLBACK_HERO.title1_ge,
    title2: lang === 'en' ? FALLBACK_HERO.title2_en : FALLBACK_HERO.title2_ge,
    title3: lang === 'en' ? FALLBACK_HERO.title3_en : FALLBACK_HERO.title3_ge,
    cta: lang === 'en' ? FALLBACK_HERO.cta_en : FALLBACK_HERO.cta_ge,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'content', 'hero'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as HeroContent;
          setContent({
            since: lang === 'en' ? data.since_en : data.since_ge,
            title1: lang === 'en' ? data.title1_en : data.title1_ge,
            title2: lang === 'en' ? data.title2_en : data.title2_ge,
            title3: lang === 'en' ? data.title3_en : data.title3_ge,
            cta: lang === 'en' ? data.cta_en : data.cta_ge,
          });
        }
      },
      (error) => {
        console.warn('Firebase hero unavailable, using fallback:', error);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return content;
}

// Contacts hook with real-time updates
export function useContactsContent(lang: Lang) {
  const [content, setContent] = useState({
    location: lang === 'en' ? FALLBACK_CONTACTS.location_en : FALLBACK_CONTACTS.location_ge,
    city: lang === 'en' ? FALLBACK_CONTACTS.city_en : FALLBACK_CONTACTS.city_ge,
    hoursWeek: lang === 'en' ? FALLBACK_CONTACTS.hours_week_en : FALLBACK_CONTACTS.hours_week_ge,
    hoursWeekend: lang === 'en' ? FALLBACK_CONTACTS.hours_weekend_en : FALLBACK_CONTACTS.hours_weekend_ge,
    visitDesc: lang === 'en' ? FALLBACK_CONTACTS.visit_desc_en : FALLBACK_CONTACTS.visit_desc_ge,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'content', 'contacts'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ContactsContent;
          setContent({
            location: lang === 'en' ? data.location_en : data.location_ge,
            city: lang === 'en' ? data.city_en : data.city_ge,
            hoursWeek: lang === 'en' ? data.hours_week_en : data.hours_week_ge,
            hoursWeekend: lang === 'en' ? data.hours_weekend_en : data.hours_weekend_ge,
            visitDesc: lang === 'en' ? data.visit_desc_en : data.visit_desc_ge,
          });
        }
      },
      (error) => {
        console.warn('Firebase contacts unavailable, using fallback:', error);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return content;
}

// Brand hook with real-time updates
export function useBrandContent(lang: Lang) {
  const [content, setContent] = useState({
    title1: lang === 'en' ? FALLBACK_BRAND.title1_en : FALLBACK_BRAND.title1_ge,
    titleAccent: lang === 'en' ? FALLBACK_BRAND.title_accent_en : FALLBACK_BRAND.title_accent_ge,
    desc: lang === 'en' ? FALLBACK_BRAND.desc_en : FALLBACK_BRAND.desc_ge,
    imageUrl: FALLBACK_BRAND.image_url || '',
    stat1: FALLBACK_BRAND.stat1,
    stat1Label: lang === 'en' ? FALLBACK_BRAND.stat1_label_en : FALLBACK_BRAND.stat1_label_ge,
    stat2: FALLBACK_BRAND.stat2,
    stat2Label: lang === 'en' ? FALLBACK_BRAND.stat2_label_en : FALLBACK_BRAND.stat2_label_ge,
    features: [
      { title: lang === 'en' ? FALLBACK_BRAND.feature1_title_en : FALLBACK_BRAND.feature1_title_ge, text: lang === 'en' ? FALLBACK_BRAND.feature1_text_en : FALLBACK_BRAND.feature1_text_ge },
      { title: lang === 'en' ? FALLBACK_BRAND.feature2_title_en : FALLBACK_BRAND.feature2_title_ge, text: lang === 'en' ? FALLBACK_BRAND.feature2_text_en : FALLBACK_BRAND.feature2_text_ge },
      { title: lang === 'en' ? FALLBACK_BRAND.feature3_title_en : FALLBACK_BRAND.feature3_title_ge, text: lang === 'en' ? FALLBACK_BRAND.feature3_text_en : FALLBACK_BRAND.feature3_text_ge },
    ],
  });

  useEffect(() => {
    // Real-time listener for brand content
    const unsubscribe = onSnapshot(
      doc(db, 'content', 'brand'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as BrandContent;
          setContent({
            title1: lang === 'en' ? data.title1_en : data.title1_ge,
            titleAccent: lang === 'en' ? data.title_accent_en : data.title_accent_ge,
            desc: lang === 'en' ? data.desc_en : data.desc_ge,
            imageUrl: '',
            stat1: data.stat1,
            stat1Label: lang === 'en' ? data.stat1_label_en : data.stat1_label_ge,
            stat2: data.stat2,
            stat2Label: lang === 'en' ? data.stat2_label_en : data.stat2_label_ge,
            features: [
              { title: lang === 'en' ? data.feature1_title_en : data.feature1_title_ge, text: lang === 'en' ? data.feature1_text_en : data.feature1_text_ge },
              { title: lang === 'en' ? data.feature2_title_en : data.feature2_title_ge, text: lang === 'en' ? data.feature2_text_en : data.feature2_text_ge },
              { title: lang === 'en' ? data.feature3_title_en : data.feature3_title_ge, text: lang === 'en' ? data.feature3_text_en : data.feature3_text_ge },
            ],
          });
        }
      },
      (error) => {
        console.warn('Firebase brand unavailable, using fallback:', error);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return content;
}

// Export fallback data for reference
export { FALLBACK_COFFEE, FALLBACK_TEA, FALLBACK_EXTRA, FALLBACK_DRINKS, FALLBACK_SHOP };
