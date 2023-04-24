
import React, { useEffect, useRef, useState } from 'react';

import styles from '@/styles/components/Button.module.scss';
import Spinner from './Spinner';

export default function Button({ children, subButton, onClick }){

    const [ loading, setLoading ] = useState(false);

    const onClickMiddleware = () => {
        if( onClick ){
            const result = onClick();
            if( result instanceof Promise ){
                setLoading(true);
                result.finally(() => setLoading(false));
            }
        }
    }

    const className = subButton ? styles.subButton : styles.button;

    return (
        <button className={className} onClick={onClickMiddleware}>
            { loading
                ? <Spinner small={true}/>
                : children
            }
        </button>
    )
}