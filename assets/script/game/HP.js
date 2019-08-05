import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
       
    },

    onClose() {
        cc.vv.GAME.monsterWalk();
        this._super();
    },

    onEnable(){
        this._super();
    },

});
