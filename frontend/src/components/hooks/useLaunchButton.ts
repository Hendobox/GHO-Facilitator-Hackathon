import { useModal } from "connectkit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const REDIRECT_ON_CONNECT = "/borrow";

export default function useLaunchButton() {
    const [launch, setLaunch] = useState(false);
    const navigate = useNavigate();
    const { setOpen } = useModal();
    const { isConnected } = useAccount();

    useEffect(() => {
        if (launch && isConnected) {
            navigate(REDIRECT_ON_CONNECT);
            setLaunch(false);
        }
    }, [launch, setOpen, isConnected, navigate]);

    const onLaunchClick = () => {
        if (isConnected) {
            navigate(REDIRECT_ON_CONNECT);
            return;
        }
        setLaunch(true);
        setOpen(true);
    };

    return {
        onLaunchClick,
        isConnected
    }
}