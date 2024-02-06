# html-to-figma-auto-layout

Converts DOM nodes to Figma nodes with extended support for auto-layouts.

Modified fork of [https://github.com/sergcen/html-to-figma](https://github.com/sergcen/html-to-figma) which was inspired by  [https://github.com/BuilderIO/figma-html](https://github.com/BuilderIO/figma-html)

Example: `/dev-plugin`

```npm i html-figma```

## USAGE

### Browser
```js
import { htmlTofigma } from 'html-figma/browser';

const element = document.getElementById('#element-to-export');

const layersMeta = await htmlTofigma(element);
```

### Figma
```js
import { addLayersToFrame } from 'html-figma/figma';

const rootNode = figma.currentPage;

await addLayersToFrame(layersMeta, rootNode);
```


