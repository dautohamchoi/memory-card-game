function findEquationSumArray(arr) {
    let totalArr = []
      for (let j = 0; j < arr.length; j++) {
        for (let k = j + 1; k < arr.length; k++) {
          totalArr.push(arr[k] * arr[k] + 2 * arr[j]);
        }
      }
      return totalArr;
}

export default findEquationSumArray;