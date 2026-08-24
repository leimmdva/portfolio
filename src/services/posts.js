import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, limit as fbLimit,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const postsRef = () => collection(db, "posts");

function toPost(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getHomePosts() {
  const snap = await getDocs(query(postsRef(), orderBy("date", "desc"), fbLimit(3)));
  return snap.docs.map(toPost);
}

export async function getAllPosts() {
  const snap = await getDocs(query(postsRef(), orderBy("date", "desc")));
  return snap.docs.map(toPost);
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? toPost(snap) : null;
}

export async function addPost(data) {
  return addDoc(postsRef(), data);
}

export async function updatePost(id, data) {
  return updateDoc(doc(db, "posts", id), data);
}

export async function deletePost(id) {
  return deleteDoc(doc(db, "posts", id));
}
