'use strict'


var Photo = function (args) {
    if(args) {
        var data = JSON.parse(args);
        this.id = data.id;  //图片ID，SHA1码，是惟一的
        this.url = data.url;
        this.author = data.author;  //作者钱包地址
        this.datetime = data.datetime;  //登记时间
        this.price = new BigNumber(data.price); //价格
    }
};

Photo.prototype = {
    toString : function () {
        return JSON.stringify(this);
    }
};


var PhotoContract = function () {
    LocalContractStorage.defineMapProperty(this, "dataMap",{
        parse : function (args) {
            return new Photo(args);
        },
        stringify : function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "arryMap");
    LocalContractStorage.defineProperty(this, "count");
};

PhotoContract.prototype = {
    init:function () {
        this.count = 0;
    },

    getNowTime: function() {
        var now = new Date();

        var hour = now.getHours() + 8;
            hour = hour < 10 ? '0' + hour : hour;
        var minute = now.getMinutes();
            minute = minute < 10 ? '0'+ minute : minute;
        var seconds = now.getSeconds();
            seconds = seconds < 10 ? '0' + seconds : seconds;
        return now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate() + " " + hour + ":" + minute + ":" + seconds;
    },

    getPhoto : function (_id) {
        if(!_id) {
            throw new Error("Invalid arguments")
        }
        return this.dataMap.get(_id);
    },

    getAllPhotos : function() {
        var photos = [];
        for (var i = 0; i < this.count; ++i) {
            var id = this.arryMap.get(i);
            var obj = JSON.parse(this.dataMap.get(id));
            photos.push(obj);
        }
        return photos;
    },

    registerPhoto : function (_id,_url,_price) {
        if(!_id || !_price) {
            throw new Error("Invalid args data")
        }

        var photo = new Photo();
        photo.id = _id;
        photo.url = _url;
        photo.author = Blockchain.transaction.from;
        photo.datetime = this.getNowTime();
        photo.price = new BigNumber(_price);

        if (this.getPhoto(_id) === null){
            this.dataMap.put(_id,photo);
            this.arryMap.put(this.count,_id);
            this.count += 1;
            return true;
        }
        return false;
    }
}

module.exports = PhotoContract;
