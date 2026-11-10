# Add your homepage video

The film section sits immediately below the hero and plays the supplied `public/besvideo.mp4` by default. It accepts MP4 or WebM, uses native play/pause, volume, seek, and fullscreen controls, and preserves the source video's proportions. The supplied film is portrait (480 × 848), so it has a dedicated portrait layout with a cover captured from the film. It never autoplays or downloads the video before the visitor chooses to watch.

## Use your raw file

The portrait player is capped at 260px wide on desktop (about 459px tall) and 220px wide on mobile (about 389px tall). Landscape players are capped at 520px wide. The section uses compact spacing and keeps the original video proportions without cropping.

1. Export the video as an H.264 MP4 with AAC audio for broad browser support. A compressed 1080p export is usually suitable for this placement; avoid serving a large camera-original file to mobile visitors.
2. Replace `public/besvideo.mp4` to update the current video without changing any settings.
3. To use a different file path, add this to `.env.local` (and to the hosting environment when deploying), and place the file at the matching location:

   ```env
   HOMEPAGE_VIDEO_URL="/videos/bes-expo.mp4"
   ```

4. Restart the local preview or rebuild/redeploy the website. No component changes are needed.

For large videos, upload the exported file to your media host or CDN and use its direct HTTPS file URL in `HOMEPAGE_VIDEO_URL`. YouTube webpage URLs are not direct video files and are not supported by this player.

Optional settings:

```env
HOMEPAGE_VIDEO_POSTER="/Images/your-video-poster.jpg"
HOMEPAGE_VIDEO_CAPTIONS="/videos/bes-expo.en.vtt"
```

Captions use WebVTT. For media on a different origin, serve captions from the website's own public directory. A video with spoken content should include accurate captions before publication.

## Upload through the existing Contentful CMS

Add these optional fields to the homepage content model:

| Field ID | Type | Purpose |
| --- | --- | --- |
| `homepageVideo` | Media, one file | Upload the MP4/WebM asset here. |
| `homepageVideoPoster` | Media, one image | Optional cover photograph. |
| `homepageVideoCaptions` | Media, one file | Optional WebVTT captions; the asset host must permit cross-origin access. |
| `homepageVideoTitle` | Short text | Optional section heading. |
| `homepageVideoDescription` | Long text | Optional introduction. |
| `homepageVideoUrl` | Short text | Optional direct HTTPS video URL instead of a media asset. |

Publish the assets and homepage entry. The existing `USECONTENTSTACK=true` switch and Contentful configuration must be enabled, with `FRONTEND_DEMO_MODE=false` for real CMS access in this checkout. A published CMS video takes precedence over the environment setting. If no CMS video is supplied, the environment setting or the default `/besvideo.mp4` is used.

There is no public upload form: video publishing uses your existing CMS access or your normal project deployment. Backend registration, account, and booking configuration is unaffected.
