import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

// 1. Add a new product
export async function addProduct(
  userId: string, 
  productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productData,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// 2. Fetch all products for the logged-in user
export async function getUserProducts(userId: string): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION), 
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Product[];
}

// 3. Delete a product
export async function deleteProduct(productId: string) {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}