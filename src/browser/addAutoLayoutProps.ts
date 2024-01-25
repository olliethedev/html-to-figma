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
    computedStyles: CSSStyleDeclaration,
): void {
    const flexProps: {
        layoutMode: FlexDirection;
        itemSpacing: number;
        primaryAxisAlignItems: PrimaryAxisAlignItems;
        counterAxisAlignItems: CounterAxisAlignItems;
        layoutWrap: WRAP_MODE;
    } = {
        layoutMode: 'HORIZONTAL',
        itemSpacing: 0,
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        layoutWrap: 'NO_WRAP',
    };

    const display = computedStyles.getPropertyValue('display');
    const gap = computedStyles.getPropertyValue('gap');
    const justifyContent = computedStyles.getPropertyValue('justify-content');
    const alignItems = computedStyles.getPropertyValue('align-items');
    const flexDirection = computedStyles.getPropertyValue('flex-direction');
    const flexWrap = computedStyles.getPropertyValue('flex-wrap');

    if (display === 'flex')
        flexProps.layoutMode =
            flexDirection === 'row' ? 'HORIZONTAL' : 'VERTICAL';

    if (gap && gap !== 'normal') flexProps.itemSpacing = parseInt(gap, 10);

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

    if (flexProps.layoutMode === 'HORIZONTAL') {
        flexProps.layoutWrap = flexWrap === 'wrap' ? 'WRAP' : 'NO_WRAP';
    }

    layer = Object.assign(layer, flexProps);
}
