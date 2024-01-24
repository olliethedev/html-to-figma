export type FlexDirection = 'HORIZONTAL' | 'VERTICAL';
export type PrimaryAxisAlignItems =
    | 'MIN'
    | 'MAX'
    | 'CENTER'
    | 'SPACE_BETWEEN'
    | 'SPACE_AROUND'
    | 'SPACE_EVENLY';
export type CounterAxisAlignItems =
    | 'MIN'
    | 'MAX'
    | 'CENTER'
    | 'BASELINE'
    | 'FILL';
export type WRAP_MODE = 'WRAP' | 'NO_WRAP';

export interface Unit {
    unit: 'PIXELS';
    value: number;
}

export interface SvgNode extends DefaultShapeMixin, ConstraintMixin {
    type: 'SVG';
    svg: string;
}

export type WithWriteChildren<T> = Partial<T> & {
    children: WithWriteChildren<T>[];
};

export type WithRef<T> = T & {
    ref?: SceneNode;
};

// export interface Layer {
//     ref: Element,
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     fills:
//     clipsContent: !!overflowHidden,
//     fills: fills as any,
//     children: [],
//     opacity: getOpacity(computedStyle),
//     zIndex: Number(computedStyle.zIndex),
// }

export type LayerNode = Partial<
    RectangleNode | TextNode | FrameNode | SvgNode | GroupNode | ComponentNode
>;

export type PlainLayerNode = Partial<LayerNode> & {
    fontFamily?: string;
};

export type MetaLayerNode = WithMeta<LayerNode>;
export type MetaTextNode = WithMeta<TextNode>;

export type WithMeta<T> = Partial<Omit<T, 'children'>> & {
    ref?: SceneNode | Element | HTMLElement;
    zIndex?: number;
    fontFamily?: string;
    textValue?: WithMeta<TextNode>;
    before?: WithMeta<T>;
    after?: WithMeta<T>;
    borders?: WithMeta<T>;
    children?: WithMeta<T>[];
    constraints?: FrameNode['constraints'];
    clipsContent?: FrameNode['clipsContent'];
    fontWeight?: number;
};
