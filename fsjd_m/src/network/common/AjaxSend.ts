type optionType = {
    url: string,
    data: object,
    dataType: string,
    type?: string
}

function ajaxSend(option: optionType) {
    option = setOpation(option);
    switch (option.dataType) {
        case "jsonp":
            return jsonpSend(option);
        default:
            return xhrSend(option);
    }
}

function xhrSend(_option:optionType) {
    return new Promise (function (fulfill,reject) {
        let qStr=qString(_option.data);
        let xhr=new XMLHttpRequest();
        xhr.addEventListener("readystatechange",function () {
            if (this.readyState===4 && /2\d{2}/.test(this.status.toString())){
                switch (_option.dataType) {
                    case "json":
                        fulfill(JSON.parse(this.responseText));
                        break;
                    default:
                        fulfill(this.responseText);
                }
            }
        });
    
        switch (_option.type) {
            case "GET":
                xhr.open(_option.type,_option.url+(Object.keys(_option.data).length ? "?" : "")+qStr);
                xhr.send();
                break;
            case "POST":
                xhr.open(_option.type,_option.url);
                xhr.send(encodeURIComponent(JSON.stringify(_option.data)));
                break;
        }
    }) as any;
}

function qString(data:any) {
    return Object.keys(data).length>0 ? Object.keys(data).reduce((value,item) => {
        return value+`&${item}=${data[item]}`;
    },"").slice(1) : "";
}

function jsonpSend(_option:optionType) {
    return new Promise(function (fulfill,reject) {
        let querystring=qString(_option.data);
        let jsonpName=("fs"+Date.now()+Math.random()).replace(".","_");
        let script=document.createElement("script");
        function loadHandler () {
            (window as any)[jsonpName]=null;
            delete (window as any)[jsonpName];
            script.removeEventListener("load",loadHandler);
            script.remove();
        }

        (window as any)[jsonpName]=function (data:any) {
            fulfill(data);
        }
        
        document.body.appendChild(script);
        script.addEventListener("load",loadHandler);
        script.src=_option.url+"?"+querystring+"&cb="+jsonpName;
    })
}

function setOpation(obj:any) {
    let _option:any={
        type:"GET"
    }
    for (var prop in obj) {
        _option[prop]=obj[prop];
    }
    _option.url.replace("?","");
    return _option as optionType;
}

export default {
    ajaxSend
}