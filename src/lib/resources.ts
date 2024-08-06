import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKnCxy6IjH1lLwxdGe6lqDeGblnzoyfiI",
  authDomain: "dissertation-92230.firebaseapp.com",
  projectId: "dissertation-92230",
  storageBucket: "dissertation-92230.appspot.com",
  messagingSenderId: "51086144897",
  appId: "1:51086144897:web:c69e1c1582a9fde421a480",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { app, storage };
