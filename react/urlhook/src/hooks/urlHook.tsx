import {useSearchParams, useParams, useNavigate} from 'react-router-dom';

type IPeriod = {
    startDate: Date;
    endDate: Date;
};


/**
 * URLParams
 * */
type URLParams = {
    app?: string;
    user?: string;
};

/**
 * URLQueryParams
 * */
type URLQueryParams = {
    periods?: IPeriod[];
    path?: string;
    tags?: string[];
    timePoint?: Date;
};


/**
 * URLQueryParamKeys is an array of all the possible URL search params that
 * could be present
 */
type URLQueryParamKeys = keyof URLQueryParams;
const queryKeys: URLQueryParamKeys[] = ['path', 'tags', 'timePoint', 'periods'];

/**
 * TypeConversion
 */
interface TypeConversion {
    multiple: boolean;
    decode?: (v: string) => any;
    decodeArray?: (v: string[]) => any;
    encode: (v: any) => string | string[];
}

/**
 * periodToString converts a period into a string with format 
 * "yyyy-mm-ddTHH:MM:ssZ;yyyy-mm-ddTHH:MM:ssZ"
 */
const periodToString = (p: IPeriod) => {
    return `${p.startDate.toUTCString()};${p.endDate.toUTCString()}`
}
/**
 * periodToString converts a string with format 
 * "yyyy-mm-ddTHH:MM:ssZ;yyyy-mm-ddTHH:MM:ssZ" into a period
 */
const stringToPeriod = (v: string) => {
    const periodSplit = v.split(';');
    try {
        const period: IPeriod = {
            startDate: new Date(periodSplit[0]),
            endDate: new Date(periodSplit[1]),
        }
        return period;
    } catch (err) {
        console.error("Invalid date", err);
    }
}


/**
 * convert
 */
const convert = {
    // period conversion
    toPeriodArray: (v: string[]) => v.map((vi) => stringToPeriod(vi)),
    periodsToStringArray: (v: IPeriod[]) => v.map((vi) => periodToString(vi)),
    // other more generic conversions
    toDate: (v: string | never) => new Date(v),
    toDateArray: (v: string[]) => v.map((vi: string) => new Date(vi)),
    toNumber: (v: string) => Number(v),
    toNumberArray: (v: string[]) => v.map((vi: string) => Number(vi)),
    dateToString: (v: Date) => v.toISOString(),
    datesToStringArray: (v: Date[]) => v.map((vi: Date) => vi.toISOString()),
    directMap: (v: any) => v,
    voidMap: (v: any) => { },
}


/**
 * urlSearchParamConversion defines the specific type conversion for each
 * key when the parameter is NOT TYPED as a STRING or ARRAY of STRINGS.
 */
const urlSearchParamConversion: Record<URLQueryParamKeys, TypeConversion> = {
    periods: {
        multiple: true,
        encode: convert.periodsToStringArray,
        decodeArray: convert.toPeriodArray,
    },
    path: {
        multiple: false,
        decode: convert.directMap,
        encode: convert.directMap,
    },
    tags: {
        multiple: true,
        decodeArray: convert.directMap,
        encode: convert.directMap,
    },
    timePoint: {
        multiple: false,
        decode: convert.toDate,
        encode: convert.dateToString,
    }
};

/**
 * decodeSearchParams decodes the search param based on the TypeConversion
 * specifications, each is decoded into the type as defined by the conversion
 * decode method. If there are multiples expected all multiples are decoded.
 * If there is no param undefined is returned.
 * 
 * @param param - an array of search parameter strings.
 * @param conversion - the type conversion specifications for the search parameter.
 */
const decodeSearchParams = (param: string[], conversion: TypeConversion): any => {
    if (param.length === 0) return undefined;
    if (conversion.multiple && conversion.decodeArray) {
        return conversion.decodeArray(param);
    }
    if (!conversion.multiple) {
        const param0 = param[0];
        if (param0 !== undefined && conversion.decode) {
            return  conversion.decode(param0);
        }
    }
    return undefined;
};

/**
 * decodeURLSearchParams extracts all the search params from the URL that are
 * derived from the keyof URLQueryParams. It extracts all the search params
 * as an array of strings no matter if it is `multiple` or not. The search
 * params are then decoded with the decodeSearchParams with its own specified
 * decoder. It sets the property to the value or undefined if there is no
 * value in the URL.
 * 
 * @param searchParams - The search parameters from the react useSearchParams hook.
 */
const decodeURLSearchParams = (searchParams: globalThis.URLSearchParams) => {
    let p: any = {};
    queryKeys.forEach((key: URLQueryParamKeys) => {
        const conv = urlSearchParamConversion[key];
        const val = searchParams.getAll(`${key}`);
        p[key] = decodeSearchParams(val, conv);
    });
    console.log('decodeURLSearchParams:', p);
    return p
}

/**
 * sanitizeSearchParams
 * */
const sanitizeSearchParams = (val: string | string[]): { ok: boolean, multiple: boolean, v: string | string[] } => {
    // if an string zero value ('') if present return undefined
    if (typeof val === 'string' && val.length === 0) {
        return { ok: false, multiple: false,  v: val };
    } else if (typeof val === 'string' && val.length !== 0) {
        return { ok: true, multiple: false, v: val }
    }
    // if the value is an array of strings the check for any string zero
    // values and remove the zero values from the string array.
    val = val as string[]; // certain this is not a string.
    val = val.filter((vi) => vi !== '')
    return {
        ok: val.length > 0,
        multiple: true,
        v: val,
    }
}

/**
 * encodeSearchParams
 */
const encodeSearchParams: (params: URLQueryParams) => URLSearchParams  = (params: URLQueryParams) => {
    const p = new URLSearchParams();
    queryKeys.forEach((key) => {
        if (params[key] !== undefined) {
            let val = urlSearchParamConversion[key].encode(params[key]);
            const { ok, multiple, v } = sanitizeSearchParams(val);
            if (ok) {
                if (multiple) {
                    (v as string[]).forEach((vi) => p.append(key, vi))
                } else {
                    p.append(key, v as string);
                }
            }
        }
    });
    return p;
};

/**
 * encodePath uses regex to replace placeholder param keys with the actual param
 * */
const encodePath = (path: string, params?: URLParams) => {
    if (params === undefined) return path;

    for (const k in params) {
        const key = k as keyof URLParams;
        path = path.replace(`:${key}`, params[key]!);
    }
    return path;
}

/**
 * URLHook is the interface exposed to the application.
 *
 * @param url - Contains all the search (or query) parameters. As defined in the type URLQueryParams.
 *
 * @param params - Contains all the url parameters. As defined by the URLParams.
 *
 * @param setSearchParam - Is a wrapper for useSearchParams set function from react-router-dom. Limited
 * to only parse parameters as defined in the type URLQueryParams.
 *
 * @param navigate - Is a wrapper function for the useNavigation hook from react-router-dom. The wrapper
 * allows the path as a regex string with standard placeholder for params as defined above to be populated
 * and searchParams to override existing search parameters in the URL or set if not yet present.
 *
 * */
interface URLHook {
    url: URLQueryParams;
    params: URLParams;
    setSearchParam: (params: URLQueryParams) => void;
    navigate: (options: navigateType) => void;
}

/**
 * navigateType defines the structure to be able to navigate throughout the app
 *
 * @param path - is a regex like string with `:paramName` as placeholders for param injection
 * an example `/app/:app/home`, where the param `{app: 'calculator}` would the result in a
 * path of `/app/calculator/home`
 *
 * @param params - is a key-value pairs for the path as described above
 *
 * @param searchParams - is all the searchParams that are to be updates just before navigation.
 * */
type navigateType = {
    path: string;
    params?: URLParams;
    searchParams?: URLQueryParams;
}

/**
 * useURLHook merges the use of useParams and useSearchParams from
 * React Router DOM into a single URL Hook to manage the URL state and
 * params
 */
export const useURLHook = (): URLHook => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [urlSearchParams, setURLQueryParams] = useSearchParams();

    const params = decodeURLSearchParams(urlSearchParams);

    const setSearchParam = (newParams: URLQueryParams): void => {
        const searchParams: URLQueryParams = {
            ...params,
            ...newParams
        };
        console.log('searchParams:', searchParams);
        setURLQueryParams(encodeSearchParams(searchParams));
    }

    /**
     * urlNavigate is a wrapper for the useNavigation Hook from react-router-dom to enable
     * strict passing of parameters, parsing of parameters as well as updating the search
     * parameters (or query string parameters) simultaneously.
     * */
    const urlNavigate = (options: navigateType): void => {
        const searchParams =  encodeSearchParams(params);
        let newSearchParams = new URLSearchParams();
        if (options.searchParams !== undefined) {
            newSearchParams = encodeSearchParams(options.searchParams);
        }
        // By definition from MDN: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        // @ts-ignore
        for (let [key, values] of newSearchParams) {
            searchParams.set(key, values);
        }

        if (searchParams.toString() === '') {
            // there are no search params
            navigate(encodePath(options.path, options.params))
        } else {
            // there are search params
            const path = options.path + '?' + searchParams.toString()
            navigate(encodePath(path, options.params))
        }
    }

    const urlHook = {
        url: params,
        params: urlParams,
        setSearchParam,
        navigate: urlNavigate
    };
    // console.log('url hook', urlHook);
    return urlHook;
};

