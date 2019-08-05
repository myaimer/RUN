
cc.Class({
    extends: cc.Component,

    properties: {

    },

    goBuy(event) {
        if (cc.vv.warehousePropList.length > 20) { return; }
        cc.vv.warehousePropList.push(this.node.gn('buyBtn').itemType);
        cc.vv.STORE.goBuy(event);
    }

    // update (dt) {},
});
