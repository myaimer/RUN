import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        mapPar: cc.Node,
    },


    start() {
        this.addButton();
    },

    addButton() {
        for (let i = 0, pNode = this.mapPar.children, len = pNode.length; i < len; i += 1) {
            let node = pNode[i];
            let btn = node.addComponent(cc.Button);
            cc.vv.addButton({
                'target': this.node, 'btn': btn, 'component': 'Map', 'handler': 'chooseChapter',
                'customEventData': i + 1, 'enableAutoGrayEffect': true, 'interactable': i + 1 <= 1
            });
        }
    },

    onEnable(){
        this._super();
        cc.find('player').active = false;
    },

    chooseChapter(event, number) {
        cc.vv.currentChapter = number;
        this.node.parent.gn('choice_layer').active = true;
    },

    onClose(){
        this._super();
        this.scheduleOnce(() => {
            cc.find('player').active = true;
        }, 0.3);

    }

});
