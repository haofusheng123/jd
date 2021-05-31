/*
    cookie
    根据参数判断执行的操作，无声转换
*/

function cookie(name ?: string, value ?: any, option ?: object) {
    switch (arguments.length) {
        case 0:
            return document.cookie;
        case 1:
            let arr=document.cookie.split("; ").filter(item => {
                return item.split("=")[0] === name;
            })[0];
            return arr ? arr.split("=")[1] : "";
        case 2:
            if (value == null) {
                setCookie(name as string, value, {
                    expires: -1
                })
            } else {
                value = typeof value === "string" ? value : typeof value === "object" ? JSON.stringify(value) : ("" + value);
                document.cookie = `${name}=${value}`;
            }
            break
        default:
            if (value == null) {
                (option as any).expires = -1;
                setCookie(name as string, value, option);
            } else {
                setCookie(name as string, value, option as object)
            }
    }
}

function setCookie(name: string, value: any, option: any) {
    let str = `${name}=${value}; `;
    let _option=Object.assign({},option);
    delete _option.expires;
    if (option.expires) {
        let date = new Date();
        date.setDate(date.getDate() + option.expires);
        _option.expires = date;
    }
    for (let prop in _option) {
        str += `${prop}=${_option[prop]}; `;
    }
    document.cookie = str;
}

export default cookie;