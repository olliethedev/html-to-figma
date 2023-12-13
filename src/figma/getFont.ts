const fontCache: { [key: string]: FontName | undefined } = {};

const normalizeName = (str: string) =>
    str.toLowerCase().replace(/[^a-z]/gi, '');

export const defaultFont = (style: string = 'Regular') => ({ family: 'Roboto', style });

let cachedAvailableFonts: Font[] | null = null;

const getAvailableFontNames = async () => {
    if (cachedAvailableFonts) {
        return cachedAvailableFonts;
    } else {
        return (await figma.listAvailableFontsAsync()).filter(
            (font: Font) => font.fontName.style === 'Regular'
        );
    }
}

// TODO: keep list of fonts not found
export async function getMatchingFont(fontStr: string, fontStyle: string = 'Regular') {
    const cached = fontCache[`${fontStr}-${fontStyle}`];
    if (cached) {
        return cached;
    }

    const availableFonts = await getAvailableFontNames();
    const familySplit = fontStr.split(/\s*,\s*/);

    for (const family of familySplit) {
        const normalized = normalizeName(family);
        for (const availableFont of availableFonts) {
            const normalizedAvailable = normalizeName(availableFont.fontName.family);
            if (normalizedAvailable === normalized && availableFont.fontName.style === fontStyle) {
                const cached = fontCache[`${normalizedAvailable}-${fontStyle}`];
                if (cached) {
                    return cached;
                }
                await figma.loadFontAsync(availableFont.fontName);
                fontCache[`${fontStr}-${fontStyle}`] = availableFont.fontName;
                fontCache[`${normalizedAvailable}-${fontStyle}`] = availableFont.fontName;
                return availableFont.fontName;
            }
        }
    }

    const defaultFontToUse = defaultFont(fontStyle);
    await figma.loadFontAsync(defaultFontToUse);
    return defaultFontToUse;
}