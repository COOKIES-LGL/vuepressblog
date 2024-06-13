``` js
import React, { useEffect } from 'react';
import { replaceHost } from './host';

/**
 * 查询图片状态
 */
function queryImgState(img: HTMLImageElement) {
  if (!img.complete) {
    return 'loading';
  }
  if (img.naturalHeight > 0) {
    return 'succ';
  }
  return 'error';
}

function retryErrorImg(img: HTMLImageElement) {
  // eslint-disable-next-line no-self-assign
  img.src = img.src;
}

/**
 * pc chrome bfCache 情况下
 * 1. 跳走的时候图片未加载完成或者加载失败，再 back 回来, complete 会变为 false
 * 2. 原图重试没有用，需要换个 url 重试
 */
function retryNotCompleteImg(img: HTMLImageElement) {
  // eslint-disable-next-line no-self-assign
  img.src = replaceHost(img.src);
}

export function retryImgs(withNotComplete = false) {
  const imgs = document.querySelectorAll('img');
  Array.from(imgs).forEach((img) => {
    if (img.src) {
      switch (queryImgState(img)) {
        case 'error':
          retryErrorImg(img);
          break;
        case 'loading':
          withNotComplete && retryNotCompleteImg(img);
          break;
      }
    }
  });
}

function throttleTime(fn, time) {
  let lastCallTime = 0;
  return (...args) => {
    if (Date.now() - lastCallTime > time) {
      lastCallTime = Date.now();
      fn(...args);
    }
  };
}

const throttledRetryImgs = throttleTime(retryImgs, 7000);

// 监听上线
function ListenOnline() {
  useEffect(() => {
    const handler = () => {
      retryImgs();
    };
    window.addEventListener('online', handler);
    return () => {
      window.removeEventListener('online', handler);
    };
  }, []);
  return null;
}

const idleCallback = (fn) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(fn);
  } else {
    setTimeout(fn, 200);
  }
};

function ListenBFCacheBack() {
  // 监听 BFCache back
  useEffect(() => {
    const handler = (event) => {
      if (event.persisted) {
        // 立即重试可能不好用
        // 在 pc chrome 上发现立即重试不好用
        idleCallback(() => {
          retryImgs(true);
        });
      }
    };
    window.addEventListener('pageshow', handler);
    return () => {
      window.removeEventListener('pageshow', handler);
    };
  }, []);
  return null;
}

function ListenVisibilityChange() {
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        // 这个事件可能触发的频繁，所以做个节流
        throttledRetryImgs();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);
  return null;
}

interface IProps {
  enableOnline?: boolean;
  enableBFCacheBack?: boolean;
  enableVisibilitychange?: boolean;
}

export function ImgsRetryGuard({ enableOnline = true, enableBFCacheBack = true, enableVisibilitychange }: IProps) {
  // 监听上线
  return (
    <>
      {enableOnline && <ListenOnline />}
      {enableBFCacheBack && <ListenBFCacheBack />}
      {enableVisibilitychange && <ListenVisibilityChange />}
    </>
  );
}

```
