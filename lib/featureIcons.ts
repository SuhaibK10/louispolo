// ─────────────────────────────────────────────────────────────────────────────
// lib/featureIcons.ts
// Maps a product feature label to a relevant lucide icon for the PDP
// feature grid. Rules are ordered — first match wins — so put specific
// phrases ("anti-theft zipper") before broad ones ("zip").
// ─────────────────────────────────────────────────────────────────────────────

import {
  Backpack,
  Boxes,
  Briefcase,
  CircleCheck,
  Coffee,
  DoorOpen,
  EyeOff,
  Feather,
  FileText,
  Layers,
  LayoutGrid,
  Laptop,
  LifeBuoy,
  Lock,
  Luggage,
  MoveVertical,
  Palette,
  Plane,
  Shield,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const RULES: Array<[RegExp, LucideIcon]> = [
  [/anti.?theft/i,                        ShieldCheck],
  [/lock/i,                               Lock],
  [/wheel|spinner/i,                      LifeBuoy],
  [/telescopic|handle/i,                  MoveVertical],
  [/front.?(open|access)/i,               DoorOpen],
  [/laptop/i,                             Laptop],
  [/lightweight|ultra light/i,            Feather],
  [/carry.?on|cabin/i,                    Plane],
  [/nesting|included|3.?in.?1/i,          Boxes],
  [/trolley (sleeve|attachment)|mounting sleeve/i, Luggage],
  [/strap/i,                              Backpack],
  [/concealed/i,                          EyeOff],
  [/document/i,                           FileText],
  [/professional|executive/i,             Briefcase],
  [/print|pattern|design|finish/i,        Palette],
  [/lining|fabric/i,                      Layers],
  [/compartment|pocket|divider|storage|organiz/i, LayoutGrid],
  [/zip|secure/i,                         ShieldCheck],
  [/cup holder/i,                         Coffee],
  [/shell|polycarbonate|abs|polypropylene|impact|wear|protect/i, Shield],
  [/versatile|gym|weekend/i,              Luggage],
]

export function featureIconFor(label: string): LucideIcon {
  for (const [pattern, icon] of RULES) {
    if (pattern.test(label)) return icon
  }
  return CircleCheck
}
