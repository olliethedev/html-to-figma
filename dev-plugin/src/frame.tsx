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
            <html>
    <head>
        <style>
            .flex{
              display:flex;
              gap:1rem;
            }
        </style
    </head>
    <body id="container">
        <div class="flex" data-auto-layout="true">
            <button>Click</button>
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
