import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        propPar: cc.Node,
        myProp: cc.Node,
        gameProp: cc.Node,
    },

    onLoad() {
        this._super();
        this.item = cc.vv.json.item;
        this.shopList = this.propPar.children;
    },

    onEnable() {
        this._super();
        this.ranList = [];
        this.showShop();
    },

    onClose() {
        cc.vv.GAME.monsterWalk();
        this._super();
    },

    //展示商店内容
    showShop() {
        for (let i = 0; i < this.shopList.length; i += 1) {
            let ran = (Math.random() * Object.keys(this.item).length | 0) + 1;
            this.ranList.push(ran);
        }
        for (let i = 0; i < this.shopList.length; i += 1) {
            let type = this.item[this.ranList[i]].type;
            let prop = cc.instantiate(cc.vv.res['prop_' + this.ranList[i]]);
            prop.getComponent('Prop').init(type);
            this.shopList[i].gn('buyBtn').itemType = type;
            this.shopList[i].gn('propPic').addChild(prop);
            this.shopList[i].gn('propName').getComponent(cc.Label).string = this.item[this.ranList[i]].name;
            this.shopList[i].gn('propGold').getComponent(cc.Label).string = this.item[this.ranList[i]].buy_price;
        }
    },

    //买东西
    goBuy(event) {
        let usegold = cc.vv.getRecord('gold');
        if (usegold <= 0) { return; }
        if (cc.vv.gamePropList.length >= 5) { return; }
        cc.vv.gamePropList.push(event.target.itemType);
        cc.vv.checkBag(this.myProp, cc.vv.gamePropList);
        cc.vv.checkBag(this.gameProp, cc.vv.gamePropList);
        let gold = -this.item[event.target.itemType].buy_price;
        cc.vv.changeGold(gold);
    },

});
