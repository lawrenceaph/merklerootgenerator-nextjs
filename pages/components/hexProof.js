 

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import toast from "react-hot-toast";
import Link from "next/link";
 



export default function HexProof({theMerkleONe}) {
    const [addressProof, setAddressProof] = useState(); 
    
    useEffect(()=> {
        const forHex = '0xbEdc17015C841678885D9F7948bC0C1f16D05202';
        const gettheProof = async()=> {
            const proofGet = await theMerkleONe().getHexProof(keccak256(forHex));
            setAddressProof(proofGet);
        };gettheProof();
    }, [theMerkleONe])
    
    


  
    return (
    <div>



    </div>
  )
}
