

import { useForm } from "react-hook-form";
import { useState } from "react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Link from "next/link";
import Head from "next/head";

//React-hot-toast is utilized to provide some feedback that a hash or proof has been generated
import toast from "react-hot-toast";





export default function Merkle(){

// Variables to handle state:

//Root Hash stores the Merkle Root hash, once generated
const [theRootHash, setTheRootHash] = useState();

// theMerkleTree is the actual Merkle Tree
const [theMerkleTree, setTheMerkleTree] =useState();

// sampleProof stores the generated Merkle Proof
const [theProof, setTheProof]=useState();

const [verity, setVerity]=useState();
const [rawProof, setRawProof] = useState();


// The function below takes data, separated by commas, and generates a Merkle Tree using the data as leaf nodes
// Once the Merkled Tree is generated, it computes the root hash and stores it in the state variable "theRootHash" 

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
    setTheMerkleTree(merkleOne);
    
}

// The function below takes in data and generates the necessary Merkle Proof, providing certainty that
// the address or hash was in the data set used to creat the Merkle Tree. If there is no value produced, then the address
// or hash sent was not part of the Merkle Tree. Smart contracts that possess a root hash of the Merkle Tree can be sent the Merkle Proof for
// an address to determine if that address was in a white list. 

const generateProof = async(data) => {
  const {address}= data
  const merkleProof =await theMerkleTree.getHexProof((keccak256(address)));
  const rawMerkleProof = merkleProof.toString().replaceAll('\'', '').replaceAll(' ', '');
  setTheProof(merkleProof);
  setRawProof(rawMerkleProof);

   
}


const { register, handleSubmit,formState: { errors } } = useForm();

//The function below is triggered by form submission. It takes in data and passes it to the function above (generateMerkleHash) which in turn generates the Merkle Tree and Merkle Root hash.
const generateMerkleTree = (data) => {
 generateMerkleHash(data);toast.success("Root Hash Generated!")
}

// The function below is triggered by form submission. It takes in data and passes it to the function above (generateProof) which in turn generates the Merkle Proof.
const generateProofforAddress = (data) => {generateProof(data);toast.success('Proof Generated!')}


const verifyAddress = (data) => {checkAddress(data)}

const checkAddress = async(data)=> {
const {address2} = data
const addresso = keccak256(address2)
const {rootHash} = data
const {Proof} = data

 Proof = Proof.toString().replaceAll('\'', '').replaceAll(' ', '').replaceAll('\"', '');
 Proof = Proof.split(',')

 
const v= await  theMerkleTree.verify(Proof, addresso, rootHash)
setVerity(v);


}
console.log("Proof:",theProof)
console.log(theRootHash)
console.log(theMerkleTree)
console.log(verity)
console.log(rawProof)
return(
<>
<Head>
<title>  Merkle Root and Proof Tool </title>
</Head>
<div className="flex flex-col items-center">
<div className="h-12 bg-sky-800 w-full flex flex-col items-center justify-center text-white font-bold text-md md:text-2xl">
    🌲 Merkle Root and Proof Tool 🧾
</div>
<div className="md:w-1/2">
<div className="text-sky-700 text-center p-2">
    Generate a Merkle Root Hash for NFT smart contracts and other use cases.🥂 

</div>

{theRootHash && 
<div className=" my-4 space-y-2 flex flex-wrap text-wrap flex-col justify-center items-center text-center">
  <p className="rounded-lg border border-2 border-sky-700 p-2 text-sky-700 font-semibold">Your Merkle Root Hash:</p> 
  <p  className="text-sky-700 text-lg font-semibold break-all"  >


{theRootHash && theRootHash}
</p>

{theRootHash!=null && <p onClick={() => {navigator.clipboard.writeText(theRootHash);toast.success(`Copied!`)}} className="text-sky-700 border border-1 border-sky-700 cursor-pointer rounded-lg p-2">Copy Hash</p>}
</div>
}
    <form className="flex flex-col items-center justify-center m-2" onSubmit={handleSubmit(generateMerkleTree)}>
      
      <textarea className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" rows={10}
       defaultValue={'Replace this text with the wallet addresses (or other values for your use case)  separated by a comma. Spaces and quotes are removed automatically upon submission. '}
        {...register("addresses", { required: true })} />
      {errors.addresses && <span>This field is required</span>}
      
      <input className="border rounded-lg border-2 border-sky-700 bg-sky-600 p-2 text-white" type="submit" />
    </form>
   
<div>
  
</div>
<div className="">
  {theRootHash && theMerkleTree &&
<>
<div className="text-sky-700">
  Get the Merkle proof for an address here:
  </div>

<form className="flex flex-col items-center justify-center m-2" onSubmit={handleSubmit(generateProofforAddress)}>
      {/* register  input into the hook by invoking the "register" function */}
      {/* include validation with required or other standard HTML validation rules */}

      <input className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" 
       defaultValue={'Address'}
        {...register("address", { required: true })} />
      
      {/* errors will return when field validation fails  */}
      
      {errors.exampleRequired && <span>This field is required</span>}
      
      <input className="border rounded-lg border-2 border-sky-700 bg-sky-600 p-2 text-white" type="submit" />
    
    </form>
    </>
}


</div>

<div>
  {theProof && 

<div className="break-all">
<div className="font-semibold text-center">
Your Merkle Proof:
</div>
<div className="text-sky-700 break-all p-2">
[&ldquo;{theProof.join('","')}&ldquo;]
</div>
  </div>
  }
</div>


<div>
  <div className="text-center text-sky-700">
  Verify if an Address is in a Merkle Tree Here:
  </div>
<form className="flex flex-col items-center justify-center m-2" onSubmit={handleSubmit(verifyAddress)}>
      
      <input className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" 
       defaultValue={'Address'}
        {...register("address2", { required: true })} />
      {errors.addresses && <span>This field is required</span>}

      <input className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" 
       defaultValue={  'Root Hash goes here'}
        {...register("rootHash", { required: true })} />
      {errors.rootHash && <span>This field is required</span>}
    
      <input className="w-full m-2 border-2 p-2 text-sky-600 border-sky-700 text-lg rounded-lg" 
       defaultValue={"Proof goes here (use single quotes: 'value1', 'value2')"}
        {...register("Proof", { required: true })} />
      {errors.Proof && <span>This field is required</span>}

      <input className="border rounded-lg border-2 border-sky-700 bg-sky-600 p-2 text-white" type="submit" />
    </form>

</div>

{verity && 
<div>

<> 

{
  verity && verity===true &&
  
  <>
  <div className="text-center text-sky-700">
    Result:
    The Address is in the Merkle Tree!🎉
  </div>



</>
}

</>  
  
  </div>}



  {verity===false &&
<div className="text-center text-sky-700">

  Result: The Address is not in the Merkle Tree. 
  </div>
  
  }

<div className=' text-center text-sky-700 mt-5 break-all'>

Found a bug? <br/> Let me know via the github repo: <Link  href="https://github.com/lawrenceaph/merklerootgenerator-nextjs"><a className="font-bold">Here 💖</a></Link>

</div>


<div className="text-center text-sky-700">
  Building NFT smart contracts? Check out: 

  <div className="text-center text-sky-700 font-semibold underline">
<Link href='https://unstoppable.gallery'>Unstoppable.Gallery</Link>
</div>
<div>
  <Link href='https://github.com/hashlips-lab'><a className="underline text-center font-semibold text-sky-700 cursor-pointer">HashLips Lab </a></Link></div>
  </div>
 </div>
</div>
</>


);
}

