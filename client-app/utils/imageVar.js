
export default function imageVar( image ){
    return image && { "--card-image": `url("${image}")` }
}