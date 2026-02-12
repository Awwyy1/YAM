import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDDz0qOmQyUYlKmk_PhJt608IOphcZ1C0",
  authDomain: "yam-coffee.firebaseapp.com",
  projectId: "yam-coffee",
  storageBucket: "yam-coffee.firebasestorage.app",
  messagingSenderId: "671117091402",
  appId: "1:671117091402:web:7eb95e8b086f1a87e33cb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Types
export interface MenuItem {
  id: string;
  name_en: string;
  name_ge: string;
  price: string;
  desc_en: string;
  desc_ge: string;
  order: number;
}

export interface MenuCategory {
  id: string;
  items: MenuItem[];
}

// Auth functions
export const loginAdmin = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const getMenuItems = async (category: string): Promise<MenuItem[]> => {
  const querySnapshot = await getDocs(collection(db, `menu_${category}`));
  const items: MenuItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as MenuItem);
  });
  return items.sort((a, b) => a.order - b.order);
};

export const subscribeToMenu = (category: string, callback: (items: MenuItem[]) => void) => {
  return onSnapshot(collection(db, `menu_${category}`), (snapshot) => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(items.sort((a, b) => a.order - b.order));
  });
};

export const saveMenuItem = async (category: string, item: MenuItem) => {
  const docRef = doc(db, `menu_${category}`, item.id);
  await setDoc(docRef, {
    name_en: item.name_en,
    name_ge: item.name_ge,
    price: item.price,
    desc_en: item.desc_en,
    desc_ge: item.desc_ge,
    order: item.order
  });
};

export const deleteMenuItem = async (category: string, itemId: string) => {
  await deleteDoc(doc(db, `menu_${category}`, itemId));
};

// Storage functions
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteImage = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Initialize menu data (run once to populate Firestore with existing data)
export const initializeMenuData = async (
  coffeeData: { name: string; price: string; desc: string }[],
  coffeeDataGe: { name: string; price: string; desc: string }[],
  teaData: { name: string; price: string; desc: string }[],
  teaDataGe: { name: string; price: string; desc: string }[],
  extraData: { name: string; price: string; desc: string }[],
  extraDataGe: { name: string; price: string; desc: string }[]
) => {
  // Coffee
  for (let i = 0; i < coffeeData.length; i++) {
    await saveMenuItem('coffee', {
      id: `coffee_${i}`,
      name_en: coffeeData[i].name,
      name_ge: coffeeDataGe[i]?.name || coffeeData[i].name,
      price: coffeeData[i].price,
      desc_en: coffeeData[i].desc,
      desc_ge: coffeeDataGe[i]?.desc || coffeeData[i].desc,
      order: i
    });
  }

  // Tea
  for (let i = 0; i < teaData.length; i++) {
    await saveMenuItem('tea', {
      id: `tea_${i}`,
      name_en: teaData[i].name,
      name_ge: teaDataGe[i]?.name || teaData[i].name,
      price: teaData[i].price,
      desc_en: teaData[i].desc,
      desc_ge: teaDataGe[i]?.desc || teaData[i].desc,
      order: i
    });
  }

  // Extra
  for (let i = 0; i < extraData.length; i++) {
    await saveMenuItem('extra', {
      id: `extra_${i}`,
      name_en: extraData[i].name,
      name_ge: extraDataGe[i]?.name || extraData[i].name,
      price: extraData[i].price,
      desc_en: extraData[i].desc,
      desc_ge: extraDataGe[i]?.desc || extraData[i].desc,
      order: i
    });
  }
};
