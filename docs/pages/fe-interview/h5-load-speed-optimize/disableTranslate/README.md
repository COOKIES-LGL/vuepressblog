```js
/**
 * 使用的时候直接按组件再入口出引入即可
 */
import React from "react";
export default function DisableTranslate() {
  const html = `document.documentElement.translate = false;`;
  return <script dangerouslySetInnerHTML={{ __html: html }} />;
}
```
