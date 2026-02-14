import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
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

// Fallback featured drinks — local images for instant display
const FALLBACK_DRINKS: Record<Lang, DrinkItem[]> = {
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

// Fallback shop items — local images for instant display
const FALLBACK_SHOP: Record<Lang, ShopItem[]> = {
  en: [
    { id: 101, name: "YAM ARCHIVE TEE", color: "BLAZE ORANGE", price: "₾45.00", img: "/images/shop/shop-101.jpg", desc: "Heavyweight cotton with puff print logo.", comingSoon: true },
    { id: 102, name: "ABSTRACT NOIR", color: "MIDNIGHT BLACK", price: "₾50.00", img: "/images/shop/shop-102.jpg", desc: "Oversized fit. Back abstract tonal print.", comingSoon: true },
    { id: 103, name: "YAM HOODIE", color: "VOID", price: "₾85.00", img: "/images/shop/shop-103.jpg", comingSoon: true },
    { id: 104, name: "CANVAS TOTE", color: "RAW", price: "₾25.00", img: "/images/shop/shop-104.jpg", comingSoon: true }
  ],
  ge: [
    { id: 101, name: "YAM არქივ TEE", color: "მკვეთრი ნარინჯისფერი", price: "₾45.00", img: "/images/shop/shop-101.jpg", desc: "მძიმე ბამბა, მოცულობითი ლოგო.", comingSoon: true },
    { id: 102, name: "აბსტრაქტ ნუარი", color: "შუაღამის შავი", price: "₾50.00", img: "/images/shop/shop-102.jpg", desc: "ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.", comingSoon: true },
    { id: 103, name: "YAM ჰუდი", color: "VOID", price: "₾85.00", img: "/images/shop/shop-103.jpg", comingSoon: true },
    { id: 104, name: "ტილოს ჩანთა", color: "RAW", price: "₾25.00", img: "/images/shop/shop-104.jpg", comingSoon: true }
  ]
};

// Hook to get featured drinks data with real-time updates
export function useDrinksData(lang: Lang) {
  const [drinks, setDrinks] = useState<DrinkItem[]>(FALLBACK_DRINKS[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('firebase');

  useEffect(() => {
    // Real-time listener for drinks collection
    const unsubscribe = onSnapshot(
      collection(db, 'drinks'),
      (snapshot) => {
        const items: FirebaseDrink[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as FirebaseDrink);
        });

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
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firebase unavailable for drinks, using fallback:', error);
        setDrinks(FALLBACK_DRINKS[lang]);
        setSource('fallback');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return { drinks, isLoading, source };
}

// Hook to get shop data with real-time updates
export function useShopData(lang: Lang) {
  const [items, setItems] = useState<ShopItem[]>(FALLBACK_SHOP[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('firebase');

  useEffect(() => {
    // Real-time listener for shop collection
    const unsubscribe = onSnapshot(
      collection(db, 'shop'),
      (snapshot) => {
        const shopItems: FirebaseShopItem[] = [];
        snapshot.forEach((doc) => {
          shopItems.push({ id: doc.id, ...doc.data() } as FirebaseShopItem);
        });

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
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firebase unavailable for shop, using fallback:', error);
        setItems(FALLBACK_SHOP[lang]);
        setSource('fallback');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return { items, isLoading, source };
}

// Marquee Items
interface MarqueeItem {
  text: string;
  style: 'bold' | 'italic';
}

interface FirebaseMarqueeItem {
  text_en: string;
  text_ge: string;
  style: 'bold' | 'italic';
  order: number;
}

interface FirebaseMarqueeContent {
  items: FirebaseMarqueeItem[];
}

// Fallback marquee items
const FALLBACK_MARQUEE: Record<Lang, MarqueeItem[]> = {
  en: [
    { text: 'ORGANIC SOIL', style: 'bold' },
    { text: 'daily roast', style: 'italic' },
    { text: 'FAIR TRADE', style: 'bold' },
    { text: 'slow mornings', style: 'italic' },
    { text: 'NO SHORTCUTS', style: 'bold' },
    { text: 'craft over hype', style: 'italic' },
    { text: 'BATUMI', style: 'bold' },
    { text: 'good beans only', style: 'italic' },
    { text: 'EST. 2026', style: 'bold' },
    { text: 'sip the vibe', style: 'italic' },
  ],
  ge: [
    { text: 'ორგანული ნიადაგი', style: 'bold' },
    { text: 'ყოველდღიური მოხალვა', style: 'italic' },
    { text: 'სამართლიანი ვაჭრობა', style: 'bold' },
    { text: 'მშვიდი დილა', style: 'italic' },
    { text: 'კომპრომისის გარეშე', style: 'bold' },
    { text: 'ხელობა, არა ჰაიპი', style: 'italic' },
    { text: 'ბათუმი', style: 'bold' },
    { text: 'მხოლოდ კარგი მარცვალი', style: 'italic' },
    { text: '2026 წლიდან', style: 'bold' },
    { text: 'იგრძენი ვაიბი', style: 'italic' },
  ]
};

// Hook to get marquee data with real-time updates
export function useMarqueeData(lang: Lang) {
  const [items, setItems] = useState<MarqueeItem[]>(FALLBACK_MARQUEE[lang]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'firebase' | 'fallback'>('fallback');

  useEffect(() => {
    // Real-time listener for marquee content document
    const unsubscribe = onSnapshot(
      doc(db, 'content', 'marquee'),
      (docSnap) => {
        if (docSnap.exists()) {
          const marqueeData = docSnap.data() as FirebaseMarqueeContent;
          if (marqueeData.items && marqueeData.items.length > 0) {
            const converted = marqueeData.items
              .sort((a, b) => a.order - b.order)
              .map((item) => ({
                text: lang === 'en' ? item.text_en : item.text_ge,
                style: item.style,
              }));
            setItems(converted);
            setSource('firebase');
          } else {
            setItems(FALLBACK_MARQUEE[lang]);
            setSource('fallback');
          }
        } else {
          setItems(FALLBACK_MARQUEE[lang]);
          setSource('fallback');
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firebase unavailable for marquee, using fallback:', error);
        setItems(FALLBACK_MARQUEE[lang]);
        setSource('fallback');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return { items, isLoading, source };
}

export { FALLBACK_DRINKS, FALLBACK_SHOP, FALLBACK_MARQUEE };
