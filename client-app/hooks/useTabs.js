
// Hooks
import React, { useState } from 'react';

// Custom Components
import { NavigatorBar } from '@/components/TabNavigator';

export default function useTabs( tabs ){

    let [ activeTab, setActiveTab ] = useState(0);

    const Tabs = function( props ){

        const tab = tabs[activeTab];
        const Tab = tab.component;

        return <Tab {...props}/>;
    }

    const Navigator = function(){
        return <NavigatorBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    }

    return [ Tabs, setActiveTab, Navigator ];
}