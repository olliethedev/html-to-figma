# html-to-figma-auto-layout

Converts DOM nodes to Figma nodes with extended support for adding AutoLayout

Improved [https://github.com/sergcen/html-to-figma](https://github.com/sergcen/html-to-figma).

_DEMO_: [html-to-figma-auto-layout DEV-plugin](https://www.figma.com/community/plugin/1331945921486030669/html-to-figma-auto-layout-dev-plugin)


## Integration Steps

To integrate Auto Layout into your project, follow these steps:

### 1. Identify Auto Layout Elements

Determine which HTML elements should use Auto Layout. Add the `data-auto-layout="true"` attribute to these elements.

```html
<div data-auto-layout="true">
  <!-- Your Auto Layout content goes here -->
</div>
```
