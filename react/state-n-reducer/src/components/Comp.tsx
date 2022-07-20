import React, { useState, useReducer } from 'react';
import Graph from "./graph/Graph";

type Obj = {
    name: string;
    count: number;
};

const initialObj: Obj = {
    name: 'james',
    count: 0,
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'increment':
            state.count = state.count + 1
            return { ...state};
        default:
            throw new Error('no dispatch type');
    }
}

const Comp = () => {
    const [word, setWord] = useState('hi');
    const [obj, dispatchObj] = useReducer(reducer, initialObj)
    const [startDate, setStartDate] = useState(new Date('2022-05-11'));
    const [endDate, setEndDate] = useState(new Date('2022-06-11'));

    return (
        <div>
            <h1>Comp</h1>
            <div>
                <h3>State</h3>
                <div>{word}</div>
                <input type="text" value={word} onChange={(e) => setWord(e.target.value)}/>
            </div>
            <div>
                <h3>Reducer</h3>
                <div>{JSON.stringify(obj)}</div>
                <div>
                    <h5>Buttons</h5>
                    <button onClick={() => dispatchObj({type: 'increment'})}>increment</button>
                    <button>reset</button>
                </div>
            </div>
            <div>
                <h3>Graph</h3>
                <div>
                    <div>
                        <span>{startDate.toUTCString()}</span>
                        <input type="datetime-local" value={startDate.toUTCString()} onChange={(e) => setStartDate(new Date(e.target.value))}/>
                    </div>
                    <div>
                        <span>{endDate.toUTCString()}</span>
                        <input type="datetime-local" value={endDate.toUTCString()} onChange={(e) => setEndDate(new Date(e.target.value))}/>
                    </div>
                    <button onClick={() => {

                    }}>apply date change</button>
                </div>
                <Graph period={[startDate, endDate]} />
            </div>
        </div>
    );
};
export default Comp;