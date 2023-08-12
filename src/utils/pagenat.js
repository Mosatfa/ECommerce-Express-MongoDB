


export function pagenate(page, size) {

    if (!size || size <= 0) {
        size = 2
    }

    if (!page || page <= 0) {
        page = 1
    }
    const skip = (parseInt(page) - 1) * parseInt(size)

    return { skip, limit: size }
}