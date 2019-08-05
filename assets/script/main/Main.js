 
cc.Class({
    extends: cc.Component,

    properties: {
        bagSpace:cc.Node,
    },



    // onLoad () {},

    start() {
        this.bagSpace.scaleX = 0;
        if(cc.vv.ISWON){
            this.node.parent.gn('choice_layer').active = true;
            cc.vv.ISWON = false;
        }
    },

    onEnable() {
    },

    windowManager(event, customData) {
        this.node.parent.gn(customData).active = true;
    },

    //背包的控制
    controlBag(event){
        if(Number(event.target.children[0].scaleX) === 0){
            event.target.children[0].scaleX = 1;
        }else{
            event.target.children[0].scaleX = 0;
        }        
    },


});
