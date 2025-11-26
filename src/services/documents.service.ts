import { nanoid } from "nanoid";

import { FIRESTORE_COLLECTIONS } from "@/constants/firestore.constant";
import { adminDb } from "@/libs/firebase/firebaseAdmin.config";
import { DocumentPayload, DocumentResponse, DocumentType } from "@/types/documents";

export async function createDocument(payload: DocumentPayload) {
    const now = Date.now();

    const documentId = nanoid();

    const documentRef = adminDb.collection(FIRESTORE_COLLECTIONS.DOCUMENTS).doc(documentId);

    let sortNo = payload.sortNo;

    if (!sortNo) {
        const lastDocumentSnapshot = await adminDb
            .collection(FIRESTORE_COLLECTIONS.DOCUMENTS)
            .where("type", "==", payload.type)
            .orderBy("sortNo", "desc")
            .limit(1)
            .get();

        if (!lastDocumentSnapshot.empty) {
            const lastDocument = lastDocumentSnapshot.docs[0].data();
            sortNo = (lastDocument.sortNo || 0) + 1;
        } else {
            sortNo = 1;
        }
    }

    const documentPayload = {
        ...payload,
        sortNo,
        id: documentId,
        createdAt: now,
    };

    await documentRef.set(documentPayload);

    return { success: true };
}

export async function getListDocuments(type: DocumentType): Promise<DocumentResponse[]> {
    const documentRef = adminDb
        .collection(FIRESTORE_COLLECTIONS.DOCUMENTS)
        .where("type", "==", type);

    const documentSnapshot = await documentRef.get();

    return documentSnapshot.docs?.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as DocumentResponse;
    });
}

export async function updateDocument(id: string, payload: Partial<DocumentPayload>) {
    const documentRef = adminDb.collection(FIRESTORE_COLLECTIONS.DOCUMENTS).doc(id);

    await documentRef.update({
        ...payload,
        updatedAt: Date.now(),
    });

    return { success: true };
}

export async function deleteDocument(id: string) {
    const documentRef = adminDb.collection(FIRESTORE_COLLECTIONS.DOCUMENTS).doc(id);

    await documentRef.delete();

    return { success: true };
}
