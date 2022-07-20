import '@testing-library/jest-dom'
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import {renderHook} from '@testing-library/react'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'

import { useURLHook } from "./urlHook";


const TestComponent = () => {
    const {url, setSearchParam} = useURLHook();
    const toString = (x: any) => {
        return JSON.stringify(x);
    }
    return (
        <div>
            <p data-testid="path">{toString(url.path)}</p>
            <p data-testid="periods">{toString(url.periods)}</p>
        </div>
    );
}

const TestApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TestComponent />}/>
                <Route path="/app/:app" element={<TestComponent />}/>
                <Route path="/resource/:app" element={<TestComponent />}/>
            </Routes>
        </BrowserRouter>
    );
}

describe('useURLHook', () => {
    it('should by default have no search params', () => {
        render(<TestApp />)

        expect(screen.findByTestId('path')).toHaveTextContent('undefined')
        expect(screen.findByTestId('periods')).toHaveTextContent('undefined')
    });
});