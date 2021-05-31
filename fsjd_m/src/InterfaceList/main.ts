export type runWorkType =""|"home"|"classify"|"shopcar"|"mine"|"detail"|"detail/intr"|"detail/param"|"detail/aftersale";
export type tabType="home"|"classify"|"shopcar"|"mine";
export type routeType = {path:string,run:Function,childRoute?:routeType[]};