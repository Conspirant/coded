import React from 'react';
import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const BuyMeACoffeeWidget = () => {
    return (
        <motion.a
            href="https://buymeacoffee.com/kcetcoded"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-black/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="p-1.5 bg-black/10 rounded-full">
                <Coffee className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Buy me a coffee</span>
        </motion.a>
    );
};
