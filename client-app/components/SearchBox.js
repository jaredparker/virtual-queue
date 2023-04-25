
import styles from '@/styles/components/SearchBox.module.scss';
import Box from './Box';
import TextInput from './TextInput';

export default function SearchBox( props ){

    const classes = styles.search;

    return (
        <TextInput type={'search'}>
            Search
        </TextInput>
    )
}