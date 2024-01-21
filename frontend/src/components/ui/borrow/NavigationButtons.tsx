import { motion } from 'framer-motion';

export default function NavigationButtons({
    handleNextStep,
    handlePreviousStep,
    noNextButton,
    isButtonLoading,
}: {
    handleNextStep: () => void;
    handlePreviousStep: () => void;
    noNextButton?: boolean;
    isButtonLoading?: boolean;
}) {
    return (
        <div className="flex flex-row justify-between pt-8 items-start text-white">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ x: -20 }}
                onClick={handlePreviousStep}
                className="flex flex-row items-center gap-2 pr-5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8L10 4" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Go back</span>
            </motion.button>
            {!noNextButton && <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                className="bg-violet-700 rounded-md py-2 px-4 flex flex-row justify-between items-center gap-2"
            >
                {isButtonLoading && (
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                      .spinner_P7sC {
                        transform-origin: center;
                        animation: spinner_svv2 .75s infinite linear;
                      }
                      @keyframes spinner_svv2 {
                        100% {
                          transform: rotate(360deg);
                        }
                      }
                    `}</style>
                        <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" className="spinner_P7sC" />
                    </svg>
                )}
                Continue
            </motion.button>}
        </div>
    );
}
