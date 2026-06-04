// src/components/Divider.jsx

interface DividerProps {
  text?: string;
}

const Divider = ({ text = "Instant Log In" }: DividerProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-sm text-gray-400 whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
};

export default Divider;
