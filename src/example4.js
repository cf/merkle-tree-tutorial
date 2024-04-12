// 在实践中，我们通常从返回的默克尔路径中排除根节点，因为每个节点的默克尔路径都包含它
// 所以我们可以重写我们的函数，返回除根节点之外的所有默克尔路径中的节点（level>0）

function getMerklePathOfNode(level, index){
  const merklePath = [];
  for(let currentLevel=level;currentLevel>0;currentLevel--){
    merklePath.push({
      level: currentLevel,
      index: index,
    });
    index = Math.floor(index/2);
  }
  return merklePath;
}

console.log(getMerklePathOfNode(3,5))

