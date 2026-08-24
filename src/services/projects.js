import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const projectsRef = () => collection(db, "projects");

function toProject(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getProjects() {
  const snap = await getDocs(query(projectsRef(), orderBy("createdAt", "desc")));
  return snap.docs.map(toProject);
}

export async function getProject(id) {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? toProject(snap) : null;
}

export async function addProject(data) {
  return addDoc(projectsRef(), { ...data, createdAt: serverTimestamp() });
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, "projects", id));
}
