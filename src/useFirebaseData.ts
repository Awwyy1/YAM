import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

type Lang = 'en' | 'ge';

// Last Firestore snapshot is kept in localStorage so repeat visits render real
// content (and start downloading real image URLs) before Firestore connects.
const CACHE_PREFIX = 'yam-cache:';

function readCache<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — the live listener still works.
  }
}

// undefined = nothing known yet (first visit, still loading)
function useCollection<T>(name: string): T[] | undefined {
  const [docs, setDocs] = useState<T[] | undefined>(() => readCache<T[]>(name));

  useEffect(() => {
    return onSnapshot(
      collection(db, name),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
        writeCache(name, items);
        setDocs(items);
      },
      () => setDocs((prev) => prev ?? [])
    );
  }, [name]);

  return docs;
}

// undefined = still loading, null = document missing or unavailable
function useDocument<T>(path: string, id: string): T | null | undefined {
  const key = `${path}/${id}`;
  const [data, setData] = useState<T | null | undefined>(() => readCache<T>(key));

  useEffect(() => {
    return onSnapshot(
      doc(db, path, id),
      (snap) => {
        const value = snap.exists() ? (snap.data() as T) : null;
        writeCache(key, value);
        setData(value);
      },
      () => setData((prev) => prev ?? null)
    );
  }, [path, id, key]);

  return data;
}

// ============ Featured Drinks (Homepage) ============

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

// Text-only fallback: shown while loading on a first visit or if Firebase is down.
const FALLBACK_DRINKS: Record<Lang, DrinkItem[]> = {
  en: [
    { id: 1, name: 'YAM SPECIAL', note: 'Honey-infused cold brew & sea salt.', img: '' },
    { id: 2, name: 'SILKY FLAT WHITE', note: 'Micro-foam over double ristretto.', img: '' },
    { id: 3, name: 'BATCH BREW', note: 'Ethiopia, floral & light body.', img: '' },
  ],
  ge: [
    { id: 1, name: 'YAM სპეშალი', note: 'თაფლიანი ქოლდ ბრიუ და ზღვის მარილი.', img: '' },
    { id: 2, name: 'სილქი ფლეთ უაითი', note: 'მიკრო-ქაფი ორმაგ რისტრეტოზე.', img: '' },
    { id: 3, name: 'ბეჩ ბრიუ', note: 'ეთიოპია, ყვავილოვანი და მსუბუქი.', img: '' },
  ],
};

export function useDrinksData(lang: Lang) {
  const docs = useCollection<FirebaseDrink>('drinks');

  const drinks = useMemo<DrinkItem[]>(() => {
    if (!docs || docs.length === 0) return FALLBACK_DRINKS[lang];
    return [...docs]
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({
        id: index + 1,
        name: lang === 'en' ? item.name_en : item.name_ge,
        note: lang === 'en' ? item.note_en : item.note_ge,
        img: item.img || '',
      }));
  }, [docs, lang]);

  return { drinks, isLoading: docs === undefined };
}

// ============ Shop ============

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

const FALLBACK_SHOP: Record<Lang, ShopItem[]> = {
  en: [
    { id: 101, name: 'YAM ARCHIVE TEE', color: 'BLAZE ORANGE', price: '₾45.00', img: '', desc: 'Heavyweight cotton with puff print logo.', comingSoon: true },
    { id: 102, name: 'ABSTRACT NOIR', color: 'MIDNIGHT BLACK', price: '₾50.00', img: '', desc: 'Oversized fit. Back abstract tonal print.', comingSoon: true },
    { id: 103, name: 'YAM HOODIE', color: 'VOID', price: '₾85.00', img: '', comingSoon: true },
    { id: 104, name: 'CANVAS TOTE', color: 'RAW', price: '₾25.00', img: '', comingSoon: true },
  ],
  ge: [
    { id: 101, name: 'YAM არქივ TEE', color: 'მკვეთრი ნარინჯისფერი', price: '₾45.00', img: '', desc: 'მძიმე ბამბა, მოცულობითი ლოგო.', comingSoon: true },
    { id: 102, name: 'აბსტრაქტ ნუარი', color: 'შუაღამის შავი', price: '₾50.00', img: '', desc: 'ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.', comingSoon: true },
    { id: 103, name: 'YAM ჰუდი', color: 'VOID', price: '₾85.00', img: '', comingSoon: true },
    { id: 104, name: 'ტილოს ჩანთა', color: 'RAW', price: '₾25.00', img: '', comingSoon: true },
  ],
};

export function useShopData(lang: Lang) {
  const docs = useCollection<FirebaseShopItem>('shop');

  const items = useMemo<ShopItem[]>(() => {
    if (!docs || docs.length === 0) return FALLBACK_SHOP[lang];
    return [...docs]
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({
        id: 100 + index + 1,
        name: lang === 'en' ? item.name_en : item.name_ge,
        color: lang === 'en' ? item.color_en : item.color_ge,
        price: item.price,
        img: item.img || '',
        desc: lang === 'en' ? item.desc_en : item.desc_ge,
        comingSoon: item.comingSoon,
      }));
  }, [docs, lang]);

  return { items, isLoading: docs === undefined };
}

// ============ Marquee ============

interface MarqueeItem {
  text: string;
  style: 'bold' | 'italic';
}

interface FirebaseMarqueeContent {
  items?: { text_en: string; text_ge: string; style: 'bold' | 'italic'; order: number }[];
}

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
  ],
};

export function useMarqueeData(lang: Lang) {
  const data = useDocument<FirebaseMarqueeContent>('content', 'marquee');

  const items = useMemo<MarqueeItem[]>(() => {
    if (!data?.items || data.items.length === 0) return FALLBACK_MARQUEE[lang];
    return [...data.items]
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ text: lang === 'en' ? item.text_en : item.text_ge, style: item.style }));
  }, [data, lang]);

  return { items, isLoading: data === undefined };
}

// ============ Brand ============

interface FirebaseBrandContent {
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

// Empty fields mean "use the built-in text" — BrandPage falls back to CONTENT.
export function useBrandContent(lang: Lang) {
  const data = useDocument<FirebaseBrandContent>('content', 'brand');

  return useMemo(() => {
    const en = lang === 'en';
    if (!data) {
      return { title1: '', titleAccent: '', desc: '', imageUrl: '', stat1: '', stat1Label: '', stat2: '', stat2Label: '', features: [] as { title: string; text: string }[], isLoading: data === undefined };
    }
    return {
      title1: en ? data.title1_en : data.title1_ge,
      titleAccent: en ? data.title_accent_en : data.title_accent_ge,
      desc: en ? data.desc_en : data.desc_ge,
      imageUrl: data.image_url || '',
      stat1: data.stat1,
      stat1Label: en ? data.stat1_label_en : data.stat1_label_ge,
      stat2: data.stat2,
      stat2Label: en ? data.stat2_label_en : data.stat2_label_ge,
      features: [
        { title: en ? data.feature1_title_en : data.feature1_title_ge, text: en ? data.feature1_text_en : data.feature1_text_ge },
        { title: en ? data.feature2_title_en : data.feature2_title_ge, text: en ? data.feature2_text_en : data.feature2_text_ge },
        { title: en ? data.feature3_title_en : data.feature3_title_ge, text: en ? data.feature3_text_en : data.feature3_text_ge },
      ],
      isLoading: false,
    };
  }, [data, lang]);
}
