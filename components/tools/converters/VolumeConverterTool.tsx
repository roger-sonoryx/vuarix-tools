"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para litros (L)
const units = [
  { id: "l", label: "Litro (L)", toBase: 1 },
  { id: "ml", label: "Mililitro (mL)", toBase: 0.001 },
  { id: "m3", label: "Metro³ (m³)", toBase: 1000 },
  { id: "gal", label: "Galão (US)", toBase: 3.785411784 },
  { id: "cup", label: "Xícara (US)", toBase: 0.2365882365 },
  { id: "tbsp", label: "Colher de sopa", toBase: 0.0147867648 },
];

export default function VolumeConverterTool() {
  return <UnitConverter units={units} />;
}
