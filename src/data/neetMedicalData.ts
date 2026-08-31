export interface NeetCollegeRecord {
  id: string;
  code: string; // KEA UG-NEET College Code (e.g., M001, M002)
  name: string;
  shortName: string;
  location: string;
  district: string;
  type: "Government" | "Private" | "Deemed" | "Minority";
  established: number;
  hospitalBeds: number;
  totalMbbsSeats: number;
  totalBdsSeats?: number;
  affiliatedTo: string;
  website?: string;
  quotas: {
    govtSeatGovtFee?: number; // Annual Tuition
    govtSeatPvtFee?: number;
    pvtSeatFee?: number;
    nriFee?: number;
  };
  cutoffs: {
    year: number;
    round: "R1" | "R2" | "R3" | "MOPUP";
    categoryCutoffs: Record<string, number>; // e.g., { 'GM': 4520, '2AG': 9800, 'SCG': 42100, 'GMP': 18500, 'OPN': 22000 }
  }[];
}

export const KARNATAKA_MEDICAL_COLLEGES: NeetCollegeRecord[] = [
  {
    id: "m001-bmcri",
    code: "M001",
    name: "Bangalore Medical College and Research Institute (BMCRI)",
    shortName: "BMCRI Bangalore",
    location: "Fort, K.R. Road, Bengaluru",
    district: "Bengaluru Urban",
    type: "Government",
    established: 1955,
    hospitalBeds: 2800,
    totalMbbsSeats: 250,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 2850,
          "2AG": 6200,
          "2BG": 4800,
          "3AG": 3500,
          "3BG": 3200,
          SCG: 29500,
          STG: 24200,
          GMK: 3400,
          GMR: 3600,
        },
      },
      {
        year: 2025,
        round: "R2",
        categoryCutoffs: {
          GM: 3420,
          "2AG": 7100,
          "2BG": 5400,
          "3AG": 4100,
          "3BG": 3800,
          SCG: 34200,
          STG: 28900,
        },
      },
    ],
  },
  {
    id: "m002-mmcri",
    code: "M002",
    name: "Mysore Medical College and Research Institute (MMCRI)",
    shortName: "MMCRI Mysore",
    location: "Irwin Road, Mysuru",
    district: "Mysuru",
    type: "Government",
    established: 1924,
    hospitalBeds: 1800,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 7450,
          "2AG": 13200,
          "2BG": 10500,
          "3AG": 8900,
          "3BG": 8100,
          SCG: 48500,
          STG: 41200,
          GMK: 8600,
          GMR: 9100,
        },
      },
      {
        year: 2025,
        round: "R2",
        categoryCutoffs: {
          GM: 9100,
          "2AG": 15400,
          "2BG": 12100,
          "3AG": 10200,
          "3BG": 9700,
          SCG: 55600,
          STG: 48900,
        },
      },
    ],
  },
  {
    id: "m003-kims-hubballi",
    code: "M003",
    name: "Karnataka Institute of Medical Sciences (KIMS)",
    shortName: "KIMS Hubballi",
    location: "Vidyanagar, Hubballi",
    district: "Dharwad",
    type: "Government",
    established: 1957,
    hospitalBeds: 1600,
    totalMbbsSeats: 200,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 12400,
          "2AG": 21500,
          "2BG": 17800,
          "3AG": 14200,
          "3BG": 13100,
          SCG: 68400,
          STG: 56900,
        },
      },
    ],
  },
  {
    id: "m004-st-johns",
    code: "M004",
    name: "St. John's Medical College",
    shortName: "St. John's Bengaluru",
    location: "Sarjapur Road, John Nagar, Bengaluru",
    district: "Bengaluru Urban",
    type: "Minority",
    established: 1963,
    hospitalBeds: 1400,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 780000,
      pvtSeatFee: 1150000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 6800,
          GMP: 9500,
          OPN: 11200,
          CHR: 38500,
        },
      },
    ],
  },
  {
    id: "m005-ms-ramaiah",
    code: "M005",
    name: "M.S. Ramaiah Medical College",
    shortName: "Ramaiah Medical Bengaluru",
    location: "MSR Nagar, MSRIT Post, Mathikere, Bengaluru",
    district: "Bengaluru Urban",
    type: "Private",
    established: 1979,
    hospitalBeds: 1350,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
      nriFee: 3600000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 11200,
          "2AG": 22100,
          "2BG": 18400,
          "3AG": 13900,
          "3BG": 12600,
          SCG: 72000,
          GMP: 24500,
          OPN: 28900,
        },
      },
    ],
  },
  {
    id: "m006-kempegowda-kims",
    code: "M006",
    name: "Kempegowda Institute of Medical Sciences (KIMS Bangalore)",
    shortName: "KIMS Bangalore",
    location: "Banashankari 2nd Stage, Bengaluru",
    district: "Bengaluru Urban",
    type: "Private",
    established: 1980,
    hospitalBeds: 1200,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
      nriFee: 3200000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 16500,
          "2AG": 28400,
          "2BG": 23500,
          "3AG": 18200,
          "3BG": 17400,
          SCG: 84500,
          GMP: 36500,
          OPN: 42000,
        },
      },
    ],
  },
  {
    id: "m007-vims-ballari",
    code: "M007",
    name: "Vijayanagar Institute of Medical Sciences (VIMS)",
    shortName: "VIMS Ballari",
    location: "Cantonment, Ballari",
    district: "Ballari",
    type: "Government",
    established: 1961,
    hospitalBeds: 1450,
    totalMbbsSeats: 200,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 18900,
          "2AG": 31200,
          "2BG": 26800,
          "3AG": 21500,
          "3BG": 19800,
          SCG: 89500,
          STG: 78000,
        },
      },
    ],
  },
  {
    id: "m008-father-muller",
    code: "M008",
    name: "Father Muller Medical College",
    shortName: "Father Muller Mangalore",
    location: "Kankanady, Mangaluru",
    district: "Dakshina Kannada",
    type: "Minority",
    established: 1999,
    hospitalBeds: 1250,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 19800,
          "2AG": 33500,
          "2BG": 28900,
          "3AG": 22400,
          "3BG": 21100,
          GMP: 41200,
          OPN: 47800,
        },
      },
    ],
  },
  {
    id: "m009-jjm-davangere",
    code: "M009",
    name: "J.J.M. Medical College",
    shortName: "JJM Davangere",
    location: "MCC B Block, Davangere",
    district: "Davangere",
    type: "Private",
    established: 1965,
    hospitalBeds: 1500,
    totalMbbsSeats: 250,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 21500,
          "2AG": 36800,
          "2BG": 31400,
          "3AG": 24200,
          "3BG": 22900,
          SCG: 96000,
          GMP: 46500,
          OPN: 54000,
        },
      },
    ],
  },
  {
    id: "m010-bowring-lady-curzon",
    code: "M010",
    name: "Shri Atal Bihari Vajpayee Medical College & Research Institute (Bowring)",
    shortName: "Bowring Lady Curzon Bengaluru",
    location: "Lady Curzon Road, Tasker Town, Bengaluru",
    district: "Bengaluru Urban",
    type: "Government",
    established: 2019,
    hospitalBeds: 900,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 10800,
          "2AG": 19200,
          "2BG": 15400,
          "3AG": 12800,
          "3BG": 11900,
          SCG: 64500,
          STG: 52100,
        },
      },
    ],
  },
  {
    id: "m011-kmc-manipal-mangalore",
    code: "M011",
    name: "Kasturba Medical College (KMC Mangalore)",
    shortName: "KMC Mangalore (MAHE)",
    location: "Light House Hill Road, Mangaluru",
    district: "Dakshina Kannada",
    type: "Deemed",
    established: 1953,
    hospitalBeds: 1650,
    totalMbbsSeats: 250,
    affiliatedTo: "Manipal Academy of Higher Education (MAHE)",
    quotas: {
      pvtSeatFee: 1780000,
      nriFee: 4200000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 38200,
          OPN: 38200,
          MNG: 44000,
        },
      },
    ],
  },
  {
    id: "m012-jss-mysore",
    code: "M012",
    name: "JSS Medical College",
    shortName: "JSS Medical Mysuru",
    location: "Bannimantap, Mysuru",
    district: "Mysuru",
    type: "Deemed",
    established: 1984,
    hospitalBeds: 1800,
    totalMbbsSeats: 250,
    affiliatedTo: "JSS AHER Deemed University",
    quotas: {
      pvtSeatFee: 1980000,
      nriFee: 4000000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 54000,
          OPN: 54000,
          MNG: 62000,
        },
      },
    ],
  },
  {
    id: "m013-vydehi-ims",
    code: "M013",
    name: "Vydehi Institute of Medical Sciences and Research Centre",
    shortName: "Vydehi Medical Bengaluru",
    location: "EPIP Area, Whitefield, Bengaluru",
    district: "Bengaluru Urban",
    type: "Private",
    established: 2000,
    hospitalBeds: 1600,
    totalMbbsSeats: 250,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
      nriFee: 3400000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 23400,
          "2AG": 39500,
          "2BG": 34100,
          "3AG": 26800,
          "3BG": 25200,
          SCG: 104000,
          GMP: 52000,
          OPN: 59000,
        },
      },
    ],
  },
  {
    id: "m014-bgs-global-bangalore",
    code: "M014",
    name: "BGS Global Institute of Medical Sciences",
    shortName: "BGS GIMS Bengaluru",
    location: "Kengeri, Bengaluru",
    district: "Bengaluru Urban",
    type: "Private",
    established: 2013,
    hospitalBeds: 850,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatPvtFee: 141196,
      pvtSeatFee: 1150000,
      nriFee: 3200000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 26800,
          "2AG": 44500,
          "2BG": 39000,
          "3AG": 30500,
          "3BG": 28900,
          SCG: 112000,
          GMP: 58000,
          OPN: 66000,
        },
      },
    ],
  },
  {
    id: "m015-shimoga-sims",
    code: "M015",
    name: "Shivamogga Institute of Medical Sciences (SIMS)",
    shortName: "SIMS Shivamogga",
    location: "Sagar Road, Shivamogga",
    district: "Shivamogga",
    type: "Government",
    established: 2005,
    hospitalBeds: 1050,
    totalMbbsSeats: 150,
    affiliatedTo: "RGUHS Bengaluru",
    quotas: {
      govtSeatGovtFee: 140000,
    },
    cutoffs: [
      {
        year: 2025,
        round: "R1",
        categoryCutoffs: {
          GM: 16200,
          "2AG": 27400,
          "2BG": 22900,
          "3AG": 18500,
          "3BG": 17200,
          SCG: 82000,
          STG: 69500,
        },
      },
    ],
  },
];

export const NEET_CATEGORY_LIST = [
  { code: "GM", label: "General Merit (GM)", desc: "Open to all Karnataka candidates" },
  { code: "2AG", label: "Category 2A General", desc: "15% Karnataka OBC quota" },
  { code: "2BG", label: "Category 2B General", desc: "4% Karnataka Muslim minority quota" },
  { code: "3AG", label: "Category 3A General", desc: "4% Karnataka Vokkaliga & aligned quota" },
  { code: "3BG", label: "Category 3B General", desc: "5% Karnataka Lingayat & aligned quota" },
  { code: "SCG", label: "Scheduled Caste General (SC)", desc: "15% Karnataka SC quota" },
  { code: "STG", label: "Scheduled Tribe General (ST)", desc: "3% Karnataka ST quota" },
  { code: "GMP", label: "General Merit Private (GMP)", desc: "Karnataka domicile in Private Colleges" },
  { code: "OPN", label: "Open Quota (OPN)", desc: "Open to All-India candidates in Karnataka Pvt Colleges" },
  { code: "HKR", label: "Hyderabad-Karnataka (371J)", desc: "Special reservation for 6 Kalyana-Karnataka districts" },
];
