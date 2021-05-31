interface goodsRecom {
    img:string;
    info:string;
}

export interface goodsType{
    id:number;
    imgSrc:string;
    link:string;
    price:string;
    title:string;
    _id:string;
    detail:{
        appraise:string,
        price:string,
        choose:{
            cName:string;
            cList:Array<goodsRecom>
        },
        hotList:Array<{img:string,info:string,name:string,price:string}>,
        imgList:Array<string>,
        introduce:Array<string>,
        lookList:Array<{img:string,name:string,price:string}>,
        moreList:Array<string>,
        newList:Array<{img:string,name:string,price:string}>,
        shop:{
            name:string,
            star:string,
            grade:Array<{desc:string,num:number}>
        }
    }
}

export interface carType{
    shop:String,
    checked:Boolean,
    title:String,
    price:Number|String,
    num:1,
    info:String,
    delete:Boolean,
    pid:Number,
    imgSrc:String,
    sumPrice:Number|String,
    like:Boolean,
    username:String,
    password:String
}

export interface sendType{
    type:"succeed"|"error",
    code:Number,
    detail:{
        name:String,
        value:any
    }
}