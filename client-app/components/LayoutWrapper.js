
import LayoutGroup from './LayoutGroup';

import formatClasses from '@/utils/formatClasses';

import styles from '@/styles/components/LayoutWrapper.module.scss';
import imageVar from '@/utils/imageVar';
import Spinner from './Spinner';

export default function LayoutWrapper({ children, centreContent=false, fillHeight=false, className='', bannerImage, header }){

    const classes = formatClasses({
        [styles.wrapper]: true,
        [styles.centre]: centreContent,
        [styles.fill]: fillHeight,
        [className]: true
    });

    return (
        <>
            { header && <>
                <div className={styles.headerPlaceholder}/>
                <div className={styles.header} style={imageVar( bannerImage )}>
                    { header }
                </div>
            </> }
            <div className={classes}>
                { children }
            </div>
        </>
    )
}