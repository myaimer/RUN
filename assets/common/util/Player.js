
cc.Class({
    extends: cc.Component,

    properties: {
        gold:cc.Label,
        grade:cc.Label,
    },


    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start () {
        this.gold.string = cc.vv.getRecord('gold') || 10000;
        this.grade.string = cc.vv.getRecord('levelTXT') || 1;
    },

    //充值
    addMoney(){
        cc.vv.changeGold(10000);
        this.gold.string = cc.vv.getRecord('gold') || 10000;
    }
});
