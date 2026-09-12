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
  { videoId: 'd77f79073e54f95ec8ecc24857e02fc1', caption: 'Louis Polo customer video' },
]
