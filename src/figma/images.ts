import { getImageFills } from "../utils";

export async function processImages(layer: RectangleNode | TextNode) {
    const images = getImageFills(layer);
    return (
        images &&
        Promise.all(
            images.map(async (image: any) => {
                if (image && image.intArr) {
                    const fixedArr = new Uint8Array(Object.values(image.intArr));
                    const hash = await figma.createImage(fixedArr ).hash;
                    image.imageHash = hash;
                    delete image.intArr;
                }
            })
        )
    );
}
