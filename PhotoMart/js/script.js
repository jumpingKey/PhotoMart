$(function(){
    "use strict";
    var dappContactAddress = "n1z1h7sxy57GnZWFMXZ1YjuX4PFXnQZpSzZ";
    var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
    var NebPay = require("nebpay");
    var nebPay = new NebPay();
    var serialNumber;

    var from;
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "";
    var callArgs = "[\""+"\"]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");

    init();


//buy button event
    $("ul").on("click","li button",function() {
        alert($(this).siblings('p').text());
    });

    $("#fileUpload").on('change', function () {

        if (typeof (FileReader) != "undefined") {

            var image_holder = $("#image-holder");
            image_holder.empty();

            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image",
                    "style": "max-width:90%"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("你的浏览器不支持FileReader.");
        }
    });

    $('#confirm').click(function() {
        var image_holder = $("#image-holder img")[0];
        var data = { base64: image_holder.src};
        var file = new AV.File('resume.png', data);
        var image_id = SHA1(image_holder.src);
        var price = $(".upload-price").val();
        $(".upload-id").text(image_id);

        if($('.upload-price').val() == "" || isNaN($('.upload-price').val())) {
            alert("请正确填写价格");
            return;
        }

        callFunction = "registerPhoto"
        var to = dappContactAddress;
        var value = "0";


        //location.reload();

        file.save().then(function(file) {
            // 文件保存成功
            callArgs = "[\""+ image_id +"\",\"" + file.url() + "\",\"" + price + "\"]";
            console.log(callArgs);
            serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                listener: function (resp) {
                    console.log("thecallback is " + resp)
                }
            });
        }, function(error) {
            // 异常处理
            console.error(error);
        });
    });

});


function init() {
    "use strict";
    var dappContactAddress = "n1z1h7sxy57GnZWFMXZ1YjuX4PFXnQZpSzZ";
    var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
    var NebPay = require("nebpay");
    var nebPay = new NebPay();
    var serialNumber;

    var from = dappContactAddress;
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAllPhotos";
    var callArgs = "[\""+"\"]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };

    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;

        if (result === 'null') {
            return;
        }

        console.log(result);
        var photos = JSON.parse(result);

        for (var i = 0; i <photos.length; ++i) {
            $("#og-grid").append("<li>\n" +
                "\t\t\t\t\t\t<a href=\"#\" data-largesrc=" + photos[i].url + " data-imageid=" + photos[i].id +" data-description=\"Swiss chard pumpkin bunya nuts maize plantain aubergine napa cabbage soko coriander sweet pepper water spinach winter purslane shallot tigernut lentil beetroot.\">\n" +
                "\t\t\t\t\t\t\t<img src=" + photos[i].url + " alt=\"img01\"/>\n" +
                "\t\t\t\t\t\t</a>\n" +
                "\t\t\t\t\t</li>")
        }

        Grid.init();

    }).catch(function (err) {
        console.log("error :" + err.message);
    })

};



// SHA1
function add(x, y) {
    return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
}

function SHA1hex(num) {
    var sHEXChars = "0123456789abcdef";
    var str = "";
    for(var j = 7; j >= 0; j--)
        str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
    return str;
}

function AlignSHA1(sIn) {
    var nblk = ((sIn.length + 8) >> 6) + 1,
        blks = new Array(nblk * 16);
    for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
    for(i = 0; i < sIn.length; i++)
        blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
    blks[nblk * 16 - 1] = sIn.length * 8;
    return blks;
}

function rol(num, cnt) {
    return(num << cnt) | (num >>> (32 - cnt));
}

function ft(t, b, c, d) {
    if(t < 20) return(b & c) | ((~b) & d);
    if(t < 40) return b ^ c ^ d;
    if(t < 60) return(b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

function kt(t) {
    return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
        (t < 60) ? -1894007588 : -899497514;
}

function SHA1(sIn) {
    var x = AlignSHA1(sIn);
    var w = new Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for(var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for(var j = 0; j < 80; j++) {
            if(j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
        e = add(e, olde);
    }
    SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);
    return SHA1Value.toUpperCase();
}

function SHA2(sIn) {
    return SHA1(sIn).toLowerCase();
}