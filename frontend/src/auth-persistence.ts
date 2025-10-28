import { setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from "firebase/auth";
import { auth } from "./firebase";

export async function useDefaultPersistence() {
    await setPersistence(auth, browserLocalPersistence);   // 既定：再起動後も維持
}
export async function useSessionOnly() {
    await setPersistence(auth, browserSessionPersistence); // タブ閉じたら消える
}
export async function useNoPersistence() {
    await setPersistence(auth, inMemoryPersistence);       // 全く残さない
}
