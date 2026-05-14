/**
 * Get password strength score and level
 */
export function getPasswordStrength(password: string): {
  score: number;
  level: "weak" | "fair" | "good" | "strong" | "";
} {
  let score = 0;

  if (!password) return { score: 0, level: "" };

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  const levels = ["", "weak", "fair", "good", "strong"] as const;
  const strengthLevel = levels[Math.min(score, 4)] || "weak";

  return {
    score: Math.min(score, 4),
    level: strengthLevel as "weak" | "fair" | "good" | "strong" | "",
  };
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
