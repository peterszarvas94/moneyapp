interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
}

export function InputMoney({ value, onChange, min }: Props) {
  return (
    <input
      className="w-full h-full border border-gray-400 rounded text-right"
      type="number"
      min={min ?? 0}
      max={9007199254740991}
      step={1}
      required={true}
      value={value ?? 0}
      onChange={(e) => {
        if (e.target.value === "") {
          onChange(null);
          return;
        }

        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          onChange(newValue);
        }
      }}
    />
  );
}
