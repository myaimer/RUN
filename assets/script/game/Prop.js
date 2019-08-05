
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    
    init(type){
        this.type = type;
        this.node.type = this.type;
    },

    start () {
        this.node.on('touchstart',this.touchStart,this);
        this.node.on('touchcancel',this.touchCancel,this);
        this.node.on('touchend',this.touchEnd,this);
    },
    touchStart(){
        this.node.getChildByName('info').active = !this.node.getChildByName('info').active;
    },

    touchCancel(){
        this.node.getChildByName('info').active = false;
    },
    
    touchEnd(){
        this.node.getChildByName('info').active = !this.node.getChildByName('info').active;
        cc.vv.talkPropType = this.node.type;
    },
    
});
