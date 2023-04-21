
import styles from '@/styles/components/LayoutGroup.module.scss';
import formatClasses from '@/utils/formatClasses';

export default function LayoutGroup({ children, gapSize='small', marginSize='' }){

    const className = formatClasses({
        [styles.group]: true,

        [styles.gapSmall]: gapSize === 'small',
        [styles.gapMedium]: gapSize === 'medium',
        [styles.gapLarge]: gapSize === 'large',

        [styles.marginSmall]: marginSize === 'small',
        [styles.marginMedium]: marginSize === 'medium',
        [styles.marginLarge]: marginSize === 'large'
    });

    return (
        <div className={className}>
            {children}
        </div>
    );
}