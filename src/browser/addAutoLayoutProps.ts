import {
    CounterAxisAlignItems,
    FlexDirection,
    LayerNode,
    PrimaryAxisAlignItems,
    WithMeta,
    WRAP_MODE,
} from '../types';

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

type FlexPropsType =  {
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
    // Initialize default FlexProps
    const flexProps: FlexPropsType = {
        layoutMode: 'HORIZONTAL' as FlexDirection,
        itemSpacing: DEFAULT_SPACING,
        counterAxisSpacing: DEFAULT_SPACING,
        primaryAxisAlignItems: 'MIN' as PrimaryAxisAlignItems,
        counterAxisAlignItems: 'MIN' as CounterAxisAlignItems,
        layoutWrap: 'NO_WRAP' as WRAP_MODE,
        layoutSizingVertical: 'HUG' as 'FIXED' | 'HUG' | 'FILL',
        layoutSizingHorizontal: 'FILL' as 'FIXED' | 'HUG' | 'FILL',
        paddingTop: DEFAULT_PADDING,
        paddingRight: DEFAULT_PADDING,
        paddingBottom: DEFAULT_PADDING,
        paddingLeft: DEFAULT_PADDING,
        marginTop: DEFAULT_MARGIN,
        marginRight: DEFAULT_MARGIN,
        marginBottom: DEFAULT_MARGIN,
        marginLeft: DEFAULT_MARGIN,
        minHeight: undefined as number | undefined,
        maxHeight: undefined as number | undefined,
        minWidth: undefined as number | undefined,
        maxWidth: undefined as number | undefined,
    };

    const {
        display,
        gap,
        justifyContent,
        alignItems,
        flexDirection,
        flexWrap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        flexGrow,
        flexShrink,
        flexBasis,
        width,
        height,
    } = computedStyles;

    console.log('computedStyles', {
        display,
        gap,
        justifyContent,
        alignItems,
        flexDirection,
        flexWrap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        flexGrow,
        width,
        height,
    });

    const parent = element.parentElement;

    

    // Set layoutMode based on display and flexDirection
    if (display === 'flex') {
        flexProps.layoutMode =
            flexDirection === 'row' || flexDirection === 'row-reverse' ? 'HORIZONTAL' : 'VERTICAL';
    }else{
        flexProps.layoutMode = 'VERTICAL';
    }

    // Set itemSpacing and counterAxisSpacing based on gap
    if (gap && gap !== 'normal') {
        const gapValues = gap
            .trim()
            .split(' ')
            .map((value) => parseInt(value, 10));
        flexProps.itemSpacing = gapValues[0] || 0;
        flexProps.counterAxisSpacing = gapValues[1] || gapValues[0] || 0;
    }

    // Set primaryAxisAlignItems based on justifyContent

    flexProps.primaryAxisAlignItems =
        justifyContentMapping[justifyContent] || 'MIN';

    // Set counterAxisAlignItems based on alignItems
    flexProps.counterAxisAlignItems = alignItemsMapping[alignItems] || 'MIN';

    


    // Set layoutSizingVertical and layoutSizingHorizontal based on width and height
    // set to FILL if width or height is set to 100% or if parent is a flex container
    const{ width: styleWidth, height: styleHeight, flexGrow: styleFlexGrow } = element.style;
    console.log({
        width,
        styleWidth,
        height,
        styleHeight,
    });
    if(isBodyElement(element)){
        console.log('isBodyElement');
        flexProps.layoutSizingHorizontal = 'FIXED';
        flexProps.layoutSizingVertical = 'FIXED';
    }else if (!isInsideFlexContainer(element)) {
        console.log('!isInsideFlexContainer');
        flexProps.layoutSizingHorizontal = !styleWidth || isEmptyString(styleWidth) ? 'FILL' : 'HUG';
        flexProps.layoutSizingVertical = parsePixelValue(styleHeight) > 0 ? 'FIXED' : 'HUG';
    }else if (width === '100%' || height === '100%') {
        console.log('width === 100% || height === 100%');
        flexProps.layoutSizingHorizontal = 'FILL';
        flexProps.layoutSizingVertical = 'FILL';
    } else {
        console.log('else');
        
        
        const parentFlexDirectionRaw = parent && getComputedStyle(parent).flexDirection;
        const parentFlexDirection= parentFlexDirectionRaw === 'row' || flexDirection === 'row-reverse' ? 'HORIZONTAL' : 'VERTICAL';
        if(parentFlexDirection=== 'HORIZONTAL'){
            if(width === '100%'){
                flexProps.layoutSizingHorizontal = 'FILL';
            } else if(height === '100%'){
                flexProps.layoutSizingVertical = 'FILL';
            }else if (flexBasis !== 'auto' && flexBasis !== '0%') {
                const basisValue = parseSizeValue(flexBasis);
                console.log('basisValue', basisValue);
                flexProps.layoutSizingHorizontal = basisValue > 0 ? 'FIXED' : 'HUG';
            }else if(styleFlexGrow){
                // Set layoutGrow
                console.log('flexBasis', flexBasis);
                const flexGrowValue = parseInt(flexGrow, 10);
                flexProps.layoutSizingHorizontal = 'FILL';
            } else{
                flexProps.layoutSizingHorizontal= width.endsWith('%') ? 'FILL' : !styleWidth || isEmptyString(styleWidth) ? 'HUG' : 'FIXED';
                flexProps.layoutSizingVertical = height.endsWith('%') ? 'FILL' : !styleWidth || isEmptyString(styleWidth) ? 'HUG' : 'FIXED';
            }
        }else if(parentFlexDirection === 'VERTICAL'){
            if(height === '100%'){
                flexProps.layoutSizingVertical = 'FILL';
            } else if(width === '100%'){
                flexProps.layoutSizingHorizontal = 'FILL';
            }else if (flexBasis !== 'auto' && flexBasis !== '0%') {
                const basisValue = parseSizeValue(flexBasis);
                console.log('basisValue', basisValue);
                flexProps.layoutSizingVertical = basisValue > 0 ? 'FIXED' : 'HUG';
            }else if(styleFlexGrow){
                // Set layoutGrow
                console.log('flexBasis', flexBasis);
                const flexGrowValue = parseInt(flexGrow, 10);
                flexProps.layoutSizingVertical = 'FILL';
            } else{
                flexProps.layoutSizingHorizontal= width.endsWith('%') ? 'FILL' : !styleWidth || isEmptyString(styleWidth) ? 'FILL' : 'FIXED';
                flexProps.layoutSizingVertical = height.endsWith('%') ? 'FILL' : !styleWidth || isEmptyString(styleWidth) ? 'HUG' : 'FIXED';
            }
            
        }
    }

    // Set padding values
    flexProps.paddingTop = parseInt(paddingTop, 10) || DEFAULT_PADDING;
    flexProps.paddingRight = parseInt(paddingRight, 10) || DEFAULT_PADDING;
    flexProps.paddingBottom = parseInt(paddingBottom, 10) || DEFAULT_PADDING;
    flexProps.paddingLeft = parseInt(paddingLeft, 10) || DEFAULT_PADDING;

    // Set margin values

    flexProps.marginTop = parseInt(marginTop, 10) || DEFAULT_MARGIN;
    flexProps.marginRight = parseInt(marginRight, 10) || DEFAULT_MARGIN;
    flexProps.marginBottom = parseInt(marginBottom, 10) || DEFAULT_MARGIN;
    flexProps.marginLeft = parseInt(marginLeft, 10) || DEFAULT_MARGIN;
    

    // Set minHeight, maxHeight, minWidth, maxWidth only if they are explicitly set
    flexProps.minHeight =
        parseFloat(computedStyles.getPropertyValue('min-height')) || undefined;
    flexProps.maxHeight =
        parseFloat(computedStyles.getPropertyValue('max-height')) || undefined;
    flexProps.minWidth =
        parseFloat(computedStyles.getPropertyValue('min-width')) || undefined;
    flexProps.maxWidth =
        parseFloat(computedStyles.getPropertyValue('max-width')) || undefined;

        const flexBasisValue = parseSizeValue(flexBasis);
        console.log('flexBasisValue', flexBasisValue);
    

    // Set layoutWrap based on flexWrap when layoutMode is HORIZONTAL
    flexProps.layoutWrap = flexWrap === 'wrap' || flexWrap === 'wrap-reverse'
    ? 'WRAP' : 'NO_WRAP';

    // if has children and child is type text
    if(layer.children && layer.children.length === 1){
        const textNode = layer.children[0];
        if(textNode.type === 'TEXT'){
            console.log('textNode', textNode);
            // Set layoutSizingVertical and layoutSizingHorizontal to FILL
            flexProps.layoutSizingVertical = 'FILL';
            flexProps.layoutSizingHorizontal = 'FILL';
        }
    }


    // Assign flexProps to the layer
    Object.assign(layer, flexProps);
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
    return parent && getComputedStyle(parent).display === 'flex';
}

function isBodyElement(element: HTMLElement) {
    return element.tagName === 'BODY';
}

function isEmptyString(value: string): boolean {
    return value.trim() === '';
}
