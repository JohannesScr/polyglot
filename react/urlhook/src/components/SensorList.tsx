import React from 'react';
import {useURLHook} from "../hooks/urlHook";

const SensorList = () => {
    const {url, params, navigate} = useURLHook();

    const navApp = () => {
        navigate({
            path: '/app/:app',
            params: {
                app: 's343'
            },
        })
    }

    const navHome = () => {
        navigate({path: '/'})
    }

    return (
        <div>
            <h3>{params.app}</h3>
            <button onClick={navApp}>change page</button>
            <button onClick={navHome}>home</button>
        </div>
    )
};

export default SensorList;