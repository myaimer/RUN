
cc.Class({
    extends: cc.Component,

    properties: {
        loadProgressBar: cc.ProgressBar,
        json: cc.JsonAsset,
    },

    start() {
        cc.vv.json = this.parseAllData(this.json.json, true);
        this.loading();
    },

    parseAllData(data, isObj) {
        let d = {};
        let keyArr = Object.keys(data);
        for (let i = 0, len = keyArr.length; i < len; i += 1) {
            let k = keyArr[i];
            d[k] = this.parseData(isObj, data[k]);
        }
        return d;
    },

    parseData(isObj, data) {
        let list = isObj ? {} : [];
        let keyList = data[0];
        for (let i = 1; i < data.length; i += 1) {
            let obj = {};
            let d = data[i];
            for (let j = 0, len = d.length; j < len; j += 1) {
                let k = keyList[j];
                obj[k] = d[j];
            }
            list[isObj ? i : i - 1] = obj;
        }
        return list;
    },

    loading() {
        let total = Object.keys(cc.vv.res).length;
        let hasFinish = 0;
        let self = this;
        for (const key in cc.vv.res) {
            let url = cc.vv.res[key]['url'];
            let type = cc.vv.res[key]['type'];
            cc.loader.loadRes(url, type, function (err, obj) {
                if (err) {
                    console.log(err);
                } else {
                    cc.vv.res[key] = obj;
                    hasFinish += 1;
                    self.loadProgressBar.progress = hasFinish / total;
                    if (hasFinish / total === 1) {
                        cc.director.loadScene('main');
                    }
                }
            });
        }
    }

});