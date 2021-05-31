import Cookie from "../../common/Cookie.js";
import ajax from "../../common/AjaxSend.js";
import token from "../../common/token.js";
import Utils from "../../common/Utils.js";
import proxy from "../../common/proxy.js";

// showCap、showCon 需要在同一父元素下
interface cityType{
    showCap:HTMLElement;
    showCon:HTMLElement;
}

export default class CityList implements cityType {
    public showCap!:HTMLElement;
    public showCon!:HTMLElement;

    private initCity:any={
        prov:"北京市",
        town:"北京市",
        county:"东城区"
    };
    private cityPrev:any=[];
    private cityIndex:any=[];
    private cityProxy!:any;

    private provList!:any[];
    private townList!:any[];
    private countyList!:any[];

    private cityCap!:any;//三个城市切换按钮外层

    private capList!:any;
    private cityTab!:any;

    private cityCon!:any; //三个展示城市页面外层
    private conList!:any;
    private prevCon!:HTMLElement;//上一个显示页面
    private prevCap!:HTMLElement;//上一个tab按钮

    constructor(option:cityType) {
        this.setInit(option);
        this.createElem(this.showCon);
        this.getInitCity();
        
        this.cityCon.addEventListener("click",(e:Event) => this.checkCity(e));
        this.cityCap.addEventListener("click",(e:Event) => this.changeCap(e));
        this.showCap.parentElement!.addEventListener("mouseenter",(e:Event) => this.showConHandler(e));
        this.showCap.parentElement!.addEventListener("mouseleave",(e:Event) => this.showConHandler(e));
    }

    setInit(option:cityType) {
        this.cityProxy=proxy("initCity",this.initCity,this.cityCap);
        this.showCap=option.showCap;
        this.showCon=option.showCon;
        this.showCap.parentElement!.style.position="relative";
        this.showCon.style.display="none";
        this.provList=[];
        this.townList=[];
    }

    showConHandler(e:any) {
        if (e.type==="mouseenter") {
            this.showCon.style.display="block";
        }else{
            this.showCon.style.display="none";
        }
    }

    changeCap(e:any) {
        if (e.target.nodeName!=="B") return;
        let index=this.capList.indexOf(e.target);
        if (index>0) {
            if (this.prevCon) (this.prevCon as HTMLElement).style.display="none";
            this.prevCon=this.conList[index];
            (this.prevCon as HTMLElement).style.display="block";
            this.prevCap.className="";
            this.prevCap=this.cityTab[index];
            this.prevCap.className="active";
            if (!this.cityIndex[index] && this.cityIndex[index]!=0){
                this.cityIndex[index]=0;
                this.getCityItem(this.capList[index-1].textContent,index,this.cityIndex[index]);
            }else{
                this.getCityItem(this.capList[index-1].textContent,index,this.cityIndex[index]);
            }
        }else {
            if (this.prevCon) (this.prevCon as HTMLElement).style.display="none";
            this.prevCon=this.conList[index];
            (this.prevCon as HTMLElement).style.display="block";
            this.prevCap.className="";
            this.prevCap=this.cityTab[index];
            this.prevCap.className="active";
            if (!this.cityPrev[index]){
                this.cityPrev[index]=this.prevCon.querySelectorAll("a")[0];
            }
        }
        
    }

    checkCity(e:any) {
        if (e.target.nodeName!=="A") return;
        let index:any;
        let cType=e.target.getAttribute("c-type");
        switch (cType){
            case "prov":
                index=0;
                break;
            case "town":
                index=1;
                break;
            case "county":
                index=2;
                this.showCon.style.display="none";
                break;
        }

        this.capList[index].parentElement.className="active";
        this.cityProxy[cType]=e.target.textContent;
        if (this.cityPrev[index]) this.cityPrev[index].className="";
        this.cityPrev[index]=e.target;
        this.cityPrev[index].className="active";
        this.cityIndex[index]=Array.from(this.prevCon.querySelectorAll("a")).indexOf(e.target);

        this.tabCity(index,cType);
    }

    tabCity(index:number,cType:string) {
        if (index<2) {
            if (this.prevCap) this.prevCap.className="";
            this.prevCap=this.cityTab[index+1];
            this.prevCap.className="active";
        }

        if (index+1 >=this.conList.length) return;
        if (this.prevCon) (this.prevCon as HTMLElement).style.display="none";
        this.prevCon=this.conList[index+1];
        (this.prevCon as HTMLElement).style.display="block";
        this.getCityItem(this.cityProxy[cType],index+1,0);
    }

    createProvCom(list:any[]) {
        this.capList[0].innerHTML=`${list[0].name}`;
        this.conList[0].innerHTML=list.reduce((value:string,item:any,index:number) => {
            return value + `
                <li><a href="javascript: void(0)" c-type="prov" class="${index===0 ? "active" : ""}">${item.name}</a></li>
            `
        },"");

        
        this.cityPrev[0]=this.conList[0].querySelector("a");
        console.log(this.cityPrev);
    }

    createElem(parent:HTMLElement) {
        this.cityCap=Utils.ce("ul",{},{
            className:"clear-float city-tab"
        },parent);
        this.cityCon=Utils.ce("div",{},{
            className:"city-con"
        },parent);

        this.cityCap.innerHTML=`
            <li class="active" cap-i="prov"><a class="prov-cap" href="javascript:void(0)"><b v-bind="initCity.prov">${this.initCity.prov}</b><span class="iconfont icon-zhankai"></span></a></li>
            <li cap-i="town"><a class="town-cap" href="javascript:void(0)"><b v-bind="initCity.town">${this.initCity.town}</b><span class="iconfont icon-zhankai"></span></a></li>
            <li cap-i="county"><a class="county-cap" href="javascript:void(0)"><b v-bind="initCity.county">${this.initCity.county}</b><span class="iconfont icon-zhankai"></span></a></li>
        `;

        this.showCap.innerHTML=`
        <i v-bind="initCity.prov">${this.initCity.prov}</i><i v-bind="initCity.town">${this.initCity.town}</i><i v-bind="initCity.county">${this.initCity.county}</i><span class="iconfont icon-zhankai"></span>
        `

        this.cityCon.innerHTML=`
            <ol class="clear-float" con-i="prov"></ol>
            <ol class="clear-float" con-i="town"></ol>
            <ol class="clear-float" con-i="county"></ol>
        `;

        this.capList=Array.from(this.cityCap.querySelectorAll("[cap-i] b"));
        this.conList=this.cityCon.querySelectorAll("[con-i]");
        this.cityTab=this.cityCap.querySelectorAll(".city-tab li");
        this.prevCon=this.conList[0];
        this.prevCap=this.cityTab[0];
    }

    renderCity(list:any[],index:number,cType:string,tag:any) {
        console.log(index,cType);
        this.conList[index].innerHTML=`
            ${(function (list:any[]) {
                return list.reduce((value:string,item:any,index:number) => {
                    return value+`<li><a class="${index===tag ? "active" : ""}" href="javascript:void(0)" c-type="${cType}">${item}</a></li>`
                },"")
            })(list)}
        `;

        this.cityPrev[index]=this.conList[index].querySelector("li a");

        switch (cType){
            case "prov":
                index=0;
                this.cityProxy.town=list[tag];
                break;
            case "town":
                index=1;
                this.cityProxy.town=list[tag];
                this.cityProxy.county=this.townList[tag].districtAndCounty[0];

                let elem= this.conList[2].querySelectorAll("a")[this.cityIndex[2]]
                if (elem) {
                    elem.className="";
                    this.cityIndex[2]=0;
                    this.conList[2].querySelectorAll("a")[0].className="active";
                }
                break;
            case "county":
                index=2;
                this.cityProxy.county=this.townList[this.cityIndex[index-1] || 0].districtAndCounty[0];
                break;
        }
    }

    getInitCity() {
        ajax.ajaxSend({
            url:"http://haofusheng.xyz:3000/getinitcity",
            data:{
                cityName:this.cityProxy.prov
            },
            dataType:"json",
            type:"POST"
        }).then(((result:any) => {
            if (result.type==="succeed") {
                this.provList.push(result.detail.value);
                this.createProvCom(this.provList[0]);
            }
        })).then((result:any) => {

            ajax.ajaxSend({
                url:"http://haofusheng.xyz:3000/getcity",
                data:{
                    cityName:this.cityProxy.prov
                },
                dataType:"json",
                type:"POST"
            }).then(((result:any) => {
                if (result.type==="succeed") {
                    this.townList=result.detail.value[0].city;
                }
            }));
        })
    }
    getCityItem(name:string,index:number,tag?:number){
        if (!tag) tag=0;
        if (index===1) {
            ajax.ajaxSend({
                url:"http://haofusheng.xyz:3000/getcity",
                data:{
                    cityName:name
                },
                dataType:"json",
                type:"POST"
            }).then(((result:any) => {
                if (result.type==="succeed") {
                    this.townList=result.detail.value[0].city;
                    let cType="town";
                    this.renderCity(this.townList.map((item:any) => item.name),index,cType,tag);
                }
            }));
        }else if (index===2){
            this.townList.forEach((item:any) => {
                if (item.name === name) {
                    this.countyList=item.districtAndCounty;
                }
            })
            let cType="county";
            this.renderCity(this.countyList,index,cType,tag);
        }
        
    }
}