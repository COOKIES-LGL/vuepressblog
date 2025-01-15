```ts
/**
 * preloadLinks.js
 * 资源预加载
 */
import React from "react";

export type PreloadAssets = Partial<{
  imgs: string[];
  fonts: { src: string; type?: string }[];
}>;

export const PreloadLinks = ({ preloadAssets }: { preloadAssets: PreloadAssets }) => (
  <>
    {preloadAssets.imgs?.map((url) => (
      <link rel="preload" href={url} as="image" crossOrigin="anonymous" key={url} />
    ))}
    {preloadAssets.fonts?.map(({ src, type }) => (
      <link rel="preload" href={src} as="font" type={type} crossOrigin="anonymous" key={src} />
    ))}
  </>
);
```
