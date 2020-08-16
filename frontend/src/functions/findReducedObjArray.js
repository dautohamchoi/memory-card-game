function findReducedObjArray(removedArr, objArr) {
  // create a new array to make sure that do not affect origin Obj Array
  let reducedArr = [...objArr]; 
  for (let i = 0; i < removedArr.length; i++) {
    for (let j = 0; j < reducedArr.length; j ++) {
      if (reducedArr[j].name === removedArr[i]) {
        reducedArr.splice(j, 1);  
      } 
    }
  }
  return reducedArr.sort(() => 0.5 - Math.random());
}
export default findReducedObjArray;