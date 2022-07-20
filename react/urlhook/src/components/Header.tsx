import React from 'react';
import {useURLHook} from "../hooks/urlHook";

const Header = () => {
    const {navigate, params} = useURLHook();

    console.log('headers params', params);

    const navApp = () => {
        navigate({
            path: '/app/:app',
            params: {
                app: 's3'
            },
        })
    }

    const navAF = () => {
        navigate({
            path: '/app/:app',
            params: {
                app: 'af'
            },
        })
    }

    const navOpm = () => {
        navigate({
            path: '/app/:app',
            params: {
                app: 'opm'
            },
        })
    }

    const navHome = () => {
        navigate({path: '/'})
    }

    return (
        <div style={{display: 'flex'}}>
            <button onClick={navHome}>home</button>
            <button onClick={navApp}>s3</button>
            <button onClick={navAF}>af</button>
            <button onClick={navOpm}>opm</button>
        </div>
    )
}

export default Header;