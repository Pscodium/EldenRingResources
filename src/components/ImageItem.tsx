import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface ImageProps {
    src?: string | null;
    style?: StyleProp<ImageStyle> | undefined;
}

export default function ImageItem({ src, style }: ImageProps) {

    const FALLBACK_IMAGE = 'https://developers.google.com/static/maps/documentation/maps-static/images/error-image-generic.png';
    const [source, setSource] = useState('');

    function loadFallback() {
        setSource(FALLBACK_IMAGE);
    }

    useEffect(() => {
        if(src) {
            setSource(src);
            return;
        }
        setSource(FALLBACK_IMAGE);
    }, [src]);

    return (
        <Image source={{uri: source}} onError={loadFallback} style={style} />
    );
}
