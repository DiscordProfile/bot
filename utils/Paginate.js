/**
 * @function Paginate
 * @author crispy
 * @brief Splits the array into smaller chunks
 * @example 
 *  Paginate([1,2,3,4,5,6,7,8,9], 3) => [[1,2,3], [4,5,6], [7,8,9]]
 * 
 * @param {[]} arr 
 * @param {number} size 
 * 
 * Also known as Array Chunking
 */
 function Paginate(arr, size) {
    return arr.reduce((previous, current) => {
        let chunk;
        if (previous.length === 0 || previous[previous.length - 1].length === size) {
            chunk = [];
            previous.push(chunk);
        } else {
            chunk = previous[previous.length - 1];
        }
        chunk.push(current);
        return previous;
    }, []);
}

module.exports = Paginate;