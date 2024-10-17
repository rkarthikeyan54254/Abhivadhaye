import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
const AdComponent = ({ adSlot }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (e) {
            console.error('Error loading AdSense:', e);
        }
    }, []);
    return (_jsx("div", { className: "ad-container", children: _jsx("ins", { className: "adsbygoogle", style: { display: 'block' }, "data-ad-client": "ca-pub-1118721416381353", "data-ad-slot": adSlot, "data-ad-format": "auto", "data-full-width-responsive": "true" }) }));
};
export default AdComponent;
