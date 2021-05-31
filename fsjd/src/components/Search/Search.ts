import ajax from "../../common/AjaxSend.js";
import Utils from "../../common/Utils.js";

interface searchType {
    searchItem:HTMLElement;
    searchBox:HTMLElement;
}

export default class Search implements searchType{
    public searchItem!:HTMLElement;
    public searchBox!:HTMLElement;

    private hiddenBoxPar!:(e:Event) => void;
    private ids:any;

    constructor (option:searchType) {
        this.setInit(option);

        this.searchItem.addEventListener("input", (e:Event) => this.dimSearch(e));
        this.searchItem.addEventListener("click", (e:Event) => this.dimSearch(e));
        this.searchBox.addEventListener("click",(e:Event) => this.checkSearch(e));

        this.hiddenBoxPar=(e) => this.hiddenBox(e);
        this.searchItem.addEventListener("mouseenter",this.hiddenBoxPar);
        this.searchItem.addEventListener("mouseleave",this.hiddenBoxPar);
        this.searchBox.addEventListener("mouseenter",this.hiddenBoxPar);
        this.searchBox.addEventListener("mouseleave",this.hiddenBoxPar);
    }

    setInit (option:searchType) {
        this.searchItem=option.searchItem;
        this.searchBox=option.searchBox;
    }

    hiddenBox(e:any) {
        if (e.type==="mouseenter") {
            clearTimeout(this.ids);
            this.ids=undefined;
        }else if (e.type==="mouseleave") {
            this.ids=setTimeout(() => {
                this.searchBox.style.display="none";
            },1000);
        }

    }

    dimSearch (e:any) {

        this.dimSearch=Utils.throttle((e: any) => {
            ajax.ajaxSend({
                url: "https://www.baidu.com/sugrec",
                dataType: 'jsonp',
                data: {
                    ie: "utf-8",
                    json: "1",
                    prod: "pc",
                    from: "pc_web",
                    wd: e.target.value
                }
            }).then((result: any) => {
                if (!result.g || result.g.length===0) return;
                (this.searchBox as any).innerHTML=`
                    ${(function (list) {
                        return list.reduce((value:string,item:any) => {
                            return value+`
                                <li>${item.q}</li>
                            `
                        },"")
                    })(result.g)}
                    <li class="close">关闭</li>
                `;
                this.searchBox.style.display="block";
            })
        }, 500);
        this.dimSearch(e);
    } 
    
    checkSearch (e:any) {
        if (e.target.nodeName!=="LI") return;
        if (e.target.className==="close") {
            this.searchBox.style.display="none";
            return;
        }
        (this.searchItem as any).value=e.target.textContent;
        this.searchBox.style.display="none";
    }
}