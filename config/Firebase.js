import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyAvMDwYlKG3zK6o6rwo5U_N3P6GigSiktM",
    authDomain: "smmpcc-f1d23.firebaseapp.com",
    databaseURL: "https://smmpcc-f1d23-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smmpcc-f1d23",
    storageBucket: "smmpcc-f1d23.appspot.com",
    messagingSenderId: "871154173533",
    appId: "1:871154173533:web:249b27cb2d1001e081efb4"
  };

firebase.initializeApp(config);

export default firebase;