
cc.Class({
    extends: cc.Component,

    properties: {
        indexNum:cc.Label,
        pic:cc.Sprite,
    },


    init(index,frame){
        this.index = index;
        // this.indexNum.string = this.index;
        this.pic.spriteFrame = frame;
    },


    // update (dt) {},
});
