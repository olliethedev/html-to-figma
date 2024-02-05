import * as monaco from 'monaco-editor';
import { htmlToFigma, setContext } from '../../src/browser';
import throttle from 'lodash.throttle';
import { LayerNode } from '../../src/types';

const simpleLayout= `
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
            margin: 2px;
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

`;
const complexTextLayout = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Improved Resource Center Section with Images</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <section class="bg-gray-50 py-12">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-semibold text-center text-gray-800 mb-4">Resource Center</h2>
            <p class="text-center text-gray-600 mb-8">Valuable insights and information to help you navigate employee health benefits</p>   
        </div>
    </section>
</body>
</html>
`;
const complexLayout = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Improved Resource Center Section with Images</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <section class="bg-gray-50 py-12">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-semibold text-center text-gray-800 mb-4">Resource Center</h2>
            <p class="text-center text-gray-600 mb-8">Valuable insights and information to help you navigate employee health benefits</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-center mb-4">
                        <img src="https://placehold.co/100x100" alt="A collection of guides and e-books related to health benefits" class="rounded-full">
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Guides & E-books</h3>
                    <p class="text-gray-600 mb-4">In-depth resources to deepen your understanding of health benefits.</p>
                    <a href="#" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-center mb-4">
                        <img src="https://placehold.co/100x100" alt="Infographics presenting data on health benefits planning" class="rounded-full">
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Infographics</h3>
                    <p class="text-gray-600 mb-4">Visual data to quickly grasp key aspects of benefits planning.</p>
                    <a href="#" class="text-green-500 hover:text-green-600 font-semibold">Learn More</a>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-center mb-4">
                        <img src="https://placehold.co/100x100" alt="Video tutorials on various health benefits topics" class="rounded-full">
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Video Tutorials</h3>
                    <p class="text-gray-600 mb-4">Engaging tutorials that walk you through various benefits topics.</p>
                    <a href="#" class="text-purple-500 hover:text-purple-600 font-semibold">Learn More</a>
                </div>
            </div>
            <div class="mt-2 flex gap-4 text-white text-sm font-bold font-mono leading-6 bg-stripes-pink rounded-lg">
                <div class="p-4 flex-none w-14 h-14 rounded-lg flex items-center justify-center bg-pink-300 dark:bg-pink-800 dark:text-pink-400">01</div>
                <div class="p-4 flex-1 w-64 rounded-lg flex items-center justify-center bg-pink-500 shadow-lg">02</div>
                <div class="p-4 flex-1 w-32 rounded-lg flex items-center justify-center bg-pink-500 shadow-lg">03</div>
            </div>
            <div class="flex gap-4 text-white text-sm font-bold font-mono leading-6 bg-stripes-indigo rounded-lg">
                <div class="flex-none last:pr-8 sm:last:pr-0">
                    <div class="p-4 w-14 h-14 rounded-lg flex items-center justify-center bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    01
                    </div>
                </div>
                <div class="flex-none last:pr-8 sm:last:pr-0">
                    <div class="p-4 w-72 rounded-lg flex items-center justify-center bg-indigo-500 shadow-lg">
                    02
                    </div>
                </div>
                <div class="flex-1 last:pr-8 sm:last:pr-0">
                    <div class="p-4 rounded-lg flex items-center justify-center bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    03
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>
`;

const complexLayout2 = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GroupHEALTH Landing Page</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<style>
  body {
    font-family: 'Open+Sans', sans-serif;
  }
  .benefit-icon {
    background-color: #189faa;
    color: #ffffff;
  }
</style>
</head>
<body class="bg-white">
  <section class="bg-f2f2f2">
    <div class="container mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-333333 mb-4">Benefits and Features</h2>
        <p class="text-md text-333333 mb-8">Explore the comprehensive range of benefits and features we offer</p>
      </div>
      <div class="flex flex-wrap -mx-4">
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
                <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Extended Health Care</h3>
            <p class="text-md text-333333">Covering prescriptions, vision care, and more for comprehensive health support.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
                <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Dental Care</h3>
            <p class="text-md text-333333">Dental plans that keep your smile bright and your dental health top-notch.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
            <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Vision Care</h3>
            <p class="text-md text-333333">Benefits to ensure your vision is always protected with regular check-ups and eyewear coverage.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
              <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Disability Coverage</h3>
            <p class="text-md text-333333">Providing financial security and peace of mind for employees facing disabilities.</p>
          </div>
        </div>
        <!-- Repeat for additional benefits and features as needed -->
      </div>
    </div>
  </section>
</body>
</html>
`

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
            value: simpleLayout.trim(),
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
