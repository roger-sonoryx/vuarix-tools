import {
  FileText, Image, Type, Calculator, RefreshCw, Globe, Share2,
  Combine, Scissors, FileDown, ListOrdered, FileOutput, RotateCw,
  Maximize2, Crop, QrCode, KeyRound, Palette, LucideIcon,
  CaseSensitive, Clock, ArrowDownAZ, CopyX, Percent, Fuel, Users,
  Flame, PaintBucket, Ruler, Cake, CalendarDays, Weight, Move,
  Square, Box, Thermometer, Gauge, Archive, Braces, FileCode,
  Minimize2, Binary, Link2, Map, Tags, Fingerprint, Hash, Pipette,
  Instagram, Facebook, Linkedin, Youtube, LayoutGrid, CreditCard,
Sparkle, ShieldCheck,
} from "lucide-react";

// Mapa central de ícones. Cada ferramenta em lib/data.ts referencia um ícone
// pelo nome (string), e este componente resolve para o ícone real do Lucide.
// Isso evita importar dezenas de ícones espalhados pelo projeto.
const iconMap: Record<string, LucideIcon> = {
  FileText, Image, Type, Calculator, RefreshCw, Globe, Share2,
  Combine, Scissors, FileDown, ListOrdered, FileOutput, RotateCw,
  Maximize2, Crop, QrCode, KeyRound, Palette,
  CaseSensitive, Clock, ArrowDownAZ, CopyX, Percent, Fuel, Users,
  Flame, PaintBucket, Ruler, Cake, CalendarDays, Weight, Move,
  Square, Box, Thermometer, Gauge, Archive, Braces, FileCode,
  Minimize2, Binary, Link2, Map, Tags, Fingerprint, Hash, Pipette,
  Instagram, Facebook, Linkedin, Youtube, LayoutGrid, CreditCard,
  Sparkle, ShieldCheck,
};

export default function ToolIcon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[name] ?? FileText;
  return <Icon size={size} className={className} />;
}
