"use client";

import UnitConverter from "./UnitConverter";

// toBase = fator para km/h
const units = [
  { id: "kmh", label: "km/h", toBase: 1 },
  { id: "ms", label: "m/s", toBase: 3.6 },
  { id: "mph", label: "mph", toBase: 1.609344 },
  { id: "knot", label: "Nó (knot)", toBase: 1.852 },
];

export default function SpeedConverterTool() {
  return <UnitConverter units={units} />;
}
