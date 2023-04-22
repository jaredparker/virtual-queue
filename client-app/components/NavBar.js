
import { useRouter } from 'next/router';
import Link from 'next/link';

import { HiOutlineTicket, HiMagnifyingGlass, HiOutlineCamera } from 'react-icons/hi2';

import LayoutWrapper from './LayoutWrapper';

import formatClasses from '@/utils/formatClasses';

import styles from '@/styles/components/NavBar.module.scss';
const navItems = [
    {
        name: 'My Tickets',
        icon: HiOutlineTicket,
        link: '/tickets'
    },
    {
        name: 'Scan Code',
        icon: HiOutlineCamera,
        link: '/scan'
    },
    {
        name: 'Search',
        icon: HiMagnifyingGlass,
        link: '/search'
    }
];

export default function NavBar({ children, centreContent=false, fillHeight=false }){

    const router = useRouter();

    return (
        <>
            <div className={styles.placeholderNav}/>
            <div className={styles.nav}>
                { navItems.map( (item, index) => {

                    const _classes = formatClasses({
                        [styles.item]: true,
                        [styles.active]: router.pathname.startsWith( item.link )
                    });

                    return (
                        <Link className={_classes} key={index} href={item.link}>
                            <item.icon className={styles.icon}/>
                            <p>{item.name}</p>
                        </Link>
                    )

                }) }
            </div>
        </>
    )
}