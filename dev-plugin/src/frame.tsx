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
        '*'
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
            <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                  font-family: 'Inter', sans-serif;
                }
              </style>
              <style>
        .gradient-up {
            background: linear-gradient(to top, #ff0000 0%, #00ff00 50%, #0000ff 100%);
            width: 100px;
            height: 100px;
            margin: 10px;
        }
        .gradient-down {
            background: linear-gradient(to bottom, #ff0000 0%, #00ff00 50%, #0000ff 100%);
            width: 100px;
            height: 100px;
            margin: 10px;
        }
        .gradient-left {
            background: linear-gradient(to left, #ff0000 0%, #00ff00 50%, #0000ff 100%);
            width: 100px;
            height: 100px;
            margin: 10px;
        }
        .gradient-right {
            background: linear-gradient(to right, #ff0000 0%, #00ff00 50%, #0000ff 100%);
            width: 100px;
            height: 100px;
            margin: 10px;
        }
        .radial1 {
            width: 100px;
            height: 100px;
            margin: 10px;
            background: radial-gradient(circle, #ff0000 0%, #00ff00 50%, #0000ff 100%);
          }
          .radial2 {
            width: 100px;
            height: 100px;
            margin: 10px;
            background: radial-gradient(circle at top, #ff0000, #00ff00, #0000ff);
          }
          .radial3 {
            width: 100px;
            height: 100px;
            margin: 10px;
            background: radial-gradient(circle at bottom, #ff0000, #00ff00, #0000ff);
          }
          .radial4 {
            width: 100px;
            height: 100px;
            margin: 10px;
            background: radial-gradient(circle at right, #ff0000, #00ff00, #0000ff);
          }
    </style>
            </head>
            <body id="container" class="bg-gray-100 p-10">
            <div class="flex">
                <div>
                Gradient direction to top
                <div class="gradient-up"></div>
                <div class="bg-gradient-to-t from-red-500 via-green-500 to-blue-500 w-48 h-48 my-4"></div>
                Gradient direction to bottom
                <div class="gradient-down"></div>
                <div class="bg-gradient-to-b from-red-500 via-green-500 to-blue-500 w-48 h-48 my-4"></div>
                Gradient direction to left
                <div class="gradient-left"></div>
                <div class="bg-gradient-to-l from-red-500 via-green-500 to-blue-500 w-48 h-48 my-4"></div>
                Gradient direction to right
                <div class="gradient-right"></div>
                <div class="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 w-48 h-48 my-4"></div>
                </div>
                <div>
                <div>
                <h2>Radial Gradients</h2>
                Radial Gradient 1
                <div class="gradient radial1"></div>
                Radial Gradient 2
                <div class="gradient radial2"></div>
                Radial Gradient 3
                <div class="gradient radial3"></div>
                Radial Gradient 4
                <div class="gradient radial4"></div>
                </div>
            </div>
            </body>
            </html>
`.trim(),
            language: 'html',
        }
    );

    const frame = document.getElementById(
        'iframe-sandbox'
    ) as HTMLIFrameElement;

    if (!frame || !frame.contentWindow) return;

    const updateFigma = throttle(async () => {
        setContext(frame.contentWindow as Window);
        //@ts-ignore
        const res = await htmlToFigma('#root,#container');

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
