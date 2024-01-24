import { getImageFills } from '../utils';
import { processImages } from './images';
import { getMatchingFont } from './getFont';
import { assign } from './helpers';
import { LayerNode, PlainLayerNode, WithRef } from '../types';

const processDefaultElement = (
    layer: LayerNode,
    node: SceneNode,
): SceneNode => {
    node.x = layer.x as number;
    node.y = layer.y as number;
    //@ts-expect-error
    node.resize(layer.width || 1, layer.height || 1);
    assign(node, layer);
    // rects.push(frame);
    return node;
};

const createNodeFromLayer = (layer: LayerNode) => {
    if (layer.type === 'FRAME' || layer.type === 'GROUP') {
        return figma.createFrame();
    }

    if (layer.type === 'SVG' && layer.svg) {
        if (layer.svg.startsWith('<svg')) {
            return figma.createNodeFromSvg(layer.svg);
        } else {
            let tempSvgData = decodeBase64(layer.svg);
            if (tempSvgData.startsWith('<svg')) {
                return figma.createNodeFromSvg(tempSvgData);
            } else {
                console.warn('malformed svg');
                console.warn(layer.svg);
            }
            return figma.createNodeFromSvg(
                `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#DDDDDD"/><path fill="#999999" d="M23.32 53.77h1.82v1.29h-5.6v-1.29h2.05v-5.91q0-.35.02-.72l-1.45 1.22q-.13.1-.25.12-.12.03-.23.01-.11-.02-.19-.08-.09-.05-.13-.11l-.55-.75 3.09-2.63h1.42v8.85ZM33.79 50q0 1.32-.29 2.3-.28.97-.78 1.61-.5.64-1.18.95-.69.31-1.48.31t-1.46-.31q-.68-.31-1.18-.95-.49-.64-.77-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.77-1.61.5-.64 1.18-.95.67-.31 1.46-.31.79 0 1.48.31.68.31 1.18.95.5.63.78 1.61.29.97.29 2.3ZM32 50q0-1.1-.16-1.82t-.43-1.15q-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.71.17-.35.17-.62.6-.26.43-.42 1.15-.16.72-.16 1.82t.16 1.82q.16.72.42 1.15.27.42.62.6.34.17.71.17.38 0 .73-.17.35-.18.62-.6.27-.43.43-1.15Q32 51.1 32 50Zm9.91 0q0 1.32-.29 2.3-.28.97-.78 1.61-.5.64-1.18.95-.69.31-1.48.31t-1.46-.31q-.68-.31-1.18-.95-.49-.64-.77-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.77-1.61.5-.64 1.18-.95.67-.31 1.46-.31.79 0 1.48.31.68.31 1.18.95.5.63.78 1.61.29.97.29 2.3Zm-1.79 0q0-1.1-.16-1.82t-.43-1.15q-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.71.17-.35.17-.62.6-.26.43-.42 1.15-.16.72-.16 1.82t.16 1.82q.16.72.42 1.15.27.42.62.6.34.17.71.17.38 0 .73-.17.35-.18.62-.6.27-.43.43-1.15.16-.72.16-1.82Zm12.9 2.74-.91.91-2.38-2.38-2.39 2.39-.92-.9 2.4-2.4-2.29-2.29.91-.91 2.29 2.29 2.26-2.27.93.91-2.28 2.27 2.38 2.38Zm9.59 1.03h1.82v1.29h-5.6v-1.29h2.05v-5.91q0-.35.02-.72l-1.46 1.22q-.12.1-.25.12-.12.03-.23.01-.11-.02-.19-.08-.08-.05-.13-.11l-.54-.75 3.09-2.63h1.42v8.85ZM73.07 50q0 1.32-.28 2.3-.29.97-.79 1.61-.5.64-1.18.95-.68.31-1.47.31-.79 0-1.47-.31-.67-.31-1.17-.95-.5-.64-.78-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.78-1.61.5-.64 1.17-.95.68-.31 1.47-.31.79 0 1.47.31.68.31 1.18.95.5.63.79 1.61.28.97.28 2.3Zm-1.78 0q0-1.1-.16-1.82-.17-.72-.43-1.15-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.72.17t-.61.6q-.27.43-.43 1.15-.15.72-.15 1.82t.15 1.82q.16.72.43 1.15.26.42.61.6.35.17.72.17.38 0 .73-.17.35-.18.62-.6.26-.43.43-1.15.16-.72.16-1.82Zm9.9 0q0 1.32-.28 2.3-.29.97-.79 1.61-.5.64-1.18.95-.68.31-1.47.31-.79 0-1.47-.31-.67-.31-1.17-.95-.5-.64-.78-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.78-1.61.5-.64 1.17-.95.68-.31 1.47-.31.79 0 1.47.31.68.31 1.18.95.5.63.79 1.61.28.97.28 2.3Zm-1.78 0q0-1.1-.16-1.82-.17-.72-.43-1.15-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.72.17t-.61.6q-.27.43-.43 1.15-.15.72-.15 1.82t.15 1.82q.16.72.43 1.15.26.42.61.6.35.17.72.17.38 0 .73-.17.35-.18.62-.6.26-.43.43-1.15.16-.72.16-1.82Z"/></svg>`,
            );
        }
    }

    if (layer.type === 'RECTANGLE') {
        return figma.createRectangle();
    }

    if (layer.type === 'TEXT') {
        return figma.createText();
    }

    if (layer.type === 'COMPONENT') {
        return figma.createComponent();
    }
};

const SIMPLE_TYPES = ['FRAME', 'GROUP', 'SVG', 'RECTANGLE', 'COMPONENT'];

export const processLayer = async (
    layer: PlainLayerNode,
    parent: WithRef<LayerNode> | null,
    baseFrame: PageNode | FrameNode,
) => {
    const parentFrame = (parent?.ref as FrameNode) || baseFrame;

    if (typeof layer.x !== 'number' || typeof layer.y !== 'number') {
        throw Error('Layer coords not defined');
    }

    const node = createNodeFromLayer(layer);

    if (!node) {
        throw Error(`${layer.type} not implemented`);
    }

    if (layer.type === 'RECTANGLE' || layer.type === 'FRAME') {
        if (getImageFills(layer as RectangleNode)) {
            await processImages(layer as RectangleNode);
        }
    }

    if (SIMPLE_TYPES.includes(layer.type as string)) {
        parentFrame.appendChild(processDefaultElement(layer, node));
    }
    // @ts-expect-error
    layer.ref = node;

    if (layer.type === 'TEXT') {
        const text = node as TextNode;

        if (layer.fontFamily) {
            const fontNumberToNameMap: { [key: number]: string } = {
                200: 'Thin',
                300: 'Light',
                400: 'Regular',
                500: 'Medium',
                600: 'SemiBold',
                700: 'Bold',
                800: 'ExtraBold',
                900: 'Black',
            };
            const fontWeight =
                fontNumberToNameMap[layer.fontWeight as number] || 'Regular';
            const fontName = await getMatchingFont(
                layer.fontFamily,
                fontWeight,
            );
            text.fontName = fontName;
            // @ts-expect-error
            delete layer.fontWeight;
            delete layer.fontFamily;
        }

        assign(text, layer);
        text.resize(layer.width || 1, layer.height || 1);

        text.textAutoResize = 'HEIGHT';

        let adjustments = 0;
        if (layer.lineHeight) {
            text.lineHeight = layer.lineHeight;
        }
        // Adjust text width
        while (typeof layer.height === 'number' && text.height > layer.height) {
            if (adjustments++ > 10) {
                console.warn('Too many font adjustments', text, layer);

                break;
            }

            try {
                text.resize(text.width + 1, text.height);
            } catch (err) {
                console.warn('Error on resize text:', layer, text, err);
            }
        }

        parentFrame.appendChild(text);
    }

    return node;
};

function decodeBase64(input: string) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = '';
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
        const enc1 = chars.indexOf(input.charAt(i++));
        const enc2 = chars.indexOf(input.charAt(i++));
        const enc3 = chars.indexOf(input.charAt(i++));
        const enc4 = chars.indexOf(input.charAt(i++));

        const chr1 = (enc1 << 2) | (enc2 >> 4);
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        const chr3 = ((enc3 & 3) << 6) | enc4;

        str = str + String.fromCharCode(chr1);

        if (enc3 != 64) {
            str = str + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            str = str + String.fromCharCode(chr3);
        }
    }

    return str;
}
