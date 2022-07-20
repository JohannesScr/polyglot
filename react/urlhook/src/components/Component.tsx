import React, { useState } from 'react';
import { useURLHook } from '../hooks/urlHook';

const Component: React.FunctionComponent<{}> = () => {
    console.log('render component')
    const { url, setSearchParam } = useURLHook();

    const [tags, setTags] = useState<string | undefined>(url.tags?.join(','));
    const [path, setPath] = useState<string | undefined>(url.path);

    const onClick = () => {
        const newTags = tags?.split(',')
        console.log('newTags', newTags);

        setSearchParam({ tags: newTags, path: path });
        // setSearchParam({ tags: newTags });
        // setSearchParam({ path: path });
    };

    return (
        <div>
            <div>component</div>
            <div>
                <p>url params</p>
            </div>
            <div>
                <label htmlFor="tags"></label>
                <input id="tags" type="text" onChange={(e) => { setTags(e.target.value) }} value={tags} />
            </div>
            <div>
                <label htmlFor="path"></label>
                <input id="path" type="text" onChange={(e) => { setPath(e.target.value) }} value={path} />
            </div>
            <div>
                <button onClick={onClick}>add search params</button>
            </div>
        </div>
    )
};

export default Component;