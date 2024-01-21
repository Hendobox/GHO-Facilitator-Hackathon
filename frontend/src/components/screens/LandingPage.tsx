import { motion } from 'framer-motion';
import useLaunchButton from "../hooks/useLaunchButton";
import BlurryLoadingImage from "../ui/BlurryLoadingImage";

export default function LandingPage() {
    const { onLaunchClick } = useLaunchButton();


    return (
        <div className="bg-zinc-900 pb-16">
            <div className="flex flex-col gap-[64px] items-center w-[1200px] mx-auto">
                <div className="relative">
                    <BlurryLoadingImage image="/assets/hero.png" alt="hero" divStyleClass="w-[1200px] h-[580px]" />
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.1 }}
                        className="absolute top-[calc(50%-5px)] left-[98px] bg-violet-700 rounded-md py-3 px-3"
                        onClick={onLaunchClick}
                    >
                        Stake now
                    </motion.button>
                </div>
                <span className="text-[30px]">How it works</span>
                <BlurryLoadingImage image="/assets/how-it-works.png" alt="how it works" divStyleClass="w-[1200px] h-[1072px]" />
                <span className="text-[30px]">Intuitive dashboard</span>
                <span className="text-zinc-400 font-medium text-center text-[16px] w-1/2">
                    unHODL offer seamless collateral NFT tracking, ensuring low-interest rates and quick, hassle-free loan options, all within minutes.
                </span>
                <BlurryLoadingImage image="/assets/dashboard.png" alt="dashboard" divStyleClass="w-[1200px] h-[884px]" />
                <span className="text-[30px]">Leverage assets in 3 easy steps</span>
                <div className="flex flex-row justify-between gap-5">
                    {new Array(3).fill(0).map((_, i) => (
                        <img key={i} width={384} src={`/assets/easy-steps/${i + 1}.png`} alt={`step ${i + 1}`} />
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    className="bg-violet-700 rounded-md py-2 px-4"
                    onClick={onLaunchClick}
                >
                    Deposit asset
                </motion.button>
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row gap-5">
                        <span>FAQs</span>
                        <span>Facilitators</span>
                        <span>Partners</span>
                    </div>
                    <span>© 2024 unHODL Inc.</span>
                </div>
            </div>
        </div>
    )
}