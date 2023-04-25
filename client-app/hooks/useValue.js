
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useForceUpdate from './useForceUpdate';

export default function useValue( initValue ){

    const value = useRef( initValue );
    const forceUpdate = useForceUpdate();

    const onChange = ( event ) => {
        value.current = event.target.value;
    }

    const setValue = ( newValue ) => {
        value.current = newValue;
        forceUpdate();
    }

    return [ value, onChange, setValue ];
}