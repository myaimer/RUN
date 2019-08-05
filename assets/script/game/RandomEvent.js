import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
       eventLabel:cc.Label,
       goldLabel:cc.Label,
    },

    onClose() {
        cc.vv.GAME.monsterWalk();
        this._super();
    },

    onEnable(){
        this._super();
        this.event = cc.vv.json.event;  
        this.ran = (Math.random() * Object.keys(this.event).length  | 0) + 1;
        this.ranEvent();
    },
    ranEvent(){
        for(let key in this.event){
            if(Number(key) === this.ran){
                this.eventLabel.string = this.event[key].event;
                this.goldLabel.string = this.event[key].gold;
                cc.vv.changeGold(this.event[key].gold)
            }
        }
    },
    
});
