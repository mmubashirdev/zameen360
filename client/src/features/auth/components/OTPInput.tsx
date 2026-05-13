import { useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  hasError = false,
}: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Build digit array of fixed length
  const digits: string[] = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setDigit = (i: number, ch: string) => {
    const next = [...digits];
    next[i] = ch;
    onChange(next.join(""));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    if (!ch) return;
    setDigit(i, ch);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        setDigit(i, "");
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setDigit(i - 1, "");
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next.join(""));
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1}`}
          className={[
            "w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-gray-50 text-gray-900",
            hasError
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : d
                ? "border-blue-500 bg-blue-50 text-blue-700 scale-105"
                : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:scale-105",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
