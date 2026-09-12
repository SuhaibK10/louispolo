// ─────────────────────────────────────────────────────────────────────────────
// config/communityShowcase.ts
// Content for the homepage "By Our Community" UGC video carousel.
//
// The clips below are temporary stand-ins (reusing existing product demo
// videos already on Cloudflare Stream) so the section can be built, previewed,
// and reviewed with real motion/layout before actual content exists. Before
// launch, replace every `videoId` with real customer/creator clips — sourced
// and uploaded the same way (see scripts/migrate-video-to-cloudflare-stream.ts)
// — and confirm each creator has actually agreed to being reposted.
// ─────────────────────────────────────────────────────────────────────────────

// Homepage switch — flip to false to pull this section off the homepage.
export const COMMUNITY_SHOWCASE_HOME_ENABLED = true

export interface CommunityClip {
  videoId:  string  // Cloudflare Stream UID
  duration?: string // e.g. "00:20" — shown as an overlay badge, purely cosmetic. Omit if unknown.
  caption:  string  // alt text — creator's handle once real content is in
}

// TODO: swap the remaining placeholder videoIds for real, rights-cleared UGC clips.
export const COMMUNITY_CLIPS: CommunityClip[] = [
  { videoId: '48b8f7686d12130e84b9de78f34723ab', duration: '00:14', caption: 'Louis Polo community video' },
  { videoId: 'ac2c3cbed74ec63cd72630b8b4c9bf62', duration: '00:20', caption: 'Louis Polo community video' },
  { videoId: 'd7a97bbee4bddeaee0b222272c81c78e', caption: 'Louis Polo customer video — Dr Vishva' },
  { videoId: '8f322ddea596b20c6d9b5028f768988f', duration: '00:36', caption: 'Louis Polo community video' },
  { videoId: '5ab8e342df61ced6a63ddf057acd832f', duration: '00:24', caption: 'Louis Polo community video' },
]
