import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

type Lang = 'en' | 'ge';

// Featured Drinks (Homepage)
interface DrinkItem {
  id: number;
  name: string;
  note: string;
  img: string;
}

interface FirebaseDrink {
  id: string;
  name_en: string;
  name_ge: string;
  note_en: string;
  note_ge: string;
  img: string;
  order: number;
}

// Fallback featured drinks
const FALLBACK_DRINKS: Record<Lang, DrinkItem[]> = {
  en: [
    { id: 1, name: 'YAM SPECIAL', note: 'Honey-infused cold brew & sea salt.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' },
    { id: 2, name: 'SILKY FLAT WHITE', note: 'Micro-foam over double ristretto.', img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80' },
    { id: 3, name: 'BATCH BREW', note: 'Ethiopia, floral & light body.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
  ],
  ge: [
    { id: 1, name: 'YAM სპეშალი', note: 'თაფლიანი ქოლდ ბრიუ და ზღვის მარილი.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' },
    { id: 2, name: 'სილქი ფლეთ უაითი', note: 'მიკრო-ქაფი ორმაგ რისტრეტოზე.', img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80' },
    { id: 3, name: 'ბეჩ ბრიუ', note: 'ეთიოპია, ყვავილოვანი და მსუბუქი.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
  ]
};

// Shop Items
interface ShopItem {
  id: number;
  name: string;
  color: string;
  price: string;
  img: string;
  desc?: string;
  comingSoon: boolean;
}

interface FirebaseShopItem {
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

// Fallback shop items
const FALLBACK_SHOP: Record<Lang, ShopItem[]> = {
  en: [
    { id: 101, name: "YAM ARCHIVE TEE", color: "BLAZE ORANGE", price: "₾45.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", desc: "Heavyweight cotton with puff print logo.", comingSoon: true },
    { id: 102, name: "ABSTRACT NOIR", color: "MIDNIGHT BLACK", price: "₾50.00", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", desc: "Oversized fit. Back abstract tonal print.", comingSoon: true },
    { id: 103, name: "YAM HOODIE", color: "VOID", price: "₾85.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", comingSoon: true },
    { id: 104, name: "CANVAS TOTE", color: "RAW", price: "₾25.00", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80", comingSoon: true }
  ],
  ge: [
    { id: 101, name: "YAM არქივ TEE", color: "მკვეთრი ნარინჯისფერი", price: "₾45.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", desc: "მძიმე ბამბა, მოცულობითი ლოგო.", comingSoon: true },
    { id: 102, name: "აბსტრაქტ ნუარი", color: "შუაღამის შავი", price: "₾50.00", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", desc: "ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.", comingSoon: true },
    { id: 103, name: "YAM ჰუდი", color: "VOID", price: "₾85.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", comingSoon: true },
    { id: 104, name: "ტილოს ჩანთა", color: "RAW", price: "₾25.00", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80", comingSoon: true }
  ]
};

// Hook to get featured drinks data
export function useDrinksData(lang: Lang) {
  const [drinks, setDrinks] = useState<DrinkItem[]>(FALLBACK_DRINKS[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('fallback');

  useEffect(() => {
    let mounted = true;

    async function loadDrinks() {
      try {
        const querySnapshot = await getDocs(collection(db, 'drinks'));
        const items: FirebaseDrink[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as FirebaseDrink);
        });

        if (!mounted) return;

        if (items.length > 0) {
          const converted = items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({
              id: index + 1,
              name: lang === 'en' ? item.name_en : item.name_ge,
              note: lang === 'en' ? item.note_en : item.note_ge,
              img: item.img,
            }));
          setDrinks(converted);
          setSource('firebase');
        } else {
          setDrinks(FALLBACK_DRINKS[lang]);
          setSource('fallback');
        }
      } catch (error) {
        console.warn('Firebase unavailable for drinks, using fallback:', error);
        if (mounted) {
          setDrinks(FALLBACK_DRINKS[lang]);
          setSource('fallback');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadDrinks();

    return () => {
      mounted = false;
    };
  }, [lang]);

  // Update when language changes and using fallback
  useEffect(() => {
    if (source === 'fallback') {
      setDrinks(FALLBACK_DRINKS[lang]);
    }
  }, [lang, source]);

  return { drinks, isLoading, source };
}

// Hook to get shop data
export function useShopData(lang: Lang) {
  const [items, setItems] = useState<ShopItem[]>(FALLBACK_SHOP[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('fallback');

  useEffect(() => {
    let mounted = true;

    async function loadShop() {
      try {
        const querySnapshot = await getDocs(collection(db, 'shop'));
        const shopItems: FirebaseShopItem[] = [];
        querySnapshot.forEach((doc) => {
          shopItems.push({ id: doc.id, ...doc.data() } as FirebaseShopItem);
        });

        if (!mounted) return;

        if (shopItems.length > 0) {
          const converted = shopItems
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({
              id: 100 + index + 1,
              name: lang === 'en' ? item.name_en : item.name_ge,
              color: lang === 'en' ? item.color_en : item.color_ge,
              price: item.price,
              img: item.img,
              desc: lang === 'en' ? item.desc_en : item.desc_ge,
              comingSoon: item.comingSoon,
            }));
          setItems(converted);
          setSource('firebase');
        } else {
          setItems(FALLBACK_SHOP[lang]);
          setSource('fallback');
        }
      } catch (error) {
        console.warn('Firebase unavailable for shop, using fallback:', error);
        if (mounted) {
          setItems(FALLBACK_SHOP[lang]);
          setSource('fallback');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadShop();

    return () => {
      mounted = false;
    };
  }, [lang]);

  // Update when language changes and using fallback
  useEffect(() => {
    if (source === 'fallback') {
      setItems(FALLBACK_SHOP[lang]);
    }
  }, [lang, source]);

  return { items, isLoading, source };
}

export { FALLBACK_DRINKS, FALLBACK_SHOP };
