
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from '@/hooks/useForceUpdate';

// Styles
import styles from '@/styles/components/TabNavigator.module.scss';
import formatClasses from '@/utils/formatClasses';

export function NavigatorBar({ tabs, activeTab, setActiveTab }){

    return (
        <div className={styles.bar}>
            { tabs.map(( tab, index ) => {

                const selectTab = () => setActiveTab(index);

                const isActive = index === activeTab;

                const classes = formatClasses({
                    [styles.tab]: true,
                    [styles.active]: isActive
                });

                return <button key={index} className={classes} onClick={selectTab}>{tab.name}</button>
            })}
        </div>
    );
}