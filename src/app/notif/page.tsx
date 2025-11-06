"use client";

import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/lib/firebaseClient";
import type { MessagePayload } from "firebase/messaging";
export default function NotificationsPage() {
  useEffect(() => {
    let unsubscribe = null;

    // Minta token
    requestForToken().then((token) => {
      console.log("FCM Token:", token);
      // bisa kirim token ke backend jika perlu
    });

    // Dengarkan pesan di foreground
    unsubscribe = onMessageListener((payload:MessagePayload) => {
      console.log("Foreground message:", payload);
      const notif = payload.notification;
      if (notif) {
        alert(`${notif.title}: ${notif.body}`);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return <div>Enable Notifications</div>;
}
