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

const justifyContentMapping: Record<string, PrimaryAxisAlignItems> = {
    'flex-start': 'MIN',
    'flex-end': 'MAX',
    center: 'CENTER',
    'space-between': 'SPACE_BETWEEN',
    'space-around': 'SPACE_AROUND',
    'space-evenly': 'SPACE_EVENLY',
};

const alignItemsMapping: Record<string, CounterAxisAlignItems> = {
    'flex-start': 'MIN',
    'flex-end': 'MAX',
    center: 'CENTER',
    baseline: 'BASELINE',
    stretch: 'FILL',
};

/**
 * Sets Auto Layout properties for a layer based on computed styles.
 * @param {WithMeta<LayerNode>} layer - The layer to set Auto Layout properties for.
 * @param {CSSStyleDeclaration} computedStyles - The computed styles of the layer.
 * @returns {void}
 */
export function setAutoLayoutProps(
    layer: WithMeta<LayerNode>,
    computedStyles: CSSStyleDeclaration
): void {
    // Initialize default FlexProps
    const flexProps = {
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
        alignContent: 'stretch',
        alignSelf: 'auto',
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
        flexGrow,
        width,
        height,
    } = computedStyles;

    // Set layoutMode based on display and flexDirection
    if (display === 'flex') {
        flexProps.layoutMode =
            flexDirection === 'row' ? 'HORIZONTAL' : 'VERTICAL';
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

    // Set layoutSizingVertical and layoutSizingHorizontal based on width
    if (width.endsWith('%')) {
        flexProps.layoutSizingHorizontal = 'FILL';
    } else if (width.endsWith('px')) {
        flexProps.layoutSizingHorizontal = 'FIXED';
    } else {
        flexProps.layoutSizingHorizontal = 'HUG';
    }

    // Set layoutSizingVertical based on height
    if (height.endsWith('%')) {
        flexProps.layoutSizingVertical = 'FILL';
    } else if (height.endsWith('px')) {
        flexProps.layoutSizingVertical = 'FIXED';
    } else {
        flexProps.layoutSizingVertical = 'HUG';
    }
    flexProps.layoutSizingVertical = 'HUG';

    // Set padding values
    flexProps.paddingTop = parseInt(paddingTop, 10) || DEFAULT_PADDING;
    flexProps.paddingRight = parseInt(paddingRight, 10) || DEFAULT_PADDING;
    flexProps.paddingBottom = parseInt(paddingBottom, 10) || DEFAULT_PADDING;
    flexProps.paddingLeft = parseInt(paddingLeft, 10) || DEFAULT_PADDING;

    // Set layoutGrow
    layer.layoutGrow = parseInt(flexGrow, 10) || 0;

    // Set minHeight, maxHeight, minWidth, maxWidth only if they are explicitly set
    flexProps.minHeight =
        parseFloat(computedStyles.getPropertyValue('min-height')) || undefined;
    flexProps.maxHeight =
        parseFloat(computedStyles.getPropertyValue('max-height')) || undefined;
    flexProps.minWidth =
        parseFloat(computedStyles.getPropertyValue('min-width')) || undefined;
    flexProps.maxWidth =
        parseFloat(computedStyles.getPropertyValue('max-width')) || undefined;

    // Set layoutWrap based on flexWrap when layoutMode is HORIZONTAL
    if (flexProps.layoutMode === 'HORIZONTAL') {
        flexProps.layoutWrap = flexWrap === 'wrap' ? 'WRAP' : 'NO_WRAP';
    }

    // Assign flexProps to the layer
    Object.assign(layer, flexProps);
}
