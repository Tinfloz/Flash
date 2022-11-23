export const likeValidator = (id, array) => {
    const validationArray = array.map(arr => {
        if (arr.owner === id) {
            return true;
        };
        return false;
    })
    const valid = validationArray.some(val => val === true);
    return valid;
};   