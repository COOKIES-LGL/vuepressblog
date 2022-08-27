---
home: false
sidebar: false
---

### 批量加载图片
#### 上面的解没有达到请求最快，因为 Promise.all 的返回是传入 promise组 相互依赖的结果，当其中有一个完成了还得等其它都完成，蜗牛都睁大了双眼👀。 也不是题目想要的效果。也就有了下面的思路将八张图片先拿三张出来，当做 初始请求，但是一旦有完成的（无论成功或失败）就 将成后面的一张的结果加入请求。
``` javascript
function limitRequest(urlArr, max) {

    const urls = [].concat(urlArr);
    let currentUrls = urls.splice(0, 3)
    let currentPromises = currentUrls.map(url => loadImg(url));
    let resolvedUrl = '';
    const len = urls.length;
    const results = []

    return urls.reduce((acc, url, index) => {
      return acc.then(
          () => Promise.race(currentPromises)
        ).then(img => {
          console.log('wow~~', index, img);
          results.push(img)
          resolvedUrl = img.src;
          updatePromises(resolvedUrl, url)
        })
        .catch(err => {
          console.log(`第 ${index} 张图片加载失败了`);
          resolvedUrl = err.message.match(/http[s]?:\/\/.{1,}$/);
          results.push(index)
          updatePromises(resolvedUrl, url);
        }).then(() => {
          return new Promise(resolve => {
            if (index === urls.length - 1) {
              Promise.all(currentPromises).then(res => {
                results.push(...res)
                resolve(results);
              })
            } else resolve()
          })
        })
    }, Promise.resolve())

    function updatePromises(removeUrl, addUrl) {
      const idx = currentUrls.findIndex(url => url === removeUrl);
      currentUrls.splice(idx, 1, addUrl)
      currentPromises[idx] = loadImg(addUrl)
    }
}

limitRequest(urls, 3).then(res => {
    console.log('end', res);
})
```



