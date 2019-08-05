import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        levelTXT: cc.Label,
        heroInfo: cc.Node,
    },


    onLoad() {
        this._super();
        this.player = cc.find('player');
        this.LEVEL = cc.vv.getRecord('levelTXT') || 1;
        this.goldNum = cc.vv.getRecord('gold') || 10000;
        this.ATK = cc.vv.getRecord('ATK') || 1;
        this.HP = cc.vv.getRecord('HP') || 30;
        this.DEF = cc.vv.getRecord('DEF') || 1;
    },

    onEnable() {
        this._super();
        this.init();
    },

    // 更新人物信息
    levelUP() {
        this.LEVEL += 1;
        this.goldNum -= 100;
        this.ATK += 1;
        this.HP += 2;
        this.DEF += 1;
        cc.vv.refreshRecord('levelTXT', this.LEVEL);
        cc.vv.refreshRecord('gold', this.goldNum);
        cc.vv.refreshRecord('ATK', this.ATK);
        cc.vv.refreshRecord('HP', this.HP);
        cc.vv.refreshRecord('DEF', this.DEF);
        this.init();
    },

    // 初始化人物信息
    init() {
        this.player.gn('gold').gn('label').getComponent(cc.Label).string = cc.vv.getRecord('gold') || 10000;
        let arr1 = ['level', 'ATK', 'HP', 'DEF'];
        let arr2 = ['rank', 'ATKValue', 'HPValue', 'DEFValue'];
        let arr3 = ['lv.' + (cc.vv.getRecord('levelTXT') || 1) + '/999', cc.vv.getRecord('ATK') || 1, cc.vv.getRecord('HP') || 30, cc.vv.getRecord('DEF') || 3];
        for (let i = 0; i < arr1.length; i += 1) {
            this.heroInfo.gn(arr1[i]).gn(arr2[i]).getComponent(cc.Label).string = arr3[i];
        }
        cc.find('player').getComponent('Player').grade.string = cc.vv.getRecord('levelTXT') || 1;
    },


});
