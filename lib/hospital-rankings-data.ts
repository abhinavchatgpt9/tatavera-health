// Source-backed ranking data. Every rank below was read from the publisher's own page on 18 November 2026.
// Do not add, edit or reorder entries from memory: re-read the source and update RANKING_SOURCES dates too.
// Scores are only comparable inside the same list. No Tatvavera scores or star ratings exist here.

export type RankedHospital = {
  id: string;
  name: string;
  city: string;
  /** Rank in Newsweek / Statista "World's Best Hospitals 2026 - India". Null when the hospital is not in that list. */
  overallRank: number | null;
  overallScore: number | null;
};

export const RANKING_SOURCES = {
  overall: {
    publisher: 'Newsweek / Statista',
    title: "World's Best Hospitals 2026 - India",
    edition: '2026',
    url: 'https://rankings.newsweek.com/worlds-best-hospitals-2026/india',
    checked: '18 November 2026',
    note: 'Peer recommendations, hospital quality metrics, patient experience data and a PROMs survey. Scores are comparable only inside the India list.',
  },
  specialty: {
    publisher: 'Newsweek / Statista',
    title: "World's Best Specialized Hospitals 2027",
    edition: '2027 (published 2026)',
    url: 'https://rankings.newsweek.com/worlds-best-specialized-hospitals-2027',
    checked: '18 November 2026',
    note: 'Global lists. Ranks shown are the hospital\'s position among hospitals worldwide in that specialty.',
  },
} as const;

export type SpecialtyKey = 'cardiac-surgery' | 'cardiology' | 'gastroenterology' | 'neurosurgery';

export const SPECIALTY_RANKS: Record<SpecialtyKey, { label: string; ranks: Array<{ hospitalId: string; rank: number }> }> = {
  "cardiac-surgery": {
    "label": "Cardiac Surgery",
    "ranks": [
      {
        "hospitalId": "all-india-institute-of-medical-sciences-delhi",
        "rank": 44
      },
      {
        "hospitalId": "narayana-institute-of-cardiac-sciences",
        "rank": 53
      },
      {
        "hospitalId": "fortis-escorts-heart-institute",
        "rank": 63
      },
      {
        "hospitalId": "cmc-vellore-town-campus",
        "rank": 110
      },
      {
        "hospitalId": "medanta-the-medicity",
        "rank": 119
      },
      {
        "hospitalId": "apollo-hospitals-greams-road-chennai",
        "rank": 135
      }
    ]
  },
  "cardiology": {
    "label": "Cardiology",
    "ranks": [
      {
        "hospitalId": "apollo-hospitals-greams-road-chennai",
        "rank": 91
      },
      {
        "hospitalId": "medanta-the-medicity",
        "rank": 105
      },
      {
        "hospitalId": "all-india-institute-of-medical-sciences-delhi",
        "rank": 117
      },
      {
        "hospitalId": "narayana-institute-of-cardiac-sciences",
        "rank": 119
      },
      {
        "hospitalId": "breach-candy-hospital-trust",
        "rank": 128
      },
      {
        "hospitalId": "pgimer-postgraduate-institute-of-medical-education-and-research",
        "rank": 170
      },
      {
        "hospitalId": "fortis-escorts-heart-institute",
        "rank": 180
      }
    ]
  },
  "gastroenterology": {
    "label": "Gastroenterology",
    "ranks": [
      {
        "hospitalId": "asian-institute-of-gastroenterology",
        "rank": 49
      },
      {
        "hospitalId": "all-india-institute-of-medical-sciences-delhi",
        "rank": 91
      },
      {
        "hospitalId": "apollo-hospitals-greams-road-chennai",
        "rank": 121
      }
    ]
  },
  "neurosurgery": {
    "label": "Neurosurgery",
    "ranks": [
      {
        "hospitalId": "all-india-institute-of-medical-sciences-delhi",
        "rank": 55
      }
    ]
  }
};

/** Recognised specialist hospitals the publisher lists without a rank in the India list. */
export const SPECIALIST_MENTIONS: Array<{ hospitalId: string; specialty: string }> = [
  { hospitalId: 'fortis-escorts-heart-institute', specialty: 'Cardiology' },
  { hospitalId: 'tata-memorial-hospital', specialty: 'Oncology' },
  { hospitalId: 'apollo-childrens-hospital-chennai', specialty: 'Pediatrics' },
];

export const RANKED_HOSPITALS: RankedHospital[] = [
  {
    "id": "medanta-the-medicity",
    "name": "Medanta - The Medicity",
    "city": "Gurugram",
    "overallRank": 1,
    "overallScore": 90.9
  },
  {
    "id": "all-india-institute-of-medical-sciences-delhi",
    "name": "All India Institute of Medical Sciences - Delhi",
    "city": "New Delhi",
    "overallRank": 2,
    "overallScore": 90.29
  },
  {
    "id": "pgimer-postgraduate-institute-of-medical-education-and-research",
    "name": "PGIMER - Postgraduate Institute of Medical Education and Research",
    "city": "Chandigarh",
    "overallRank": 3,
    "overallScore": 85.96
  },
  {
    "id": "cmc-vellore-town-campus",
    "name": "CMC Vellore - Town Campus",
    "city": "Vellore",
    "overallRank": 4,
    "overallScore": 81.39
  },
  {
    "id": "kokilaben-dhirubhai-ambani-hospital-medical-research-institute",
    "name": "Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute",
    "city": "Mumbai",
    "overallRank": 5,
    "overallScore": 78.94
  },
  {
    "id": "apollo-hospitals-greams-road-chennai",
    "name": "Apollo Hospitals - Greams Road Chennai",
    "city": "Chennai",
    "overallRank": 6,
    "overallScore": 76.95
  },
  {
    "id": "breach-candy-hospital-trust",
    "name": "Breach Candy Hospital Trust",
    "city": "Mumbai",
    "overallRank": 7,
    "overallScore": 76.6
  },
  {
    "id": "jaslok-hospital-and-research-centre",
    "name": "Jaslok Hospital and Research Centre",
    "city": "Mumbai",
    "overallRank": 8,
    "overallScore": 75.42
  },
  {
    "id": "sir-ganga-ram-hospital",
    "name": "Sir Ganga Ram Hospital",
    "city": "New Delhi",
    "overallRank": 9,
    "overallScore": 75.39
  },
  {
    "id": "p-d-hinduja-national-hospital-medical-research-centre",
    "name": "P. D. Hinduja National Hospital & Medical Research Centre",
    "city": "Mumbai",
    "overallRank": 10,
    "overallScore": 75.09
  },
  {
    "id": "max-super-speciality-hospital-saket",
    "name": "Max Super Speciality Hospital - Saket",
    "city": "New Delhi",
    "overallRank": 11,
    "overallScore": 72.77
  },
  {
    "id": "aster-cmi-hospital",
    "name": "Aster - CMI Hospital",
    "city": "Bengaluru",
    "overallRank": 12,
    "overallScore": 72.29
  },
  {
    "id": "apollo-hospitals-delhi",
    "name": "Apollo Hospitals - Delhi",
    "city": "New Delhi",
    "overallRank": 13,
    "overallScore": 71.88
  },
  {
    "id": "fortis-memorial-research-institute",
    "name": "Fortis - Memorial Research Institute",
    "city": "Gurugram",
    "overallRank": 14,
    "overallScore": 71.87
  },
  {
    "id": "jawaharlal-institute-of-postgraduate-medical-education-and-research",
    "name": "Jawaharlal Institute of Postgraduate Medical Education and Research",
    "city": "Puducherry",
    "overallRank": 15,
    "overallScore": 69.28
  },
  {
    "id": "kauvery-hospital",
    "name": "Kauvery Hospital",
    "city": "Chennai",
    "overallRank": 16,
    "overallScore": 68.52
  },
  {
    "id": "lilavati-hospital-and-research-centre",
    "name": "Lilavati Hospital and Research Centre",
    "city": "Mumbai",
    "overallRank": 17,
    "overallScore": 68.51
  },
  {
    "id": "manipal-hospital-old-airport-road",
    "name": "Manipal Hospital - Old Airport Road",
    "city": "Bengaluru",
    "overallRank": 18,
    "overallScore": 68.38
  },
  {
    "id": "marengo-cims-hospital-ahmedabad",
    "name": "Marengo CIMS Hospital Ahmedabad",
    "city": "Ahmedabad",
    "overallRank": 19,
    "overallScore": 68.37
  },
  {
    "id": "king-edward-memorial-hospital",
    "name": "King Edward Memorial Hospital",
    "city": "Mumbai",
    "overallRank": 20,
    "overallScore": 68.35
  },
  {
    "id": "apollo-hospitals-secunderabad",
    "name": "Apollo Hospitals - Secunderabad",
    "city": "Secunderabad",
    "overallRank": 21,
    "overallScore": 68.34
  },
  {
    "id": "fortis-hiranandani-hospital",
    "name": "Fortis - Hiranandani Hospital",
    "city": "Navi Mumbai",
    "overallRank": 22,
    "overallScore": 68.33
  },
  {
    "id": "safdarjung-hospital",
    "name": "Safdarjung Hospital",
    "city": "New Delhi",
    "overallRank": 23,
    "overallScore": 68.32
  },
  {
    "id": "nanavati-max-super-speciality-hospital",
    "name": "Nanavati-Max Super Speciality Hospital",
    "city": "Mumbai",
    "overallRank": 24,
    "overallScore": 68.3
  },
  {
    "id": "bombay-hospital-medical-research-centre",
    "name": "Bombay Hospital & Medical Research Centre",
    "city": "Mumbai",
    "overallRank": 25,
    "overallScore": 68.28
  },
  {
    "id": "fortis-flt-lt-rajan-dhall-hospital",
    "name": "Fortis - Flt. Lt. Rajan Dhall Hospital",
    "city": "New Delhi",
    "overallRank": 26,
    "overallScore": 68.27
  },
  {
    "id": "apollo-hospitals-navi-mumbai",
    "name": "Apollo Hospitals - Navi Mumbai",
    "city": "Navi Mumbai",
    "overallRank": 27,
    "overallScore": 68.24
  },
  {
    "id": "aster-medcity",
    "name": "Aster - Medcity",
    "city": "Kochi",
    "overallRank": 28,
    "overallScore": 68.23
  },
  {
    "id": "apollo-hospitals-international-ahmedabad",
    "name": "Apollo Hospitals International - Ahmedabad",
    "city": "Ahmedabad",
    "overallRank": 29,
    "overallScore": 68.06
  },
  {
    "id": "apollo-hospitals-bannerghatta-road",
    "name": "Apollo Hospitals - Bannerghatta Road",
    "city": "Bengaluru",
    "overallRank": 30,
    "overallScore": 68.05
  },
  {
    "id": "apollo-hospitals-jubilee-hills",
    "name": "Apollo Hospitals - Jubilee Hills",
    "city": "Hyderabad",
    "overallRank": 31,
    "overallScore": 67.71
  },
  {
    "id": "dr-l-h-hiranandani-hospital",
    "name": "Dr. L H Hiranandani Hospital",
    "city": "Mumbai",
    "overallRank": 32,
    "overallScore": 67.3
  },
  {
    "id": "dr-ram-manohar-lohia-hospital",
    "name": "Dr. Ram Manohar Lohia Hospital",
    "city": "New Delhi",
    "overallRank": 33,
    "overallScore": 66.83
  },
  {
    "id": "apollo-specialty-hospitals-vanagaram",
    "name": "Apollo Specialty Hospitals - Vanagaram",
    "city": "Chennai",
    "overallRank": 34,
    "overallScore": 66.31
  },
  {
    "id": "fortis-hospital-mulund",
    "name": "Fortis - Hospital Mulund",
    "city": "Mumbai",
    "overallRank": 35,
    "overallScore": 65.62
  },
  {
    "id": "manipal-hospital-salt-lake",
    "name": "Manipal Hospital - Salt Lake",
    "city": "Kolkata",
    "overallRank": 36,
    "overallScore": 65.27
  },
  {
    "id": "saifee-hospital",
    "name": "Saifee Hospital",
    "city": "Mumbai",
    "overallRank": 37,
    "overallScore": 65.1
  },
  {
    "id": "yashoda-hospitals-somajiguda",
    "name": "Yashoda Hospitals - Somajiguda",
    "city": "Hyderabad",
    "overallRank": 38,
    "overallScore": 65.02
  },
  {
    "id": "all-india-institute-of-medical-sciences-raipur",
    "name": "All India Institute of Medical Sciences - Raipur",
    "city": "Raipur",
    "overallRank": 39,
    "overallScore": 65.01
  },
  {
    "id": "sir-h-n-reliance-foundation-hospital-and-research-centre",
    "name": "Sir H. N. Reliance Foundation Hospital and Research Centre",
    "city": "Mumbai",
    "overallRank": 40,
    "overallScore": 64.83
  },
  {
    "id": "gleneagles-bgs-hospital",
    "name": "Gleneagles - BGS Hospital",
    "city": "Bengaluru",
    "overallRank": 41,
    "overallScore": 64.71
  },
  {
    "id": "blk-max-super-specialty-hospital",
    "name": "BLK-Max Super Specialty Hospital",
    "city": "New Delhi",
    "overallRank": 42,
    "overallScore": 64.63
  },
  {
    "id": "sterling-hospital-ahmedabad",
    "name": "Sterling Hospital Ahmedabad",
    "city": "Ahmedabad",
    "overallRank": 43,
    "overallScore": 64.49
  },
  {
    "id": "gleneagles-hospital-lakdi-ka-pul",
    "name": "Gleneagles Hospital - Lakdi-Ka-Pul",
    "city": "Hyderabad",
    "overallRank": 44,
    "overallScore": 64.44
  },
  {
    "id": "mgm-healthcare",
    "name": "MGM Healthcare",
    "city": "Chennai",
    "overallRank": 45,
    "overallScore": 64.41
  },
  {
    "id": "lok-nayak-hospital",
    "name": "Lok Nayak Hospital",
    "city": "New Delhi",
    "overallRank": 46,
    "overallScore": 64.4
  },
  {
    "id": "the-madras-medical-mission-hospital",
    "name": "The Madras Medical Mission Hospital",
    "city": "Chennai",
    "overallRank": 47,
    "overallScore": 64.39
  },
  {
    "id": "amrita-hospital-kochi",
    "name": "Amrita Hospital - Kochi",
    "city": "Kochi",
    "overallRank": 48,
    "overallScore": 64.37
  },
  {
    "id": "gleneagles-hospital-perumbakkam-sholinganallur-chennai",
    "name": "Gleneagles Hospital - Perumbakkam, Sholinganallur, Chennai",
    "city": "Chennai",
    "overallRank": 49,
    "overallScore": 64.35
  },
  {
    "id": "gleneagles-hospital-parel",
    "name": "Gleneagles Hospital - Parel",
    "city": "Mumbai",
    "overallRank": 50,
    "overallScore": 64.34
  },
  {
    "id": "artemis-hospital-gurgaon",
    "name": "Artemis Hospital Gurgaon",
    "city": "Gurugram",
    "overallRank": 51,
    "overallScore": 64.25
  },
  {
    "id": "all-india-institute-of-medical-sciences-bhubaneswar",
    "name": "All India Institute of Medical Sciences - Bhubaneswar",
    "city": "Bhubaneswar",
    "overallRank": 52,
    "overallScore": 64.24
  },
  {
    "id": "aakash-hospital",
    "name": "Aakash Hospital",
    "city": "Chennai",
    "overallRank": 53,
    "overallScore": 64.21
  },
  {
    "id": "ruby-hall-clinic-sassoon-road",
    "name": "Ruby Hall Clinic, Sassoon Road",
    "city": "Pune",
    "overallRank": 54,
    "overallScore": 64.2
  },
  {
    "id": "yashoda-hospitals-malakpet",
    "name": "Yashoda Hospitals - Malakpet",
    "city": "Hyderabad",
    "overallRank": 55,
    "overallScore": 64.18
  },
  {
    "id": "fortis-hospital-nagarbhavi",
    "name": "Fortis - Hospital Nagarbhavi",
    "city": "Bengaluru",
    "overallRank": 56,
    "overallScore": 64.16
  },
  {
    "id": "ruby-general-hospital",
    "name": "Ruby General Hospital",
    "city": "Kolkata",
    "overallRank": 57,
    "overallScore": 64.05
  },
  {
    "id": "aster-rv-hospital",
    "name": "Aster - RV Hospital",
    "city": "Bengaluru",
    "overallRank": 58,
    "overallScore": 63.96
  },
  {
    "id": "kimshealth-trivandrum",
    "name": "KIMSHEALTH Trivandrum",
    "city": "Trivandrum",
    "overallRank": 59,
    "overallScore": 63.94
  },
  {
    "id": "care-hospitals-banjara-hills",
    "name": "CARE Hospitals - Banjara Hills",
    "city": "Hyderabad",
    "overallRank": 60,
    "overallScore": 63.93
  },
  {
    "id": "manipal-hospital-whitefield",
    "name": "Manipal Hospital - Whitefield",
    "city": "Bengaluru",
    "overallRank": 61,
    "overallScore": 63.92
  },
  {
    "id": "institute-of-post-graduate-medical-education-and-research",
    "name": "Institute of Post Graduate Medical Education and Research",
    "city": "Kolkata",
    "overallRank": 62,
    "overallScore": 63.91
  },
  {
    "id": "ramaiah-memorial-hospital",
    "name": "Ramaiah Memorial Hospital",
    "city": "Bengaluru",
    "overallRank": 63,
    "overallScore": 63.87
  },
  {
    "id": "all-india-institute-of-medical-sciences-rishikesh",
    "name": "All India Institute of Medical Sciences - Rishikesh",
    "city": "Rishikesh",
    "overallRank": 64,
    "overallScore": 63.86
  },
  {
    "id": "meitra-hospital-calicut",
    "name": "Meitra Hospital, Calicut",
    "city": "Kozhikode",
    "overallRank": 65,
    "overallScore": 63.85
  },
  {
    "id": "yashoda-hospitals-secunderabad",
    "name": "Yashoda Hospitals - Secunderabad",
    "city": "Secunderabad",
    "overallRank": 66,
    "overallScore": 63.83
  },
  {
    "id": "manipal-hospital-kmc-hospital",
    "name": "Manipal Hospital - KMC Hospital",
    "city": "Mangaluru",
    "overallRank": 67,
    "overallScore": 63.73
  },
  {
    "id": "mgm-healthcare-malar-adyar",
    "name": "MGM Healthcare - Malar Adyar",
    "city": "Chennai",
    "overallRank": 68,
    "overallScore": 63.66
  },
  {
    "id": "manipal-hospital-vijayawada",
    "name": "Manipal Hospital - Vijayawada",
    "city": "Vijayawada",
    "overallRank": 69,
    "overallScore": 63.64
  },
  {
    "id": "apollo-bgs-hospitals-mysore",
    "name": "Apollo BGS Hospitals - Mysore",
    "city": "Mysore",
    "overallRank": 70,
    "overallScore": 63.63
  },
  {
    "id": "aster-mims-hospital",
    "name": "Aster - MIMS Hospital",
    "city": "Kozhikode",
    "overallRank": 71,
    "overallScore": 63.62
  },
  {
    "id": "medanta-super-specialty-hospital-indore",
    "name": "Medanta - Super Specialty Hospital, Indore",
    "city": "Indore",
    "overallRank": 72,
    "overallScore": 63.61
  },
  {
    "id": "sms-hospital",
    "name": "SMS Hospital",
    "city": "Jaipur",
    "overallRank": 73,
    "overallScore": 63.6
  },
  {
    "id": "continental-hospitals",
    "name": "Continental Hospitals",
    "city": "Hyderabad",
    "overallRank": 74,
    "overallScore": 63.59
  },
  {
    "id": "max-super-speciality-hospital-patparganj",
    "name": "Max Super Speciality Hospital - Patparganj",
    "city": "Delhi",
    "overallRank": 75,
    "overallScore": 63.58
  },
  {
    "id": "bangalore-baptist-hospital",
    "name": "Bangalore Baptist Hospital",
    "city": "Bengaluru",
    "overallRank": 76,
    "overallScore": 63.57
  },
  {
    "id": "all-india-institute-of-medical-sciences-patna",
    "name": "All India Institute of Medical Sciences - Patna",
    "city": "Patna",
    "overallRank": 77,
    "overallScore": 63.56
  },
  {
    "id": "st-john-s-medical-college-hospital",
    "name": "St. John's Medical College Hospital",
    "city": "Bengaluru",
    "overallRank": 78,
    "overallScore": 63.55
  },
  {
    "id": "rajagiri-hospital",
    "name": "Rajagiri Hospital",
    "city": "Kochi",
    "overallRank": 79,
    "overallScore": 63.53
  },
  {
    "id": "fortis-hospital-mohali",
    "name": "Fortis - Hospital Mohali",
    "city": "Mohali",
    "overallRank": 80,
    "overallScore": 63.51
  },
  {
    "id": "manipal-hospital-hebbal",
    "name": "Manipal Hospital - Hebbal",
    "city": "Bengaluru",
    "overallRank": 81,
    "overallScore": 63.48
  },
  {
    "id": "zydus-hospital-ahmedabad",
    "name": "Zydus Hospital - Ahmedabad",
    "city": "Ahmedabad",
    "overallRank": 82,
    "overallScore": 63.45
  },
  {
    "id": "ann-hospital",
    "name": "ANN Hospital",
    "city": "Chennai",
    "overallRank": 83,
    "overallScore": 63.37
  },
  {
    "id": "apollo-adlux-hospital",
    "name": "Apollo - Adlux Hospital",
    "city": "Angamaly",
    "overallRank": 84,
    "overallScore": 63.17
  },
  {
    "id": "baby-memorial-hospital",
    "name": "Baby Memorial Hospital",
    "city": "Kozhikode",
    "overallRank": 85,
    "overallScore": 63.13
  },
  {
    "id": "miot-international",
    "name": "MIOT International",
    "city": "Chennai",
    "overallRank": 86,
    "overallScore": 62.92
  },
  {
    "id": "max-super-speciality-hospital-sector-128-noida",
    "name": "Max Super Speciality Hospital - Sector-128, Noida",
    "city": "Noida",
    "overallRank": 87,
    "overallScore": 62.49
  },
  {
    "id": "fortis-escorts-hospital-jaipur",
    "name": "Fortis - Escorts Hospital Jaipur",
    "city": "Jaipur",
    "overallRank": 88,
    "overallScore": 62.4
  },
  {
    "id": "dayanand-medical-college-hospital",
    "name": "Dayanand Medical College & Hospital",
    "city": "Ludhiana",
    "overallRank": 89,
    "overallScore": 62.36
  },
  {
    "id": "manipal-hospital-mysore",
    "name": "Manipal Hospital - Mysore",
    "city": "Mysore",
    "overallRank": 90,
    "overallScore": 62.1
  },
  {
    "id": "cmc-vellore-ranipet-campus",
    "name": "CMC Vellore - Ranipet Campus",
    "city": "Vellore",
    "overallRank": 91,
    "overallScore": 62.06
  },
  {
    "id": "ahmedabad-institute-of-medical-services",
    "name": "Ahmedabad Institute of Medical Services",
    "city": "Ahmedabad",
    "overallRank": 92,
    "overallScore": 61.93
  },
  {
    "id": "vps-lakeshore-hospital",
    "name": "VPS Lakeshore Hospital",
    "city": "Kochi",
    "overallRank": 93,
    "overallScore": 61.85
  },
  {
    "id": "sri-ramachandra-medical-centre",
    "name": "Sri Ramachandra Medical Centre",
    "city": "Chennai",
    "overallRank": 94,
    "overallScore": 61.83
  },
  {
    "id": "a-one-hospital",
    "name": "A One Hospital",
    "city": "Lucknow",
    "overallRank": 95,
    "overallScore": 61.78
  },
  {
    "id": "sanjay-gandhi-postgraduate-institute-of-medical-sciences",
    "name": "Sanjay Gandhi Postgraduate Institute of Medical Sciences",
    "city": "Lucknow",
    "overallRank": 96,
    "overallScore": 61.62
  },
  {
    "id": "medanta-super-speciality-hospital-lucknow",
    "name": "Medanta - Super Speciality Hospital, Lucknow",
    "city": "Lucknow",
    "overallRank": 97,
    "overallScore": 61.53
  },
  {
    "id": "narayana-institute-of-cardiac-sciences",
    "name": "Narayana Institute of Cardiac Sciences",
    "city": "Bengaluru",
    "overallRank": null,
    "overallScore": null
  },
  {
    "id": "fortis-escorts-heart-institute",
    "name": "Fortis - Escorts Heart Institute",
    "city": "New Delhi",
    "overallRank": null,
    "overallScore": null
  },
  {
    "id": "asian-institute-of-gastroenterology",
    "name": "Asian Institute of Gastroenterology",
    "city": "Hyderabad",
    "overallRank": null,
    "overallScore": null
  },
  {
    "id": "tata-memorial-hospital",
    "name": "Tata Memorial Hospital",
    "city": "Mumbai",
    "overallRank": null,
    "overallScore": null
  },
  {
    "id": "apollo-childrens-hospital-chennai",
    "name": "Apollo Children's Hospital - Chennai",
    "city": "Chennai",
    "overallRank": null,
    "overallScore": null
  }
];
