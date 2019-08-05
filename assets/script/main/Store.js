import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        warehouseContent: cc.Node,
        warehouseScrollView: cc.ScrollView,
        storeContent: cc.Node,
        storeScrollView: cc.ScrollView,
    },

    onLoad() {
        this._super();
        cc.vv.STORE = this;
        this.shopPropList = [];
        this.item = cc.vv.json.item;
        this.addProp();
        this.creatwarehouse();
    },

    onEnable() {
        cc.find('player').active = false;
        this.node.stopAllActions();
        this.node.setScale(0);
        let layout1 = this.warehouseContent.getComponent(cc.Layout);
        layout1.enabled = false;
        let layout2 = this.storeContent.getComponent(cc.Layout);
        layout2.enabled = false;       
        this.node.parent.gn('mask').active = true;
        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeTo(this.alertAnimSpeed, 255),
                    cc.scaleTo(this.alertAnimSpeed, 1).easing(cc.easeBackOut(1))
                ), cc.callFunc(() => {
                    layout1.enabled = true;
                    layout2.enabled = true;
                    this.storeScrollView.scrollToTop(0);
                    this.warehouseScrollView.scrollToTop(0);
                })
            )
        );
        cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);
    },

    onClose() {
        this._super();
        this.scheduleOnce(() => {
            cc.find('player').active = true;
        }, 0.3);
    },

    //给商城添加道具
    addProp() {
        for (let i = 0; i < 7; i += 1) {
            let shopProp = cc.instantiate(cc.vv.res.storeProp);
            this.storeContent.addChild(shopProp);
            this.shopPropList.push(shopProp);
        }
        for (let i = 0; i < this.shopPropList.length; i += 1) {
            let m = i + 1;
            let type = this.item[m].type;
            let prop = cc.instantiate(cc.vv.res['prop_' + m]);
            prop.getComponent('Prop').init(type);
            this.shopPropList[i].gn('propPic').addChild(prop);
            this.shopPropList[i].gn('buyBtn').itemType = type;
            this.shopPropList[i].gn('propName').getComponent(cc.Label).string = this.item[m].name;
            this.shopPropList[i].gn('propGold').getComponent(cc.Label).string = this.item[m].buy_price;
        }
    },

    //生成仓库格子
    creatwarehouse() {
        for (let i = 0; i < 20; i += 1) {
            let rect = cc.instantiate(cc.vv.res.warehouseRect);
            this.warehouseContent.addChild(rect);
        }
        cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);
    },

    goBuy(event) {
        let usegold = cc.vv.getRecord('gold');
        let gold = this.item[event.target.itemType].buy_price;
        if (usegold <= gold) { return; }
        cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);       
        cc.vv.changeGold(-gold);
    },

});
