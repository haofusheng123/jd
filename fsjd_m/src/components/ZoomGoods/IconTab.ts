import Utils from "../../common/Utils.js";

interface iconType {
    imgList:[];
    num:number;
    width:number;
}

export default class IconTab extends EventTarget implements iconType{

    static CHANGE_ICON:string="change_icon";
    static IconList:any[]=[];
    static RUN_ICON_MOVE() {
        IconTab.IconList.forEach(item => {
            item.moveIcon();
        })
    }

    public imgList!:[];
    public num!:number;
    public width!:number;

    private iconList!:HTMLElement;
    private iconOuter!:HTMLElement;
    private iconCon!:HTMLElement;
    private liList!:any;
    private conWidth!:number;
    private leftBtn!:HTMLElement;
    private rightBtn!:HTMLElement;
    private prevItem!:HTMLElement;
    private index:number=0;
    private movenum:number=0;
    private decretion!:string;
    private runBool:Boolean=false;
    private left:number=0;

    constructor (option:iconType) {
        super();
        this.width=option.width;
        this.num=option.num;
        this.conWidth=this.width*0.8;
        this.createIcon(option.imgList);
        this.iconCon=this.iconList.querySelector(".icon-con") as HTMLElement;
        this.iconOuter=this.iconList.querySelector(".icon-outer") as HTMLElement;
        this.liList=this.iconCon.querySelectorAll("li");
        this.leftBtn=this.iconList.querySelector(".left") as HTMLElement;
        this.rightBtn=this.iconList.querySelector(".right") as HTMLElement;


        this.leftBtn.addEventListener("click",(e) => this.slideIcon(e));
        this.rightBtn.addEventListener("click",(e) => this.slideIcon(e));
        this.iconCon.addEventListener("mouseover",(e) => this.changeShow(e));

        this.setStyle();
        this.changeIcon(this.index);
        
        IconTab.IconList.push(this);
    }
    
    slideIcon(e:Event) {
        if (e.target===this.leftBtn) {
            this.changeMovenum(this.movenum-1);
        }else{
            this.changeMovenum(this.movenum+1);
        }
    }

    changeMovenum(num:number) {
        this.decretion=this.movenum < num ? "right" : "left";
        this.movenum=num;
        if (this.movenum<0) {
            this.movenum=0;
        }else if (this.movenum>this.liList.length-this.num) {
            this.movenum=this.liList.length-1-this.num;
        }else{
            this.runBool=true;
        }
    }

    moveIcon() {
        if (!this.runBool) return;
        if (this.decretion ==="left") {
            this.left+=6;
            if (this.left > -(this.movenum*this.conWidth/this.num)-2) {
                this.left=-(this.movenum*this.conWidth/this.num);
                this.runBool=false;
            }
        }else{
            this.left-=6;
            if (this.left < -(this.movenum*this.conWidth/this.num)+2) {
                this.left=-(this.movenum*this.conWidth/this.num);
                this.runBool=false;
            }
        }
        this.iconCon.style.left=this.left+"px";
    }

    

    appendTo(elem:HTMLElement) {
        elem.appendChild(this.iconList);
    }

    changeShow(e:Event) {
        if ((e.target as HTMLElement).nodeName!=="IMG") return;
        this.index=Number((e.target as HTMLElement).getAttribute("tag-index"));
        this.changeIcon(Number(this.index));

        this.dispatch((e.target as HTMLElement).getAttribute("src") as string)
    }

    dispatch(src:string) {
        let evt:any=new Event(IconTab.CHANGE_ICON);
        evt.targetImg=src;
        this.dispatchEvent(evt);
    }

    changeIcon(index:number) {
        if (this.prevItem) this.prevItem.style.borderColor="transparent";
        this.prevItem=this.liList[index];
        this.prevItem.style.borderColor="#e53e41";
    }

    setStyle(){
        Object.assign(this.iconOuter.style,{
            width:this.conWidth+"px",
            height:this.conWidth/this.num+"px",
            overflow:"hidden",
            position:"relative"
        });
        Object.assign(this.iconCon.style,{
            position:"absolute",
            top:0,
            left:0
        });
        let btn=[this.leftBtn,this.rightBtn];
        for (var i=0;i<btn.length;i++) {
            Object.assign(btn[i].style,{
                width:this.width*0.07+"px",
                marginLeft: this.width*0.015+"px",
                marginRight: this.width*0.015+"px",
                marginTop:this.width*0.03+"px",
                cursor:"pointer"
            });
        }

    }

    createIcon(list:[]) {
        this.iconList=document.createElement("div");
        this.iconList.className="clear-float";
        this.iconList.innerHTML=`
            <img class="left" src="../../public/images/left-btn.png">
            <div class="icon-outer">
                <ul style="width:${this.conWidth/this.num*list.length}px;" class="clear-float icon-con">
                    ${(function (elem,width) {
                        return elem.reduce((value,item:any,index:number) => {
                            return value+`
                            <li style="width:${width-width*0.14}px;margin:${width*0.07-2}px;border: 2px solid transparent;">
                                <img tag-index="${index}" style="width:100%;" src="${item.icon}">
                            </li>
                            `
                        },"")
                    })(list,this.conWidth/this.num)}
                </ul>
            </div>
            <img class="right" src="../../public/images/right-btn.png">
        `
    }
}