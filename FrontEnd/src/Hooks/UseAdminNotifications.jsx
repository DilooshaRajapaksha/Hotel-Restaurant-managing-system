// src/hooks/useAdminNotifications.js
import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
export { useNotifications as useAdminNotifications } from "../Context/NotificationContext";

// const WS_URL = "http://localhost:8081/ws";

// export function useAdminNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [unread, setUnread]               = useState(0);
//   const [toast, setToast]                 = useState(null);
//   const toastTimer = useRef(null);

//   useEffect(() => {
//     const client = new Client({
//       webSocketFactory: () => new SockJS(WS_URL),
//       reconnectDelay: 5000,
//       onConnect: () => {
//         client.subscribe("/topic/admin-notifications", (frame) => {
//           const payload = JSON.parse(frame.body);
//           const notif = {
//             id:        Date.now(),
//             type:      payload.type,       // "ORDER" | "BOOKING"
//             refId:     payload.id,         // orderId or bookingId
//             title:     payload.title,
//             message:   payload.message,
//             timestamp: payload.timestamp,
//             read:      false,
//           };
//           setNotifications(prev => [notif, ...prev].slice(0, 50));
//           setUnread(prev => prev + 1);
//           // show toast
//           clearTimeout(toastTimer.current);
//           setToast(notif);
//           toastTimer.current = setTimeout(() => setToast(null), 4500);
//         });
//       },
//       onStompError: (frame) => console.error("STOMP error:", frame),
//     });
//     client.activate();
//     return () => client.deactivate();
//   }, []);

//   const dismissToast = useCallback(() => {
//     clearTimeout(toastTimer.current);
//     setToast(null);
//   }, []);

//   const markAllRead = useCallback(() => {
//     setUnread(0);
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//   }, []);

//   const clearAll = useCallback(() => {
//     setNotifications([]);
//     setUnread(0);
//   }, []);

//   return { notifications, unread, toast, dismissToast, markAllRead, clearAll };
// }