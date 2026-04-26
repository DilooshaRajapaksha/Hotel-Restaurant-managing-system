import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const NotificationContext = createContext(null);

const WS_URL = "http://localhost:8081/ws";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [toast, setToast]                 = useState(null);
  const toastTimer = useRef(null);
  const clientRef  = useRef(null);

  useEffect(() => {
    // Only connect once, keep alive for entire admin session
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WS] Connected to admin notifications");

        client.subscribe("/topic/admin-notifications", (frame) => {
          const payload = JSON.parse(frame.body);

          const notif = {
            id:        Date.now(),
            type:      payload.type,     // "ORDER" | "BOOKING"
            refId:     payload.id,       // orderId or bookingId
            title:     payload.title,
            message:   payload.message,
            timestamp: payload.timestamp || new Date().toISOString(),
            read:      false,
          };

          setNotifications(prev => [notif, ...prev].slice(0, 50));
          setUnread(prev => prev + 1);

          // Show toast
          clearTimeout(toastTimer.current);
          setToast(notif);
          toastTimer.current = setTimeout(() => setToast(null), 4500);
        });
      },
      onDisconnect: () => console.log("[WS] Disconnected"),
      onStompError: (frame) => console.error("[WS] STOMP error:", frame),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clearTimeout(toastTimer.current);
      client.deactivate();
    };
  }, []);

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const markAllRead = useCallback(() => {
    setUnread(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnread(0);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unread, toast, dismissToast, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
  return ctx;
}