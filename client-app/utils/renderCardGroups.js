
import CardList from '@/components/CardList';

export default function renderCardGroups( cardGroups=[] ){
    return cardGroups.map(
        (cardGroup, index) =>
        <CardList title={cardGroup.title} key={cardGroup.title||index}>
            {cardGroup.cards}
        </CardList>
    )
}