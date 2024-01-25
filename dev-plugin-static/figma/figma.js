(()=>{"use strict";function t(n,e,i=null){return o=this,r=void 0,c=function*(){if(n&&(yield e(n,i),(o=n)&&Array.isArray(o.children)))for(let i of n.children.reverse())yield t(i,e,n);var o},new((a=void 0)||(a=Promise))((function(t,n){function e(t){try{f(c.next(t))}catch(t){n(t)}}function i(t){try{f(c.throw(t))}catch(t){n(t)}}function f(n){var o;n.done?t(n.value):(o=n.value,o instanceof a?o:new a((function(t){t(o)}))).then(e,i)}f((c=c.apply(o,r||[])).next())}));var o,r,a,c}function n(t){return Array.isArray(t.fills)&&t.fills.filter((t=>"IMAGE"===t.type))}!function(t){if(!t)return null;const[n,e,i,o,r,a]=t.match(/rgba?\(([\d\.]+), ([\d\.]+), ([\d\.]+)(, ([\d\.]+))?\)/)||[],c=a&&0===parseFloat(a);e&&i&&o&&!c&&(parseInt(e),parseInt(i),parseInt(o),a&&parseFloat(a))}("rgba(178, 178, 178, 1)");var e=function(t,n,e,i){return new(e||(e=Promise))((function(o,r){function a(t){try{f(i.next(t))}catch(t){r(t)}}function c(t){try{f(i.throw(t))}catch(t){r(t)}}function f(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(a,c)}f((i=i.apply(t,n||[])).next())}))},i=function(t,n,e,i){return new(e||(e=Promise))((function(o,r){function a(t){try{f(i.next(t))}catch(t){r(t)}}function c(t){try{f(i.throw(t))}catch(t){r(t)}}function f(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(a,c)}f((i=i.apply(t,n||[])).next())}))};const o={},r=t=>t.toLowerCase().replace(/[^a-z]/gi,""),a=(t="Regular")=>({family:"Roboto",style:t});function c(t,n){for(const e in n){const i=n[e];if("data"===e&&i&&"object"==typeof i){const n=JSON.parse(t.getSharedPluginData("builder","data")||"{}")||{},e=i,o=Object.assign({},n,e);t.setSharedPluginData("builder","data",JSON.stringify(o))}else if(void 0!==i&&-1===["width","height","type","ref","children","svg"].indexOf(e))try{t[e]=n[e]}catch(i){console.warn(`Assign error for property "${e}"`,t,n,i)}}}const f=["FRAME","GROUP","SVG","RECTANGLE","COMPONENT"],l=(t,l,s)=>{return u=void 0,h=void 0,y=function*(){const u=(null==l?void 0:l.ref)||s;if("number"!=typeof t.x||"number"!=typeof t.y)throw Error("Layer coords not defined");const h=(t=>{if("FRAME"===t.type||"GROUP"===t.type)return figma.createFrame();if("SVG"===t.type&&t.svg){if(t.svg.startsWith("<svg"))return figma.createNodeFromSvg(t.svg);{let n=function(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";let e="",i=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");i<t.length;){const o=n.indexOf(t.charAt(i++)),r=n.indexOf(t.charAt(i++)),a=n.indexOf(t.charAt(i++)),c=n.indexOf(t.charAt(i++)),f=o<<2|r>>4,l=(15&r)<<4|a>>2,s=(3&a)<<6|c;e+=String.fromCharCode(f),64!=a&&(e+=String.fromCharCode(l)),64!=c&&(e+=String.fromCharCode(s))}return e}(t.svg);return n.startsWith("<svg")?figma.createNodeFromSvg(n):(console.warn("malformed svg"),console.warn(t.svg),figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#DDDDDD"/><path fill="#999999" d="M23.32 53.77h1.82v1.29h-5.6v-1.29h2.05v-5.91q0-.35.02-.72l-1.45 1.22q-.13.1-.25.12-.12.03-.23.01-.11-.02-.19-.08-.09-.05-.13-.11l-.55-.75 3.09-2.63h1.42v8.85ZM33.79 50q0 1.32-.29 2.3-.28.97-.78 1.61-.5.64-1.18.95-.69.31-1.48.31t-1.46-.31q-.68-.31-1.18-.95-.49-.64-.77-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.77-1.61.5-.64 1.18-.95.67-.31 1.46-.31.79 0 1.48.31.68.31 1.18.95.5.63.78 1.61.29.97.29 2.3ZM32 50q0-1.1-.16-1.82t-.43-1.15q-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.71.17-.35.17-.62.6-.26.43-.42 1.15-.16.72-.16 1.82t.16 1.82q.16.72.42 1.15.27.42.62.6.34.17.71.17.38 0 .73-.17.35-.18.62-.6.27-.43.43-1.15Q32 51.1 32 50Zm9.91 0q0 1.32-.29 2.3-.28.97-.78 1.61-.5.64-1.18.95-.69.31-1.48.31t-1.46-.31q-.68-.31-1.18-.95-.49-.64-.77-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.77-1.61.5-.64 1.18-.95.67-.31 1.46-.31.79 0 1.48.31.68.31 1.18.95.5.63.78 1.61.29.97.29 2.3Zm-1.79 0q0-1.1-.16-1.82t-.43-1.15q-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.71.17-.35.17-.62.6-.26.43-.42 1.15-.16.72-.16 1.82t.16 1.82q.16.72.42 1.15.27.42.62.6.34.17.71.17.38 0 .73-.17.35-.18.62-.6.27-.43.43-1.15.16-.72.16-1.82Zm12.9 2.74-.91.91-2.38-2.38-2.39 2.39-.92-.9 2.4-2.4-2.29-2.29.91-.91 2.29 2.29 2.26-2.27.93.91-2.28 2.27 2.38 2.38Zm9.59 1.03h1.82v1.29h-5.6v-1.29h2.05v-5.91q0-.35.02-.72l-1.46 1.22q-.12.1-.25.12-.12.03-.23.01-.11-.02-.19-.08-.08-.05-.13-.11l-.54-.75 3.09-2.63h1.42v8.85ZM73.07 50q0 1.32-.28 2.3-.29.97-.79 1.61-.5.64-1.18.95-.68.31-1.47.31-.79 0-1.47-.31-.67-.31-1.17-.95-.5-.64-.78-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.78-1.61.5-.64 1.17-.95.68-.31 1.47-.31.79 0 1.47.31.68.31 1.18.95.5.63.79 1.61.28.97.28 2.3Zm-1.78 0q0-1.1-.16-1.82-.17-.72-.43-1.15-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.72.17t-.61.6q-.27.43-.43 1.15-.15.72-.15 1.82t.15 1.82q.16.72.43 1.15.26.42.61.6.35.17.72.17.38 0 .73-.17.35-.18.62-.6.26-.43.43-1.15.16-.72.16-1.82Zm9.9 0q0 1.32-.28 2.3-.29.97-.79 1.61-.5.64-1.18.95-.68.31-1.47.31-.79 0-1.47-.31-.67-.31-1.17-.95-.5-.64-.78-1.61-.28-.98-.28-2.3 0-1.33.28-2.3.28-.98.78-1.61.5-.64 1.17-.95.68-.31 1.47-.31.79 0 1.47.31.68.31 1.18.95.5.63.79 1.61.28.97.28 2.3Zm-1.78 0q0-1.1-.16-1.82-.17-.72-.43-1.15-.27-.43-.62-.6-.35-.17-.73-.17-.37 0-.72.17t-.61.6q-.27.43-.43 1.15-.15.72-.15 1.82t.15 1.82q.16.72.43 1.15.26.42.61.6.35.17.72.17.38 0 .73-.17.35-.18.62-.6.26-.43.43-1.15.16-.72.16-1.82Z"/></svg>'))}}return"RECTANGLE"===t.type?figma.createRectangle():"TEXT"===t.type?figma.createText():"COMPONENT"===t.type?figma.createComponent():void 0})(t);if(!h)throw Error(`${t.type} not implemented`);if("RECTANGLE"!==t.type&&"FRAME"!==t.type||n(t)&&(yield function(t){return e(this,void 0,void 0,(function*(){const i=n(t);return i&&Promise.all(i.map((t=>e(this,void 0,void 0,(function*(){if(t&&t.intArr){const n=new Uint8Array(Object.values(t.intArr)),e=yield figma.createImage(n).hash;t.imageHash=e,delete t.intArr}})))))}))}(t)),f.includes(t.type)&&u.appendChild(((t,n)=>(n.x=t.x,n.y=t.y,n.resize(t.width||1,t.height||1),c(n,t),n))(t,h)),t.ref=h,"TEXT"===t.type){const n=h;if(t.fontFamily){const e={200:"Thin",300:"Light",400:"Regular",500:"Medium",600:"SemiBold",700:"Bold",800:"ExtraBold",900:"Black"}[t.fontWeight]||"Regular",c=yield function(t,n="Regular"){return i(this,void 0,void 0,(function*(){const e=o[`${t}-${n}`];if(e)return e;const c=yield i(void 0,void 0,void 0,(function*(){return(yield figma.listAvailableFontsAsync()).filter((t=>"Regular"===t.fontName.style))})),f=t.split(/\s*,\s*/);for(const e of f){const i=r(e);for(const e of c){const a=r(e.fontName.family);if(a===i&&e.fontName.style===n)return o[`${a}-${n}`]||(yield figma.loadFontAsync(e.fontName),o[`${t}-${n}`]=e.fontName,o[`${a}-${n}`]=e.fontName,e.fontName)}}const l=a(n);return yield figma.loadFontAsync(l),l}))}(t.fontFamily,e);n.fontName=c,delete t.fontWeight,delete t.fontFamily}c(n,t),n.resize(t.width||1,t.height||1),n.textAutoResize="HEIGHT";let e=0;for(t.lineHeight&&(n.lineHeight=t.lineHeight);"number"==typeof t.height&&n.height>t.height;){if(e++>10){console.warn("Too many font adjustments",n,t);break}try{n.resize(n.width+1,n.height)}catch(e){console.warn("Error on resize text:",t,n,e)}}u.appendChild(n)}return h},new((d=void 0)||(d=Promise))((function(t,n){function e(t){try{o(y.next(t))}catch(t){n(t)}}function i(t){try{o(y.throw(t))}catch(t){n(t)}}function o(n){var o;n.done?t(n.value):(o=n.value,o instanceof d?o:new d((function(t){t(o)}))).then(e,i)}o((y=y.apply(u,h||[])).next())}));var u,h,d,y};var s=function(t,n,e,i){return new(e||(e=Promise))((function(o,r){function a(t){try{f(i.next(t))}catch(t){r(t)}}function c(t){try{f(i.throw(t))}catch(t){r(t)}}function f(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(a,c)}f((i=i.apply(t,n||[])).next())}))};figma.showUI(__html__,{width:600,height:600});const u="HTML-TO-FIGMA RESULT";figma.ui.onmessage=n=>{return e=void 0,i=void 0,r=function*(){if("import"===n.type){yield figma.loadFontAsync(a());const{data:e}=n;let{layers:i}=e,o=figma.currentPage,r=o,c=0,f=0,h=figma.currentPage.findOne((t=>t.name===u));h&&(c=h.x,f=h.y),i.x=c,i.y=f,yield function(n,e,i){return s(this,void 0,void 0,(function*(){for(const o of n)yield t(o,((t,n)=>s(this,void 0,void 0,(function*(){try{const o=yield l(t,n,e);null==i||i({node:o,layer:t,parent:n})}catch(n){console.warn("Error on layer:",t,n)}}))))}))}([i],o,(({node:t,parent:n})=>{n||(r=t,t.name=u)})),null==h||h.remove()}},new((o=void 0)||(o=Promise))((function(t,n){function a(t){try{f(r.next(t))}catch(t){n(t)}}function c(t){try{f(r.throw(t))}catch(t){n(t)}}function f(n){var e;n.done?t(n.value):(e=n.value,e instanceof o?e:new o((function(t){t(e)}))).then(a,c)}f((r=r.apply(e,i||[])).next())}));var e,i,o,r}})();