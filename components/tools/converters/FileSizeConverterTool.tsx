"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para bytes. Usa base binária (1024), padrão de sistemas operacionais.
const units = [
  { id: "b", label: "Byte (B)", toBase: 1 },
  { id: "kb", label: "Kilobyte (KB)", toBase: 1024 },
  { id: "mb", label: "Megabyte (MB)", toBase: 1024 ** 2 },
  { id: "gb", label: "Gigabyte (GB)", toBase: 1024 ** 3 },
  { id: "tb", label: "Terabyte (TB)", toBase: 1024 ** 4 },
];

export default function FileSizeConverterTool() {
  return <UnitConverter units={units} decimals={4} />;
}
