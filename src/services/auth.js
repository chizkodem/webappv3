import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    console.log("Logged in!", userCredential.user);

    return userCredential.user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
