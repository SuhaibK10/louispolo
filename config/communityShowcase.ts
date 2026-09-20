// ─────────────────────────────────────────────────────────────────────────────
// config/communityShowcase.ts
// Content for the homepage "By Our Community" UGC video carousel.
//
// Real UGC only from here on — the earlier placeholder clips (reused product
// demo videos) have been removed. Add more real customer/creator clips as
// they're sourced and uploaded (see scripts/migrate-video-to-cloudflare-stream.ts),
// once each creator has actually agreed to being reposted.
// ─────────────────────────────────────────────────────────────────────────────

// Homepage switch — flip to false to pull this section off the homepage.
export const COMMUNITY_SHOWCASE_HOME_ENABLED = true

export interface CommunityClip {
  videoId:  string  // Cloudflare Stream UID
  duration?: string // e.g. "00:20" — shown as an overlay badge, purely cosmetic. Omit if unknown.
  caption:  string  // alt text — creator's handle once real content is in
}

export const COMMUNITY_CLIPS: CommunityClip[] = [
  { videoId: 'd7a97bbee4bddeaee0b222272c81c78e', caption: 'Louis Polo customer video — Dr Vishva' },
  // Re-encoded down from 19.5MB (1920p) to 7.7MB — same clip, see CommunityShowcase.tsx
  // for why the original file size was making tap-to-play feel slow.
  { videoId: '481b3c87b9c97480266e7ccb9fa8f5ac', caption: 'Louis Polo customer video' },
  // Re-encoded down from 18.1MB (1920p) to 7.19MB — same clip as above.
  { videoId: 'b8cfb74cfc722f6c6fa6ade4647c06c8', caption: 'Louis Polo customer video — Sheena Sukeja' },
]
