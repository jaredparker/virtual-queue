
import formatClasses from '@/utils/formatClasses';

import styles from '@/styles/components/LayoutWrapper.module.scss';

export default function LayoutWrapper({ children, centreContent=false, fillHeight=false }){

    // const className = centreContent ? [styles.wrapper, styles.centre] : styles.wrapper;

    const className = formatClasses({
        [styles.wrapper]: true,
        [styles.centre]: centreContent,
        [styles.fill]: fillHeight
    });

    return (
        <div className={className}>
            {children}
        </div>
    )
}