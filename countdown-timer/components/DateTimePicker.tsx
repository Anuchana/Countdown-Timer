'use client';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  return (
    <div className="picker-wrapper">
      <label htmlFor="target-date-picker" className="picker-label">
        Set Launch Date
      </label>
      <input
        id="target-date-picker"
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="picker-input"
        aria-label="Set countdown target date and time"
      />
    </div>
  );
}
