import { memo, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const { width } = Dimensions.get('window');
const autoScrollInterval = 3000;

const sliderImages = [
    { id: 1, url: require('./images/slider_image_1.png') },
    { id: 2, url: require('./images/slider_image_2.png') },
    { id: 3, url: require('./images/slider_image_3.png') },
    { id: 4, url: require('./images/slider_image_4.png') },
    { id: 5, url: require('./images/slider_image_5.png') },
    { id: 6, url: require('./images/slider_image_6.png') },
    { id: 7, url: require('./images/slider_image_7.png') },
    { id: 8, url: require('./images/slider_image_8.png') },
    { id: 9, url: require('./images/slider_image_9.png') },
    { id: 10, url: require('./images/slider_image_10.png') },
    { id: 11, url: require('./images/slider_image_11.png') },
    { id: 12, url: require('./images/slider_image_12.png') },
    { id: 13, url: require('./images/slider_image_13.png') },
    { id: 14, url: require('./images/slider_image_14.png') },
    { id: 15, url: require('./images/slider_image_15.png') },
    { id: 16, url: require('./images/slider_image_16.png') },
    { id: 17, url: require('./images/slider_image_17.png') },
    { id: 18, url: require('./images/slider_image_18.png') },
    { id: 19, url: require('./images/slider_image_19.png') },
    { id: 20, url: require('./images/slider_image_20.png') },
    { id: 21, url: require('./images/slider_image_21.png') },
    { id: 22, url: require('./images/slider_image_22.png') },
    { id: 23, url: require('./images/slider_image_23.png') },
    { id: 24, url: require('./images/slider_image_24.png') },
];

const ImageSlider = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const startAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const newIndex = (activeIndexRef.current + 1) % sliderImages.length;
            setActiveIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
            });
        }, autoScrollInterval);
    };

    useEffect(() => {
        startAutoScroll();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / slideSize);

        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={sliderImages}
            renderItem={({ item }) => (
                <Image
                    source={item.url}
                    style={{
                        width,
                        height: 200,
                        resizeMode: 'cover'
                    }}
                />
            )}
            keyExtractor={item => item.id.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(_data, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
            onScrollBeginDrag={() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }}
            onMomentumScrollEnd={startAutoScroll}
            windowSize={3}
        />
    );
});


export default ImageSlider;
