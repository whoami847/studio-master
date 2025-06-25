import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityInput({ value, onChange }: QuantityInputProps) {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(1, value - 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num > 0) {
      onChange(num);
    } else if (e.target.value === '') {
      onChange(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={decrement}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="w-16 text-center h-9"
        value={value}
        onChange={handleChange}
        min="1"
      />
      <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={increment}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
