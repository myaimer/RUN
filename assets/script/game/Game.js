import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        wayBg: cc.Node,
        hero: cc.Node,
        monster: cc.Node,
        throwBtn: cc.Node,
        chooseNum: cc.Node,
        testBtn: cc.Node,
        gameDice: cc.Node,
        propNode: cc.Node,
        gameProp: cc.Node,
    },


    onLoad() {
        //指针赋值
        cc.vv.GAME = this;
        //调试模式的点击次数
        this.testCount = 0;
        //方块放置的起始点
        this.startPos = cc.v2(-500, 180);
        //路径数组
        this.wayList = [];
        //选择的点数
        this.count = 0;
        //道具数组
        this.propList = [];
        //定义方块上放置的道具图片数组
        this.propPicList = [cc.vv.res.book, cc.vv.res.wenhao, cc.vv.res.shop, cc.vv.res.huifu, cc.vv.res.PK];
        // boss的血量
        cc.vv.bossHP = 30;
        // 玩家的血量
        cc.vv.heroHP = cc.vv.getRecord('HP') || 30;
        cc.vv.HeroATK = cc.vv.getRecord('ATK') || 1;
        cc.vv.HeroDEF = cc.vv.getRecord('DEF') || 1;
        window.Game = this;
        this.HP1 = cc.vv.heroHP;
        this.HP2 = cc.vv.bossHP;
        // 是否使用了攻击加强、
        this.increaseTheAttack = false;
        // 是否使用了防御加强
        this.increaseTheDefense = false;


    },

    start() {
        cc.find('player').active = true;
        this.creatWay();
        this.init();
        cc.vv.checkBag(this.propNode, cc.vv.gamePropList);
    },

    //窗口管理
    windowmanage(customData) {
        this.node.gn(customData).active = true;
    },

    //生成道路
    creatWay() {
        for (let i = 0; i < 30; i += 1) {
            let box = cc.instantiate(cc.vv.res.box);
            if (i <= 11) {
                box.x = this.startPos.x + i * cc.vv.GAP;
                box.y = this.startPos.y;
            }
            if (i <= 15 && i > 11) {
                box.x = this.startPos.x + 11 * cc.vv.GAP;
                box.y = this.startPos.y - (i - 11) * cc.vv.GAP;
            }
            if (i <= 27 && i > 15) {
                box.x = this.startPos.x + 11 * cc.vv.GAP - (i - 15) * cc.vv.GAP;
                box.y = this.startPos.y - 4 * cc.vv.GAP;
            }
            if (i < 30 && i > 26) {
                box.x = this.startPos.x;
                box.y = this.startPos.y - 4 * cc.vv.GAP + (i - 26) * cc.vv.GAP;
            }
            let ran = (Math.random() * 5) | 0;
            box.getComponent('Box').init(i, this.propPicList[ran]);
            this.wayBg.addChild(box);
            this.wayList.push(box);
            this.propList.push(ran);
        }
    },

    //初始化英雄和怪物的位置
    init() {
        this.hero.getComponent(cc.Sprite).spriteFrame = cc.vv.res.hero1;
        this.hero.setPosition(this.startPos);
        cc.vv.heroCurrentIndex = 0;
        this.monster.getComponent(cc.Sprite).spriteFrame = cc.vv.res.zuolunshou;
        let ran = (Math.random() * 5 | 0) + 20;
        this.monster.setPosition(this.wayList[ran].getPosition());
        cc.vv.monsterCurrentIndex = ran;
    },

    //选择点数
    chooseCount(event, number) {
        this.count = number;
    },

    //确定点数，英雄行走
    confirmCount() {
        this.heroWalk(this.count);
    },

    //英雄行走
    heroWalk(count) {
        let repeat = count;
        let timer = setInterval(function () {
            if (repeat === 0) {
                //检查下标对应的道具
                this.checkProp(cc.vv.heroCurrentIndex);
                clearInterval(timer);
            } else {
                let type = this.encounter(cc.vv.heroCurrentIndex);
                if (type) {
                    repeat = this.trigger(type, repeat,this.HP1, this.HP2);
                }
                if (repeat > 0) {
                    repeat -= 1;
                    cc.vv.heroCurrentIndex += 1;
                } else if (repeat < 0) {
                    repeat += 1;
                    cc.vv.heroCurrentIndex -= 1;
                }
                if (cc.vv.heroCurrentIndex > this.wayList.length - 1) {
                    cc.vv.heroCurrentIndex = 0;
                }
                if (cc.vv.heroCurrentIndex < 0) {
                    cc.vv.heroCurrentIndex = this.wayList.length - 1;
                }
                this.hero.runAction(
                    cc.moveTo(0.3, cc.v2(this.wayList[cc.vv.heroCurrentIndex].getPosition()))
                );
            }
        }.bind(this), 500);
    },

    // 使用道具
    useProp(event, customData) {
        if (event.target.getComponent('Prop')) {
            let type = event.target.getComponent('Prop').type;
            let name = event.target.name;
            switch (type) {
                case 2:
                case 3:
                case 5:
                    let node = this.wayList[cc.vv.heroCurrentIndex];
                    var prop = cc.instantiate(cc.vv.res['prop_' + type]);
                    prop.getComponent('Prop').init(type);
                    prop.scale = 0.8;
                    node.addChild(prop);
                    break;
                case 1:
                    this.usedPropTisi(name);
                break;
                case 6:
                    this.usedPropTisi(name);
                    this.increaseTheDefense = true;
                    break;
                case 7:
                    this.usedPropTisi(name);
                    this.increaseTheAttack = true;
                break;
                case 4:
                    this.usedPropTisi(name);
                    this.HP2 -= 5;
                break;

            }
            cc.vv.gamePropList.splice(customData - 1, 1);
            cc.vv.checkBag(this.propNode, cc.vv.gamePropList);
            cc.vv.checkBag(this.gameProp, cc.vv.gamePropList);
        }
        // this.destroyProp(event.target);
    },
    // 检查是否遇到道具
    encounter(idx) {
        let isTrue = false;
        let index = idx + 1;
        if (index === 30) {
            index = 0;
        }
        let node = this.wayList[index];
        let child = node.children;
        for (let i = 0; i < child.length; i += 1) {
            if (child[i].getComponent('Prop')) {
                isTrue = child[i].getComponent('Prop').type;
                this.destroyProp(child[i]);
            }
        }
        return isTrue;
    },
    // 触发道具实现的功能
    trigger(type, speed, hp1, hp2) {
        let temp = speed;
        switch (type) {
            case 2:
                temp = 0;
                break;
            case 3:
                hp1 -= 5;
                break;
            case 4:
                hp2 -= 5;
                break;
            case 5:
                temp *= -1;
                break;
        }
        return temp;
    },

    //怪物行走
    monsterWalk() {
        let ran = (Math.random() * 6 + 1) | 0;
        let repeat = ran;
        let timer = setInterval(function () {
            if (repeat === 0) {
                this.throwBtn.active = true;
                clearInterval(timer);
            } else {
                let type = this.encounter(cc.vv.monsterCurrentIndex);
                if (type) {
                    repeat = this.trigger(type, repeat, this.HP2, this.HP1);
                }
                if (repeat > 0) {
                    repeat -= 1;
                    cc.vv.monsterCurrentIndex += 1;
                } else if (repeat < 0) {
                    repeat += 1;
                    cc.vv.monsterCurrentIndex -= 1;
                }
                if (cc.vv.monsterCurrentIndex > this.wayList.length - 1) {
                    cc.vv.monsterCurrentIndex = 0;
                }
                if (cc.vv.monsterCurrentIndex < 0) {
                    cc.vv.monsterCurrentIndex = this.wayList.length - 1;
                }
                this.monster.runAction(
                    cc.sequence(
                        cc.moveTo(0.3, cc.v2(this.wayList[cc.vv.monsterCurrentIndex].getPosition())),
                        cc.callFunc(function () {
                            if (cc.vv.monsterCurrentIndex === cc.vv.heroCurrentIndex) {
                                this.windowmanage('fight_layer');
                                repeat = 0;
                            }
                        }.bind(this))
                    )

                );
            }
        }.bind(this), 500);
    },

    //检查下标对应道具
    checkProp(idx) {
        let propIndex = this.propList[idx];
        switch (propIndex) {
            case 0:
                this.windowmanage('answer_layer');
                break;
            case 1:
                this.windowmanage('random_event_layer');
                break;
            case 2:
                this.windowmanage('shop_layer');
                break;
            case 3:
                this.HP1 = (this.HP1 + 3) <= cc.vv.heroHP ? (this.HP1 + 3) : cc.vv.heroHP;
                this.windowmanage('HP_layer');
                break;
            case 4:
                this.windowmanage('fight_layer');
                break;
        }
    },

    //掷骰子
    throwDice() {
        this.throwBtn.active = false;
        let ran = (Math.random() * 6 | 0) + 1;
        this.gameDice.getComponent('GameDice').init(ran);
        this.gameDice.active = true;
        this.gameDice.getComponent(cc.Animation).play();
        this.scheduleOnce(function () {
            this.heroWalk(ran);
        }, 2);
    },

    //调试
    test() {
        this.testCount += 1;
        if (parseInt(this.testCount % 2) === 1) {
            this.testBtn.color = cc.Color.GREEN;
            this.chooseNum.active = true;
        } else {
            this.testBtn.color = cc.Color.WHITE;
            this.chooseNum.active = false;
        }

    },
    //    销毁道具
    destroyProp(node) {
        node.destroy();
    },
    // 使用道具提示框
    usedPropTisi(name) {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.loader.loadRes('game/tishi', cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
        node.scaleX = 0.5;
        node.scaleY = 0.5;
        let node2 = new cc.Node()
        let string = node2.addComponent(cc.Label);
        string.string = '玩家使用了' + name + '道具';
        string.node.color = cc.Color.WHITE;
        node2.scale = 2;
        node.addChild(node2);
        this.node.addChild(node);
        this.scheduleOnce(() => {
            node.destroy();
        }, 2);

    }
    // update (dt) {},
});
