import mainWork from "./work.js";
import {runWorkType,routeType} from "../../InterfaceList/main.js";

export let routerOpation:routeType = {
    path:"",
    run:mainWork.instance.homeWork,
    childRoute:[
        {
            path:"home",
            run:mainWork.instance.homeWork,
            childRoute:[
    
            ]
        },
        {
            path:"classify",
            run:mainWork.instance.classifyWork,
            childRoute:[
    
            ]
        },
        {
            path:"shopcar",
            run:mainWork.instance.shopcarWork,
            childRoute:[
    
            ]
        },
        {
            path:"mine",
            run:mainWork.instance.mineWork,
            childRoute:[
                {
                    path:"login",
                    run:mainWork.instance.login
                },
                {
                    path:"register",
                    run:mainWork.instance.register
                },
                {
                    path:"mymine",
                    run:mainWork.instance.mymine
                }
            ]
        },
        {
            path:"detail",
            run:mainWork.instance.detailWork,
            childRoute:[
                {
                    path:"intr",
                    run:mainWork.instance.dIntr
                },
                {
                    path:"param",
                    run:mainWork.instance.dParam
                },
                {
                    path:"aftersale",
                    run:mainWork.instance.dAftersale
                },
            ]
        }
    ]
}