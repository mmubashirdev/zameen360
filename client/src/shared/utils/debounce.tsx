type DebouncedFn<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): DebouncedFn<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  }) as DebouncedFn<T>;

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
