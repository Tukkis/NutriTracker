import { User } from "firebase/auth";
import { auth } from "../firestore";

export const getCurrentUserId = (): string | null => {
  const currentUser: User | null = auth.currentUser;
  if (currentUser) {
    return currentUser.uid; // The user's unique ID
  } else {
    console.log("No user is currently signed in.");
    return null;
  }
};
