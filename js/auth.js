import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";


// REGISTER
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}


// LOGIN
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}


// LOGOUT
async function logoutUser() {
  try {
    await signOut(auth);

    return {
      success: true
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}


// CHECK LOGIN STATUS
function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}


export {
  registerUser,
  loginUser,
  logoutUser,
  watchAuthState
};