"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para metros quadrados (m²)
const units = [
  { id: "m2", label: "Metro² (m²)", toBase: 1 },
  { id: "km2", label: "Quilômetro² (km²)", toBase: 1_000_000 },
  { id: "ha", label: "Hectare (ha)", toBase: 10_000 },
  { id: "cm2", label: "Centímetro² (cm²)", toBase: 0.0001 },
  { id: "ac", label: "Acre", toBase: 4046.8564224 },
  { id: "ft2", label: "Pé² (ft²)", toBase: 0.09290304 },
];

export default function AreaConverterTool() {
  return <UnitConverter units={units} />;
}
