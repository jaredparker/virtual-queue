
import formatClasses from '@/utils/formatClasses';

import styles from '@/styles/components/LayoutWrapper.module.scss';

export default function LayoutWrapper({ children, centreContent=false, fillHeight=false, className }){

    const classes = formatClasses({
        [styles.wrapper]: true,
        [styles.centre]: centreContent,
        [styles.fill]: fillHeight,
        [className]: true
    });

    return (
        <div className={classes}>
            {children}
        </div>
    )
}