import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import styles from "../styles/authButton.module.css";

interface AuthButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function AuthButton({
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  icon = null,
  children,
  className = "",
  ...rest
}: AuthButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        styles.btn,
        isDisabled ? styles.btnDisabled : styles.btnActive,
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={18} className={styles.spinner} />
          Processing...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
