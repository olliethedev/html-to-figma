import * as monaco from 'monaco-editor';
import { htmlToFigma, setContext } from '../../src/browser';
import throttle from 'lodash.throttle';
import { LayerNode } from '../../src/types';

const sendToFigma = (layers: LayerNode) => {
    window.parent.postMessage(
        {
            pluginMessage: {
                type: 'import',
                data: {
                    layers,
                },
            },
        },
        '*',
    );
};

// @ts-ignore
self.MonacoEnvironment = {
    // @ts-ignore
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return './json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return './css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return './html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.js';
        }
        return './editor.worker.js';
    },
};

document.addEventListener('DOMContentLoaded', function () {
    const editor = monaco.editor.create(
        document.getElementById('editor-container') as HTMLElement,
        {
            value: `
            <!DOCTYPE html>
<html>
<head>
    <title>Flexbox Permutations</title>
    <style>
        body{
            background-color: #fff;
        }
        .flex-container {
            display: flex;
            padding: 10px;
            margin: 10px;
            border: 1px solid #ddd;
            gap: 5px;
        }
        .flex-item {
            padding: 10px;
            border: 1px solid black;
            text-align: center;
        }
    </style>
</head>
<body>

<h2>Flex Direction</h2>
<h3>Row</h3>
<div class="flex-container" style="flex-direction: row;">
    <div class="flex-item">A</div>
    <div class="flex-item">B</div>
    <div class="flex-item">C</div>
</div>

<h3>Column</h3>
<div class="flex-container" style="flex-direction: column;">
    <div class="flex-item">D</div>
    <div class="flex-item">E</div>
    <div class="flex-item">F</div>
</div>

<h2>Justify Content</h2>
<h3>Center</h3>
<div class="flex-container" style="justify-content: center;">
    <div class="flex-item">G</div>
    <div class="flex-item">H</div>
    <div class="flex-item">I</div>
</div>

<h3>Space Between</h3>
<div class="flex-container" style="justify-content: space-between;">
    <div class="flex-item">J</div>
    <div class="flex-item">K</div>
    <div class="flex-item">L</div>
</div>

<h3>Start</h3>
<div class="flex-container" style="justify-content: flex-start;">
    <div class="flex-item">M</div>
    <div class="flex-item">N</div>
    <div class="flex-item">O</div>
</div>

<h3>End</h3>
<div class="flex-container" style="justify-content: flex-end;">
    <div class="flex-item">P</div>
    <div class="flex-item">Q</div>
    <div class="flex-item">R</div>
</div>

<h3>Space Around</h3>
<div class="flex-container" style="justify-content: space-around;">
    <div class="flex-item">S</div>
    <div class="flex-item">T</div>
    <div class="flex-item">U</div>
</div>

<h2>Align Items</h2>
<h3>Flex Start</h3>
<div class="flex-container" style="align-items: flex-start; height: 200px;">
    <div class="flex-item">V</div>
    <div class="flex-item">W</div>
    <div class="flex-item">X</div>
</div>

<h3>Flex End</h3>
<div class="flex-container" style="align-items: flex-end; height: 200px;">
    <div class="flex-item">Y</div>
    <div class="flex-item">Z</div>
    <div class="flex-item">1</div>
</div>

<h3>Center</h3>
<div class="flex-container" style="align-items: center; height: 200px;">
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <div class="flex-item">4</div>
</div>
<h2>Justinfy And Align</h2>
<h3>Space Between and Center</h3>
<div class="flex-container" style="justify-content: space-between; align-items: center; height: 200px;">
    <div class="flex-item">5</div>
    <div class="flex-item">6</div>
    <div class="flex-item">7</div>
</div>
<h3>Center and Center</h3>
<div class="flex-container" style="justify-content: center; align-items: center; height: 200px;">
    <div class="flex-item">8</div>
    <div class="flex-item">9</div>
    <div class="flex-item">10</div>
</div>
<!-- Flex Grow, Shrink, Basis -->
<h2>Flex Grow, Shrink, Basis</h2>
<h3>Horizontal</h3>
<div class="flex-container">
    <div class="flex-item" style="flex-grow: 1;">A1</div>
    <div class="flex-item" style="flex-shrink: 2;">B2</div>
    <div class="flex-item" style="flex-basis: 70px;">C3</div>
</div>
<h3>Vertical</h3>
<div class="flex-container" style="flex-direction: column; height: 200px;">
    <div class="flex-item" style="flex-grow: 1;">A1</div>
    <div class="flex-item" style="flex-shrink: 2;">B2</div>
    <div class="flex-item" style="flex-basis: 70px;">C3</div>
</div>
<!-- Flex Wrap -->
<h2>Flex Wrap</h2>
<h3>Wrap Percent</h3>
<div class="flex-container" style="flex-wrap: wrap;">
    <div class="flex-item" style="width:25%;">A</div>
    <div class="flex-item" style="width:25%;">B</div>
    <div class="flex-item" style="width:25%;">C</div>
    <div class="flex-item" style="width:25%;">D</div>
    <div class="flex-item" style="width:25%;">E</div>
</div>

<h3>Wrap Fixed Width</h3>
<div class="flex-container" style="flex-wrap: wrap;">
    <div class="flex-item" style="width:100px;">A</div>
    <div class="flex-item" style="width:100px;">B</div>
    <div class="flex-item" style="width:100px;">C</div>
    <div class="flex-item" style="width:100px;">D</div>
    <div class="flex-item" style="width:100px;">E</div>
</div>


</body>
</html>

`.trim(),
            language: 'html',
        },
    );

    const frame = document.getElementById(
        'iframe-sandbox',
    ) as HTMLIFrameElement;

    if (!frame || !frame.contentWindow) return;

    const updateFigma = throttle(async () => {
        setContext(frame.contentWindow as Window);
        //@ts-ignore
        const res = await htmlToFigma(frame.contentDocument.body, true);
        console.log(res);
        sendToFigma(res);
    }, 500);

    frame?.contentDocument?.addEventListener('DOMContentLoaded', async () => {
        setTimeout(() => {
            updateFigma();
        }, 1000);
    });

    const updateSandbox = async () => {
        frame.srcdoc = editor.getValue();
        setTimeout(updateFigma, 500);
        // updateFigma();
    };

    editor.onDidChangeModelContent((e) => {
        updateSandbox();
    });

    setTimeout(updateSandbox, 500);
});
