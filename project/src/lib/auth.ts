import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  phone: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserData {
  uid: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export const signUp = async ({ email, password, username, phone }: SignUpData) => {
  try {
    // Create auth user first
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      // Create user document in Firestore
      const userData = {
        username,
        email,
        phone,
        isAdmin: email === 'zekceralon@gmail.com', // Set admin flag based on email
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return {
        uid: user.uid,
        ...userData
      };
    } catch (error) {
      // If Firestore creation fails, delete the auth user
      await deleteUser(user);
      throw error;
    }
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('כתובת האימייל כבר קיימת במערכת');
    }
    throw error;
  }
};

export const signIn = async ({ email, password }: SignInData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('לא נמצאו פרטי משתמש');
    }

    const userData = userDoc.data();
    return {
      uid: user.uid,
      ...userData
    } as UserData;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('שם משתמש או סיסמה שגויים');
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error('שגיאה בהתנתקות מהמערכת');
  }
};