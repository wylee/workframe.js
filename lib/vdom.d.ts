import { JsxVNodeChildren, VNode, VNodeData } from "snabbdom";
import { AnyState, Setup } from "./interfaces";
export declare const patch: (oldVnode: VNode | Element | DocumentFragment, vnode: VNode) => VNode;
/**
 * Create a VNode from a JSX node.
 *
 * @param arg An HTML tag name *or* a component setup function
 * @param data HTML attributes & event handles *or* component state
 * @param children
 */
export declare function createVnodeFromJsxNode<S extends AnyState>(arg: string | Setup<S> | ((...arg: JsxVNodeChildren[]) => VNode[]), data: VNodeData | null, ...children: JsxVNodeChildren[]): VNode | VNode[];
export declare function jsxFragment(children: JsxVNodeChildren[]): VNode[];
