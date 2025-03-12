import { useEffect, useState } from "react";

export const useImageReady = (imageSource: string | undefined): boolean => {

    const [imageReady, setImageReady] = useState(false);

    useEffect(() => {

        if (!imageSource) {
            return;
        }

        const image = new Image();
        image.src = imageSource;

        image.onload = () => {
            setImageReady(true);
        }

    }, [imageSource]);

    return imageReady;

}