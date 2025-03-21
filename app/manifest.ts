import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    "name": "Coin Flip Tool",
    "short_name": "Coin Flip",
    "description": "A virtual coin flip tool for making random decisions",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0066ff",
    "icons": [
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
      {
        "src": "/icons/maskable-icon.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ]
  }
}

