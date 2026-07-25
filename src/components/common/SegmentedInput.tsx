import React, { useRef } from 'react';

interface SegmentedInputProps {
  length: number;
  value: string;
  onChange: (val: string) => void;
  ariaLabel?: string;
}

export const SegmentedInput: React.FC<SegmentedInputProps> = ({
  length,
  value,
  onChange,
  ariaLabel = 'Segmented input',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const chars = Array.from({ length }, (_, i) => value[i] || '');

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // If emptied via backspace/delete in Chrome
    if (raw === '') {
      const newValueArr = [...chars];
      newValueArr[index] = '';
      onChange(newValueArr.join(''));
      return;
    }

    const digits = raw.replace(/\D/g, '');
    if (!digits) return;

    const newValueArr = [...chars];
    let nextIndex = index;

    for (let i = 0; i < digits.length && index + i < length; i++) {
      newValueArr[index + i] = digits[i];
      nextIndex = index + i + 1;
    }

    const newStr = newValueArr.join('');
    onChange(newStr);

    if (nextIndex < length && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!chars[index] && index > 0) {
        const newValueArr = [...chars];
        newValueArr[index - 1] = '';
        onChange(newValueArr.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValueArr = [...chars];
        newValueArr[index] = '';
        onChange(newValueArr.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pastedData) return;
    const truncated = pastedData.slice(0, length);
    onChange(truncated);
    const targetIdx = Math.min(truncated.length, length - 1);
    inputRefs.current[targetIdx]?.focus();
  };

  return (
    <div className="doc-date-boxes" aria-label={ariaLabel}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="doc-date-input"
          value={chars[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};
