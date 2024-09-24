```js
import BezierEasing from 'bezier-easing'; // 滚动动态曲线包
import { getScrollTop } from './dom/scrollUtil';
import Deferred from './Deferred';
type easingParams = [number, number, number, number];

export interface IScrollOptions {
    useNative?: boolean; // 使用h5 scroll-behavior api，默认true
    speed?: number; // 滚动1000px需要的时间
    easingParams?: easingParams; // 贝塞尔曲线参数
    minTime: number; // 最小滚动时间
    maxTime: number; // 最长滚动时间
}

const defaultOptions = {
    useNative: true,
    speed: 500,
    easingParams: [0.42, 0, 0.58, 1] as easingParams,
};

function scrollByBrowserApi(anchor): Promise<any> {
    try {
        const defer = new Deferred();
        // eslint-disable-next-line
        function checkEnd() {
            const scrollTop = getScrollTop();

            if (scrollTop === anchor) {
                defer.resolve();
                return true;
            }
            return false;
        }

        // 这个scroll不能throttle，避免滑到最后没有立马触发listener，然后用户划动改变了scrollTop，无法触发结束状态
        const scrollListener = () => {
            try {
                if (checkEnd()) {
                    window.removeEventListener('scroll', scrollListener);
                }
            } catch (e) {
                defer.resolve();
            }
        };
        if (!checkEnd()) {
            window.addEventListener('scroll', scrollListener);
            window.scrollTo({
                top: anchor,
                left: 0,
                behavior: 'smooth',
            });
        }
        return defer.promise;
    } catch (e) {
        return Promise.resolve();
    }
}

function getSpeed(distance, options) {
    const speed = Math.round((distance / 1000) * options.speed);
    if (options.maxTime && speed > options.maxTime) return options.maxTime;
    if (options.minTime && speed < options.minTime) return options.minTime;
    return speed;
}

function scrollByRAF(anchor, options: IScrollOptions): Promise<any> {
    return new Promise(resolve => {
        const startLocation = window.pageYOffset;
        const endLocation = anchor;
        const distance = anchor - startLocation;
        const speed = getSpeed(Math.abs(distance), options);
        const bezierEasing = BezierEasing(...options.easingParams);

        let start;
        let timeLapsed = 0;
        let position;
        let animationInterval = null;

        const cancelScroll = function () {
            cancelAnimationFrame(animationInterval);
            animationInterval = null;
            resolve();
        };

        const stopAnimateScroll = function (position, endLocation) {
            if (position === endLocation || window.pageYOffset === endLocation) {
                cancelScroll();
                return true;
            }
        };
        // let markNum = 5;
        const loopAnimateScroll = function (timestamp) {
            try {
                start = start || timestamp;
                timeLapsed += timestamp - start;
                const percentage = Math.min(timeLapsed / speed, 1);
                position = startLocation + distance * bezierEasing(percentage);
                window.scrollTo(0, Math.floor(position));
                if (!stopAnimateScroll(position, endLocation)) {
                    animationInterval = window.requestAnimationFrame(loopAnimateScroll);
                    start = timestamp;
                }
            } catch (e) {
                resolve();
            }
        };
        // 等待主进程空闲再开始动画，避免卡顿
        setTimeout(() => {
            window.requestAnimationFrame(loopAnimateScroll);
        }, 0);
    });
}

export default async function smoothScroll(anchor, scrollOptions?: IScrollOptions) {
    const maxScrollTop = document.body.scrollHeight - document.body.offsetHeight;
    // 避免页面不够长，无法到达最终的结束位置；
    anchor = Math.min(anchor, maxScrollTop);
    const options = { ...defaultOptions, ...(scrollOptions || {}) };
    // 安卓默认使用原生api
    if (
        window.navigator.userAgent.match(/Android/i) &&
        options.useNative &&
        'scrollBehavior' in document.documentElement.style // 是否支持ScrollToOption
    ) {
        return Promise.race([
            scrollByBrowserApi(anchor),
            // 防止scroll事件触发间隔被用户滑动，导致无法在重点正确触发end（多100作为缓冲）
            new Promise(resolve => setTimeout(resolve, (options.maxTime || 1400) + 100)),
        ]);
    }

    // ios不支持scrollOptions 只用raf动画
    return scrollByRAF(anchor, options);
}

```
