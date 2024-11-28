// Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="peer hidden"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`w-[20px] h-[20px] bg-[#2C3659] border-2 border-white rounded-sm transition-all duration-200
        peer-checked:bg-[#2C3659] flex items-center justify-center`}
      >
        {/* Галочка */}
        <svg
          className={`w-4 h-4 text-white transition-opacity duration-200 ${
            checked ? 'opacity-100' : 'opacity-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.293 4.293a1 1 0 0 1 0 1.414L8 13.414 3.707 9.121a1 1 0 0 1 1.414-1.414L8 10.586l7.879-7.879a1 1 0 0 1 1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </label>
  );
};

export default Checkbox;
