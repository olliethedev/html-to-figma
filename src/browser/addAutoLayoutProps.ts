import {
    CounterAxisAlignItems,
    FlexDirection,
    LayerNode,
    PrimaryAxisAlignItems,
    WithMeta,
    WRAP_MODE,
} from '../types';

export function setAutoLayoutProps(
    layer: WithMeta<LayerNode>,
    computedStyles: CSSStyleDeclaration
): void {
    const flexProps: {
        layoutMode: FlexDirection;
        itemSpacing: number;
        counterAxisSpacing: number;
        primaryAxisAlignItems: PrimaryAxisAlignItems;
        counterAxisAlignItems: CounterAxisAlignItems;
        layoutWrap: WRAP_MODE;
        layoutSizingVertical: 'FIXED' | 'HUG' | 'FILL';
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
    } = {
        layoutMode: 'HORIZONTAL',
        itemSpacing: 0,
        counterAxisSpacing: 0,
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        layoutWrap: 'NO_WRAP',
        layoutSizingVertical: 'HUG',
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
    };

    const display = computedStyles.getPropertyValue('display');
    const gap = computedStyles.getPropertyValue('gap');
    const justifyContent = computedStyles.getPropertyValue('justify-content');
    const alignItems = computedStyles.getPropertyValue('align-items');
    const flexDirection = computedStyles.getPropertyValue('flex-direction');
    const flexWrap = computedStyles.getPropertyValue('flex-wrap');
    const paddingTop = computedStyles.getPropertyValue('padding-top');
    const paddingRight = computedStyles.getPropertyValue('padding-right');
    const paddingBottom = computedStyles.getPropertyValue('padding-bottom');
    const paddingLeft = computedStyles.getPropertyValue('padding-left');

    if (display === 'flex')
        flexProps.layoutMode =
            flexDirection === 'row' ? 'HORIZONTAL' : 'VERTICAL';

    // handling gap

    if (gap && gap !== 'normal') {
        const gapValues = gap
            .trim()
            .split(' ')
            .map((value) => parseInt(value, 10));
        if (gapValues.length === 1) {
            // if only one value is provided, it is used for both axes
            flexProps.itemSpacing = gapValues[0];
            flexProps.counterAxisSpacing = gapValues[0];
        } else if (gapValues.length === 2) {
            // if two values are provided, the first is used for the primary axis and the second for the counter axis
            flexProps.itemSpacing =
                flexProps.layoutMode === 'HORIZONTAL'
                    ? gapValues[0]
                    : gapValues[1];
            flexProps.counterAxisSpacing =
                flexProps.layoutMode === 'HORIZONTAL'
                    ? gapValues[1]
                    : gapValues[0];
        }
    }
    switch (justifyContent) {
        case 'flex-start':
            flexProps.primaryAxisAlignItems = 'MIN';
            break;
        case 'flex-end':
            flexProps.primaryAxisAlignItems = 'MAX';
            break;
        case 'center':
            flexProps.primaryAxisAlignItems = 'CENTER';
            break;
        case 'space-between':
            flexProps.primaryAxisAlignItems = 'SPACE_BETWEEN';
            break;
        case 'space-around':
            flexProps.primaryAxisAlignItems = 'SPACE_AROUND';
            break;
        case 'space-evenly':
            flexProps.primaryAxisAlignItems = 'SPACE_EVENLY';
            break;
    }

    switch (alignItems) {
        case 'flex-start':
            flexProps.counterAxisAlignItems = 'MIN';
            break;
        case 'flex-end':
            flexProps.counterAxisAlignItems = 'MAX';
            break;
        case 'center':
            flexProps.counterAxisAlignItems = 'CENTER';
            break;
        case 'baseline':
            flexProps.counterAxisAlignItems = 'BASELINE';
            break;
        case 'stretch':
            flexProps.counterAxisAlignItems = 'FILL';
            break;
    }

    flexProps.paddingTop = parseInt(paddingTop, 10);
    flexProps.paddingRight = parseInt(paddingRight, 10);
    flexProps.paddingBottom = parseInt(paddingBottom, 10);
    flexProps.paddingLeft = parseInt(paddingLeft, 10);

    if (flexProps.layoutMode === 'HORIZONTAL') {
        flexProps.layoutWrap = flexWrap === 'wrap' ? 'WRAP' : 'NO_WRAP';
    }
    layer = Object.assign(layer, flexProps);
}
