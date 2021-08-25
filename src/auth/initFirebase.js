import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { config } from "./config";

function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}

initFirebase();

export default firebase ;