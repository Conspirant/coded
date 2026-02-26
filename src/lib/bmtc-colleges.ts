/**
 * Real BMTC Bus route connectivity data for major Bangalore engineering colleges.
 * Sources: bmtcroutes.in, Moovit, official BMTC data, college websites
 * Data year: 2024-2025
 */

export interface BmtcRoute {
    id: string
    name: string
    color: string        // Tailwind bg class
    textColor: string    // Tailwind text class
    type: "Vajra" | "Ordinary" | "MetroFeeder" | "KIAL"
}

export interface BmtcCollege {
    code: string         // KCET institute code
    name: string
    area: string         // General area e.g., "South Bangalore", "Mysore Road"
    nearestStop: string  // Nearest BMTC bus stop
    walkTime: string     // Walking time from stop to college gate
    primaryRoutes: string[] // Key direct bus numbers (e.g., "500-D", "215-H")
    connectivityHubs: string[] // Major hubs it connects to easily (e.g., "Majestic", "Silk Board")
    transportType: "Excellent" | "Good" | "Fair" // Connectivity rating
}

export const BMTC_COLLEGES: BmtcCollege[] = [
    {
        code: "E005",
        name: "RV College of Engineering",
        area: "Mysore Road",
        nearestStop: "RV College Bus Stop",
        walkTime: "0 min (Stop is at gate)",
        primaryRoutes: ["222A", "226A", "223-D", "515-B", "D-6", "MF-40B"],
        connectivityHubs: ["Majestic", "Kengeri", "Shivajinagar", "Banashankari"],
        transportType: "Excellent"
    },
    {
        code: "E009",
        name: "PES University (Ring Road)",
        area: "Outer Ring Road (South)",
        nearestStop: "PES College Bus Stop",
        walkTime: "2 min",
        primaryRoutes: ["MF-510A", "410", "MF-13", "43D"],
        connectivityHubs: ["Banashankari TTMC", "Majestic", "Nagarbhavi"],
        transportType: "Excellent"
    },
    {
        code: "E001",
        name: "UVCE (KR Circle Campus)",
        area: "Central Bangalore",
        nearestStop: "K.R. Circle / Maharani College",
        walkTime: "3 min",
        primaryRoutes: ["215-H", "258", "298-MV", "365-P", "G-10"],
        connectivityHubs: ["Majestic", "Shivajinagar", "K.R. Market"],
        transportType: "Excellent"
    },
    {
        code: "E006",
        name: "MS Ramaiah Institute of Technology",
        area: "Mathikere / Yeshwanthpur",
        nearestStop: "MSRIT / Mathikere Post Office",
        walkTime: "4 min",
        primaryRoutes: ["266", "276-A", "401-K", "500-BA"],
        connectivityHubs: ["Yeshwanthpur TTMC", "Majestic", "Hebbal"],
        transportType: "Good"
    },
    {
        code: "E003",
        name: "BMS College of Engineering",
        area: "Basavanagudi",
        nearestStop: "Ramakrishna Ashram / Vidyapeeta",
        walkTime: "7 min",
        primaryRoutes: ["210-W", "213-H", "45-D", "45-G"],
        connectivityHubs: ["K.R. Market", "Majestic", "Jayanagar"],
        transportType: "Good"
    },
    {
        code: "E099",
        name: "New Horizon College of Engineering",
        area: "Outer Ring Road (East)",
        nearestStop: "Marathahalli Bridge",
        walkTime: "5 min",
        primaryRoutes: ["500-A", "500-L", "333", "KIA-8"],
        connectivityHubs: ["Silk Board", "K.R. Puram", "Hebbal", "Majestic"],
        transportType: "Excellent"
    },
    {
        code: "E007",
        name: "Dayananda Sagar College of Engg.",
        area: "Kumaraswamy Layout",
        nearestStop: "Kadirenahalli Cross / DSCE Stop",
        walkTime: "8 min",
        primaryRoutes: ["15-E", "210-R", "501-A", "V-BMT13"],
        connectivityHubs: ["Banashankari TTMC", "Majestic", "Jayanagar"],
        transportType: "Good"
    },
    {
        code: "E008",
        name: "Bangalore Institute of Technology",
        area: "V.V. Puram",
        nearestStop: "Makkala Koota / Sajjan Rao Circle",
        walkTime: "5 min",
        primaryRoutes: ["15-E", "210-E", "211-C", "213-M", "77"],
        connectivityHubs: ["K.R. Market", "Majestic"],
        transportType: "Excellent"
    },
    {
        code: "E115",
        name: "SJB Institute of Technology",
        area: "BGS Health City / Kengeri",
        nearestStop: "BGS Hospital Stop / Pattanagere",
        walkTime: "10 min",
        primaryRoutes: ["225-C", "225-A", "227 series"],
        connectivityHubs: ["Kengeri", "Majestic"],
        transportType: "Fair"
    },
    {
        code: "E107",
        name: "BNM Institute of Technology",
        area: "Banashankari 2nd Stage",
        nearestStop: "Banashankari BDA Complex",
        walkTime: "8 min",
        primaryRoutes: ["210 series", "2", "15 series"],
        connectivityHubs: ["Banashankari TTMC", "Jayanagar", "Majestic"],
        transportType: "Good"
    },
    {
        code: "E141",
        name: "PES University (Electronic City)",
        area: "Electronic City",
        nearestStop: "Electronic City Phase 1 / Velankani",
        walkTime: "12 min",
        primaryRoutes: ["356-C", "356-M", "600-F", "V-356"],
        connectivityHubs: ["Silk Board", "Majestic", "Banashankari"],
        transportType: "Good"
    },
    {
        code: "E097",
        name: "CMR Institute of Technology",
        area: "ITPL Main Road / Kundalahalli",
        nearestStop: "AECS Layout / Kundalahalli Gate",
        walkTime: "6 min",
        primaryRoutes: ["333", "335-E", "330", "500-C"],
        connectivityHubs: ["K.R. Puram", "Majestic", "Silk Board", "Shivajinagar"],
        transportType: "Excellent"
    },
    {
        code: "E118",
        name: "RNS Institute of Technology",
        area: "Channasandra / RR Nagar",
        nearestStop: "Channasandra / RNSIT Stop",
        walkTime: "4 min",
        primaryRoutes: ["223 series", "225 series", "374-E"],
        connectivityHubs: ["Kengeri", "Nagarbhavi", "Majestic"],
        transportType: "Good"
    },
    {
        code: "E126",
        name: "BMSIT&M",
        area: "Yelahanka",
        nearestStop: "Avalahalli / Nitte Meenakshi Stop",
        walkTime: "15 min",
        primaryRoutes: ["284-A", "285 series", "298 series"],
        connectivityHubs: ["Yelahanka", "Majestic"],
        transportType: "Fair"
    },
    {
        code: "E050",
        name: "NMIT",
        area: "Yelahanka",
        nearestStop: "NMIT Junction",
        walkTime: "12 min",
        primaryRoutes: ["284-A", "285 series"],
        connectivityHubs: ["Yelahanka", "Majestic"],
        transportType: "Fair"
    },
    {
        code: "E082",
        name: "JSS Academy of Technical Education",
        area: "Uttarahalli-Kengeri Road",
        nearestStop: "JSS College Stop (Uttarahalli)",
        walkTime: "2 min",
        primaryRoutes: ["375-A", "375-B", "225-C"],
        connectivityHubs: ["Banashankari", "Kengeri"],
        transportType: "Good"
    }
]
