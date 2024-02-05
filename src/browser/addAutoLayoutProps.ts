import {
    CounterAxisAlignItems,
    FlexDirection,
    LayerNode,
    PrimaryAxisAlignItems,
    WithMeta,
    WRAP_MODE,
} from '../types';
import { context } from './utils';

// Named constants
const DEFAULT_SPACING = 0;
const DEFAULT_PADDING = 0;
const DEFAULT_MARGIN = 0;

const justifyContentMapping: Record<string, PrimaryAxisAlignItems> = {
    'flex-start': 'MIN',
    'flex-end': 'MAX',
    center: 'CENTER',
    'space-between': 'SPACE_BETWEEN',
    'space-around': 'SPACE_BETWEEN',
    'space-evenly': 'SPACE_BETWEEN',
};

const alignItemsMapping: Record<string, CounterAxisAlignItems> = {
    'flex-start': 'MIN',
    'flex-end': 'MAX',
    center: 'CENTER',
    baseline: 'BASELINE',
    stretch: 'CENTER',
};

type FlexPropsType = {
    layoutMode: FlexDirection,
    itemSpacing: number,
    counterAxisSpacing: number,
    primaryAxisAlignItems: PrimaryAxisAlignItems,
    counterAxisAlignItems: CounterAxisAlignItems,
    layoutWrap: WRAP_MODE,
    layoutSizingVertical: 'FIXED' | 'HUG' | 'FILL',
    layoutSizingHorizontal: 'FIXED' | 'HUG' | 'FILL',
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    minHeight: number | undefined,
    maxHeight: number | undefined,
    minWidth: number | undefined,
    maxWidth: number | undefined,
}

/**
 * Sets Auto Layout properties for a layer based on computed styles.
 * @param {WithMeta<LayerNode>} layer - The layer to set Auto Layout properties for.
 * @param {CSSStyleDeclaration} computedStyles - The computed styles of the layer.
 * @returns {void}
 */
export function setAutoLayoutProps(
    layer: WithMeta<LayerNode>,
    computedStyles: CSSStyleDeclaration,
    element: HTMLElement
): void {
    const flexProps: FlexPropsType = initializeDefaultFlexProps();

    extractComputedStyles(computedStyles);

    const { display, gap, justifyContent, alignItems, flexDirection, flexWrap, paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft, flexGrow, flexShrink, width, height, flexBasis } = computedStyles;

    setLayoutMode(flexProps, display, flexDirection);
    setSpacing(flexProps, gap);
    setAlignment(flexProps, justifyContent, alignItems);
    setSize(flexProps, element, width, height, flexGrow, flexShrink, flexBasis);
    setPaddingAndMargin(flexProps, paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft);
    setMinMaxDimensions(flexProps, computedStyles);
    setWrapMode(flexProps, flexWrap);

    Object.assign(layer, flexProps);
}

function initializeDefaultFlexProps(): FlexPropsType {
    return {
        layoutMode: 'HORIZONTAL',
        itemSpacing: DEFAULT_SPACING,
        counterAxisSpacing: DEFAULT_SPACING,
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        layoutWrap: 'NO_WRAP',
        layoutSizingVertical: 'HUG',
        layoutSizingHorizontal: 'FILL',
        paddingTop: DEFAULT_PADDING,
        paddingRight: DEFAULT_PADDING,
        paddingBottom: DEFAULT_PADDING,
        paddingLeft: DEFAULT_PADDING,
        marginTop: DEFAULT_MARGIN,
        marginRight: DEFAULT_MARGIN,
        marginBottom: DEFAULT_MARGIN,
        marginLeft: DEFAULT_MARGIN,
        minHeight: undefined,
        maxHeight: undefined,
        minWidth: undefined,
        maxWidth: undefined,
    };
}

function extractComputedStyles(computedStyles: CSSStyleDeclaration): void {
    const stylesToLog = ['display', 'gap', 'justifyContent', 'alignItems', 'flexDirection', 'flexWrap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'flexGrow', 'width', 'height'];
    const loggedStyles = stylesToLog.reduce((acc, style) => ({ ...acc, [style]: computedStyles[style as keyof CSSStyleDeclaration] }), {});
    console.log('computedStyles', loggedStyles);
}

function setLayoutMode(flexProps: FlexPropsType, display: string, flexDirection: string): void {
    if (display === 'flex') {
        flexProps.layoutMode = flexDirection.startsWith('row') ? 'HORIZONTAL' : 'VERTICAL';
    } else {
        flexProps.layoutMode = 'VERTICAL';
    }
}

function setSpacing(flexProps: FlexPropsType, gap: string): void {
    if (gap && gap !== 'normal') {
        const spacingValues = gap.trim().split(' ').map(value => parseInt(value, 10));
        const itemSpacing: number = spacingValues[0];
        const counterAxisSpacing: number = spacingValues[1] || itemSpacing;
        Object.assign(flexProps, { itemSpacing, counterAxisSpacing });
    }
}

function setAlignment(flexProps: FlexPropsType, justifyContent: string, alignItems: string): void {
    flexProps.primaryAxisAlignItems = justifyContentMapping[justifyContent] || 'MIN';
    flexProps.counterAxisAlignItems = alignItemsMapping[alignItems] || 'MIN';
}

function setSize(flexProps: FlexPropsType, element: HTMLElement, width: string, height: string, flexGrow: string, flexShrink: string, flexBasis: string): void {
    if (isInsideFlexContainer(element)) {
        const parent = element.parentElement;
        if (!parent) return;
        const parentStyles = context.window.getComputedStyle(parent);
        const parentFlexDirection = parentStyles.flexDirection;
        const parentWraps = parentStyles.flexWrap;
        const isRowDirection = parentFlexDirection.startsWith('row');
        // const parentWidth = parseSizeValue(parentStyles.width);
        // const parentHeight = parseSizeValue(parentStyles.height);
        const elementWidth = parseSizeValue(width);
        const elementHeight = parseSizeValue(height);
        const elementFlexBasis = parseSizeValue(flexBasis);
        const elementFlexGrow = parseFloat(flexGrow) || 0;
        const elementFlexShrink = parseFloat(flexShrink) || 0;
        console.log(
            {
                elementWidth,
                elementHeight,
                elementFlexBasis,
                elementFlexGrow,
                elementFlexShrink,
                isRowDirection,
            }
        )

        // Set sizing based on flex-basis if available
        if (elementFlexBasis > 0) {
            if (isRowDirection) {
                flexProps.layoutSizingHorizontal = 'FIXED';
                flexProps.minWidth = elementFlexBasis;
                flexProps.maxWidth = elementFlexBasis;
            } else {
                flexProps.layoutSizingVertical = 'FIXED';
                flexProps.minHeight = elementFlexBasis;
                flexProps.maxHeight = elementFlexBasis;
            }
        } else {
            // Set sizing based on flex-grow if available
            if (elementFlexGrow > 0) {
                console.log('flex-grow');
                if (isRowDirection) {
                    flexProps.layoutSizingHorizontal = 'FILL';
                } else {
                    flexProps.layoutSizingVertical = 'FILL';
                }
            } else if(elementFlexShrink > 0){
                console.log('flex-shrink');
                if (isRowDirection) {
                    if(parentWraps){
                        flexProps.layoutSizingHorizontal = 'FIXED';
                    }else{
                        flexProps.layoutSizingHorizontal = 'HUG';
                    }
                } else {
                    if(parentWraps){
                        flexProps.layoutSizingVertical = 'FIXED';
                    }else{
                        flexProps.layoutSizingVertical = 'HUG';
                    }
                }
            } else {
                // Set sizing based on explicit width/height if available
                console.log('explicit width/height');
                if (elementWidth > 0 && isRowDirection) {
                    flexProps.layoutSizingHorizontal = 'FIXED';
                    flexProps.minWidth = elementWidth;
                    flexProps.maxWidth = elementWidth;
                } else if (elementHeight > 0 && !isRowDirection) {
                    flexProps.layoutSizingVertical = 'FIXED';
                    flexProps.minHeight = elementHeight;
                    flexProps.maxHeight = elementHeight;
                } else {
                    if (isRowDirection) {
                        flexProps.layoutSizingHorizontal = 'HUG';
                    } else {
                        flexProps.layoutSizingVertical = 'HUG';
                    }
                }
            }
        }

        // If the element is a direct child of the body, fill the available space
        if (isBodyElement(parent)) {
            flexProps.layoutSizingHorizontal = 'FILL';
            flexProps.layoutSizingVertical = 'FILL';
        }
    }else{
        // handle non-flex container
        console.log('non-flex container');
        const{ width: styleWidth, height: styleHeight, flexGrow: styleFlexGrow } = element.style;
        flexProps.layoutSizingHorizontal = !styleWidth || isEmptyString(styleWidth) ? 'FILL' : 'HUG';
        flexProps.layoutSizingVertical = parsePixelValue(styleHeight) > 0 ? 'FIXED' : 'HUG';
    }
}

function setPaddingAndMargin(flexProps: FlexPropsType, paddingTop: string, paddingRight: string, paddingBottom: string, paddingLeft: string, marginTop: string, marginRight: string, marginBottom: string, marginLeft: string): void {
    const paddingValues = { paddingTop, paddingRight, paddingBottom, paddingLeft };
    const marginValues = { marginTop, marginRight, marginBottom, marginLeft };

    type PaddingKeys = 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
    type MarginKeys = 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft';

    Object.keys(paddingValues).forEach(key => {
        const paddingKey = key as PaddingKeys;
        flexProps[paddingKey] = parseInt(paddingValues[paddingKey], 10) || DEFAULT_PADDING;
    });

    Object.keys(marginValues).forEach(key => {
        const marginKey = key as MarginKeys;
        flexProps[marginKey] = parseInt(marginValues[marginKey], 10) || DEFAULT_MARGIN;
    });
}

function setMinMaxDimensions(flexProps: FlexPropsType, computedStyles: CSSStyleDeclaration): void {
    const dimensions = {
        minHeight: 'minHeight',
        maxHeight: 'maxHeight',
        minWidth: 'minWidth',
        maxWidth: 'maxWidth',
    };

    type DimensionKeys = 'minHeight' | 'maxHeight' | 'minWidth' | 'maxWidth';

    Object.entries(dimensions).forEach(([key, cssProperty]) => {
        const value = parseFloat(computedStyles.getPropertyValue(cssProperty));
        const flexPropKey = key as DimensionKeys; // Explicitly narrowing down the type
        if (!isNaN(value)) {
            flexProps[flexPropKey] = value;
        } else {
            flexProps[flexPropKey] = undefined;
        }
    });
}

function setWrapMode(flexProps: FlexPropsType, flexWrap: string): void {
    flexProps.layoutWrap = flexWrap.startsWith('wrap') ? 'WRAP' : 'NO_WRAP';
}


function parsePixelValue(value: string): number {
    return parseInt(value.replace('px', ''), 10) || 0;
}

function parseSizeValue(value: string): number {
    if (value.endsWith('px')) {
        return parseInt(value, 10);
    }
    // Handle other units or default to 0 for unsupported units
    // TODO: Implement conversion for em, rem, vh, vw, etc., if needed
    return 0;
}

function isInsideFlexContainer(element: HTMLElement) {
    const parent = element.parentElement;
    const { getComputedStyle } = context.window;
    return parent && getComputedStyle(parent).display === 'flex';
}

function isBodyElement(element: HTMLElement) {
    return element.tagName === 'BODY';
}

function isEmptyString(value: string): boolean {
    return value.trim() === '';
}
