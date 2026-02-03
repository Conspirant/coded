import React from 'react';
import { Coffee, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BuyMeACoffee = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Text Content */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 mb-4">
                                <Coffee className="h-4 w-4" />
                                <span className="text-sm font-medium">Support the Project</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Fuel the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                    Development
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Hi! I built KCET Coded to simplify college admissions. As a free tool developed in my spare time, your support helps me improve features, clean data, and keep the site 100% ad-free.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <a
                                href="https://buymeacoffee.com/kcetcoded"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button size="lg" className="w-full px-8 h-14 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-bold rounded-xl shadow-xl shadow-yellow-500/20 text-lg hover:scale-105 transition-all">
                                    <Coffee className="mr-2 h-6 w-6" />
                                    Buy me a coffee
                                </Button>
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="pt-8 border-t"
                        >
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Why support?
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                                    Keeps the tools free for everyone
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                                    Supports cleaning and verifying huge datasets
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                                    Motivates development of new features (like AI Counselor)
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Side - Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-orange-500/20 rounded-3xl blur-3xl -z-10" />
                        <Card className="p-6 border-0 bg-background/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                            <div className="aspect-video relative rounded-xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
                                <div className="text-center p-6">
                                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 shadow-xl flex items-center justify-center">
                                        <img
                                            src="https://cdn.buymeacoffee.com/buttons/1.0.0-btn-nl-mc-yellow.png"
                                            alt="Coffee"
                                            className="w-12 h-12 object-contain"
                                            onError={(e) => {
                                                // Fallback if image fails
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>';
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Thank You!</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Every coffee counts and helps us make education accessible.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-2xl font-bold">100%</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Free</div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-2xl font-bold">Open</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Source</div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-2xl font-bold">4 Students</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">By Students</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BuyMeACoffee;
