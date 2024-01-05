import Head from "next/head";
import { contractAddresses, abi } from "../constants"
import Header from "../components/Header";
import { useMoralis, useWeb3Contract  } from "react-moralis";
import {useState,useEffect} from 'react';
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { addLink } from "../database_api/api";





const supportedChains = ["5"];

export default function Home() {
  const {Moralis, isWeb3Enabled,chainId: chainIdHex,account } = useMoralis();
  const [responseBytes, setResponseBytes] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(1);
  const [displayDiv, setDisplayDiv] = useState(false);
const chainId = parseInt(chainIdHex)
const contractAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
const dispatch = useNotification()
let value=inputValue+account;
const _value = ethers.utils.toUtf8Bytes(value);
let hash = ethers.utils.keccak256(_value);
let hashString = ethers.utils.hexlify(hash);

let check=inputValue+ " youtube link description contains "+ hashString;
const {
  runContractFunction: addVideo,
  data: enterTxResponse,
  isLoading,
  isFetching,
} = useWeb3Contract({
  abi: abi,
  contractAddress: contractAddress,
  functionName: "addVideo",
  params: {
    _check:check,
  },
})
const handleNewNotification = () => {
  dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
  })
}
useEffect(() => {
  if (startTimer) {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000); // Update the timer every 1 second

      return () => clearTimeout(countdown);
    } else {
      setDisplayDiv(true);
    }
  }
}, [timer, startTimer]);

const handleStartTimer = () => {
  setStartTimer(true);
};
const { runContractFunction: getAssertionResult } = useWeb3Contract({
  abi: abi,
  contractAddress: contractAddress,
  functionName: "getConfirmation",
  params: {
    _link:inputValue,
  },
})

const handleSuccess2 = async (tx) => {
  try {
      await tx.wait(1)
      // await addLink(inputValue)
      console.log(tx)
      handleNewNotification(tx)
     handleStartTimer();
  } catch (error) {
      console.log(error)
  }
}
const handleNewNotification1 = () => {
  dispatch({
      type: "info",
      message: "Video Link has successfully verified !",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
  })
}
const handleSuccess = async (tx) => {
  try {
      await tx.wait(1)
      console.log(tx)
      handleNewNotification1(tx)
      await addLink(inputValue)
  } catch (error) {
      console.log(error)
  }
}
  return (
    <div>
      <Head>
        <title>AnonYSurf</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="./images/profile.png" />
      </Head>
      <Header />
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            <div className="flex justify-center items-center">
        
  {!startTimer ? ( 
    
    <div class="rounded overflow-hidden shadow-lg p-8">
      <div className="w-24 h-24 mx-auto mb-2 overflow-hidden rounded-full border-black">
        <img
          src="./images/profile.png"
          alt="Profile Photo"
          className="object-cover w-full h-full"
        />
      </div>
  <div class="px-6 py-4">
  <div class="text-center font-semibold text-lg mb-2">{account}</div>
    <p class="text-gray-700 text-base">
      <div class="flex justify-center mt-10">Add below to your video description.</div> <div class="font-bold mt-2">{hashString}</div> 
      </p>
  </div>
  <label for="helper-text" class="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Your Video Link</label>
      <input
        id="helper-text" aria-describedby="helper-text-explanation" 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        placeholder="Enter Youtube link"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

<button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={
                          async () => {
                            await addVideo({
                                onSuccess: handleSuccess2,
                                onError: (error) => console.log(error),
                            })
                          }
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Add Video Link"
                        )}
                    </button>




  <div class="px-6 pt-40 pb-2 flex justify-center">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">#UMAprotocol</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ml-2 mb-2">#Sismo</span>
  </div>
  
  
                    
                    
                    </div>
                    
  
                    
                    ):null}

{!startTimer ? (
        null
      ) : (
        <div>
          {startTimer && (
            <p class="flex justify-center font-bold">UMA DISPUTE time: {timer} seconds</p>
          )}
          {displayDiv ? (
            <div class="pt-6 fex justify-center ml-3"> <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bol py-2 px-4 rounded ml-auto"
            onClick={
              async () =>
                await getAssertionResult({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                })
            }
            disabled={isLoading || isFetching}
        >
          
                Get confirmation
        </button></div>
          ) : null}

          
        </div>
      )}





      
               </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div class="flex justify-center">Please connect to a Wallet</div>
      )}
    </div>
  );
}
