
import Link from 'next/link';

import { HiOutlineChevronRight } from 'react-icons/hi2';

import LayoutGroup from './LayoutGroup';

import formatClasses from '@/utils/formatClasses';
import imageVar from '@/utils/imageVar';

import styles from '@/styles/components/CardList.module.scss';

export default function CardList({ children, title }){

    return (
        <LayoutGroup>
            { title && <h2 className={styles.header}>{title}</h2> }
            { children.map( (card, index) => {

                return(
                    <Link className={styles.card} style={imageVar( card.image )} key={card.id} href={card.link||''}>
                        <LayoutGroup>
                            <p className={styles.title}>{card.title}</p>
                            { card.subtitle &&
                                <p className={styles.subtitle}>{card.subtitle}</p>
                            }
                        </LayoutGroup>
                        <HiOutlineChevronRight className={styles.icon}/>
                    </Link>
                );
            })}
        </LayoutGroup>
    );
}