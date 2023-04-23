
export default function formatResultsAsCards( data=[] ){

    const categories = {};
    data.forEach( item => {
        if( !categories[item.category] ){ categories[item.category] = { title: item.category, cards: [] }; }

        const card = {
            id: item.id,
            title: item.name,
            subtitle: item.waitTime,
            image: item.bannerImage,
        }
        if( item.type === 'group' ) card.link = `/search/group/${item.id}`;
        else if( item.type === 'queue' ) card.link = `/search/queue/${item.id}`;

        categories[item.category].cards.push( card );
    });
    
    let groups = Object.values(categories);

    // Move uncategorized to the end & rename it to 'Other' if there are other categories
    // (to avoid confusion where it may appear to be another category)
    const uncategorized = categories[''];
    if( uncategorized && groups.length > 1 ){
        uncategorized.title = 'Other';
        groups.push( ...groups.splice( groups.indexOf(uncategorized), 1 ) );
    }

    return groups;
}