import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

interface MenuItemSimple {
  name: string;
  price: string;
  desc: string;
}

interface FirebaseMenuItem {
  id: string;
  name_en: string;
  name_ge: string;
  price: string;
  desc_en: string;
  desc_ge: string;
  order: number;
}

type Lang = 'en' | 'ge';

// Fallback data - used when Firebase is empty or unavailable
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

// Convert Firebase items to simple menu format
function convertToSimpleMenu(items: FirebaseMenuItem[], lang: Lang): MenuItemSimple[] {
  return items
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      name: lang === 'en' ? item.name_en : item.name_ge,
      price: item.price,
      desc: lang === 'en' ? item.desc_en : item.desc_ge,
    }));
}

// Fetch menu from Firebase
async function fetchMenuFromFirebase(category: string): Promise<FirebaseMenuItem[]> {
  const querySnapshot = await getDocs(collection(db, `menu_${category}`));
  const items: FirebaseMenuItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as FirebaseMenuItem);
  });
  return items;
}

// Hook to get menu data with fallback
export function useMenuData(lang: Lang) {
  const [coffee, setCoffee] = useState<MenuItemSimple[]>(FALLBACK_COFFEE[lang]);
  const [tea, setTea] = useState<MenuItemSimple[]>(FALLBACK_TEA[lang]);
  const [extra, setExtra] = useState<MenuItemSimple[]>(FALLBACK_EXTRA[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('fallback');

  useEffect(() => {
    let mounted = true;

    async function loadMenu() {
      try {
        const [coffeeItems, teaItems, extraItems] = await Promise.all([
          fetchMenuFromFirebase('coffee'),
          fetchMenuFromFirebase('tea'),
          fetchMenuFromFirebase('extra'),
        ]);

        if (!mounted) return;

        // Use Firebase data if available, otherwise keep fallback
        if (coffeeItems.length > 0) {
          setCoffee(convertToSimpleMenu(coffeeItems, lang));
          setSource('firebase');
        } else {
          setCoffee(FALLBACK_COFFEE[lang]);
        }

        if (teaItems.length > 0) {
          setTea(convertToSimpleMenu(teaItems, lang));
          setSource('firebase');
        } else {
          setTea(FALLBACK_TEA[lang]);
        }

        if (extraItems.length > 0) {
          setExtra(convertToSimpleMenu(extraItems, lang));
          setSource('firebase');
        } else {
          setExtra(FALLBACK_EXTRA[lang]);
        }
      } catch (error) {
        console.warn('Firebase unavailable, using fallback data:', error);
        if (mounted) {
          setCoffee(FALLBACK_COFFEE[lang]);
          setTea(FALLBACK_TEA[lang]);
          setExtra(FALLBACK_EXTRA[lang]);
          setSource('fallback');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      mounted = false;
    };
  }, [lang]);

  // Update when language changes
  useEffect(() => {
    if (source === 'fallback') {
      setCoffee(FALLBACK_COFFEE[lang]);
      setTea(FALLBACK_TEA[lang]);
      setExtra(FALLBACK_EXTRA[lang]);
    }
  }, [lang, source]);

  return { coffee, tea, extra, isLoading, source };
}

// Export fallback data for direct use if needed
export { FALLBACK_COFFEE, FALLBACK_TEA, FALLBACK_EXTRA };
