// /* eslint-disable no-undef */
// importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"); 

// importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// // Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNgdiQX_ZyzTXwRJhdyVz_268CupL6InM",
  authDomain: "siagas-cc523.firebaseapp.com",
  projectId: "siagas-cc523",
  storageBucket: "siagas-cc523.firebasestorage.app",
  messagingSenderId: "833025681646",
  appId: "1:833025681646:web:e7e18d058e6ec70043ebff",
  measurementId: "G-LS286N8VJL"
};


// firebase.initializeApp(firebaseConfig);


// const messaging = firebase.messaging();

// // listener background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("📩 Received background message ", payload);

//   const notificationTitle = payload.notification?.title || "Notifikasi Baru 🚀";
//   const notificationOptions = {
//     body: payload.notification?.body || "Ada update dari sistem",
//     icon: "/icon-192x192.png", // ganti sesuai ikon di /public
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


// public/firebase-messaging-sw.js



// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message: ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/vercel.svg',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Konfigurasi Firebase kamu
 
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // console.log('Received background message: ', payload);
  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/vercel.svg',  // ganti dengan path icon kamu
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
