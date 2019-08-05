import PanelBase from 'PanelBase';
cc.Class({
    extends: PanelBase,

    properties: {
        answerTime:cc.Label,
        answerHint:cc.Node,
        quizLabel:cc.Label,
        answerPar:cc.Node,
        confirmBtn:cc.Node,
        gain:cc.Node,
    },

    start () {
        
    },

    onEnable(){
        this._super();
        this.quest = cc.vv.json.question;  
        this.ran = (Math.random() * Object.keys(this.quest).length + 1) | 0;
        this.timeCount = 20;
        this.question();
    },

    //知识问答
    question(){        
        this.answerTime.string = this.timeCount;
        this.answerHint.active = false;   
        this.gain.active = false;   
        for(let i = 1;i <= 5;i += 1){
            if(i === 5){
                this.answerPar.gn(i + '').getComponent(cc.Toggle).isChecked = true;
            }else{
                this.answerPar.gn(i + '').getComponent(cc.Toggle).isChecked = false;
            }
        }       
        for(let key in this.quest){
            if(Number(key) === this.ran){
                this.quizLabel.string = '问题：' + this.quest[key].question;
                for(let i = 1;i <= 4;i += 1){
                    this.answerPar.gn(i + '').gn('label').getComponent(cc.Label).string = this.quest[key]['answer' + i];
                }               
            }
        }
       
        this.timer = setInterval(function(){
            if(this.timeCount === 0){
                this.answerHint.active = true;
                this.answerHint.getComponent(cc.Label).string = '回答错误';
                this.answerHint.color = cc.Color.RED;
                clearInterval(this.timer);
                this.onClose();             
            }else{
                this.timeCount -= 1;
                this.answerTime.string = this.timeCount;
            }
        }.bind(this),1000);
    },

    //回答
    response(){
        let questList = this.answerPar.children;
        for(let i = 0;i < questList.length - 1;i += 1){
            if(questList[i].getComponent(cc.Toggle).isChecked){
                if(Number(questList[i].name) === this.quest[this.ran].right){
                    this.answerHint.active = true;
                    this.answerHint.getComponent(cc.Label).string = '回答正确';
                    this.answerHint.color = cc.Color.GREEN;
                    cc.vv.changeGold(1000)
                    this.gain.active = true;
                }else{
                    this.answerHint.active = true;
                    this.answerHint.getComponent(cc.Label).string = '回答错误';
                    this.answerHint.color = cc.Color.RED;
                }
            }
        }
        setTimeout(function(){
            clearInterval(this.timer);
            cc.vv.GAME.monsterWalk();
            this.onClose();
        }.bind(this),500);
    },

});
