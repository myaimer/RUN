import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        player: cc.Sprite,
        monster: cc.Sprite,
        skill_1: cc.Prefab,
        playerNum: cc.Label,
        monsterNum: cc.Label,
        monsterATK: cc.Label,
        playerAtk: cc.Label,
        playHP: cc.Label,
        monsterHP: cc.Label,
        //    回合提示框
        promptDialogBox: cc.Node,
        //    回合提示文字
        promptTxt: cc.Label,
        gameOver: cc.Node,
    },

    onClose() {
        cc.vv.GAME.monsterWalk();
        this._super();
        this.gameOver.active = false;
        cc.find('player').active = true;
        this.playerNum.string = 0;
        this.monsterNum.string = 0;
    },
    onEnable() {
        this._super();
        this.init();
        this.monsterStatus += 1;
        this.scheduleOnce(function () {
            this.promptDialogBox.active = false;
            this.fingerGuessing();
        }, 3);
    },
    start() {
        this.monsterStatus = 1;
    },
    // 游戏的初始化
    init() {
        this.playHP.string = window.Game.HP1 + '/' + cc.vv.heroHP;
        this.monsterHP.string = window.Game.HP2 + '/' + cc.vv.bossHP;
        cc.find('player').active = false;
        this.gold = cc.find('player').gn('gold').gn('label').getComponent(cc.Label);
        this.gameStatus = 1;
        this.munsterStatus = 0;
        this.punchingBag = true;
        this.lock = true;
        this.round = true;
        this.tiSi('游戏开始');
        this.playerAtk.string = cc.vv.HeroATK;
        this.monsterATK.string = 5;
    },
    // 双方玩家随机石头剪刀布
    fingerGuessing() {
        let player_num = Math.random() * 3 | 0;
        let boss_num = Math.random() * 3 | 0;
        switch (player_num) {
            case 0:
                switch (boss_num) {
                    case 0:
                        this.fingerGuessing();
                        break;
                    case 1:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('boss先手');
                        this.scheduleOnce(function () {
                            this.bossAttack();
                        }, 3);
                        break;
                    case 2:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('玩家先手');
                        this.scheduleOnce(function () {
                            this.node.gn('skill').active = true;
                        }, 3);
                        break;
                }
                break;
            case 1:
                switch (boss_num) {
                    case 0:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('玩家先手');
                        this.scheduleOnce(function () {
                            this.node.getChildByName('skill').active = true;
                        }, 3);
                        break;
                    case 1:
                        this.fingerGuessing();
                        break;
                    case 2:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('boss先手');
                        this.scheduleOnce(function () {
                            this.bossAttack();
                        }, 3);
                        break;
                }
                break;
            case 2:
                switch (boss_num) {
                    case 0:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('boss先手');
                        this.scheduleOnce(function () {
                            this.bossAttack();
                        }, 3);
                        break;
                    case 1:
                        this.createPic(this.player, player_num);
                        this.createPic(this.monster, boss_num);
                        this.tiSi('玩家先手');
                        this.scheduleOnce(function () {
                            this.node.getChildByName('skill').active = true;
                        }, 3);
                        break;
                    case 2:
                        this.fingerGuessing();
                        break;
                }
                break;
        }
    },
    // 剪刀石头布提示框
    createPic(obj, num) {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.loader.loadRes('game/' + num, cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
        node.x = -200;
        obj.node.addChild(node);
        this.delete(node);
    },
    // 提示框
    tiSi(str) {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.loader.loadRes('game/tishi', cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
        node.scale = 0.4;
        let node2 = new cc.Node('提示框');
        node2.width = 430;
        node2.height = 200;
        let string = node2.addComponent(cc.Label);
        string.string = str;
        string.overflow = 2;
        string.horizontalAlign = 1;
        string.verticalAlign = 1;
        string.node.color = cc.Color.WHITE;
        node2.scale = 2;
        node.y = 150;
        node.addChild(node2);
        this.node.addChild(node);
        this.scheduleOnce(() => {
            node.destroy();
        }, 2);
    },

    // boss攻击的AI
    bossAttack() {
        this.gameStatus += 1;

        let num = (Math.random() * 6 | 0) + 1 + Number(this.monsterATK.string);
        if (window.Game.increaseTheDefense) {
            num -= cc.vv.HeroDEF * 2;
            window.Game.increaseTheDefense = false;
        } else {
            num -= cc.vv.HeroDEF;
        }
        if (num < 0) {
            num = 0;
        }
        this.monsterNum.string = num;
        let str = null;
        if (Number(this.monsterStatus) === 3) {
            str = 'boss进入到狂暴状态，造成了' + num + '点伤害';
            this.monsterStatus = 1;
        } else {
            str = 'boss造成了' + num + '点伤害';
        }
        this.tiSi(str);
        window.Game.HP1 = window.Game.HP1 - num;
        this.playHP.string = window.Game.HP1 + '/' + cc.vv.heroHP;
        this.scheduleOnce(function () {
            if (this.isDied(window.Game.HP1)) {
                if (this.gameStatus >= 3) {
                    this.gameStatus = 1;
                    this.gameOverHint();
                } else {
                    this.tiSi('玩家的回合');
                    this.node.getChildByName('skill').active = true;
                }
            } else {
                this.victory();
            }
        }, 3);
    },

    // 玩家的普通攻击
    attack() {
        this.node.gn('skill').active = false;
        this.gameStatus += 1;
        let num = (Math.random() * 6 | 0) + 1 + Number(this.playerAtk.string);
        if (window.Game.increaseTheAttack) {
            num *= 2;
            window.Game.increaseTheAttack = false;
        }
        this.playerNum.string = num;
        let str = '玩家造成了' + num + '点伤害';
        this.tiSi(str);
        window.Game.HP2 = window.Game.HP2 - num;
        this.monsterHP.string = window.Game.HP2 + '/' + cc.vv.bossHP;
        this.scheduleOnce(function () {
            if (this.isDied(window.Game.HP2)) {
                if (this.gameStatus >= 3) {
                    this.gameOverHint();
                    this.gameStatus = 1;
                } else {
                    this.tiSi('boss的回合');
                    this.node.getChildByName('skill').active = false;
                    this.scheduleOnce(() => {
                        this.bossAttack();
                    }, 3);
                }
            } else {
                this.victory();
            }
        }, 3);
    },

    // 突袭
    skill1() {
        this.gameStatus += 1;
        let num = Math.random() * 6 | 0;
        let num2 = Math.random() * 6 | 0;
        if (num > num2) {
            this.tiSi('突袭成功');
            this.scheduleOnce(function () {
                num = num * 2 + Number(this.playerAtk.string);
                let str = '玩家造成了' + num + '点伤害';
                this.tiSi(str);
                this.playerNum.string = num;
                window.Game.HP2 = window.Game.HP2 - num;
                this.monsterHP.string = window.Game.HP2 + '/' + cc.vv.bossHP;
                this.scheduleOnce(function () {
                    if (this.isDied(window.Game.HP2)) {
                        if (this.gameStatus >= 3) {
                            this.gameStatus = 1;
                            this.gameOverHint();
                        } else {
                            this.tiSi('boss的回合');
                            this.node.getChildByName('skill').active = false;
                            this.scheduleOnce(function () {
                                this.bossAttack();
                            }, 3);
                        }
                    } else {
                        this.victory();
                    }
                }, 3);
            }, 3);
        } else {
            this.tiSi('突袭失败');
            this.node.getChildByName('skill').active = false;
            this.scheduleOnce(() => {
                if (Number(this.gameStatus) === 3) {
                    this.gameStatus = 1;
                    this.gameOverHint();
                } else {
                    this.scheduleOnce(function () {
                        this.tiSi('boss的回合');
                        this.scheduleOnce(function () {
                            this.bossAttack();
                        }, 3);
                    }, 3);
                }
            }, 3)
        }
    },
    // 游戏结束提示框
    gameOverHint() {
        this.gameOver.active = true;
        let arr1 = ['gameOverTXT', 'gameScore', 'getGold'];
        let arr2 = ['游戏胜利', this.playerNum.string + ':' + this.monsterNum.string, '金币+1000'];
        let arr3 = ['失败', this.playerNum.string + ':' + this.monsterNum.string, ''];
        if (Number(this.playerNum.string) > Number(this.monsterNum.string)) {
            for (let i = 0; i < arr1.length; i++) {
                this.gameOver.gn(arr1[i]).getComponent(cc.Label).string = arr2[i];
            }
            let goldNum = this.gold.string >> 0 + 1000;
            cc.vv.changeGold(goldNum);
        } else {
            for (let i = 0; i < arr1.length; i++) {
                this.gameOver.gn(arr1[i]).getComponent(cc.Label).string = arr3[i];
            }
        }
    },
    //道具
    skill2() {
        // cc.log('去死吧，沙雕');
    },

    delete(node) {
        this.scheduleOnce(function () {
            node.destroy();
        }, 2);
    },

    throw() {
        let num = (Math.random() * 6 | 0) + 1;
        return num;
    },

    onButtonClick(event, customData) {
        this[customData]();
    },

    // 判断哪一方是否死亡
    isDied(hp) {
        let status = null;
        if (hp > 0) {
            status = true;
        } else {
            status = false;
        }
        return status;
    },
    // 判断哪一方胜利
    victory() {
        if (cc.vv.heroHP > 0) {
            this.tiSi('玩家胜利');
        } else {
            this.tiSi('玩家失败');
        }
        this.scheduleOnce(function () {
            cc.vv.ISWON = true;
            cc.director.loadScene('main');
        }, 1.5);
    }
    // update (dt) {},
});
