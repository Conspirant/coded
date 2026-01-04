import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { branchItems, LoadoutItem } from "@/data/loadoutData";
import {
    Laptop, Keyboard, Monitor, Glasses,
    DraftingCompass, Shirt, Ruler,
    Coffee, Plug, Headphones,
    Gamepad2, Info, ShoppingCart, Share2
} from "lucide-react";

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
    Laptop, Keyboard, Monitor, Glasses,
    DraftingCompass, Shirt, Ruler,
    Coffee, Plug, Headphones
};

const Loadout = () => {
    const [selectedBranch, setSelectedBranch] = useState("CS_IS");
    const [selectedItem, setSelectedItem] = useState<LoadoutItem | null>(null);

    const getInventorySlots = (branch: string) => {
        // Combine Branch items + Common Hostel items
        const items = [...(branchItems[branch] || []), ...branchItems["HOSTEL"]];
        // Pad to 15 slots for the grid
        const totalSlots = 15;
        const filledSlots = items.map((item, index) => ({ ...item, slotIndex: index, status: "locked" }));
        const emptySlots = Array(totalSlots - items.length).fill(null);
        return [...filledSlots, ...emptySlots];
    };

    const handleSlotClick = (item: any) => {
        if (item) {
            setSelectedItem(item);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl animate-fade-in space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                        The Engineering Loadout
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Equip yourself for the semester. Don't go into battle unprepared.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Share2 className="h-4 w-4" /> Share Build
                    </Button>
                </div>
            </div>

            {/* Class/Branch Selection */}
            <Tabs defaultValue="CS_IS" onValueChange={setSelectedBranch} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="CS_IS">CSE / ISE / ECE</TabsTrigger>
                    <TabsTrigger value="MECH_CIVIL">Mech / Civil</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedBranch} className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Inventory Grid (The "Game" Part) */}
                        <Card className="lg:col-span-2 border-2 border-primary/20 bg-secondary/5">
                            <CardHeader>
                                <CardTitle>Inventory Slots</CardTitle>
                                <CardDescription>Click on an item to inspect.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {getInventorySlots(selectedBranch).map((item, idx) => {
                                        const Icon = item ? IconMap[item.icon] : null;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleSlotClick(item)}
                                                className={`
                           aspect-square rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95
                           ${item
                                                        ? "bg-card border-primary/40 hover:border-primary hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                                        : "bg-background/50 border-dashed border-muted-foreground/20 cursor-default"
                                                    }
                         `}
                                            >
                                                {item ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Icon className={`h-8 w-8 ${item.category === 'tech' ? 'text-blue-500' : item.category === 'hostel' ? 'text-orange-500' : 'text-green-500'}`} />
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground/80 truncate w-16 text-center">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/20 font-mono">EMPTY</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats / Info Panel */}
                        <Card className="flex flex-col">
                            <CardHeader className="bg-muted/50 pb-4">
                                <CardTitle className="text-lg">Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-6 space-y-6">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Completion</div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[30%]" />
                                    </div>
                                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                                        <span>Starter Gear</span>
                                        <span>30%</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Tech Score</span>
                                        <span className="font-bold">450</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Survival</span>
                                        <span className="font-bold">280</span>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                                    <Info className="h-5 w-5 shrink-0" />
                                    <p>Equip items to increase your stats and survive the 4-year campaign.</p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </TabsContent>
            </Tabs>

            {/* Item Details Dialog (The Monetization Hook) */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                {selectedItem && IconMap[selectedItem.icon] &&
                                    (() => {
                                        const Icon = IconMap[selectedItem.icon];
                                        return <Icon className="h-6 w-6" />;
                                    })()
                                }
                            </div>
                            <div>
                                <DialogTitle className="text-xl">{selectedItem?.name}</DialogTitle>
                                <Badge variant={selectedItem?.essentialLevel === 'critical' ? 'destructive' : 'secondary'} className="mt-1">
                                    {selectedItem?.essentialLevel}
                                </Badge>
                            </div>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            {selectedItem?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted/50 p-4 rounded-lg my-4">
                        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Effect</div>
                        <p className="text-sm font-medium">Increases productivity by 15%. Reduces stress by 10%.</p>
                    </div>

                    <DialogFooter className="sm:justify-between gap-2">
                        <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                            Close
                        </Button>
                        <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Acquire (Amazon)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Loadout;
