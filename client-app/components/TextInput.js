
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useValue from '@/hooks/useValue';

import LayoutGroup from './LayoutGroup';

import styles from '@/styles/components/TextInput.module.scss';

export default function TextInput({ name, type='text', defaultValue, children, innerRef, autoFocus, onChange, onSubmit, onBlur }){

    const focused = useRef(false);

    const ref = element => {
        if( element ){
            if( !focused.current && autoFocus ){
                focused.current = true;
                element.focus();
            }
            onkeydown = e => {
                if( e.keyCode === 13 ){
                    element.blur();
                    if( onSubmit ) onSubmit(e);
                }
            }
        }
        if( innerRef ) innerRef.current = element;
    }

    return (
        <LayoutGroup>
            <label className={styles.label}>{name}</label>
            <input className={styles.input} type={type} placeholder={children} onChange={onChange} onBlur={onBlur} ref={ref} defaultValue={defaultValue}/>
        </LayoutGroup>
    )
}