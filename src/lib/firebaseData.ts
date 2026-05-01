import { db } from './firebase-admin';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Generic function to read a document from a collection
export async function getDocument<T>(collection: string, docId: string): Promise<T | null> {
    try {
        const docRef = db.collection(collection).doc(docId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return docSnap.data() as T;
        }

        // Auto-seed logic: if it doesn't exist, try local JSON
        console.log(`[Auto-Seed] Document ${collection}/${docId} not found in Firestore. Attempting local seed...`);
        const localData = getLocalJsonSeed(docId); // e.g. "about" -> "about.json"
        if (localData) {
            await docRef.set(localData);
            return localData as T;
        }
    } catch (error: any) {
        console.warn(`[Firebase Error] reading ${collection}/${docId}:`, error?.message || error);
        console.log(`[Fallback] Attempting to load local seed for ${docId}...`);
        const localData = getLocalJsonSeed(docId);
        return (localData as T) || null;
    }
    return null;
}

// Generic function to write a document to a collection
export async function setDocument<T>(collection: string, docId: string, data: any): Promise<boolean> {
    try {
        await db.collection(collection).doc(docId).set(data, { merge: true });
        return true;
    } catch (error) {
        console.error(`Error writing ${collection}/${docId}:`, error);
        return false;
    }
}

// Function to get all documents from a collection (e.g., works)
export async function getCollection<T>(collection: string, orderByField?: string): Promise<T[]> {
    try {
        let query: admin.firestore.Query = db.collection(collection);
        if (orderByField) {
            query = query.orderBy(orderByField, 'desc');
        }
        const snapshot = await query.get();

        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        }

        // Auto-seed logic for collections
        if (collection === 'works') {
            console.log(`[Auto-Seed] Collection works is empty. Attempting local seed...`);
            const localWorks = getLocalJsonSeed('works');
            if (Array.isArray(localWorks)) {
                const batch = db.batch();
                localWorks.forEach((work: any) => {
                    const id = work.id || Date.now().toString() + Math.random().toString();
                    const ref = db.collection(collection).doc(id.toString());
                    batch.set(ref, { ...work, id });
                });
                await batch.commit();
                return localWorks as T[];
            }
        }
        return [];
    } catch (error: any) {
        console.warn(`[Firebase Error] reading collection ${collection}:`, error?.message || error);

        if (collection === 'works') {
            console.log(`[Fallback] Attempting to load local seed for works...`);
            const localWorks = getLocalJsonSeed('works');
            return Array.isArray(localWorks) ? (localWorks as T[]) : [];
        }

        return [];
    }
}

function getLocalJsonSeed(filename: string) {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', `${filename}.json`);
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error(`Failed to read seed file ${filename}.json:`, e);
    }
    return null;
}
