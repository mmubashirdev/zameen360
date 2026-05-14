import styles from "./Toast.module.css";
import type { Toast as ToastItem } from "@features/auth/types/auth.types";

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}

const TOAST_ICONS = {
  success: "fa-check-circle",
  error: "fa-circle-exclamation",
  info: "fa-circle-info",
} as const;

export function ToastContainer({
  toasts,
  removeToast,
}: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            styles.toast,
            styles[toast.type],
            toast.removing ? styles.removing : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
        >
          <i
            className={`fa-solid ${TOAST_ICONS[toast.type]} ${styles.icon}`}
            aria-hidden="true"
          />
          <div className={styles.content}>
            <p className={styles.title}>{toast.title}</p>
            {toast.message ? (
              <p className={styles.message}>{toast.message}</p>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
