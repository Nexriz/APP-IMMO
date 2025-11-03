"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markAllAsRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          markAllAsRead();
        }}
        className="relative"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune notification</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`text-sm p-2 rounded ${
                    n.isRead ? "text-gray-500" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {n.message}
                  <br />
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
