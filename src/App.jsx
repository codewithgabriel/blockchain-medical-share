import {
  ConnectWallet,
  useAddress,
  useConnectionStatus,
  useContract,
  useWallet,
} from "@thirdweb-dev/react";
import * as abi from './components/abi.json';
import contractAddress from "./abi";

import { useEffect } from "react";
import Swal from "sweetalert2";
import image from './assets/image.jpg'

const CLIENT_ID = process.env.CLIENT_ID;

export default function App() {
  const {contract , isLoading , error } = useContract(contractAddress , abi.abi);
 

  const connectionStatus = useConnectionStatus();
  const address = useAddress();

  function registerProvider() { 
      
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait...',
      background: "#172554",
      color: '#fff',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
      contract.call('registerProvider')
      .then( (r) => { 
          Swal.fire({ 
            icon: 'success',
            text: 'Provider Registered',
            background: "#172554",
            color: '#fff',
            position: 'top'

          })
          window.location.href = '/dashboard'
      })
      .catch( (e) => {
        console.info(e) 
        let err_msg = e.message.toString();
        if ( err_msg.includes("Provider already registered") )  { 
          Swal.fire({
            icon: "success",
            text: "Sign In successful",
            toast: true,
            background: "#172554",
            color: '#fff',
            position: 'center'
          })
          window.location.href = '/dashboard'


        }else { 

          Swal.fire({
            icon: "error",
            text: e.message,
            toast: true,
            background: "#172554",
            color: '#fff',
            position: 'center'
          })

        }
        
      })
  }

  useEffect(() => {
    console.log(isLoading , error)
    // if (connectionStatus == "connected" && address ) {
    //   localStorage.setItem("user", address);
    //   registerProvider()
    // }
  }, [connectionStatus]);
  return (
    <div>
      {/* <h1>Blochain Medical Record Share</h1> */}
      <div className="w-full h-screen flex-row flex" >
        <div className="h-screen w-7/12  hidden sm:flex" style={{backgroundImage: `url(${image})` , backgroundRepeat: 'no-repeat'}}>
        
        <div className="bg-black bg-opacity-40 w-full flex justify-center items-center h-screen">
          <h1 className="py-3 text-4xl font-bold text-white ">  Blockchain Base eHealth System </h1>
        </div>

        </div>


        <div className="h-screen flex justify-center items-center w-full sm:w-5/12 px-2">
          <div>
            <h1 className="py-3 text-2xl font-medium">Get Started by Connecting Your Wallet </h1>
            <div className="flex gap-4">
              <ConnectWallet  />
              <button onClick={registerProvider } className="font-md bg-blue-400 text-white px-5 py-5  shadow-lg active:bg-blue-950 rounded-lg"> Continue to Dashboard </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
