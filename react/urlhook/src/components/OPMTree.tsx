import React from 'react';
import {useURLHook} from "../hooks/urlHook";

const OPMList = () => {
    const {url, params} = useURLHook();
    console.log('OPM: params:', params);
    console.log('OPM: url:', url);
    return (
        <div>
            opm list
        </div>
    )
};

export default OPMList;