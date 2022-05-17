import './App.css';
import logo from "../assets/armor250.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {greeterAbi, greeterAddress} from "../utils/constants";
import {checkWalletIsConnected} from "../utils/wallet";
import {
    setGreeting,
    useAutoRefresh,
    useBalance,
    useBlock,
    useCurrentAccount,
    useGreeting,
    useProvider
} from "../utils/Store";


/**
 * The Header Component - currently shows up at the HP.
 * @returns {JSX.Element}
 */

export const greetMe = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const greeterContract = new ethers.Contract(greeterAddress, greeterAbi, provider);
    return await greeterContract.greet();
}

const Greeter = () => {
    const [newGreetings, setNewGreetings] = useState("");

    const autoRefresh = useAutoRefresh();
    const provider = useProvider();
    const block = useBlock();
    const balance = useBalance();
    const greetings = useGreeting();

    useEffect(() => async () => {
        let interval;

        const updateGreeting = async () => {
            const greetMsg = await greetMe();
            setGreeting(greetMsg);
            console.log("updated");
        }

        if (!greetings) {
            await updateGreeting();
        }

        if (autoRefresh) {
            interval = setInterval(() => {
                updateGreeting();
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [autoRefresh, greetings])

    const updateGreets = async () => {
        document.getElementById("greetingsInput").value = "";
        const greeterContract = new ethers.Contract(greeterAddress, greeterAbi, provider);
        const contractWithSigner = greeterContract.connect(await provider.getSigner());

        await contractWithSigner.setGreeting(newGreetings);
    }

    return (
        <div className="Greeter mailbox">
            <h1>Set a greeting for others here!</h1>
            <h2>
                Current Greetings:&nbsp;
                <b>{greetings}</b>
            </h2>
            <p>Your ETH Balance is: <b>{balance}</b></p>
            <p>Current ETH Block is: {block}</p>
            <input id="greetingsInput" placeholder="New greetings" type="text"
                   onChange={(e) => setNewGreetings(e.target.value)}
            />
            <button className="update-greetings-button" onClick={() => updateGreets()}>
                Update Greetings
            </button>
        </div>
    )
}

export default Greeter;