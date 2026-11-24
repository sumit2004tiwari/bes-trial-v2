# Homepage video

The second homepage section, directly below the hero, contains only the supplied
`public/besexpolandscapeVideo.mp4`. `EventFilm.tsx` selects this file directly;
legacy CMS and `HOMEPAGE_VIDEO_*` settings do not override this section.

The player fills the entire content viewport below the site header, edge to edge,
with no container width limit, outer spacing, or rounded corners. Both the player
and video use 100% width and height. `object-fit: cover` preserves the source's
proportions while cropping the edges as needed to fill desktop, tablet, and mobile
screens without blank space. Dynamic viewport height follows mobile browser chrome.

Playback starts when at least 20% of the player enters the visible scroll area.
It starts muted, plays inline on mobile, and loops continuously. Playback pauses
when the player leaves that area or the browser tab is hidden, and resumes when
visible again. Native controls allow visitors to pause, seek, enable sound, or
use fullscreen; they also provide manual playback if browser settings block
autoplay. Load failures offer retry and a direct file link.

To replace this film, update the public MP4 and rebuild/redeploy. Use an H.264 MP4
with a web-optimized export for broad browser support.
