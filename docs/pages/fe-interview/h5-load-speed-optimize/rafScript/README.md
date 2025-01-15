```js
/**
 * @file Preload.js
 * @description: 预加载文件
 */

import React from "react";

export default ({ scripts = [] }) =>
  scripts.map((src) => <link rel="preload" href={src} crossOrigin="anonymous" as="script" />);
```

```js
/**
 * @file requestAnimationFrame.js
 * @description: raf 兼容字符串
 */
export const safeRequestAnimationFrameStr = `window.requestAnimationFrame ||

// Older versions Chrome/Webkit
window.webkitRequestAnimationFrame ||

// opera
window.oRequestAnimationFrame ||

// Firefox < 23
window.mozRequestAnimationFrame ||

// IE
window.msRequestAnimationFrame ||

function (callback) {
    return window.setTimeout(callback, 1000 / 60);
};`;
```

```js
/**
 * @file RafScript.js
 * @scripts 需要加载的脚步列表
 * @context 设备上下文
 * @description raf 优化 ios 加载
 */
import React from "react";
import Preload from "./Preload";
import { SYSTEM } from "./platform-util";
import { safeRequestAnimationFrameStr } from "./requestAnimationFrame";

export default function RafScript({ scripts = [], context }) {
  return (
    <>
      {process.env.NODE_ENV !== "development" && <Preload scripts={scripts} />}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function() {
    function loadScript(n) {
      for (var e = document.createDocumentFragment(), t = 0; t < n.length; t++) {
        var o = document.createElement("script");
        o.src = n[t],
        o.crossOrigin = "anonymous",
        o.async = !1,
        e.appendChild(o)
      }
      document.body.appendChild(e)
    }
    function scriptDelayLoad(n) {
      var aniFrame = ${safeRequestAnimationFrameStr}
      aniFrame(function(){
        loadScript(n)
      })
    }
    document.addEventListener('DOMContentLoaded', function () {
      ${context?.platform?.platform === SYSTEM.IOS ? "scriptDelayLoad" : "loadScript"}([${scripts
            .map((src) => `"${src}"`)
            .join(",")}]);
    });
}());`,
        }}
      />
    </>
  );
}
```
