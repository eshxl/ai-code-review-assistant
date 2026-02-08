// ArraySum.js

function arraySum(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
}

const input = [10, 20, 30, 40, 50];
console.log("Array:", input);
console.log("Sum of array elements:", arraySum(input));
