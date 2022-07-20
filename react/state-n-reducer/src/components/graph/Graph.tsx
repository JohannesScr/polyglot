import React, {useReducer} from 'react';
import {Layout, xaxisReducer, defaultXAxis, initXAxis} from "./utils";

const initalLayout: Layout = {
    dragmode: 'select',
    xaxis: {
        range: []
    }
}

type GraphProps = {
    period: Date[],
}

const Graph: React.FunctionComponent<GraphProps> = (props) => {
    // defaultXAxis should be passed or computed from props.
    // initXAxis is the function to set the state based on the defaultXAxis from props.
    const [xaxis, dispatchXAxis] = useReducer(xaxisReducer, {
        range: props.period
    }, initXAxis);

    const layout: Layout = {
        dragmode: 'select',
        xaxis: xaxis,
    };
    return (
        <div>
            <div>
                Graph: {JSON.stringify(layout)}
            </div>
        </div>
    )
};

export default Graph;