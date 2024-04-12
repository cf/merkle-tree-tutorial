const shajs = require("sha.js");

function hash(leftNode, rightNode) {
  return shajs("sha256")
    .update(leftNode + rightNode, "hex")
    .digest("hex");
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
}

function example1(){
  const height = 3;
  const leaves = [
    "0000000000000000000000000000000000000000000000000000000000000001", // 1
    "0000000000000000000000000000000000000000000000000000000000000003", // 3
    "0000000000000000000000000000000000000000000000000000000000000003", // 3
    "0000000000000000000000000000000000000000000000000000000000000007", // 7
    "0000000000000000000000000000000000000000000000000000000000000004", // 4
    "0000000000000000000000000000000000000000000000000000000000000002", // 2
    "0000000000000000000000000000000000000000000000000000000000000000", // 0
    "0000000000000000000000000000000000000000000000000000000000000006", // 6
  ];
  const tree = new MerkleTree(height, leaves);
  console.log("[EX_1] the merkle tree's root is: "+tree.getRoot());
}
example1();

