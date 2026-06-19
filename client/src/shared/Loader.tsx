import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoaderSize = "sm" | "md" | "lg" | "xl";
type LoaderVariant = "spinner" | "dots" | "bar" | "skeleton";

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  progress?: number; // 0-100 for progress bar variant
  color?: string;
}

// ─── Size mappings ────────────────────────────────────────────────────────────

const SIZE_MAP: Record<
  LoaderSize,
  { spinner: number; text: string; gap: string }
> = {
  sm: { spinner: 16, text: "text-xs", gap: "gap-1.5" },
  md: { spinner: 24, text: "text-sm", gap: "gap-2" },
  lg: { spinner: 40, text: "text-base", gap: "gap-3" },
  xl: { spinner: 56, text: "text-lg", gap: "gap-4" },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const SpinnerLoader = ({ size, message, color = "#2563eb" }: any) => {
  const { spinner, text, gap } = SIZE_MAP[size as LoaderSize];
  return (
    <div className={`flex flex-col items-center justify-center ${gap}`}>
      <Loader2 size={spinner} className="animate-spin" style={{ color }} />
      {message && (
        <p className={`${text} font-medium text-gray-600`}>{message}</p>
      )}
    </div>
  );
};

const DotsLoader = ({ size, message, color = "#2563eb" }: any) => {
  const { text, gap } = SIZE_MAP[size as LoaderSize];
  const dotSize = size === "sm" ? 6 : size === "lg" ? 12 : 8;

  return (
    <div className={`flex flex-col items-center justify-center ${gap}`}>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="rounded-full animate-bounce"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      {message && (
        <p className={`${text} font-medium text-gray-600`}>{message}</p>
      )}
    </div>
  );
};

const BarLoader = ({ progress = 0, message, color = "#2563eb" }: any) => (
  <div className="w-full max-w-md flex flex-col gap-2">
    {message && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{message}</span>
        <span className="text-gray-500 font-mono">{progress}%</span>
      </div>
    )}
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300 ease-out rounded-full"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        }}
      />
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="w-full space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
  </div>
);

// ─── Main Loader Component ────────────────────────────────────────────────────

const Loader = ({
  size = "md",
  variant = "spinner",
  message,
  fullScreen = false,
  overlay = false,
  progress,
  color = "#2563eb",
}: LoaderProps) => {
  const content = (() => {
    switch (variant) {
      case "dots":
        return <DotsLoader size={size} message={message} color={color} />;
      case "bar":
        return (
          <BarLoader progress={progress} message={message} color={color} />
        );
      case "skeleton":
        return <SkeletonLoader />;
      default:
        return <SpinnerLoader size={size} message={message} color={color} />;
    }
  })();

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-inherit">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{content}</div>;
};

export default Loader;
