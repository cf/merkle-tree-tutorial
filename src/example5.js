function getSiblingNode(level, index){
  // if node is the root, it has no sibling
  if(level === 0){
    throw new Error("the root does not have a sibling")
  }else if(index % 2 === 0){
    // if node is even, its sibling is at index+1
    return {level: level, index: index+1};
  }else{
    // if node is odd, its sibling is at index-1
    return {level: level, index: index-1};
  }
}

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
const merklePath = getMerklePathOfNode(3,5);
const siblings = merklePath.map((node)=>getSiblingNode(node.level, node.index));
console.log("默克尔路径: ", merklePath.map((node)=>`N(${node.level},${node.index})`).join(", "));
console.log("默克尔路径兄弟节点: ", siblings.map((node)=>`N(${node.level},${node.index})`).join(", "));
