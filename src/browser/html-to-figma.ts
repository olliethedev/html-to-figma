import { elementToFigma } from './element-to-figma';
import { LayerNode, MetaLayerNode, PlainLayerNode, WithMeta } from '../types';
import { addConstraintToLayer } from './add-constraints';
import { context } from './utils';
import { traverse, traverseMap } from '../utils';
import { ElemTypes, isElemType } from './dom-utils';
import { setAutoLayoutProps } from './addAutoLayoutProps';

const removeMeta = (layerWithMeta: WithMeta<LayerNode>): LayerNode | undefined => {
    const {
        textValue,
        before,
        after,
        borders,
        ref,
        type,
        zIndex,
        isAutoLayout,
        ...rest
    } = layerWithMeta;

    if (!type) return;

    return { type, ...rest } as PlainLayerNode;
}

const mapDOM = async (root: Element, useAutoLayout = false): Promise<LayerNode> => {
    const elems: WithMeta<LayerNode>[] = [];
    const walk = context.document.createTreeWalker(
        root,
        NodeFilter.SHOW_ALL,
        null,
        false
    );
    const refs = new Map<Element, MetaLayerNode[]>();

    let n: Node | null = walk.currentNode;

    do {
        if (!n.parentElement) continue;
        const figmaEl = await elementToFigma(n as Element, undefined, useAutoLayout);
        console.log('figmaEl', figmaEl)
        const el = n as Element;
    const isAutoLayout =
        isElemType(el, ElemTypes.Element) && useAutoLayout;
    

        if (figmaEl) {
            addConstraintToLayer(figmaEl, n as HTMLElement);

            const children = refs.get(n.parentElement) || [];
            refs.set(n.parentElement, [...children, figmaEl]);
            elems.push(figmaEl as WithMeta<LayerNode>);

            if(isAutoLayout) {
                const computedStyle = getComputedStyle(el);
                
                    console.log('elementToFigma', el, 'isAutoLayout', isAutoLayout);
                    setAutoLayoutProps(figmaEl, computedStyle, el as HTMLElement);
                    figmaEl.isAutoLayout = true;
            }
        }
    } while (n = walk.nextNode());

    const result = elems[0];

    for (let i = 0;i < elems.length; i++) {
        const elem = elems[i];
        if (elem.type !== 'FRAME') continue;

        elem.children = elem.children || [];

        elem.before && elem.children.push(elem.before);

        const children = refs.get(elem.ref as Element) || [];

        children && elem.children.push(...children);
        // elements with text
        if (!elem.textValue) {
            elem.children = elem.children.filter(Boolean);
        } else {
            elem.children = [elem.textValue];
        }
        // extends elements for show complex borders
        if (elem.borders) {
            elem.children = elem.children.concat(elem.borders);
        }
        elem.after && elem.children.push(elem.after);

        const isAutoLayout = elem.isAutoLayout;

        if(isAutoLayout) {
            //reverese children order
            elem.children = elem.children.reverse();
            //todo: reverese for row-reverse and column-reverse
        }else{
            elem.children.sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        }
        
    }

    // @ts-expect-error
    const layersWithoutMeta = traverseMap<WithMeta<LayerNode>>(result, (layer) => {
        return removeMeta(layer);
    }) as LayerNode;
    // Update all positions and clean
    traverse(layersWithoutMeta, (layer) => {
        if (layer.type === 'FRAME' || layer.type === 'GROUP') {
            const { x, y } = layer;
            if (x || y) {
                traverse(layer, (child) => {
                    if (child === layer) {
                        return;
                    }
                    child.x = child.x! - x!;
                    child.y = child.y! - y!;
                });
            }
        }
    });

    if(useAutoLayout){
        console.log('patchLayers', layersWithoutMeta);
        return patchLayers(layersWithoutMeta);
    }

    return layersWithoutMeta;
}

const patchLayers = (layer: LayerNode) => {
    console.log('processMargins', layer);
    const newRoot = processMargins(layer);
    traverse(layer, (child, parent) => {
        processMargins(child, parent);
        processTextLayers(child, parent);
    });
    return newRoot as LayerNode;
}

const processMargins = (child: LayerNode, parent?: LayerNode | null) => {
    console.log('processMargins', child, parent);
        const castedChild = child as any;
        const castedParent = parent as any;
        if((castedChild.marginLeft || castedChild.marginRight || castedChild.marginTop || castedChild.marginBottom)){
            console.log('margin', castedChild.marginLeft, castedChild.marginRight, castedChild.marginTop, castedChild.marginBottom);
            //wrap with figma frame element with padding set to margins
            const frame = {
                type: 'FRAME',
                x: castedChild.x,
                y: castedChild.y,
                width: castedChild.width,
                height: castedChild.height,
                paddingLeft: castedChild.marginLeft,
                paddingRight: castedChild.marginRight,
                paddingTop: castedChild.marginTop,
                paddingBottom: castedChild.marginBottom,
                fills: castedChild.fills,
                layoutMode: 'VERTICAL',
                // itemSpacing: castedChild.itemSpacing,
                // counterAxisSpacing: castedChild.counterAxisSpacing,
                // primaryAxisAlignItems: castedChild.primaryAxisAlignItems,
                // counterAxisAlignItems: castedChild.counterAxisAlignItems,
                // layoutWrap: castedChild.layoutWrap,
                layoutSizingVertical: castedChild.layoutSizingVertical,
                layoutSizingHorizontal: castedChild.layoutSizingHorizontal,

               children: [castedChild],
            }

            castedChild.layoutSizingVertical= castedChild.layoutSizingVertical==="FIXED" ? "FILL":castedChild.layoutSizingVertical,
            castedChild.layoutSizingHorizontal= castedChild.layoutSizingHorizontal==="FIXED" ? "FILL":castedChild.layoutSizingHorizontal,

            //delete margins from child
            delete castedChild.marginLeft;
            delete castedChild.marginRight;
            delete castedChild.marginTop;
            delete castedChild.marginBottom;

            // swap child with frame, update parent
            if(castedParent){
                castedParent.children[castedParent.children.indexOf(child)] = frame;
            }else{
                //update root
                castedChild.layoutMode= "VERTICAL";
                castedChild.layoutSizingVertical= "HUG";
                castedChild.layoutSizingHorizontal= "FILL";
                frame.layoutSizingVertical = "HUG"
                return frame;
            }

        }
        return child;
}

const processTextLayers = (child: LayerNode, parent?: LayerNode | null) => {
    //todo process text layers and add auto layout props
    const castedChild = child as any;
        const castedParent = parent as any;
    if(castedChild.type === 'TEXT'){
        console.log('processTextLayers', castedChild);
        console.log('processTextLayers', castedParent);
        // const computedStyle = getComputedStyle(castedChild.ref as HTMLElement);
        // console.log('elementToFigma', castedChild.ref, 'isAutoLayout', true);
        // setAutoLayoutProps(castedChild, computedStyle, castedChild.ref as HTMLElement);
        // castedChild.isAutoLayout = true;
        // castedChild.layoutMode= "VERTICAL";
        castedChild.layoutSizingHorizontal= "FILL";
        // castedChild.layoutSizingVertical= "HUG";
        // castedChild.counterAxisAlignItems = "MAX";
        // castedChild.primaryAxisAlignItems = "MAX";
        // castedChild.layoutGrow = 1;
        castedChild.layoutAlign = "STRETCH";
        castedChild.layoutPositioning = "AUTO";
        castedChild.textAutoResize = "WIDTH_AND_HEIGHT";
    }
}

export async function htmlToFigma(
    selector: HTMLElement | string = 'body',
    useAutoLayout = false
) {

    let layers: LayerNode[] = [];
    const el =
        isElemType(selector as HTMLElement, ElemTypes.Element)
            ? selector as HTMLElement
            : context.document.querySelectorAll(selector as string || 'body')[0];

    if (!el) {
        throw Error(`Element not found`);
    }

    console.warn('Element tree:', el.innerHTML);

    // Process SVG <use> elements
    for (const use of Array.from(
        el.querySelectorAll('use')
    ) as SVGUseElement[]) {
        try {
            const symbolSelector = use.href.baseVal;
            const symbol: SVGSymbolElement | null =
                context.document.querySelector(symbolSelector);
            if (symbol) {
                use.outerHTML = symbol.innerHTML;
            }
        } catch (err) {
            console.warn('Error querying <use> tag href', err);
        }
    }

    // const els = (Array.from(el.querySelectorAll('*')) as Element[]).reduce(
    //     (memo, el) => {
    //         memo.push(el);
    //         memo.push(...getShadowEls(el));

    //         return memo;
    //     },
    //     [] as Element[]
    // );
    const data = await mapDOM(el, useAutoLayout);

    return data ? data : [];
}
