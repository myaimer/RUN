cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.alertAnimSpeed = 0.45;
    },

    onEnable() {
        let mask = this.node.parent.gn('mask');
        if (mask) { mask.active = true; }
        this.node.stopAllActions();
        this.node.setScale(0);
        this.node.runAction(cc.spawn(
            cc.fadeTo(this.alertAnimSpeed, 255),
            cc.scaleTo(this.alertAnimSpeed, 1).easing(cc.easeBackOut(1))
        ));
    },

    onDisable() {
        let mask = this.node.parent.gn('mask');
        if (mask) { mask.active = false; }
        this.node.stopAllActions();
        this.node.runAction(cc.spawn(
            cc.fadeTo(this.alertAnimSpeed, 150),
            cc.scaleTo(this.alertAnimSpeed, 0).easing(cc.easeBackIn(1))
        ));
        this.node.runAction(cc.sequence(
            cc.delayTime(this.alertAnimSpeed),
            cc.callFunc(() => {
                this.node.active = false;
            })
        ));
    },

    onClose() {
        this.onDisable();
    },
    


});
