import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        warehouseContent: cc.Node,
        warehouseScrollView: cc.ScrollView,
        bagContent: cc.Node,
        bagScrollView: cc.ScrollView,
        bagPar:cc.Node,
    },

    onLoad() {
        this._super();
        this.creatwarehouse();
        this.creatBag();
    },

    onEnable() {
        cc.find('player').active = false;
        this.node.stopAllActions();
        this.node.setScale(0);
        let layout1 = this.warehouseContent.getComponent(cc.Layout);
        layout1.enabled = false;
        let layout2 = this.bagContent.getComponent(cc.Layout);
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
                    this.bagScrollView.scrollToTop(0);
                    this.warehouseScrollView.scrollToTop(0);
                })
            )
        );
        cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);
        cc.vv.talkPropType = 0;
    },

    onClose() {
        this._super();
        setTimeout(() => {
            cc.find('player').active = true;
        }, 300);
    },

    //生成仓库格子
    creatwarehouse() {
        for (let i = 0; i < 20; i += 1) {
            let rect = cc.instantiate(cc.vv.res.warehouseRect);
            this.warehouseContent.addChild(rect);
        }
        if (cc.vv.warehousePropList.length > 0) {
            cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);
        }
    },

    //生成背包
    creatBag() {
        for (let i = 0; i < 9; i += 1) {
            let rect = cc.instantiate(cc.vv.res.warehouseRect);
            this.bagContent.addChild(rect);
        }
        if (cc.vv.gamePropList.length > 0) {
            cc.vv.checkBag(this.bagContent, cc.vv.gamePropList);
        }
    },

    takeAlong() {
        if (cc.vv.talkPropType !== 0) {
            if (cc.vv.gamePropList.length >= 3) { return; }
            for (let i = 0; i < cc.vv.warehousePropList.length; i += 1) {
                let idx = cc.vv.warehousePropList.indexOf(cc.vv.talkPropType);
                if (idx !== -1) {
                    cc.vv.warehousePropList.splice(idx, 1);
                    cc.vv.checkBag(this.warehouseContent, cc.vv.warehousePropList);
                    cc.vv.gamePropList.push(cc.vv.talkPropType);
                    cc.vv.checkBag(this.bagContent, cc.vv.gamePropList);
                    cc.vv.checkBag(this.bagPar,cc.vv.gamePropList);
                    break;
                }
            }
        }

    },




});
