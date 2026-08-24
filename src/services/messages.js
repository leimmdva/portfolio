import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const messagesRef = () => collection(db, "messages");

function toMessage(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getMessages() {
  const snap = await getDocs(query(messagesRef(), orderBy("date", "desc")));
  return snap.docs.map(toMessage);
}

export async function addMessage({ name, email, subject, message }) {
  return addDoc(messagesRef(), { name, email, subject, message, read: false, date: serverTimestamp() });
}

export async function markMessageRead(id) {
  return updateDoc(doc(db, "messages", id), { read: true });
}

export async function deleteMessage(id) {
  return deleteDoc(doc(db, "messages", id));
}
