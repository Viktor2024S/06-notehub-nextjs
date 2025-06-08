import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search notes"
    />
  );
}
