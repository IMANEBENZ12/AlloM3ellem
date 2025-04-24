// firebaseServices.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AppleAuthProvider,
  RecaptchaVerifier,
  signInWithCredential
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from './Firebase';

// Error message handler
export const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé par un autre compte.';
    case 'auth/invalid-email':
      return 'Email invalide.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible.';
    case 'auth/user-not-found':
      return 'Aucun utilisateur trouvé avec cet email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-verification-code':
      return 'Code de vérification invalide.';
    case 'auth/invalid-phone-number':
      return 'Numéro de téléphone invalide.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};

// Email authentication
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Phone authentication
export const setupRecaptcha = (containerID) => {
  window.recaptchaVerifier = new RecaptchaVerifier(containerID, {
    size: 'invisible',
    callback: () => {
      console.log('Recaptcha verified');
    },
  }, auth);
  return window.recaptchaVerifier;
};

export const verifyPhoneNumber = async (phoneNumber, recaptchaVerifier) => {
  try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber, 
      recaptchaVerifier
    );
    return verificationId;
  } catch (error) {
    throw error;
  }
};

export const confirmPhoneVerification = async (verificationId, verificationCode) => {
  try {
    const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const result = await signInWithCredential(auth, phoneCredential);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Social authentication
export const socialLogin = async (providerName) => {
  try {
    let provider;
    
    switch(providerName) {
      case 'Google':
        provider = new GoogleAuthProvider();
        break;
      case 'Facebook':
        provider = new FacebookAuthProvider();
        break;
      case 'Apple':
        provider = new AppleAuthProvider();
        break;
      default:
        throw new Error('Invalid provider');
    }
    
    const result = await signInWithPopup(auth, provider);
    return {
      user: result.user,
      isNewUser: result._tokenResponse.isNewUser
    };
  } catch (error) {
    throw error;
  }
};

// User data management
export const saveUserToFirestore = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};