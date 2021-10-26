import { Render } from "./typedefs";

type Child = VNode | string;

let nodeId = 1;

export interface VNode {
  id: number;
  type: string | Render<any>;
  attributes: Record<string, unknown>;
  children: Child[];
  isComponent: boolean;
  element?: Element;
  prevElement?: Element;
}

export function Fragment(props: { children: VNode[] }): VNode[] {
  return props.children;
}

export function createNode(
  type: string | Render<any>,
  attributes: any,
  ...children: any[]
): VNode {
  const node = {
    id: nodeId++,
    type,
    attributes,
    children,
    isComponent: typeof type !== "string",
    element: undefined,
    prevElement: undefined,
  };
  return node;
}
