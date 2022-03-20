

import { useForm } from "react-hook-form";
import { useState } from "react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import toast from "react-hot-toast";
import Link from "next/link";
 
export default function Merkle(){

const [theRootHash, setTheRootHash] = useState();

const generateMerkleHash = async(data)=> {
    const {addresses} = data;
    addresses = await addresses.replace(/,\s*$/, "");
    addresses = await addresses.replace(/['"]+/g, '')
    addresses = await addresses.replace(/\s+/g, "")
    addresses = await addresses.split(',')
    
    const leafNodes = await addresses.map((addr) => keccak256(addr));

    const merkleOne = new MerkleTree(leafNodes, keccak256, { sortPairs:true});
    const rootHash1 = "0x" + merkleOne.getRoot().toString('hex');
    setTheRootHash(rootHash1);

}

const { register, handleSubmit, watch, formState: { errors } } = useForm();
 
console.log(watch("example")); // watch input value by passing the name of it
const onSubmit = (data) => {
 generateMerkleHash(data); 
}
 

console.log(theRootHash)
return(
<>

<div className="h-12 bg-sky-800 flex flex-col items-center justify-center text-white font-bold text-2xl">
    Generate a Merkle Root Hash
</div>
<div className="text-sky-700 text-center">
    This tiny web app produces a Merkle Root Hash compatible with the <Link href='https://github.com/hashlips-lab'><a className="font-semibold text-pink-700 cursor-pointer">HashLips ecosystem </a></Link> for building and deploying NFT smart contracts. 
   <br/> After generating the root hash here, you can use it to update the Merkle root of your smart contract directly, saving you time. Enjoy!
</div>
{theRootHash && 
<div className=" my-4 space-y-2 flex flex-wrap text-wrap flex-col justify-center items-center text-center">
  <p className="rounded-lg border border-2 border-sky-700 p-2 text-sky-700 font-semibold">Your Merkle Root Hash:</p> 
  <p  className="text-sky-700 text-lg font-semibold break-all"  >


{theRootHash && theRootHash}
</p>

{theRootHash!=null && <p onClick={() => {navigator.clipboard.writeText(theRootHash);toast.success(`Copied!`)}} className="text-sky-700 border border-1 border-sky-700 rounded-lg p-2">Copy Hash</p>}
</div>
}
    <form className="flex flex-col items-center justify-center m-2" onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      
      {/* include validation with required or other standard HTML validation rules */}
      <textarea className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" rows={10}
       defaultValue={'Replace this text with the wallet addresses--or other hash strings--separated by a comma.'}
        {...register("addresses", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
      
      <input className="border rounded-lg border-2 border-sky-700 bg-sky-600 p-2 text-white" type="submit" />
    </form>
   

</>

);
}

