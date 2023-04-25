
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useValue from '@/hooks/useValue';

import LayoutGroup from './LayoutGroup';

import styles from '@/styles/components/TextInput.module.scss';

export default function TextInput({ name, type='text', defaultValue, children, innerRef, autoFocus, onChange, onSubmit, onBlur }){

    const autoFocused = useRef(false);
    const inputEl = useRef(false);

    const onKeyDown = ( e ) => {
        if( e.keyCode === 13 ){
            inputEl.current.blur();
            if( onSubmit ) onSubmit(e);
        }
    }

    const ref = element => {
        if( element ){
            inputEl.current = element;

            if( !autoFocused.current && autoFocus ){
                autoFocused.current = true;
                element.focus();
                setTimeout( () => element.selectionStart = element.selectionEnd = 10000, 0 );
            }
        }
        if( innerRef ) innerRef.current = element;
    }

    // Put cursor at end of input
    if( inputEl.current && defaultValue && document.activeElement === inputEl.current ){
        autoFocused.current = false;
    }

    return (
        <LayoutGroup>
            <label className={styles.label}>{name}</label>
            <input className={styles.input} type={type} placeholder={children} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} ref={ref} defaultValue={defaultValue}/>
        </LayoutGroup>
    )
}