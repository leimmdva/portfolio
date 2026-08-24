import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const notesRef = () => collection(db, "notes");

function toNote(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getNotes() {
  const snap = await getDocs(query(notesRef(), orderBy("date", "desc")));
  return snap.docs.map(toNote);
}

export async function getNote(id) {
  const snap = await getDoc(doc(db, "notes", id));
  return snap.exists() ? toNote(snap) : null;
}

export async function addNote(data) {
  return addDoc(notesRef(), data);
}

export async function updateNote(id, data) {
  return updateDoc(doc(db, "notes", id), data);
}

export async function deleteNote(id) {
  return deleteDoc(doc(db, "notes", id));
}
