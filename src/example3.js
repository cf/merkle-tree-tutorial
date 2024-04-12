function getMerklePathOfNode(level, index){
  const merklePath = [];
  for(let currentLevel=level;currentLevel>=0;currentLevel--){
    merklePath.push({
      level: currentLevel,
      index: index,
    });
    index = Math.floor(index/2);
  }
  return merklePath;
}

console.log(getMerklePathOfNode(3,5))