import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type StepIndicatorProps = {
    currentStep: number;
    totalSteps: number;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center justify-center">
            <AnimatePresence>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <React.Fragment key={index}>
                        {index < currentStep ? (
                            completedStep()
                        ) : (
                            <motion.div
                                key={index}
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep === index ? 'bg-violet-700 text-white' : 'bg-zinc-800 text-zinc-600'}`}
                                initial={false}
                                animate={{
                                    scale: currentStep === index ? 1.1 : 1, color: currentStep === index ? '#fff' : '#9CA3AF'
                                }}
                                exit={{
                                    scale: 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {index + 1}
                            </motion.div>
                        )}
                        {index < totalSteps - 1 && (
                            <div className="relative flex-1">
                                <motion.div
                                    key={`line-${index}`}
                                    className={`absolute inset-0 h-0.5 bg-violet-700 z-10 origin-left`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: currentStep > index ? 1 : 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "linear",
                                        type: 'spring',
                                        stiffness: 100, // Adjust the stiffness to your preference
                                        damping: 10, // Adjust the damping to control the "bounciness"
                                        mass: 1, // Adjust the mass if needed
                                        restDelta: 0.001 // Optional: defines when the animation is considered at rest
                                    }}

                                />
                                <div
                                    key={`line-${index}-animated`}
                                    className={`absolute inset-0 h-0.5 bg-zinc-600`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default StepIndicator;

const completedStep = () => {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            initial={{
                scale: 0
            }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <rect width="48" height="48" rx="24" fill="#6D28D9" />
            <path
                d="M31 19L21.375 29L17 24.4545"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </motion.svg>
    );
};