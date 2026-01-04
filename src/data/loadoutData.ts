
export type LoadoutItem = {
    id: string;
    name: string;
    category: "tech" | "hostel" | "study" | "lifestyle";
    description: string;
    affiliateLink: string;
    icon: string; // Lucide icon name
    price?: string;
    essentialLevel: "critical" | "recommended" | "optional";
};

export const branchItems: Record<string, LoadoutItem[]> = {
    "CS_IS": [
        {
            id: "laptop_high_ram",
            name: "Performance Laptop",
            category: "tech",
            description: "Minimum 16GB RAM for compilation & VMs. Don't cheap out here.",
            affiliateLink: "https://amzn.to/example-laptop",
            icon: "Laptop",
            essentialLevel: "critical"
        },
        {
            id: "mech_keyboard",
            name: "Mech Keyboard",
            category: "tech",
            description: "For those long coding sessions. Blue switches for chaos, Red for stealth.",
            affiliateLink: "https://amzn.to/example-keyboard",
            icon: "Keyboard",
            essentialLevel: "optional"
        },
        {
            id: "monitor",
            name: "24\" Monitor",
            category: "tech",
            description: "Vertical orientation ready. Because reading code sideways is hard.",
            affiliateLink: "#",
            icon: "Monitor",
            essentialLevel: "recommended"
        },
        {
            id: "blue_light",
            name: "Anti-Glare Glasses",
            category: "lifestyle",
            description: "Save your eyes.",
            affiliateLink: "#",
            icon: "Glasses",
            essentialLevel: "recommended"
        }
    ],
    "MECH_CIVIL": [
        {
            id: "mini_drafter",
            name: "Mini Drafter",
            category: "study",
            description: "The classic weapon of choice. Omega brand recommended.",
            affiliateLink: "#",
            icon: "DraftingCompass",
            essentialLevel: "critical"
        },
        {
            id: "apron",
            name: "Workshop Apron",
            category: "lifestyle",
            description: "Khaki/Blue depending on college. Keeps grease off your soul.",
            affiliateLink: "#",
            icon: "Shirt",
            essentialLevel: "critical"
        },
        {
            id: "caliper",
            name: "Digital Vernier",
            category: "study",
            description: "Precision matters.",
            affiliateLink: "#",
            icon: "Ruler",
            essentialLevel: "recommended"
        }
    ],
    "HOSTEL": [
        {
            id: "kettle",
            name: "Electric Kettle",
            category: "hostel",
            description: "The lifeblood of hostel survival. Maggi, Coffee, Boiling Eggs.",
            affiliateLink: "#",
            icon: "Coffee",
            essentialLevel: "critical"
        },
        {
            id: "spike_buster",
            name: "Extension Box",
            category: "hostel",
            description: "One plug point for Laptop, Phone, Kettle, and Trimmer? Unlikely.",
            affiliateLink: "#",
            icon: "Plug",
            essentialLevel: "critical"
        },
        {
            id: "earplugs",
            name: "Noise Cancelling",
            category: "tech",
            description: "Roommates snore. Be ready.",
            affiliateLink: "#",
            icon: "Headphones",
            essentialLevel: "recommended"
        }
    ]
};
