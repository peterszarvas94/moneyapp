import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  width?: string;
  invalid?: boolean;
}

export function InputNumber({ value, min, width, onChange, invalid }: Props) {
  const widthClass = width ?? "w-full";
  return (
    <div className="flex items-center gap-2">
      {invalid && (
        <>
          <div className="text-red-500 text-sm">Too low</div>
          <FiAlertTriangle className="text-red-500" />
        </>
      )}
      <input
        className={`${widthClass} h-6 border border-gray-400 rounded text-right pr-1`}
        type="number"
        min={min ?? 0}
        max={9007199254740991}
        step={1}
        required={true}
        value={value}
        onChange={(e) => {
          if (e.target.value === "") {
            onChange(0);
            return;
          }

          const newValue = parseFloat(e.target.value);
          if (!isNaN(newValue)) {
            onChange(newValue);
          }
        }}
      />

    </div>
  );
}
