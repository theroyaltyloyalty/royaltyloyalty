import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256';

export const generateMerkleTree = (input: string[]) => {
    const leaves = input.map((x) => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256);
    const root = tree.getRoot().toString('hex');

    const leaf = SHA256(input[0]);
    const proof = tree.getProof(leaf);
    const isValid = tree.verify(proof, leaf, root);

    if (!isValid) {
        return null;
    }

    return {
        root,
    };
};
