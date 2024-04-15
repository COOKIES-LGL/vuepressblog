### 使用nodejs搭建api的mock服务调研

mock js

### 场景多接口联动mock
``` javascript
function mocker(scene, mockSceneMap, isDriver, initMocker) {
    const mockSceneArr = Object.entries(mockSceneMap);

    if (initMocker === '1') {
        // 重置状态
        global[scene] = null;
        return;
    }

    if(!global[scene]) {
        isDriver ? global[scene] = mockSceneArr[0][0] : null;
        mockSceneArr[0][1]();
        return;
    }

    for (let index = 0; index < mockSceneArr.length; index++) {
        if (mockSceneArr[index][0] === global[scene]) {
            if (!isDriver) {
                mockSceneArr[index][1]();
                return;
            }
            if (index + 1 < mockSceneArr.length) {
                mockSceneArr[index + 1][1]();
                global[scene] = mockSceneArr[index + 1][0];
            } else {
                global[scene] = mockSceneArr[0][0];
                mockSceneArr[0][1]();
            }
            return;
        }
    }
}
// 使用
// 从属接口 claimBonus 场景值
mocker('claimBonus', {
    'init': () => {
        cycleNumber = 1;
    },
    'finishClaimBonus': () => {
        cycleNumber = 0;
    }
}, false);

// 驱动接口
mocker('claimBonus', {
    'init': () => {
        popStyle = 'AWARD';
        lastAward = 600;
    },
    'finishClaimBonus': () => {
        popStyle = '';
        lastAward =  0;
    }
}, true, initMocker);
```
