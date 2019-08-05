import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {

    },

    startGame(enent,number){
        cc.vv.currentLevel = number;
        cc.director.loadScene('game');
    },
    
    onClose(){
        this._super();
        cc.find('Canvas').gn('map_layer').active = true;
    }
    
});
