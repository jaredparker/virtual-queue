

import LayoutGroup from './LayoutGroup';
import CardList from './CardList';

export default function CardListGroups({ children }){
    return (
        <LayoutGroup gapSize='medium'>
            { children.map(( cardGroup, index ) =>
                <CardList title={cardGroup.title} key={cardGroup.title||index}>
                    {cardGroup.cards}
                </CardList>
            )}
        </LayoutGroup>
    );
}