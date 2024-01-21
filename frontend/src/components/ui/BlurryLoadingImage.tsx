import { useEffect, useState } from 'react';

const BlurryLoadingImage = ({
    image,
    alt,
    imageStyleClass = '',
    divStyleClass = '',
    bgColor = 'transparent',
}: {
    image: string,
    alt: string,
    imageStyleClass?: string,
    divStyleClass?: string,
    bgColor?: string,
}) => {
    const previewPath = `${image.split('.')[0]}-preview.${image.split('.')[1]}`;
    const [currentImage, setCurrentImage] = useState(previewPath);
    const [loading, setLoading] = useState(true);

    const fetchImage = (src: string) => {
        const loadingImage = new Image();
        loadingImage.src = src;
        loadingImage.onload = () => {
            setCurrentImage(loadingImage.src);
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchImage(image);
    }, [image]);

    return (
        <div className={divStyleClass} style={{ overflow: 'hidden' }}>
            <img
                style={{
                    filter: `${loading ? 'blur(20px)' : ''}`,
                    transition: '1s filter linear',
                    width: '100%',
                    background: bgColor,
                }}
                src={currentImage}
                alt={alt}
                className={imageStyleClass}
            />
        </div>
    );
};

export default BlurryLoadingImage;