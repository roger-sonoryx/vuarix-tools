"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para quilogramas (kg)
const units = [
  { id: "kg", label: "Quilograma (kg)", toBase: 1 },
  { id: "g", label: "Grama (g)", toBase: 0.001 },
  { id: "mg", label: "Miligrama (mg)", toBase: 0.000001 },
  { id: "t", label: "Tonelada (t)", toBase: 1000 },
  { id: "lb", label: "Libra (lb)", toBase: 0.45359237 },
  { id: "oz", label: "Onça (oz)", toBase: 0.0283495231 },
];

export default function WeightConverterTool() {
  return <UnitConverter units={units} />;
}
