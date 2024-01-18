import { ConnectKitButton, useModal } from "connectkit";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const REDIRECT_ON_CONNECT = "/borrow";

export default function NavBar() {
    const [launch, setLaunch] = useState(false);
    const navigate = useNavigate();
    const { setOpen } = useModal();
    const { isConnected } = useAccount();
    const location = useLocation();

    useEffect(() => {
        if (launch && isConnected) {
            navigate(REDIRECT_ON_CONNECT);
            setLaunch(false);
        }
    }, [launch, setOpen, isConnected, navigate]);

    return (
        <nav className="flex flex-row px-28 py-8 justify-between text-white">
            <ul className="flex flex-row items-center gap-4">
                <li>
                    <Link to={"/"}>
                        <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 35 36" fill="none"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.8 }}
                            className="outline-none"
                        >
                            <circle cx="17.5" cy="18" r="17.5" fill="#6D28D9" />
                        </motion.svg>
                    </Link>
                </li>
                <motion.li
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                >
                    <Link to={"/borrow"}>Borrow</Link>
                </motion.li>
            </ul>
            {
                location.pathname === "/" ?
                    <div className="flex flex-row justify-between items-center gap-4">
                        {isConnected && <ConnectKitButton />}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.8 }}
                            className="bg-violet-700 rounded-md py-2 px-4"
                            onClick={() => {
                                if (isConnected) {
                                    navigate(REDIRECT_ON_CONNECT);
                                    return;
                                }
                                setLaunch(true);
                                setOpen(true);
                            }}
                        >
                            Lauch
                        </motion.button>
                    </div>
                    :
                    <div
                        className="flex flex-row justify-between items-center gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <Link to={"/dashboard"}>Dashboard</Link>
                        </motion.div>
                        <ConnectKitButton />
                    </div>
            }
        </nav>
    );
}