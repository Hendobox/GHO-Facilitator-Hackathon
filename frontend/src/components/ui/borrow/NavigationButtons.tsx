import { motion } from 'framer-motion';

export default function NavigationButtons({
    handleNextStep,
    handlePreviousStep,
}: {
    handleNextStep: () => void;
    handlePreviousStep: () => void;
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
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                className="bg-violet-700 rounded-md py-2 px-4"
            >
                Continue
            </motion.button>
        </div>
    );
}
