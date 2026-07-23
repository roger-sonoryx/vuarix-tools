export type SocialPreset = { id: string; label: string; width: number; height: number };

export const INSTAGRAM_PRESETS: SocialPreset[] = [
  { id: "square", label: "Feed quadrado", width: 1080, height: 1080 },
  { id: "portrait", label: "Feed retrato", width: 1080, height: 1350 },
  { id: "landscape", label: "Feed paisagem", width: 1080, height: 566 },
  { id: "reels", label: "Reels / Story", width: 1080, height: 1920 },
];

export const FACEBOOK_PRESETS: SocialPreset[] = [
  { id: "post", label: "Post", width: 1200, height: 630 },
  { id: "cover", label: "Capa da página", width: 820, height: 312 },
  { id: "profile", label: "Foto de perfil", width: 720, height: 720 },
];

export const LINKEDIN_PRESETS: SocialPreset[] = [
  { id: "post", label: "Post", width: 1200, height: 627 },
  { id: "cover", label: "Capa do perfil", width: 1584, height: 396 },
  { id: "profile", label: "Foto de perfil", width: 400, height: 400 },
  { id: "company-cover", label: "Capa da empresa", width: 1128, height: 191 },
];
