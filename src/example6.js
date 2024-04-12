const shajs = require("sha.js"); // npm install --save sha.js

function hash(leftNode, rightNode) {
  return shajs("sha256")
    .update(leftNode + rightNode, "hex")
    .digest("hex");
}
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
class MerkleTree {
  constructor(height, leaves){
    this.height = height;
    this.leaves = leaves;
  }
  N(level, index){
    if(level === this.height){
      // if level == height, the node is a leaf, 
      // so just return the value from our dataset
      return this.leaves[index];
    }else{
      // if the node is not a leaf, use our definition:
      // N(level, index) = Hash(N(level+1, index*2), N(level+1, index*2+1))
      return hash(
        this.N(level+1, 2*index),
        this.N(level+1, 2*index+1),
      );
    }
  }
  getRoot(){
    // the node N(0,0) is always the root node
    return this.N(0,0);
  }
  getMerkleProof(level, index){
    // 获取叶子节点的值
    const leafValue = this.N(level, index);

    // 获取叶子的默克尔路径上节点的层级和索引
    const merklePath = getMerklePathOfNode(level, index);

    // 获取默克尔路径上节点的兄弟节点的层级和索引
    const merklePathSiblings = merklePath.map((node) => {
      return getSiblingNode(node.level, node.index);
    });

    // 获取兄弟节点的值
    const siblingValues = merklePathSiblings.map((node) => {
      return this.N(node.level, node.index);
    });

    return {
      root: this.getRoot(), // 我们声称为我们树的根
      siblings: siblingValues, // 我们叶子的默克尔路径的兄弟节点
      index: index, // 我们叶子的索引
      value: leafValue, // 我们叶子的值
    };
  }
}
function computeMerkleRootFromProof(siblings, index, value){
  // 我们从叶子节点开始我们的默克尔路径节点
  let merklePathNodeValue = value;
  let merklePathNodeIndex = index;

  // 我们沿着叶子的默克尔路径向上到根，
  // 我们一边走一边使用提供的兄弟节点来计算默克尔路径的节点
  for(let i=0;i<siblings.length;i++){
    const merklePathNodeSibling = siblings[i];

    if(merklePathNodeIndex%2===0){
      // 如果我们默克尔路径上节点的当前索引是偶数：
      // * merklePathNodeValue 是左手节点，
      // * merklePathNodeSibling 是右手节点
      // * 父节点的值是 hash(merklePathNodeValue, merklePathNodeSibling)
      merklePathNodeValue = hash(merklePathNodeValue, merklePathNodeSibling);
    }else{
      // 如果我们默克尔路径上节点的当前索引是奇数：
      // * merklePathNodeSibling 是左手节点
      // * merklePathNodeValue 是右手节点，
      // * 父节点的值是 hash(merklePathNodeSibling, merklePathNodeValue)
      merklePathNodeValue = hash(merklePathNodeSibling, merklePathNodeValue);
    }

    // 根据我们的定义，我们路径节点的父节点是 N(level-1, floor(index/2))
    merklePathNodeIndex = Math.floor(merklePathNodeIndex/2);
  }
  return merklePathNodeValue;
}

function verifyMerkleProof(proof){
  return proof.root === computeMerkleRootFromProof(proof.siblings, proof.index, proof.value);
}
function example6(){
  const height = 3;
  const leaves = [
    "0000000000000000000000000000000000000000000000000000000000000001", // 1
    "0000000000000000000000000000000000000000000000000000000000000003", // 3
    "0000000000000000000000000000000000000000000000000000000000000003", // 3
    "0000000000000000000000000000000000000000000000000000000000000007", // 7
    "0000000000000000000000000000000000000000000000000000000000000004", // 4
    "0000000000000000000000000000000000000000000000000000000000000009", // 9
    "0000000000000000000000000000000000000000000000000000000000000000", // 0
    "0000000000000000000000000000000000000000000000000000000000000006", // 6
  ];
  const tree = new MerkleTree(height, leaves);
  console.log("[EX_6] the root is: "+tree.getRoot());
  const merkleProofOfN3_5 = tree.getMerkleProof(3,5);

  console.log("[EX_6] the merkle proof of N(3,5):\n" + JSON.stringify(merkleProofOfN3_5, null, 2));

  console.log("[EX_6] computed root: "+computeMerkleRootFromProof(merkleProofOfN3_5.siblings, merkleProofOfN3_5.index, merkleProofOfN3_5.value));
  console.log("[EX_6] verify merkle proof: "+verifyMerkleProof(merkleProofOfN3_5));
}

example6();