import React from 'react';

export type XAxis = {
    range: Date[];
}

/**
 * Layout design implementation is that the layout should be computed just
 * before render. That is because when the layout is updated and the plot
 * is updated, the layout object can easily be constructed.
 * */
export type Layout = {
    dragmode: 'select' | 'pan';
    xaxis: XAxis;
};

/**
 * defaultXAxis is the default xaxis object.
 * */
export const defaultXAxis = {
    range: []
};

/**
 * initXAxis initialises the xaxis object based on the options passed
 * */
export const initXAxis = (o: Partial<XAxis>):XAxis => {
    return {
        ...defaultXAxis,
        ...o,
    };
};

/**
 * xaxisReducer used to reduce the layout
 * TODO: Learn how to make it a typed reducer
 * */
export const xaxisReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'range':
            return {
                ...state,
                range: action.payload,
            };
        default:
            throw new Error(`xaxisReducer has no type: ${action.type}`);
    }
}
