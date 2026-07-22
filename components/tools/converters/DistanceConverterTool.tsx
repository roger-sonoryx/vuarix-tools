"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para metros (m)
const units = [
  { id: "m", label: "Metro (m)", toBase: 1 },
  { id: "km", label: "Quilômetro (km)", toBase: 1000 },
  { id: "cm", label: "Centímetro (cm)", toBase: 0.01 },
  { id: "mm", label: "Milímetro (mm)", toBase: 0.001 },
  { id: "mi", label: "Milha (mi)", toBase: 1609.344 },
  { id: "yd", label: "Jarda (yd)", toBase: 0.9144 },
  { id: "ft", label: "Pé (ft)", toBase: 0.3048 },
  { id: "in", label: "Polegada (in)", toBase: 0.0254 },
];

export default function DistanceConverterTool() {
  return <UnitConverter units={units} />;
}
