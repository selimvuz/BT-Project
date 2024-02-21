// LordIcon.js
import React, { useEffect } from 'react';

const LordIcon = ({ src, trigger, style, onClick }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.lordicon.com/xdjxvujz.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <lord-icon
            src={src}
            trigger={trigger}
            style={style}
            onClick={onClick} // onClick prop'unu buraya ekleyin
        >
        </lord-icon>
    );
};

export default LordIcon;
