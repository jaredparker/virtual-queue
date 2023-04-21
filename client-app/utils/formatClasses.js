
export default function formatClasses(classes){
    return Object.entries(classes).filter(([key, value]) => value).map(([key, value]) => key).join(' ');
}