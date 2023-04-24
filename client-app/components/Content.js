

import LayoutGroup from './LayoutGroup';
import Spinner from './Spinner';

import styles from '@/styles/components/Content.module.scss';
import ErrorBox from './ErrorBox';

export default function Content({
    data, children: content,
    noContentCheck=result=>result?.length===0,
    noContentMessage="No results found",
    notFoundMessage="Page not found",
    errorMessage="Something went wrong\nPlease try again later"
}){
    return (<>{
        data.fetching || data.success == null ?
        <LayoutGroup marginSize={'large'} centreContent={true}>
            <Spinner/>
        </LayoutGroup>

        : data.success === false ?
        <LayoutGroup>
            <ErrorBox centreContent={true}>{ data.status === 404 ? notFoundMessage : errorMessage }</ErrorBox>
        </LayoutGroup>

        : noContentCheck(data.result) ?
        <LayoutGroup marginSize={'large'}>
            <p className={styles.message}>{noContentMessage}</p>
        </LayoutGroup>

        : typeof content == 'function' ?
        content( data.result )
        
        : content ?
        content

        : <></>
    }</>);
}