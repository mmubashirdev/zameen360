import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

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
        "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-200",
        isDisabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
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
