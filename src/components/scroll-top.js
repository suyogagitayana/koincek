import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'react-feather';

// tailwind css classes
const DEFAULT_CLASSES = 'cursor-pointer bg-white rounded-3xl p-4 fixed bottom-8 right-4';

const ScrollTop = ({
    className = DEFAULT_CLASSES,
    style = {},
    iconSize = 18,
    treshold = 200
}) => {
    const [show, setShow] = useState(false);
    const elementRef = useRef();

    useEffect(() => {
        const onScroll = () => window.scrollY >= treshold ? setShow(true) : setShow(false);

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const goTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return show && (
        <div
            className={className}
            style={style}
            onClick={goTop}
            ref={elementRef}
        >
            <ChevronUp size={iconSize} />
        </div>
    );
};

export default ScrollTop;