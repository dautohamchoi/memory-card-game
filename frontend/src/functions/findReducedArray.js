function findReducedArray(removedArr, arr) {
    let reducedArr = arr; 
    for (let i = 0; i < removedArr.length; i++) {
      if (arr.includes(removedArr[i])) {
        const index = arr.indexOf(removedArr[i]);
        reducedArr.splice(index, 1);  
      } 
    }
    return reducedArr;
  }
  export default findReducedArray;