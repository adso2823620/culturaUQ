'use client';

import { MUNICIPIOS_CALDAS } from '@/lib/constants/municipios';

interface MunicipioInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function MunicipioInput({
  id = 'municipio',
  value,
  onChange,
  placeholder = 'Escribe o selecciona un municipio',
  className = '',
  required = false,
}: MunicipioInputProps) {
  const listId = `${id}-list`;

  return (
    <>
      <input
        id={id}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
      <datalist id={listId}>
        {MUNICIPIOS_CALDAS.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
    </>
  );
}