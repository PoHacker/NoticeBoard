/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
interface JQuery {
  ellipsis(options?: any): any
  enscroll(options?: any): any
}