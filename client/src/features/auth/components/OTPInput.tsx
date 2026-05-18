import { useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import styles from "../styles/otpInput.module.css";

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
    <div className={styles.container} onPaste={handlePaste}>
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
            styles.digitInput,
            hasError
              ? styles.digitError
              : d
              ? styles.digitFilled
              : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
