import { parseUnits } from "../utils";

interface ExtendedWindow extends Window {
    HTMLInputElement: HTMLInputElement
}
interface FigmaToHtmlContext { 
    window: ExtendedWindow;
    document: Document
}

export const context: FigmaToHtmlContext = { 
    // @ts-expect-error
    window,
    document
};

export const setContext = (window: Window) => {
    context.document = window.document;
    // @ts-expect-error
    context.window = window;
};

export const replaceSvgFill = (svg: string, fillColor: string) => {
    const endTagIndex = svg.indexOf('>');
    const mainTag = svg.slice(1, endTagIndex);
    const fillAttr = `fill="${fillColor}"`;
    const mainTagWithFill = mainTag.includes('fill=') ? mainTag.replace(/fill\=(.*?)\s/, `fill="${fillColor}" `) : mainTag + fillAttr;

    return `<${mainTagWithFill}>${svg.slice(endTagIndex)}`;
}
// src/utils/index.ts


export function parseGradient(cssGradient: string) {
    const linearMatch = cssGradient.match(/linear-gradient\((.+)\)/);
    const radialMatch = cssGradient.match(/radial-gradient\((.+)\)/);

    if (!linearMatch && !radialMatch) {
        return null;
    }

    const isLinear = Boolean(linearMatch);
    let parts: string[] = [];
    
    if (isLinear && linearMatch) {
        parts = splitGradientParts(linearMatch[1]);
    } else if (!isLinear && radialMatch) {
        parts = splitGradientParts(radialMatch[1]);
    }

    // Check if gradient has direction, if not add default direction to the beginning of the parts array
    if (isLinear && !parts[0].includes('to')) {
        parts.unshift('to bottom');
    } else if (!isLinear && !parts[0].includes('circle')) {
        parts.unshift('circle at center');
    }
    let angle = 0;
    let transform = { x: 0, y: 0 }
    if (parts.length > 0) {
        const part = parts.shift() as string;
        if (isLinear) {
            angle = getAngleFromDirection(part.trim());
            transform = getTransformFromDirection(part.trim());
        } else {
            // Handle radial gradient direction
            const radialDirectionMatch = part.match(/circle( at (center|top|bottom|right|left)( (top|bottom|right|left))?)?/);
            console.warn({radialDirectionMatch});
            if (radialDirectionMatch) {
                const direction1 = radialDirectionMatch[2] || 'center';
                const direction2 = radialDirectionMatch[4] || '';
                const direction = direction2 ? `${direction1} ${direction2}` : direction1;
                
                angle = getRadialAngleFromDirection(direction);
                transform = getRadialTransformFromDirection(direction);
            }
        }
    }

    const colorStops = parts.map((part, index, array) => {
        const [color, position] = part.trim().split(/\s+(?![^\(]*\))/).filter(Boolean);
        const parsedColor = getRgb(color); // Debugging line
        return {
            color: parsedColor,
            position: getPosition(position, index, array.length, isLinear, color)
        };
    });

    return {
        type: isLinear ? 'GRADIENT_LINEAR' : 'GRADIENT_RADIAL',
        angle: (angle * Math.PI) / 180, // Convert to radians
        colorStops,
        transform
    };
}

function getPosition(position: string | undefined, index: number, arrayLength: number, isLinear: boolean, direction: string): number {
    if (position) {
        return parseFloat(position) / 100;
    }

    // Calculate position based on index and array length
    const calculatedPosition = index / (arrayLength - 1);

    if (isLinear) {
        switch (direction) {
            case 'to right':
                return calculatedPosition;
            case 'to left':
                return calculatedPosition;
            case 'to top':
                return calculatedPosition;
            default: // 'to bottom'
                return calculatedPosition;
        }
    } else{
        switch (direction) {
            case 'circle at top':
                return calculatedPosition;
            case 'circle at right':
                return calculatedPosition;
            case 'circle at bottom':
                return calculatedPosition;
            case 'circle at left':
                return calculatedPosition;
            default: // 'center'
                return calculatedPosition;
        }
    }

    // Default return value
    return calculatedPosition;
}

function getAngleFromDirection(direction: string): number {
    switch (direction) {
        case 'to right':
            return 0;
        case 'to left':
            return 180;
        case 'to top':
            return -90;
        default: // 'to bottom'
            return 90;
    }
}

function getTransformFromDirection(direction: string) {
    switch (direction) {
        case 'to right':
            return { x: 0, y: 1 };
        case 'to left':
            return { x: 1, y: 1 };
        case 'to top':
            return { x: 1, y: 1 };
        default: // 'to bottom'
            return { x: 0, y: 1 };
    }
}

function splitGradientParts(gradientPart: string): string[] {
    let parts = [];
    let currentIndex = 0;
    let parenthesesCounter = 0;

    for (let i = 0; i < gradientPart.length; i++) {
        if (gradientPart[i] === '(') parenthesesCounter++;
        if (gradientPart[i] === ')') parenthesesCounter--;

        if (gradientPart[i] === ',' && parenthesesCounter === 0) {
            parts.push(gradientPart.substring(currentIndex, i).trim());
            currentIndex = i + 1;
        }
    }

    // Add the last part
    parts.push(gradientPart.substring(currentIndex).trim());

    return parts;
}


export function getRgb(color: string) {
    let match;

    // Check if color is in rgb format
    match = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
        return {
            r: parseInt(match[1]) / 255,
            g: parseInt(match[2]) / 255,
            b: parseInt(match[3]) / 255,
            a: 1,
        };
    }

    // Check if color is in rgba format
    match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i);
    if (match) {
        return {
            r: parseInt(match[1]) / 255,
            g: parseInt(match[2]) / 255,
            b: parseInt(match[3]) / 255,
            a: match[4] ? parseFloat(match[4]) : 1,
        };
    }

    // Check if color is in hex format
    match = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (match) {
        return {
            r: parseInt(match[1], 16) / 255,
            g: parseInt(match[2], 16) / 255,
            b: parseInt(match[3], 16) / 255,
            a: 1,
        };
    }

    // If color format is not recognized, return null
    return null;
}

function getRadialAngleFromDirection(direction: string): number {
    switch (direction) {
        case 'top':
        case 'center top':
        case 'left top':
        case 'right top':
            return 0;
        case 'right':
        case 'center right':
        case 'top right':
        case 'bottom right':
            return 90;
        case 'bottom':
        case 'center bottom':
        case 'left bottom':
        case 'right bottom':
            return 180;
        case 'left':
        case 'center left':
        case 'top left':
        case 'bottom left':
            return -90;
        default: // 'center'
            return 0;
    }
}

function getRadialTransformFromDirection(direction: string) {
    switch (direction) {
        case 'top':
        case 'center top':
            return { x: 0, y: 0.5 };
        case 'left top':
            return { x: 0.5, y: 0.5 };
        case 'right top':
            return { x: -0.5, y: 0.5 };
        case 'right':
        case 'center right':
            return { x: -0.5, y: 0 };
        case 'top right':
            return { x: -0.5, y: 0.5 };
        case 'bottom right':
            return { x: -0.5, y: -0.5 };
        case 'bottom':
        case 'center bottom':
            return { x: 0, y: -0.5 };
        case 'left bottom':
            return { x: 0.5, y: -0.5 };
        case 'right bottom':
            return { x: -0.5, y: -0.5 };
        case 'left':
        case 'center left':
            return { x: 0.5, y: 0 };
        case 'top left':
            return { x: 0.5, y: 0.5 };
        case 'bottom left':
            return { x: 0.5, y: -0.5 };
        default: // 'center'
            return { x: 0, y: 0 };
    }
}
