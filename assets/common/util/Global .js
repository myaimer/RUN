cc.vv = cc.vv || {};


//用户当前金币数量
cc.vv.gold = 10000;
//当前选择章节
cc.vv.currentChapter = null;
//当前选定关卡
cc.vv.currentLevel = null;
//方格间距
cc.vv.GAP = 90;
//英雄的当前下标
cc.vv.heroCurrentIndex = null;
//怪物的当前下标
cc.vv.monsterCurrentIndex = null;
// 用户的等级
cc.vv.level = 1;
//游戏道具列表
cc.vv.gamePropList = [];
//主场景仓库列表
cc.vv.warehousePropList = [];
//游戏的脚本
cc.vv.GAME = null;
//商店脚本
cc.vv.STORE = null;
//携带的道具类型
cc.vv.talkPropType = 0;
// 玩家的血量
cc.vv.heroHP = null;
// 玩家攻击
cc.vv.HeroATK = null;
// 玩家的防御
cc.vv.HeroDEF =null;
// boss的血量
cc.vv.bossHP = null;
// 是否赢得比赛
cc.vv.ISWON = false;

cc.vv.res = {
    //商城道具预制件
    'storeProp': { url: 'prefab/storeProp', type: cc.Prefab },
    //仓库的方块预制件
    'warehouseRect': { url: 'prefab/warehouseRect', type: cc.Prefab },
    //怪物类
    'zuolunshou': { url: 'monster/jiershou', type: cc.SpriteFrame },
    //英雄类
    'hero1': { url: 'hero/hero', type: cc.SpriteFrame },
    'hero2': { url: 'hero/hero2', type: cc.SpriteFrame },
    //道具类
    'book': { url: 'prop/book', type: cc.SpriteFrame },
    'wenhao': { url: 'prop/wenhao', type: cc.SpriteFrame },
    'shop': { url: 'prop/shop', type: cc.SpriteFrame },
    'huifu': { url: 'prop/huifu', type: cc.SpriteFrame },
    'PK': { url: 'prop/pk', type: cc.SpriteFrame },
    //骰子类
    'dice_1': { url: 'dice/dice1', type: cc.SpriteFrame },
    'dice_2': { url: 'dice/dice2', type: cc.SpriteFrame },
    'dice_3': { url: 'dice/dice3', type: cc.SpriteFrame },
    'dice_4': { url: 'dice/dice4', type: cc.SpriteFrame },
    'dice_5': { url: 'dice/dice5', type: cc.SpriteFrame },
    'dice_6': { url: 'dice/dice6', type: cc.SpriteFrame },
    //预制件
    'box': { url: 'prefab/box', type: cc.Prefab },
    'pic_1': { url: 'game/0', type: cc.SpriteFrame },
    'pic_2': { url: 'game/1', type: cc.SpriteFrame },
    'pic_3': { url: 'game/2', type: cc.SpriteFrame },
    'pic_4': { url: 'game/tishi', type: cc.SpriteFrame },
    // 道具的预制件
    'prop_1': { url: 'prefab/dice', type: cc.Prefab },
    'prop_2': { url: 'prefab/stop', type: cc.Prefab },
    'prop_3': { url: 'prefab/boom', type: cc.Prefab },
    'prop_4': { url: 'prefab/daodan', type: cc.Prefab },
    'prop_5': { url: 'prefab/reverse', type: cc.Prefab },
    'prop_6': { url: 'prefab/shield', type: cc.Prefab },
    'prop_7': { url: 'prefab/baojian', type: cc.Prefab },
};

//添加按钮的函数封装
cc.vv.addButton = function (data) {
    for (let i in data) {
        if (data[i] === null) {
            cc.warn([i] + '不存在');
            return false;
        }
    }
    const transition = cc.Button.Transition.SCALE;
    const duration = 0.1;
    const zoomScale = 1.2;

    var target = data.target;
    var btn = data.btn;
    var component = data.component;
    var handler = data.handler;
    var customEventData = data.customEventData;
    var enableAutoGrayEffect = data.enableAutoGrayEffect;
    var interactable = data.interactable;

    var clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = target;
    clickEventHandler.component = component;
    clickEventHandler.handler = handler;
    clickEventHandler.customEventData = customEventData;
    btn.clickEvents.push(clickEventHandler);

    btn.transition = transition;
    btn.duration = duration;
    btn.zoomScale = zoomScale;
    btn.enableAutoGrayEffect = enableAutoGrayEffect;
    btn.interactable = interactable;
};
//刷背包显示
cc.vv.checkBag = function (parNode, data) {
    for (let i = 0; i < parNode.children.length; i += 1) {
        let item = parNode.children[i].children[0];
        if (item) {
            item.destroy();
        }
    }

    for (let i = 0, len = data.length; i < len; i += 1) {
        let type = data[i];
        let prop = cc.instantiate(cc.vv.res['prop_' + type]);
        prop.getComponent('Prop').init(type);
        prop.parent = parNode.children[i];
    }
};

// 读取本地数据
cc.vv.getRecord = function (type) {
    let record = cc.sys.localStorage.getItem(type);
    if (record) {
        return Number(record);
    }
};

cc.vv.changeGold = function (value) {
    let goldNum = cc.find('player').gn('gold').gn('label').getComponent(cc.Label).string;
    let gold = +goldNum + value;
    cc.vv.refreshRecord('gold', gold);
    cc.find('player').gn('gold').gn('label').getComponent(cc.Label).string = cc.vv.getRecord('gold') || 9999;
};

// 刷新本地数据
cc.vv.refreshRecord = function (type, value) {
    cc.sys.localStorage.setItem(type, value);
};

cc.Node.prototype.gn = cc.Node.prototype.getChildByName;
