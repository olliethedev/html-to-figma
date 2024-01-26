# html-to-figma-auto-layout

Converts DOM nodes to Figma nodes with extended support for adding AutoLayout

Improved [https://github.com/sergcen/html-to-figma](https://github.com/sergcen/html-to-figma).

_DEMO_: [html-to-figma-auto-layout DEV-plugin](https://www.figma.com/community/plugin/1331945921486030669/html-to-figma-auto-layout-dev-plugin)

## Contributions made by me
- added support for a data attribute (`data-auto-layout`) which is used to mark elements for auto-layout.
- when the `flag` is set to `true`, then the `autoLayoutProps` are applied to the current frame.
- This schema represents the various properties that the setAutoLayoutProps function sets on the AutoLayoutProps object.
```js
type FlexDirection = 'HORIZONTAL' | 'VERTICAL';
type PrimaryAxisAlignItems = 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN' | 'SPACE_AROUND' | 'SPACE_EVENLY';
type CounterAxisAlignItems = 'MIN' | 'MAX' | 'CENTER' | 'BASELINE' | 'FILL';

interface AutoLayoutProps {
  layoutMode: FlexDirection;
  itemSpacing: number;
  counterAxisSpacing: number;
  primaryAxisAlignItems: PrimaryAxisAlignItems;
  counterAxisAlignItems: CounterAxisAlignItems;
  layoutWrap: WRAP_MODE; // Add the appropriate type for layout wrap if applicable
  layoutSizingVertical: 'FIXED' | 'HUG' | 'FILL';
  layoutSizingHorizontal: 'FIXED' | 'HUG' | 'FILL';
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  alignContent: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch';
  alignSelf: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}
  ```
- support for min/max height/width
- support for all formats of applying `gap` and `padding`
- alignment such as `justify-content`, `align-items`, `align-contents`, etc are mapped properly
- every property follows `flex-direction` rule
- mapped flexbox properties to autoLayout props with error handling
- full backward compatibility
- tested with various levels of nesting and different combination of properties
- all the test layouts can be found in the `examples folder`

## How I did it

## Integration Steps

To integrate Auto Layout into your project, follow these steps:

### 1. Identify Auto Layout Elements

Determine which HTML elements should use Auto Layout. Add the `data-auto-layout="true"` attribute to these elements.

```html
<div data-auto-layout="true">
  <!-- Your Auto Layout content goes here -->
</div>
```
