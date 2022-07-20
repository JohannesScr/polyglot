import React from 'react';
import { useURLHook } from "../hooks/urlHook";


const Footer: React.FunctionComponent = () => {
    const { url } = useURLHook();
    const x = url.periods;
    console.log("I shall rerender");
    return(
        <div>
            <h5>Footer</h5>
            <p>I simply import the read some search params from the url</p>
            <p>"{ JSON.stringify(x, null, 4) }"</p>
        </div>
    );
};

export default Footer;
