
export default function formatResultsAsCards( data=[] ){

    const catergories = {};
    data.forEach( item => {
        if( !catergories[item.category] ){ catergories[item.category] = { title: item.category, cards: [] }; }

        const card = {
            id: item.id,
            title: item.name,
            subtitle: item.waitTime,
            image: item.bannerImage,
        }
        if( item.type === 'group' ) card.link = `/search/group/${item.id}`;
        else if( item.type === 'queue' ) card.link = `/search/queue/${item.id}`;

        catergories[item.category].cards.push( card );
    });

    return Object.values(catergories);
}