import { useState, useCallback } from "react";
import type { Toast, ToastType, ToastHook } from "@features/auth/types/auth.types";

let toastIdCounter = 0;

export const useToast = (): ToastHook => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      duration = 4500
    ): void => {
      const id = ++toastIdCounter;

      setToasts((prev) => [
        ...prev,
        { id, type, title, message, removing: false },
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 320);
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: number): void => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 320);
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number): void =>
      addToast("success", title, message, duration),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number): void =>
      addToast("error", title, message, duration),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number): void =>
      addToast("info", title, message, duration),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info };
};