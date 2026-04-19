import { useMemo, useState } from "react";
import { ethers } from "ethers";
import ManufacturerSection from "./components/ManufacturerSection";
import TransferSection from "./components/TransferSection";
import AuditorSection from "./components/AuditorSection";
import contractAbi from "./abi/MuhammadSaadSupplyChain.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const SEPOLIA_CHAIN_ID = 11155111n;

export default function App() {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("Ready");

  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const getContract = async () => {
    if (!provider) {
      throw new Error("MetaMask not found");
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error("VITE_CONTRACT_ADDRESS is missing");
    }

    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
  };

  const connectWallet = async () => {
    try {
      if (!provider) throw new Error("MetaMask not found");
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        setMessage("Wallet connected. Please switch MetaMask to Ethereum Sepolia (11155111).");
        return;
      }
      setMessage("Wallet connected on Ethereum Sepolia");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const registerProduct = async (id, name, description) => {
    try {
      const contract = await getContract();
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        throw new Error("Wrong network. Switch wallet to Ethereum Sepolia (11155111)");
      }
      const tx = await contract.registerProduct(BigInt(id), name, description);
      setMessage("Submitting register transaction...");
      await tx.wait();
      setMessage(`Product ${id} registered`);
    } catch (error) {
      setMessage(error.reason || error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const contract = await getContract();
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        throw new Error("Wrong network. Switch wallet to Ethereum Sepolia (11155111)");
      }
      const tx = await contract.updateProductStatus(BigInt(id), status);
      setMessage("Submitting status update...");
      await tx.wait();
      setMessage(`Status updated for product ${id}`);
    } catch (error) {
      setMessage(error.reason || error.message);
    }
  };

  const transferProduct = async (id, newOwner) => {
    try {
      const contract = await getContract();
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        throw new Error("Wrong network. Switch wallet to Ethereum Sepolia (11155111)");
      }
      const tx = await contract.transferOwnership(BigInt(id), newOwner);
      setMessage("Submitting transfer transaction...");
      await tx.wait();
      setMessage(`Product ${id} transferred`);
    } catch (error) {
      setMessage(error.reason || error.message);
    }
  };

  const auditProduct = async (id) => {
    try {
      const contract = await getContract();
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        throw new Error("Wrong network. Switch wallet to Ethereum Sepolia (11155111)");
      }
      const [product, history] = await Promise.all([
        contract.getProduct(BigInt(id)),
        contract.getProductHistory(BigInt(id))
      ]);

      return {
        product,
        history
      };
    } catch (error) {
      setMessage(error.reason || error.message);
      return null;
    }
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>MuhammadSaad Supply Chain Management DApp</h1>
        <p>Full Traceability from Manufacturer to Customer on Ethereum Sepolia</p>
        <button type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
        <p className="account">Connected account: {account || "Not connected"}</p>
      </header>

      <ManufacturerSection onRegister={registerProduct} />
      <TransferSection onStatusUpdate={updateStatus} onTransfer={transferProduct} />
      <AuditorSection onAudit={auditProduct} />

      <footer className="main-footer">
        <strong>MuhammadSaad</strong> | Blockchain Supply Chain DApp
        <p>Status: {message}</p>
      </footer>
    </main>
  );
}
