import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Users, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Compass, 
  Search, 
  Sparkles, 
  Filter, 
  ArrowLeft,
  X,
  HelpCircle,
  TrendingUp,
  Sliders,
  Check,
  Building2,
  Calendar,
  Layers,
  GraduationCap,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Navigation,
  RotateCcw,
  Map
} from 'lucide-react';

interface Course {
  code: string;
  name: string;
  level: 'undergraduate' | 'graduate' | 'postgraduate';
  description?: string;
}

interface Department {
  name: string;
  description: string;
  courseCount: number;
  courses: Course[];
}

interface College {
  name: string;
  description: string;
  departments: Department[];
  icon?: string;
}

interface Campus {
  name: string;
  slug: string;
  location: string;
  founded: number;
  description: string;
  tagline: string;
  stats: {
    students: string;
    courses: string;
    faculty: string;
    employmentRate: string;
  };
  specialties: string[];
  colleges: College[];
  landmarks: { name: string; desc: string }[];
  accentColor: string; // Tailwind color class like "amber-500"
  badgeColor: string; // background color like "bg-amber-500/10 text-amber-400"
  identityGradient: string; // class like "from-amber-600 to-amber-900"
  coordinate: { x: number; y: number }; // Relative position on SVG Map (0-100)
  region: 'Zamboanga & Sulu' | 'Northern & Central' | 'Southern';
}

const CAMPUSES_DATA: Campus[] = [
  {
    name: "MSU Main Campus (Marawi)",
    slug: "msu-main",
    location: "Marawi City, Lanao del Sur",
    founded: 1961,
    tagline: "The Majestic Flagship Citadel on the Hills",
    description: "The flagship campus of the Mindanao State University System. High on the hills of Marawi City overlooking Lake Lanao, MSU Main is legendary for its academic diversity, focus on regional peace-building, and profound cultural heritage.",
    stats: { students: "20,000+", courses: "150+", faculty: "1,200+", employmentRate: "88%" },
    specialties: ["Peace & Conflict Studies", "Islamic Arts & Letters", "Medicine & Healthcare", "Civil Law", "Engineering"],
    colleges: [
      {
        name: "College of Medicine",
        description: "World-class medical education and healthcare training",
        icon: "⚕️",
        departments: [
          {
            name: "Department of Anatomy",
            description: "Structure and function of human body systems",
            courseCount: 8,
            courses: [
              { code: "MED101", name: "Gross Anatomy I", level: "undergraduate" },
              { code: "MED102", name: "Histology & Embryology", level: "undergraduate" },
              { code: "MED201", name: "Neuroanatomy", level: "undergraduate" },
              { code: "MED301", name: "Advanced Anatomy", level: "graduate" },
              { code: "MED401", name: "Anatomical Research Seminar", level: "postgraduate" },
              { code: "MED102S", name: "Surgical Anatomy", level: "undergraduate" },
              { code: "MED105", name: "Embryology Specialized", level: "undergraduate" },
              { code: "MED203", name: "Clinical Anatomy for Surgery", level: "undergraduate" }
            ]
          },
          {
            name: "Department of Physiology",
            description: "Body systems functions and mechanisms",
            courseCount: 7,
            courses: [
              { code: "PHY101", name: "General Physiology", level: "undergraduate" },
              { code: "PHY102", name: "Cardiovascular Physiology", level: "undergraduate" },
              { code: "PHY103", name: "Respiratory Physiology", level: "undergraduate" },
              { code: "PHY201", name: "Clinical Physiology", level: "undergraduate" },
              { code: "PHY301", name: "Advanced Physiology", level: "graduate" },
              { code: "PHY302", name: "Renal & Endocrine Physiology", level: "graduate" },
              { code: "PHY401", name: "Physiology Research", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Pharmacology",
            description: "Drug interactions and therapeutic applications",
            courseCount: 6,
            courses: [
              { code: "PHAR101", name: "General Pharmacology", level: "undergraduate" },
              { code: "PHAR102", name: "Pharmacokinetics & Dynamics", level: "undergraduate" },
              { code: "PHAR201", name: "Clinical Pharmacology", level: "undergraduate" },
              { code: "PHAR202", name: "Drug Interactions & Toxicology", level: "undergraduate" },
              { code: "PHAR301", name: "Pharmacotherapy", level: "graduate" },
              { code: "PHAR401", name: "Pharmaceutical Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Law",
        description: "Legal education and justice system studies",
        icon: "⚖️",
        departments: [
          {
            name: "Department of Civil Law",
            description: "Property, contracts, and civil obligations",
            courseCount: 8,
            courses: [
              { code: "LAW101", name: "Introduction to Law", level: "undergraduate" },
              { code: "LAW102", name: "Civil Code Part I", level: "undergraduate" },
              { code: "LAW103", name: "Property Law", level: "undergraduate" },
              { code: "LAW201", name: "Contracts & Obligations", level: "undergraduate" },
              { code: "LAW202", name: "Family Law", level: "undergraduate" },
              { code: "LAW301", name: "Advanced Civil Law", level: "graduate" },
              { code: "LAW302", name: "Legal Interpretation Methods", level: "graduate" },
              { code: "LAW401", name: "Civil Law Research Thesis", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Criminal Law",
            description: "Criminal justice and penal systems",
            courseCount: 7,
            courses: [
              { code: "CRIM101", name: "Criminal Law I", level: "undergraduate" },
              { code: "CRIM102", name: "Criminal Procedure", level: "undergraduate" },
              { code: "CRIM201", name: "Evidence Law", level: "undergraduate" },
              { code: "CRIM202", name: "Criminal Law II", level: "undergraduate" },
              { code: "CRIM301", name: "Advanced Criminal Law", level: "graduate" },
              { code: "CRIM302", name: "Criminology & Society", level: "graduate" },
              { code: "CRIM401", name: "Criminal Justice Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Engineering",
        description: "Advanced engineering and technology programs",
        icon: "⚙️",
        departments: [
          {
            name: "Department of Civil Engineering",
            description: "Infrastructure, buildings, and structural design",
            courseCount: 6,
            courses: [
              { code: "CEVC101", name: "Engineering Graphics & Design", level: "undergraduate" },
              { code: "CEVC102", name: "Mechanics of Materials", level: "undergraduate" },
              { code: "CEVC201", name: "Structural Analysis", level: "undergraduate" },
              { code: "CEVC202", name: "Foundation Engineering", level: "undergraduate" },
              { code: "CEVC301", name: "Advanced Structural Design", level: "graduate" },
              { code: "CEVC401", name: "Civil Engineering Thesis", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Electrical Engineering",
            description: "Power systems and electrical design",
            courseCount: 6,
            courses: [
              { code: "ELEC101", name: "Circuit Analysis", level: "undergraduate" },
              { code: "ELEC102", name: "Electromagnetics", level: "undergraduate" },
              { code: "ELEC201", name: "Power Systems I", level: "undergraduate" },
              { code: "ELEC202", name: "Power Systems II", level: "undergraduate" },
              { code: "ELEC301", name: "Advanced Power Analysis", level: "graduate" },
              { code: "ELEC401", name: "Electrical Engineering Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "King Faisal Center for Islamic Studies",
        description: "Islamic education and cultural heritage preservation",
        icon: "📖",
        departments: [
          {
            name: "Department of Islamic Theology",
            description: "Islamic philosophy and theological studies",
            courseCount: 5,
            courses: [
              { code: "ISLAM101", name: "Fundamentals of Islam", level: "undergraduate" },
              { code: "ISLAM102", name: "Quranic Studies", level: "undergraduate" },
              { code: "ISLAM201", name: "Islamic Jurisprudence", level: "undergraduate" },
              { code: "ISLAM301", name: "Advanced Islamic Theology", level: "graduate" },
              { code: "ISLAM401", name: "Islamic Philosophy Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Aga Khan Museum", desc: "A treasure trove of Islamic Arts, Maranao crafts, and indigenous artifacts of Mindanao." },
      { name: "King Faisal Mosque", desc: "An architectural landmark showcasing majestic Islamic cultural patterns." },
      { name: "Scenic Lake Lanao Heights", desc: "Verdant viewpoint providing panoramic misty vistas of Lake Lanao." }
    ],
    accentColor: "rose-500",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    identityGradient: "from-rose-600 via-rose-700 to-stone-900",
    coordinate: { x: 52, y: 30 },
    region: "Northern & Central"
  },
  {
    name: "MSU-Iligan Institute of Technology (MSU-IIT)",
    slug: "msu-iit",
    location: "Iligan City, Lanao del Norte",
    founded: 1968,
    tagline: "The Innovation and Technological Powerhouse",
    description: "Established in 1968, the Iligan Institute of Technology is revered as one of the premier technology and science centers of the Philippines. It combines high-octane engineering programs with deep cutting-edge digital research laboratories.",
    stats: { students: "15,000+", courses: "105+", faculty: "850+", employmentRate: "93%" },
    specialties: ["Computer Science", "Mechanical & Chemical Engineering", "Natural Sciences", "Robotics", "Modern Arts"],
    colleges: [
      {
        name: "College of Engineering and Technology",
        description: "Advanced engineering with robotics and automation",
        icon: "⚙️",
        departments: [
          {
            name: "Department of Mechanical Engineering",
            description: "Mechanical design, thermodynamics, and automation",
            courseCount: 7,
            courses: [
              { code: "MECH101", name: "Engineering Mechanics", level: "undergraduate" },
              { code: "MECH102", name: "Thermodynamics I", level: "undergraduate" },
              { code: "MECH201", name: "Fluid Mechanics", level: "undergraduate" },
              { code: "MECH202", name: "Machine Design", level: "undergraduate" },
              { code: "MECH301", name: "Thermal Systems Design", level: "graduate" },
              { code: "MECH302", name: "Robotics & Automation", level: "graduate" },
              { code: "MECH401", name: "Mechanical Engineering Research", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Chemical Engineering",
            description: "Process design and chemical manufacturing",
            courseCount: 6,
            courses: [
              { code: "CHEM101", name: "Stoichiometry & Reactions", level: "undergraduate" },
              { code: "CHEM102", name: "Unit Operations", level: "undergraduate" },
              { code: "CHEM201", name: "Chemical Process Design", level: "undergraduate" },
              { code: "CHEM202", name: "Bioprocess Engineering", level: "undergraduate" },
              { code: "CHEM301", name: "Advanced Process Control", level: "graduate" },
              { code: "CHEM401", name: "Chemical Engineering Thesis", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "School of Computer Studies",
        description: "Computing, software engineering, and IT systems",
        icon: "💻",
        departments: [
          {
            name: "Department of Computer Science",
            description: "Algorithms, data structures, and core computing",
            courseCount: 8,
            courses: [
              { code: "COCS101", name: "Introduction to Programming", level: "undergraduate" },
              { code: "COCS102", name: "Data Structures", level: "undergraduate" },
              { code: "COCS201", name: "Algorithms & Complexity", level: "undergraduate" },
              { code: "COCS202", name: "Database Systems", level: "undergraduate" },
              { code: "COCS203", name: "Artificial Intelligence", level: "undergraduate" },
              { code: "COCS301", name: "Advanced AI & Machine Learning", level: "graduate" },
              { code: "COCS302", name: "Computer Vision", level: "graduate" },
              { code: "COCS401", name: "CS Thesis & Research", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Software Engineering",
            description: "Software development and system architecture",
            courseCount: 7,
            courses: [
              { code: "SOFT101", name: "Software Engineering Fundamentals", level: "undergraduate" },
              { code: "SOFT102", name: "Web Development I", level: "undergraduate" },
              { code: "SOFT201", name: "Web Development II (Full Stack)", level: "undergraduate" },
              { code: "SOFT202", name: "Mobile App Development", level: "undergraduate" },
              { code: "SOFT301", name: "Advanced Web Architecture", level: "graduate" },
              { code: "SOFT302", name: "DevOps & Cloud Computing", level: "graduate" },
              { code: "SOFT401", name: "Software Engineering Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Science and Mathematics",
        description: "Pure sciences and mathematical foundations",
        icon: "🔬",
        departments: [
          {
            name: "Department of Physics",
            description: "Physics principles and modern physics",
            courseCount: 6,
            courses: [
              { code: "PHYS101", name: "General Physics I", level: "undergraduate" },
              { code: "PHYS102", name: "General Physics II", level: "undergraduate" },
              { code: "PHYS201", name: "Modern Physics", level: "undergraduate" },
              { code: "PHYS202", name: "Quantum Mechanics", level: "undergraduate" },
              { code: "PHYS301", name: "Advanced Physics", level: "graduate" },
              { code: "PHYS401", name: "Physics Research Thesis", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "MSU-IIT Overpass Landmark", desc: "The iconic architectural gateway indicating deep integration with Iligan City's industry." },
      { name: "Modern Science & Robotics Hub", desc: "State-of-the-art visual computing and intelligence laboratories." },
      { name: "Integrated Arts Auditorium", desc: "Cultural epicenter hosting award-winning theatre and choral ensembles." }
    ],
    accentColor: "amber-500",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    identityGradient: "from-amber-600 via-amber-700 to-slate-900",
    coordinate: { x: 55, y: 18 },
    region: "Northern & Central"
  },
  {
    name: "MSU-General Santos",
    slug: "msu-gensan",
    location: "General Santos City",
    founded: 1967,
    tagline: "The Hub of Tuna, Trade and Regional Innovation",
    description: "Serving the vibrant SOCCSKSARGEN economic corridor, MSU General Santos is strategically positioned to innovate in agribusiness, sustainable fisheries, and modern trade services under a framework of multi-ethnic harmony.",
    stats: { students: "12,000+", courses: "84+", faculty: "620+", employmentRate: "89%" },
    specialties: ["Marine Fisheries Technology", "Export Agribusiness", "Business Analytics", "Secondary Teacher Training"],
    colleges: [
      {
        name: "College of Fisheries",
        description: "Marine fisheries and aquaculture technology",
        icon: "🐟",
        departments: [
          {
            name: "Department of Fisheries Biology",
            description: "Fish species, ecology, and breeding",
            courseCount: 6,
            courses: [
              { code: "FISH101", name: "Ichthyology", level: "undergraduate" },
              { code: "FISH102", name: "Fish Ecology", level: "undergraduate" },
              { code: "FISH201", name: "Fisheries Biology", level: "undergraduate" },
              { code: "FISH202", name: "Fish Nutrition", level: "undergraduate" },
              { code: "FISH301", name: "Advanced Fish Biology", level: "graduate" },
              { code: "FISH401", name: "Fisheries Research Thesis", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Aquaculture",
            description: "Fish farming and hatchery management",
            courseCount: 5,
            courses: [
              { code: "AQUA101", name: "Aquaculture Systems", level: "undergraduate" },
              { code: "AQUA102", name: "Fish Hatchery Operations", level: "undergraduate" },
              { code: "AQUA201", name: "Commercial Fish Farming", level: "undergraduate" },
              { code: "AQUA301", name: "Advanced Aquaculture Tech", level: "graduate" },
              { code: "AQUA401", name: "Aquaculture Development", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Business Administration",
        description: "Business management and commerce education",
        icon: "💼",
        departments: [
          {
            name: "Department of Accounting",
            description: "Financial accounting and audit",
            courseCount: 6,
            courses: [
              { code: "ACC101", name: "Accounting Fundamentals", level: "undergraduate" },
              { code: "ACC102", name: "Financial Accounting", level: "undergraduate" },
              { code: "ACC201", name: "Managerial Accounting", level: "undergraduate" },
              { code: "ACC202", name: "Auditing Principles", level: "undergraduate" },
              { code: "ACC301", name: "Advanced Accounting", level: "graduate" },
              { code: "ACC401", name: "Accounting Research", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Business Management",
            description: "Organizational management and strategy",
            courseCount: 6,
            courses: [
              { code: "MGMT101", name: "Business Fundamentals", level: "undergraduate" },
              { code: "MGMT102", name: "Organizational Behavior", level: "undergraduate" },
              { code: "MGMT201", name: "Strategic Management", level: "undergraduate" },
              { code: "MGMT202", name: "Operations Management", level: "undergraduate" },
              { code: "MGMT301", name: "Advanced Management", level: "graduate" },
              { code: "MGMT401", name: "Business Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Pioneer Monument Hall", desc: "A beautiful space symbolizing the hard work of Southern Mindanao's early educators." },
      { name: "Sunset Boulevard Viewpoint", desc: "Breathtaking coastal breezes watching operations in Sarangani Bay." },
      { name: "Vast Experimental Farm Lands", desc: "Vast multi-acre fields dedicated to high-grade tropical crop engineering." }
    ],
    accentColor: "emerald-500",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    identityGradient: "from-emerald-600 via-emerald-750 to-neutral-900",
    coordinate: { x: 74, y: 78 },
    region: "Southern"
  },
  {
    name: "MSU-Tawi-Tawi College of Technology and Oceanography",
    slug: "msu-tawi-tawi",
    location: "Bongao, Tawi-Tawi",
    founded: 1969,
    tagline: "The Oceanographic and Maritime Jewel",
    description: "Situated in the pristine southernmost borders, MSU Tawi-Tawi is the nation's premier ocean research bastion. It specializes deeply in coral conservation, deep-sea fisheries, seaweed biotech, and the rich marine folklore of the Sulu Sea.",
    stats: { students: "8,000+", courses: "42+", faculty: "380+", employmentRate: "85%" },
    specialties: ["Deep Sea Oceanography", "Seaweed Biotechnology", "Mariculture & Hatchery", "Islamic Heritage"],
    colleges: [
      {
        name: "Institute of Oceanography and Environmental Science",
        description: "Ocean research and marine conservation",
        icon: "🌊",
        departments: [
          {
            name: "Department of Oceanography",
            description: "Ocean sciences and marine research",
            courseCount: 6,
            courses: [
              { code: "OCEAN101", name: "Oceanography Fundamentals", level: "undergraduate" },
              { code: "OCEAN102", name: "Physical Oceanography", level: "undergraduate" },
              { code: "OCEAN201", name: "Marine Ecology", level: "undergraduate" },
              { code: "OCEAN202", name: "Coral Reef Science", level: "undergraduate" },
              { code: "OCEAN301", name: "Advanced Oceanography", level: "graduate" },
              { code: "OCEAN401", name: "Ocean Research Thesis", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Seaweed Biotechnology",
            description: "Seaweed cultivation and biotech applications",
            courseCount: 5,
            courses: [
              { code: "SEAW101", name: "Seaweed Biology", level: "undergraduate" },
              { code: "SEAW102", name: "Cultivation Techniques", level: "undergraduate" },
              { code: "SEAW201", name: "Seaweed Biotech", level: "undergraduate" },
              { code: "SEAW301", name: "Advanced Applications", level: "graduate" },
              { code: "SEAW401", name: "Biotechnology Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Fisheries & Allied Sciences",
        description: "Fisheries management and marine technology",
        icon: "🐟",
        departments: [
          {
            name: "Department of Fisheries",
            description: "Commercial and artisanal fishing",
            courseCount: 5,
            courses: [
              { code: "FISH101", name: "Fishing Methods", level: "undergraduate" },
              { code: "FISH102", name: "Fish Stock Assessment", level: "undergraduate" },
              { code: "FISH201", name: "Fisheries Management", level: "undergraduate" },
              { code: "FISH301", name: "Advanced Fisheries", level: "graduate" },
              { code: "FISH401", name: "Fisheries Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Bud Bongao Sacred Outlook", desc: "The majestic sacred peak rising directly behind the ocean research campus." },
      { name: "Sanga-Sanga Marine Conservatory", desc: "Breeding grounds for endangered marine resources and pristine coral flora." },
      { name: "Traditional Bajau Sea Pavilion", desc: "A beautiful floating cultural study gazebo dedicated to maritime nomads." }
    ],
    accentColor: "teal-400",
    badgeColor: "bg-teal-400/15 text-teal-300 border-teal-400/20",
    identityGradient: "from-teal-600 via-cyan-800 to-indigo-950",
    coordinate: { x: 10, y: 88 },
    region: "Zamboanga & Sulu"
  },
  {
    name: "MSU-Naawan",
    slug: "msu-naawan",
    location: "Naawan, Misamis Oriental",
    founded: 1989,
    tagline: "The Center of Inland Fisheries Excellence",
    description: "Nestled along Macajalar Bay, MSU Naawan is highly acclaimed for pioneering researches in inland aquaculture, brackish water biology, ecological mangrove systems, and micro-algal ecosystems.",
    stats: { students: "5,200+", courses: "32+", faculty: "240+", employmentRate: "91%" },
    specialties: ["Hatchery Propagation", "Mangrove Forest Management", "Aquaculture Engineering"],
    colleges: [
      {
        name: "College of Fisheries and Allied Sciences",
        description: "Aquaculture and brackish water biology",
        icon: "🐟",
        departments: [
          {
            name: "Department of Aquaculture",
            description: "Fish farming and hatchery management",
            courseCount: 6,
            courses: [
              { code: "AQUA101", name: "Hatchery Management", level: "undergraduate" },
              { code: "AQUA102", name: "Brackish Water Aquaculture", level: "undergraduate" },
              { code: "AQUA201", name: "Shrimp Farming", level: "undergraduate" },
              { code: "AQUA202", name: "Feed & Nutrition", level: "undergraduate" },
              { code: "AQUA301", name: "Advanced Aquaculture", level: "graduate" },
              { code: "AQUA401", name: "Aquaculture Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Coastal Spawning Hatcheries", desc: "Renowned facilities that supply premium finfish and shrimp fry to Mindanao farmers." },
      { name: "The Quiet Mangrove Walkways", desc: "Preserved elevated wooden paths used in biological forest mapping." },
      { name: "Brackish-water Research Ponds", desc: "Specialized hydrology structures designed for adaptive salinity mapping." }
    ],
    accentColor: "sky-400",
    badgeColor: "bg-sky-400/15 text-sky-400 border-sky-400/20",
    identityGradient: "from-sky-600 via-sky-850 to-slate-950",
    coordinate: { x: 50, y: 10 },
    region: "Northern & Central"
  },
  {
    name: "MSU-Maguindanao",
    slug: "msu-maguindanao",
    location: "Datu Odin Sinsuat, Maguindanao del Norte",
    founded: 1973,
    tagline: "Agricultural Empowerment and Cultural Integration",
    description: "With a profound agricultural research thrust, MSU Maguindanao builds educational programs designed to harness the rich fertile soils of the Cotabato Basin, serving diverse communities through peace education and crop innovation.",
    stats: { students: "7,500+", courses: "48+", faculty: "310+", employmentRate: "84%" },
    specialties: ["Tropical Crops Agronomy", "Sustainable Farming Systems", "Islamic Cooperative Finance"],
    colleges: [
      {
        name: "College of Agriculture and Forestry",
        description: "Agricultural sciences and forestry management",
        icon: "🌾",
        departments: [
          {
            name: "Department of Agronomy",
            description: "Crop science and soil management",
            courseCount: 6,
            courses: [
              { code: "AGRO101", name: "Crop Production", level: "undergraduate" },
              { code: "AGRO102", name: "Soil Fertility Management", level: "undergraduate" },
              { code: "AGRO201", name: "Pest Management", level: "undergraduate" },
              { code: "AGRO202", name: "Sustainable Agriculture", level: "undergraduate" },
              { code: "AGRO301", name: "Advanced Agronomy", level: "graduate" },
              { code: "AGRO401", name: "Agriculture Research", level: "postgraduate" }
            ]
          },
          {
            name: "Department of Forestry",
            description: "Forest management and conservation",
            courseCount: 5,
            courses: [
              { code: "FOR101", name: "Forest Ecology", level: "undergraduate" },
              { code: "FOR102", name: "Silviculture", level: "undergraduate" },
              { code: "FOR201", name: "Forest Management", level: "undergraduate" },
              { code: "FOR301", name: "Advanced Forestry", level: "graduate" },
              { code: "FOR401", name: "Forestry Research Thesis", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "College of Education",
        description: "Teacher training and educational leadership",
        icon: "📚",
        departments: [
          {
            name: "Department of Teacher Education",
            description: "Professional teacher preparation",
            courseCount: 5,
            courses: [
              { code: "EDUC101", name: "Foundations of Education", level: "undergraduate" },
              { code: "EDUC102", name: "Psychology of Learning", level: "undergraduate" },
              { code: "EDUC201", name: "Curriculum Development", level: "undergraduate" },
              { code: "EDUC301", name: "Educational Leadership", level: "graduate" },
              { code: "EDUC401", name: "Education Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Integrated Farm Laboratory", desc: "An expansive fully active farm testing crop resiliency variants." },
      { name: "Peace & Unity Rotunda", desc: "A visual monument celebrating multi-cultural interfaith harmony on campus." },
      { name: "Mount POF Panoramic Ridges", desc: "Spectacular lush green mountain ranges framing the pristine campus perimeter." }
    ],
    accentColor: "yellow-500",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    identityGradient: "from-yellow-600 via-green-800 to-zinc-950",
    coordinate: { x: 44, y: 55 },
    region: "Northern & Central"
  },
  {
    name: "MSU-Sulu",
    slug: "msu-sulu",
    location: "Jolo, Sulu",
    founded: 1974,
    tagline: "The Vanguard of Sulu Archipelago Heritage",
    description: "Located in the historic town of Jolo, MSU Sulu is committed to academic empowerment, preserving the profound maritime arts of the Tausūg people, and cultivating resilient public educators for the island provinces.",
    stats: { students: "6,000+", courses: "36+", faculty: "280+", employmentRate: "82%" },
    specialties: ["Maritime Trade Sciences", "Islamic Legal Studies", "Public Administration", "Tausug Cultural Heritage"],
    colleges: [
      {
        name: "College of Fisheries and Forestry",
        description: "Marine fisheries and forest resources",
        icon: "🐟",
        departments: [
          {
            name: "Department of Fisheries",
            description: "Maritime fishing technologies",
            courseCount: 5,
            courses: [
              { code: "FISH101", name: "Maritime Fishing", level: "undergraduate" },
              { code: "FISH102", name: "Fishing Vessel Ops", level: "undergraduate" },
              { code: "FISH201", name: "Deep Sea Fishing", level: "undergraduate" },
              { code: "FISH301", name: "Advanced Fisheries", level: "graduate" },
              { code: "FISH401", name: "Fisheries Research", level: "postgraduate" }
            ]
          }
        ]
      },
      {
        name: "Institute of Islamic Shariah",
        description: "Islamic law and Sharia studies",
        icon: "📖",
        departments: [
          {
            name: "Department of Islamic Law",
            description: "Sharia law and jurisprudence",
            courseCount: 5,
            courses: [
              { code: "SHARIAH101", name: "Islamic Law Principles", level: "undergraduate" },
              { code: "SHARIAH102", name: "Family Law (Islamic)", level: "undergraduate" },
              { code: "SHARIAH201", name: "Commercial Sharia", level: "undergraduate" },
              { code: "SHARIAH301", name: "Advanced Jurisprudence", level: "graduate" },
              { code: "SHARIAH401", name: "Islamic Law Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "Mount Tumantangis Vistas", desc: "The legendary mountain of tears which acts as a sacred weather beacon for Sulu sailors." },
      { name: "Heritage Peace Arch", desc: "A majestic gateway celebrating the enduring maritime spirit of Sulu." },
      { name: "Sulu Sea Field Research Center", desc: "Dedicated station for local marine biology and water conservation studies." }
    ],
    accentColor: "indigo-400",
    badgeColor: "bg-indigo-400/15 text-indigo-300 border-indigo-400/20",
    identityGradient: "from-indigo-600 via-indigo-800 to-neutral-950",
    coordinate: { x: 25, y: 72 },
    region: "Zamboanga & Sulu"
  },
  {
    name: "MSU-Buug",
    slug: "msu-buug",
    location: "Buug, Zamboanga Sibugay",
    founded: 1971,
    tagline: "Agro-forestry and Community Entrepreneurship",
    description: "MSU Buug is a recognized center of development nestled in the verdant soils of Zamboanga Sibugay, empowering independent community farmers and micro-enterprises with top-tier technical and managerial skills.",
    stats: { students: "4,500+", courses: "26+", faculty: "190+", employmentRate: "86%" },
    specialties: ["Forest Hydrology", "Cooperative Farm Management", "Small Business Economics"],
    colleges: [
      {
        name: "College of Agriculture and Forestry",
        description: "Agroforestry and sustainable land use",
        icon: "🌾",
        departments: [
          {
            name: "Department of Agroforestry",
            description: "Integrated farm and forest systems",
            courseCount: 5,
            courses: [
              { code: "AFORE101", name: "Agroforestry Systems", level: "undergraduate" },
              { code: "AFORE102", name: "Soil Conservation", level: "undergraduate" },
              { code: "AFORE201", name: "Forest Hydrology", level: "undergraduate" },
              { code: "AFORE301", name: "Advanced Agroforestry", level: "graduate" },
              { code: "AFORE401", name: "Agroforestry Research", level: "postgraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "The Bamboo Pavilion", desc: "An beautiful open-air bamboo structure demonstrating sustainable local building arts." },
      { name: "Buug Forestry Reserve", desc: "A dense, protected preserve used for silviculture research and timber measurement." },
      { name: "Woodland Footpath Trails", desc: "Scenic hiking routes used by agro-forestry students." }
    ],
    accentColor: "orange-500",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    identityGradient: "from-orange-600 via-emerald-800 to-stone-950",
    coordinate: { x: 34, y: 44 },
    region: "Zamboanga & Sulu"
  },
  {
    name: "MSU-Lanao National Agricultural College (MSU-LNAC)",
    slug: "msu-lnac",
    location: "Lumbatan, Lanao del Sur",
    founded: 1969,
    tagline: "Cultivating Agricultural Roots & Rural Prosperity",
    description: "Dedicated to the sustainable modernization of agriculture and forestry in Lanao del Sur. It equips students with hands-on competencies in organic cultivation, animal husbandry, and watershed management.",
    stats: { students: "3,100+", courses: "18+", faculty: "125+", employmentRate: "83%" },
    specialties: ["Agronomy & Crop Science", "Animal Science", "Forestry Management", "Secondary Education"],
    colleges: [
      {
        name: "College of Agriculture and Forestry",
        description: "Agricultural sciences and rural development",
        icon: "🌾",
        departments: [
          {
            name: "Department of Agronomy",
            description: "Crop science and farming",
            courseCount: 4,
            courses: [
              { code: "AGRO101", name: "Crop Science", level: "undergraduate" },
              { code: "AGRO102", name: "Organic Farming", level: "undergraduate" },
              { code: "AGRO201", name: "Advanced Crop Management", level: "undergraduate" },
              { code: "AGRO301", name: "Agriculture Research", level: "graduate" }
            ]
          },
          {
            name: "Department of Animal Science",
            description: "Livestock and animal husbandry",
            courseCount: 4,
            courses: [
              { code: "ANIM101", name: "Animal Biology", level: "undergraduate" },
              { code: "ANIM102", name: "Livestock Management", level: "undergraduate" },
              { code: "ANIM201", name: "Veterinary Science Intro", level: "undergraduate" },
              { code: "ANIM301", name: "Advanced Animal Science", level: "graduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "LNAC Demonstration Farms", desc: "Acres of organic crop trials and high-tech rice farming fields." },
      { name: "Animal Husbandry Center", desc: "A modern livestock breeding and veterinary practice ecosystem." },
      { name: "The Pine Watershed Trails", desc: "A lush biological reserve serving as research space for agro-forestry students." }
    ],
    accentColor: "green-400",
    badgeColor: "bg-green-400/15 text-green-300 border-green-400/20",
    identityGradient: "from-green-650 via-emerald-800 to-neutral-950",
    coordinate: { x: 47, y: 35 },
    region: "Northern & Central"
  },
  {
    name: "MSU-Lanao National College of Arts and Trades (MSU-LNCAT)",
    slug: "msu-lncat",
    location: "Marawi City, Lanao del Sur",
    founded: 1968,
    tagline: "Mastering Craftsmanship & Industrial Innovation",
    description: "Co-located in the cultural landscape of Marawi City, LNCAT focuses on vocational masteries, electronic design, and technical engineering crafts to empower local artisans and build the industrial workforce of the region.",
    stats: { students: "2,800+", courses: "15+", faculty: "115+", employmentRate: "87%" },
    specialties: ["Mechanical Crafts", "Civil Engineering & Masonry", "Culinary Arts & Tech", "Applied Electronics"],
    colleges: [
      {
        name: "Division of Technical Trades",
        description: "Mechanical and electrical trades training",
        icon: "⚙️",
        departments: [
          {
            name: "Department of Automotive Technology",
            description: "Vehicle repair and maintenance",
            courseCount: 4,
            courses: [
              { code: "AUTO101", name: "Automotive Fundamentals", level: "undergraduate" },
              { code: "AUTO102", name: "Engine Mechanics", level: "undergraduate" },
              { code: "AUTO201", name: "Automotive Electronics", level: "undergraduate" },
              { code: "AUTO301", name: "Advanced Diagnostics", level: "graduate" }
            ]
          },
          {
            name: "Department of Electrical Engineering Tech",
            description: "Electrical installations and systems",
            courseCount: 3,
            courses: [
              { code: "ELEC101", name: "Electrical Installation", level: "undergraduate" },
              { code: "ELEC102", name: "Wiring & Safety", level: "undergraduate" },
              { code: "ELEC201", name: "Industrial Electrical", level: "undergraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "LNCAT Advanced Workshops", desc: "Precision machining areas equipped with modern tools and diagnostic benches." },
      { name: "Culinary & Baking Laboratory", desc: "Fully-functional training kitchens producing beautiful regional cuisine." },
      { name: "Industrial Design Pavilion", desc: "Spacious drafting and CAD designing stations." }
    ],
    accentColor: "cyan-500",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    identityGradient: "from-cyan-600 via-teal-850 to-slate-950",
    coordinate: { x: 53, y: 33 },
    region: "Northern & Central"
  },
  {
    name: "MSU-Maigo School of Arts and Trades (MSU-MSAT)",
    slug: "msu-msat",
    location: "Maigo, Lanao del Norte",
    founded: 1969,
    tagline: "Engine of Practical Engineering & Vocational Arts",
    description: "A highly specialized hub in Lanao del Norte dedicated to technical education, robotics-level mechanics, automotive intelligence, and drafting arts. MSAT empowers youths with professional-level trade certifications.",
    stats: { students: "2,400+", courses: "12+", faculty: "98+", employmentRate: "90%" },
    specialties: ["Automotive Engineering", "Electrical Installation Technology", "Applied Graphic Arts", "Machining Crafts"],
    colleges: [
      {
        name: "Department of Trades Technology",
        description: "Mechanical and technical trades",
        icon: "⚙️",
        departments: [
          {
            name: "Department of Machining",
            description: "Precision machining and metalwork",
            courseCount: 3,
            courses: [
              { code: "MACH101", name: "Machine Tool Operation", level: "undergraduate" },
              { code: "MACH102", name: "CNC Programming", level: "undergraduate" },
              { code: "MACH201", name: "Advanced Machining", level: "undergraduate" }
            ]
          }
        ]
      },
      {
        name: "Department of Applied Arts",
        description: "Design and creative arts training",
        icon: "🎨",
        departments: [
          {
            name: "Department of Graphic Design",
            description: "Visual design and digital arts",
            courseCount: 3,
            courses: [
              { code: "GRAPH101", name: "Design Fundamentals", level: "undergraduate" },
              { code: "GRAPH102", name: "Digital Design Software", level: "undergraduate" },
              { code: "GRAPH201", name: "Advanced Design Projects", level: "undergraduate" }
            ]
          }
        ]
      }
    ],
    landmarks: [
      { name: "The MSAT Engine Dyno Lab", desc: "State-of-the-art diagnostic setup for modern computerized vehicle tuning." },
      { name: "Regional Graphic Design Studio", desc: "Creative workspace featuring screenprinting, photography, and UI design suites." },
      { name: "Maigo Coastal Sea Outlook", desc: "Quiet beachfront boardwalk directly border-touching the campus boundary." }
    ],
    accentColor: "purple-400",
    badgeColor: "bg-purple-400/15 text-purple-300 border-purple-400/20",
    identityGradient: "from-purple-600 via-indigo-900 to-black",
    coordinate: { x: 45, y: 22 },
    region: "Northern & Central"
  }
];

interface QuizQuestionOption {
  id: string;
  label: string;
  desc: string;
  weights: { [slug: string]: number };
}

interface QuizQuestion {
  title: string;
  category: string;
  options: QuizQuestionOption[];
}

const NEW_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    category: "Academic Passion",
    title: "1. Which core academic division sets your intellectual curiosity on fire?",
    options: [
      { id: "opt1", label: "Advanced computing, digital infrastructure, & industrial robotics", desc: "Build algorithms, intelligent systems, and state-of-the-art software systems.", weights: { "msu-iit": 4, "msu-main": 1, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "Marine biodiversity, blue oceanography, & hatchery biotech", desc: "Understand coral ecosystems, breed high-quality fish streams, and sustain ocean reserves.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "Productive farming systems, forestry hydrology, & macro agriculture", desc: "Design sustainable agricultural systems, crops, and analyze forest soil tables.", weights: { "msu-maguindanao": 4, "msu-buug": 3, "msu-lnac": 4, "msu-gensan": 1 } },
      { id: "opt4", label: "Peace advocacy, Shariah & civil legal codes, or clinical medicine", desc: "Heal human bodies, lead constitutional peace-building, or construct legal safety codes.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Study Sanctuary",
    title: "2. What geographical environment feels like your perfect scholarly habitat?",
    options: [
      { id: "opt1", label: "Mist-covered green mountains overlooking a legendary freshwater lake", desc: "A cozy cultural highland enclave where nature and cool winds assist focus.", weights: { "msu-main": 4 } },
      { id: "opt2", label: "Pristine sandy islands bordering complex deep channels and marine reserves", desc: "An aquatic paradise where the sea serves as your natural classroom canvas.", weights: { "msu-tawi-tawi": 4, "msu-sulu": 2 } },
      { id: "opt3", label: "Coastal shores near active mangrove nurseries and experimental bays", desc: "Brackish water habitats combining biology with commercial aquaculture.", weights: { "msu-naawan": 4, "msu-gensan": 1 } },
      { id: "opt4", label: "High-octane industrial towns and bustling technology clusters", desc: "A vibrant city space filled with corporate integrations and trade corridors.", weights: { "msu-iit": 4, "msu-gensan": 3, "msu-msat": 2, "msu-lncat": 2 } }
    ]
  },
  {
    category: "Ultimate Purpose",
    title: "3. Ten years from now, what would you like your major contribution to be?",
    options: [
      { id: "opt1", label: "Filing breakthrough patents for software, autonomous robots, or web architecture", desc: "Direct technological excellence as an engineer, computer scientist, or product designer.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-lncat": 3, "msu-msat": 3 } },
      { id: "opt2", label: "Securing stable crop livelihoods and micro-economies for mainland farmers", desc: "Bring modern agronomy and business modeling directly to small-scale growers.", weights: { "msu-buug": 4, "msu-maguindanao": 4, "msu-lnac": 4 } },
      { id: "opt3", label: "Nurturing seaweed biotech export trades or directing deep-sea biological surveys", desc: "Innovate sustainable marine commercial practices or uncover aquatic secrets.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt4", label: "Directing public healthcare clinics, legal defense agencies, or peace policy groups", desc: "Construct equity, build inter-cultural trust, and heal critical community concerns.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Learning Style",
    title: "4. When tackling a challenging topic, how do you learn most effectively?",
    options: [
      { id: "opt1", label: "Conducting intensive mathematical modeling, coding labs, and logical synthesis", desc: "Focus heavily on computing theory, code algorithms, and precise hardware testing.", weights: { "msu-iit": 4, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "Taking outdoor specimen collections and physical water quality samples", desc: "Direct sensory monitoring of ecological spaces, reefs, and local marine life.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "Tending live experimental plants, analyzing soil moisture, and evaluating tree rings", desc: "Direct active intervention in natural forestry reserves and open-air nurseries.", weights: { "msu-maguindanao": 4, "msu-buug": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Studying historical case documents, legal patterns, and analyzing dialogue formats", desc: "Debate, discuss, draft frameworks, and test ideas through simulated courtrooms.", weights: { "msu-main": 4, "msu-sulu": 2 } }
    ]
  },
  {
    category: "Campus Extracurriculars",
    title: "5. Which campus club or organization would you join immediately?",
    options: [
      { id: "opt1", label: "The Advanced Engineering Alliance & Competitive Coding Union", desc: "Collaborate on robotics competitions and custom application hackathons.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "The Ocean Wildlife Society & Scuba Diving Rangers", desc: "Engage in coral reef recovery operations and beach cleaning outings.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "The Sustainable Forestry Society or Green Farm Cooperatives", desc: "Plant indigenous plants, maintain campus greenhouses, and try bamboo craftsmanship.", weights: { "msu-buug": 4, "msu-maguindanao": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "The Inter-Cultural Speech Debate panel, Historical journal, or Campus Peace League", desc: "Lead campus advocacy columns, edit heritage papers, and spark interfaith forums.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Industry Alignments",
    title: "6. Which professional business or external organization do you hope to connect with?",
    options: [
      { id: "opt1", label: "Multinational software giants, telecommunications, and digital manufacturers", desc: "Align with high-technology entities, computing systems, and tech startups.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-lncat": 2, "msu-msat": 2 } },
      { id: "opt2", label: "International marine research commissions, aquaculture labs, and deep-sea institutes", desc: "Work closely with oceanic conservation projects and marine food production labs.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "National agriculture trade centers, organic export mills, and timber cooperatives", desc: "Integrate with supply-chain organizations, soil labs, and rural financing centers.", weights: { "msu-maguindanao": 4, "msu-buug": 3, "msu-lnac": 4, "msu-gensan": 2 } },
      { id: "opt4", label: "Civil human-rights councils, the United Nations delegations, or public medical hospitals", desc: "Shape public governance, human health protocols, and structural diplomacy.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Societal Mission",
    title: "7. If awarded a ₱1,000,000 community upgrade fund, where would you invest it?",
    options: [
      { id: "opt1", label: "Empowering under-served districts with high-speed digital networks and coding boot camps", desc: "Overcome the digital divide by distributing tech workshops and basic computers.", weights: { "msu-iit": 4, "msu-gensan": 2, "msu-msat": 2, "msu-lncat": 2 } },
      { id: "opt2", label: "Deploying artificial marine shelters to revive damaged fish breeding grounds", desc: "Boost local fishermen's catch sizes sustainably while safeguarding deep reefs.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 4 } },
      { id: "opt3", label: "Sponsoring micro-irrigation systems for small multi-crop farm soils", desc: "Sustain year-round food security of highland and mainland farming communities.", weights: { "msu-maguindanao": 4, "msu-buug": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Establishing cross-cultural peace centers, language schools, and local healthcare clinics", desc: "Encourage trust, build medical relief operations, and bridge historical divides.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Atmosphere & Energy",
    title: "8. What physical setting gives you the ultimate feeling of creative focus?",
    options: [
      { id: "opt1", label: "Sleek, modern glass structures equipped with rapid fiber optic server racks", desc: "Surround yourself with electrical hubs and interactive digital labs.", weights: { "msu-iit": 4, "msu-msat": 2, "msu-lncat": 2 } },
      { id: "opt2", label: "Charming timber lookouts overlooking turquoise tropical marine waters", desc: "Enjoy salt breezes and the soft rhythm of coastal tides while studying.", weights: { "msu-tawi-tawi": 4, "msu-sulu": 3 } },
      { id: "opt3", label: "Lush green botanical reserves, crop nurseries, and quiet forest footpaths", desc: "Focus in peaceful woodland glades and organic agricultural plots.", weights: { "msu-buug": 4, "msu-maguindanao": 3, "msu-lnac": 4, "msu-naawan": 1 } },
      { id: "opt4", label: "Stately historic brick halls bordered by pine trees and cool morning mountain mist", desc: "Immerse yourself in cultural legacy, mists, and majestic library spaces.", weights: { "msu-main": 4 } }
    ]
  },
  {
    category: "Teamwork & Synergy",
    title: "9. How do you prefer to collaborate with your fellow classmates?",
    options: [
      { id: "opt1", label: "Iterative software sprint crews, product prototyping, and technical reviews", desc: "Coordinate on computing logic, digital designs, and quick feedback loops.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-lncat": 2, "msu-msat": 2 } },
      { id: "opt2", label: "Marine research teams on research vessels sharing diving records and ocean scales", desc: "Join multi-person oceanographic tours, collecting bio-data from deep sea reefs.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "Cooperative farming crews testing organic crop yield models and soil treatments", desc: "Manage agricultural plots together and evaluate plant biology variations.", weights: { "msu-buug": 4, "msu-maguindanao": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Diplomatic panels drafting treaties, civil debates, and clinical simulation rounds", desc: "Collaborate on speech structures, medical diagnoses, and conflict solutions.", weights: { "msu-main": 4, "msu-sulu": 2 } }
    ]
  },
  {
    category: "Unwavering Motivation",
    title: "10. What intrinsic reward keeps you burning the midnight oil?",
    options: [
      { id: "opt1", label: "The thrill of solving complex computational problems or debugging hardware structures", desc: "Create new solutions for technical inefficiencies and perfect automation codes.", weights: { "msu-iit": 4, "msu-naawan": 1, "msu-lncat": 3, "msu-msat": 3 } },
      { id: "opt2", label: "The deep satisfaction of cataloging and protecting rare ocean species and corals", desc: "Discover maritime secrets and preserve delicate oceanic life charts.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 3 } },
      { id: "opt3", label: "Ensuring stable, fertile soil yields and regional food independence", desc: "Combat hunger, model smart agriculture, and optimize natural forest cycles.", weights: { "msu-maguindanao": 4, "msu-buug": 4, "msu-lnac": 4, "msu-gensan": 1 } },
      { id: "opt4", label: "Empowering communities through legal justice, healing bodies, and preserving harmony", desc: "Build healthy civic bonds and secure human safety under constitutional law.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Comfort Climate",
    title: "11. What macro-climate and weather profile feels most comfortable for your lifestyle?",
    options: [
      { id: "opt1", label: "Cool, cloud-hugged highland mists with crisp mountain breezes and high rainfall", desc: "Enjoy chilly, misty, fresh air that keeps the mind highly active and awake.", weights: { "msu-main": 4 } },
      { id: "opt2", label: "Balmy tropical sea-breezes with sparkling sunrays and oceanic rhythms", desc: "Thrive in high-vitamin-D environments dominated by sand, sun, and warm sea water.", weights: { "msu-tawi-tawi": 4, "msu-sulu": 3, "msu-naawan": 2 } },
      { id: "opt3", label: "Nourishing, humid land breezes with stable rainfall ideal for farming and forests", desc: "Enjoy fertile, green rural zones that experience high plant growth cycles.", weights: { "msu-maguindanao": 4, "msu-buug": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Standard, lively coastal-urban weather profiles with quick access to cool air facilities", desc: "Enjoy city micro-facilities and standard weather near coastal trade structures.", weights: { "msu-iit": 4, "msu-gensan": 4, "msu-msat": 3, "msu-lncat": 3 } }
    ]
  },
  {
    category: "Heritage Affiliation",
    title: "12. Which historical cultural legacy of Mindanao do you feel most aligned to?",
    options: [
      { id: "opt1", label: "The intricate brass-crafts, epic folk stories, and majestic mosques of Maranao royalty", desc: "Gain appreciation for the Royal Sultanates of Meranaw and cultural preservation.", weights: { "msu-main": 4, "msu-lncat": 3, "msu-lnac": 3 } },
      { id: "opt2", label: "The seafaring epics, wooden houseboats, and oceanic lore of Bajau and Tausūg nomads", desc: "Immerse in ancient maritime trading routes, ocean protection, and island cultures.", weights: { "msu-tawi-tawi": 4, "msu-sulu": 4 } },
      { id: "opt3", label: "The harmonious multi-cultural agribusiness fairs, pioneer histories, and exports", desc: "Appreciate diversity, regional agricultural development, and commercial trade corridors.", weights: { "msu-gensan": 4, "msu-maguindanao": 3 } },
      { id: "opt4", label: "The rich industrial smelting, heavy mechanics, and scientific innovations of Iligan", desc: "Appreciate advanced technology, engineering history, and industrial development.", weights: { "msu-iit": 4, "msu-buug": 2, "msu-msat": 3 } }
    ]
  },
  {
    category: "Practical Competency",
    title: "13. What hands-on, practical skill would you love to master in college?",
    options: [
      { id: "opt1", label: "Programming high-performance systems and managing automated robotics units", desc: "Write modern codes, handle logic protocols, and master system automation.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "Cultivating aquatic seaweed cultures and analyzing water-column chemical traits", desc: "Run professional hatcheries, monitor marine ecosystems, and breed aquatic life.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 4 } },
      { id: "opt3", label: "Grafting resilient crop hybrids and mapping agro-forestry watershed flows", desc: "Handle plant biology, maximize land fertility, and manage forest ecosystems.", weights: { "msu-buug": 4, "msu-maguindanao": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Public speaking/conflict mediation, civic legal defense, and clinical healthcare", desc: "Master physical patient care, draft peace conventions, and argue civil rights.", weights: { "msu-main": 4, "msu-sulu": 3 } }
    ]
  },
  {
    category: "Weekend Exploration",
    title: "14. How would you spend a perfect sunny weekend off?",
    options: [
      { id: "opt1", label: "Tinkering in a computer makerspace, competing in virtual reality, or coding new tools", desc: "Spend time solving cyber challenges and testing digital creations.", weights: { "msu-iit": 4, "msu-gensan": 1, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "Snorkeling along a marine sanctuary or walking peaceful coastal mudflats", desc: "Be fully close to the marine tide, explore mangrove roots, and swim in the ocean.", weights: { "msu-naawan": 4, "msu-tawi-tawi": 4, "msu-sulu": 2 } },
      { id: "opt3", label: "Hiking through high-canopy pine reserves or trying woodcraft design", desc: "Discover peaceful timber reserves, search for wild berries, and study forest layers.", weights: { "msu-buug": 4, "msu-maguindanao": 3, "msu-lnac": 3 } },
      { id: "opt4", label: "Strolling through historic artifact galleries or reading at a mists cafe overlooking Lake Lanao", desc: "Soak in Islamic art pieces, historical artifacts, and calm highland lake views.", weights: { "msu-main": 4 } }
    ]
  },
  {
    category: "Core Philosophy",
    title: "15. Which institutional guiding value takes the absolute highest priority in your education?",
    options: [
      { id: "opt1", label: "Uncompromised academic excellence, engineering precision, and modern industrial competency", desc: "Strive for technical perfection, deep computer science, and high-tech patents.", weights: { "msu-iit": 4, "msu-gensan": 2, "msu-msat": 3, "msu-lncat": 3 } },
      { id: "opt2", label: "Ecological balance, marine conservation, and blue economic ocean sustainability", desc: "Live in harmony with maritime biology, conserving reefs and brackish estuaries.", weights: { "msu-tawi-tawi": 4, "msu-naawan": 4 } },
      { id: "opt3", label: "Grassroots farmer sovereignty, tropical agricultural resilience, and rural cooperatives", desc: "Feed the region, empower local family farms, and govern sustainable land usage.", weights: { "msu-buug": 4, "msu-maguindanao": 4, "msu-lnac": 4 } },
      { id: "opt4", label: "Civic ethical guidance, cross-cultural diplomacy, and integration for ultimate peace", desc: "Serve others through medicine and law, and protect peaceful human coexistence.", weights: { "msu-main": 4, "msu-sulu": 4 } }
    ]
  }
];

interface CampusesExplorerProps {
  userSettings?: { appearanceMode: 'light' | 'dark' | 'glass' };
  selectedCampus: any | null;
  setSelectedCampus: (campus: any | null) => void;
  setView: (view: 'home' | 'explorer' | 'about' | 'dashboard') => void;
}

function CollegeTree({ colleges }: { colleges: College[] }) {
  const [expandedColleges, setExpandedColleges] = useState<Set<string>>(new Set());
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  const toggleCollege = (collegeName: string) => {
    const newSet = new Set(expandedColleges);
    if (newSet.has(collegeName)) {
      newSet.delete(collegeName);
    } else {
      newSet.add(collegeName);
    }
    setExpandedColleges(newSet);
  };

  const toggleDept = (deptKey: string) => {
    const newSet = new Set(expandedDepts);
    if (newSet.has(deptKey)) {
      newSet.delete(deptKey);
    } else {
      newSet.add(deptKey);
    }
    setExpandedDepts(newSet);
  };

  const levelColor = (level: string) => {
    switch (level) {
      case 'undergraduate': return 'text-blue-400';
      case 'graduate': return 'text-purple-400';
      case 'postgraduate': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const levelLabel = (level: string) => {
    switch (level) {
      case 'undergraduate': return 'UG';
      case 'graduate': return 'GR';
      case 'postgraduate': return 'PG';
      default: return 'OTH';
    }
  };

  return (
    <div className="space-y-2">
      {colleges.map((college) => {
        const isExpanded = expandedColleges.has(college.name);
        const totalCourses = college.departments.reduce((sum, dept) => sum + dept.courseCount, 0);

        return (
          <div key={college.name} className="space-y-1">
            <motion.button
              onClick={() => toggleCollege(college.name)}
              className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center gap-2 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={14} className="text-amber-500" />
              </motion.div>
              <span className="text-sm">{college.icon || '📚'}</span>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-white">{college.name}</p>
                <p className="text-[10px] text-gray-500">{college.description}</p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 whitespace-nowrap`}>
                {college.departments.length} depts
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400 whitespace-nowrap`}>
                {totalCourses} courses
              </span>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 space-y-1 border-l border-white/10"
                >
                  {college.departments.map((dept, dIdx) => {
                    const deptKey = `${college.name}-${dept.name}`;
                    const isDeptExpanded = expandedDepts.has(deptKey);

                    return (
                      <div key={deptKey} className="space-y-1">
                        <motion.button
                          onClick={() => toggleDept(deptKey)}
                          className="w-full text-left p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/15 transition-all flex items-center gap-2"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <motion.div
                            animate={{ rotate: isDeptExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight size={12} className="text-amber-400/60" />
                          </motion.div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-[11px] font-semibold text-gray-300 truncate">{dept.name}</p>
                            <p className="text-[9px] text-gray-600">{dept.description}</p>
                          </div>
                          <span className="text-[9px] text-gray-500 whitespace-nowrap font-mono">{dept.courseCount} courses</span>
                        </motion.button>

                        <AnimatePresence>
                          {isDeptExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 space-y-1 border-l border-white/5 max-h-80 overflow-y-auto"
                            >
                              {dept.courses.map((course) => (
                                <motion.div
                                  key={course.code}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="p-2 rounded-lg bg-white/[0.01] border border-white/5 flex items-start gap-2 hover:border-white/10 transition-all"
                                >
                                  <span className={`text-[9px] font-mono font-bold ${levelColor(course.level)} whitespace-nowrap pt-0.5 min-w-max`}>
                                    {course.code}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-medium text-gray-300 line-clamp-1">{course.name}</p>
                                    {course.description && (
                                      <p className="text-[8px] text-gray-600 line-clamp-1">{course.description}</p>
                                    )}
                                  </div>
                                  <span className={`text-[8px] font-mono font-bold whitespace-nowrap pt-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${levelColor(course.level)}`}>
                                    {levelLabel(course.level)}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function CampusesExplorer({ userSettings, selectedCampus, setSelectedCampus, setView }: CampusesExplorerProps) {
  const isLightMode = userSettings?.appearanceMode === 'light';

  // Resolve selectedCampus from parent (parent passes simple Campus, we map it to rich Campus by slug)
  const resolvedSelectedCampus = useMemo(() => {
    if (!selectedCampus) return null;
    return CAMPUSES_DATA.find(c => c.slug === selectedCampus.slug) || null;
  }, [selectedCampus]);
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('All');
  const [mobileSubTab, setMobileSubTab] = useState<'list' | 'map'>('list');

  // Google Maps Clone Engine state variables
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapType, setMapType] = useState<'default' | 'satellite' | 'terrain'>('satellite'); // Default to satellite for Google Earth theme!
  const [trafficActive, setTrafficActive] = useState<boolean>(false);
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [mouseCoord, setMouseCoord] = useState<{ lat: number; lng: number }>({ lat: 8.0163, lng: 124.2709 });

  // 3D Google Earth Interactive Engine State
  const [is3D, setIs3D] = useState<boolean>(true); // Default 3D Globe mode active!
  const [tilt, setTilt] = useState<number>(55); // Pitch tilt (degrees)
  const [rotation, setRotation] = useState<number>(-15); // Yaw rotation (degrees)

  // Sync selected campus to locate and zoom automatically
  React.useEffect(() => {
    if (selectedCampus) {
      const match = CAMPUSES_DATA.find(c => c.slug === selectedCampus.slug);
      if (match) {
        // Center campus on screen (adjusted scaling factors for centering)
        const offX = (50 - match.coordinate.x) * 4.5;
        const offY = (50 - match.coordinate.y) * 3.5;
        setPan({ x: offX, y: offY });
        setZoom(2.2);
        if (is3D) {
          setTilt(55);
        }
      }
    }
  }, [selectedCampus?.slug]);

  // Google Maps Interaction Handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.3, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.3, 0.8));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMoveOverMap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left - pan.x) / (rect.width * zoom)) * 100;
    const relativeY = ((e.clientY - rect.top - pan.y) / (rect.height * zoom)) * 100;
    
    const boundedX = Math.max(0, Math.min(100, relativeX));
    const boundedY = Math.max(0, Math.min(100, relativeY));
    const latCoord = 9.1 - (boundedY / 100) * 4.3;
    const lngCoord = 119.3 + (boundedX / 100) * 7.1;
    
    setMouseCoord({ lat: latCoord, lng: lngCoord });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Custom interactive mode widgets
  const [explorerTab, setExplorerTab] = useState<'all' | 'quiz' | 'compare'>('all');
  
  // Compare State
  const [compareCampusA, setCompareCampusA] = useState<string>('msu-main');
  const [compareCampusB, setCompareCampusB] = useState<string>('msu-iit');

  // Matchmaker Quiz State
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = Intro, 1..15 = Qs, 16 = Result
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: string }>({});
  const [campusMatchScores, setCampusMatchScores] = useState<{ [slug: string]: number }>({});
  const [matchedCampus, setMatchedCampus] = useState<Campus | null>(null);

  // List of all unique specialties for filters
  const allSpecialties = useMemo(() => {
    const list = new Set<string>();
    CAMPUSES_DATA.forEach(c => c.specialties.forEach(spec => list.add(spec)));
    return Array.from(list);
  }, []);

  // Filtered campuses list
  const filteredCampuses = useMemo(() => {
    return CAMPUSES_DATA.filter(campus => {
      const matchSearch = campus.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          campus.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          campus.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campus.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRegion = filterRegion === 'All' || campus.region === filterRegion;
      const matchSpecialty = filterSpecialty === 'All' || campus.specialties.includes(filterSpecialty);
      return matchSearch && matchRegion && matchSpecialty;
    });
  }, [searchQuery, filterRegion, filterSpecialty]);

  // Handle Quiz selection
  const handleQuizAnswer = (qIndex: number, optionId: string) => {
    const updated = { ...quizAnswers, [qIndex]: optionId };
    setQuizAnswers(updated);
    
    if (qIndex < 14) {
      setQuizStep(prev => prev + 1);
    } else {
      // Last question (index 14) answered! Calculate matches.
      const scores: { [slug: string]: number } = {};
      CAMPUSES_DATA.forEach(c => { scores[c.slug] = 0; });
      
      Object.entries(updated).forEach(([qIdxStr, optVal]) => {
        const idx = parseInt(qIdxStr, 10);
        const question = NEW_QUIZ_QUESTIONS[idx];
        if (question) {
          const option = question.options.find(o => o.id === optVal);
          if (option && option.weights) {
            Object.entries(option.weights).forEach(([slug, weight]) => {
              if (scores[slug] !== undefined) {
                scores[slug] += weight;
              }
            });
          }
        }
      });
      
      setCampusMatchScores(scores);

      let bestCampus = CAMPUSES_DATA[0];
      let bestScore = -1;
      CAMPUSES_DATA.forEach(campus => {
        const score = scores[campus.slug] || 0;
        if (score > bestScore) {
          bestScore = score;
          bestCampus = campus;
        }
      });

      setMatchedCampus(bestCampus);
      setQuizStep(16);
    }
  };

  const restartQuiz = () => {
    setQuizAnswers({});
    setCampusMatchScores({});
    setMatchedCampus(null);
    setQuizStep(1);
  };

  // Compare Campus entities
  const campusA = CAMPUSES_DATA.find(c => c.slug === compareCampusA) || CAMPUSES_DATA[0];
  const campusB = CAMPUSES_DATA.find(c => c.slug === compareCampusB) || CAMPUSES_DATA[1];

  return (
    <div className={`min-h-screen relative p-4 md:p-8 overflow-x-hidden ${
      isLightMode 
        ? 'bg-slate-50 text-slate-800' 
        : 'bg-[#0a0502] text-gray-200'
    }`}>
      
      {/* BACKGROUND EFFECTS (Ambient dark/light theme filters) */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER BRAND */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5 text-left">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (selectedCampus) setSelectedCampus(null);
                else setView('home');
              }}
              className={`p-3 rounded-xl transition-all border cursor-pointer hover:scale-105 active:scale-95 ${
                isLightMode 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="text-amber-500 animate-spin-slow" size={14} />
                <span className="text-[10px] font-mono font-black tracking-widest text-amber-500 uppercase">ONE MSU GLOBAL PORTAL</span>
              </div>
              <h1 className={`text-3xl font-extrabold tracking-tight font-sans ${
                isLightMode ? 'text-slate-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400'
              }`}>
                Campus Network Explorer
              </h1>
              <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-gray-400'}`}>
                Discover the deep integration, specialties and academic citadels across Mindanao and Sulu.
              </p>
            </div>
          </div>

          {/* Tab Switchers: List / quiz / compare */}
          <div className={`w-full md:w-auto grid grid-cols-3 md:flex p-1 rounded-2xl border ${
            isLightMode ? 'bg-slate-200/55 border-slate-300/60' : 'bg-white/5 border-white/10'
          }`}>
            {[
              { id: 'all', label: 'All Campuses', icon: <Building2 size={13} /> },
              { id: 'quiz', label: 'Matchmaker Quiz', icon: <HelpCircle size={13} /> },
              { id: 'compare', label: 'Compare Engine', icon: <Sliders size={13} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setExplorerTab(tab.id as any);
                  setSelectedCampus(null);
                }}
                className={`flex items-center justify-center gap-1 md:gap-1.5 px-2 md:px-4.5 py-2.5 md:py-2 rounded-xl text-[10px] md:text-sm font-black transition-all cursor-pointer ${
                  explorerTab === tab.id 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : isLightMode 
                      ? 'text-slate-600 hover:text-slate-900' 
                      : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* --- MAIN TAB 1: ALL CAMPUSES + INTERACTIVE constellation MAP --- */}
        {explorerTab === 'all' && (
          <div className="space-y-6">
            {/* Mobile Sub-Navigation Segmented Switcher */}
            <div className={`flex lg:hidden p-1 rounded-2xl border ${
              isLightMode ? 'bg-slate-200/55 border-slate-300/60' : 'bg-white/5 border-white/10'
            }`}>
              <button
                onClick={() => setMobileSubTab('list')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mobileSubTab === 'list' 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : isLightMode 
                      ? 'text-slate-600 hover:text-slate-900 font-bold' 
                      : 'text-gray-400 hover:text-white font-bold'
                }`}
              >
                <Building2 size={13} />
                <span>Directory ({filteredCampuses.length})</span>
              </button>
              <button
                onClick={() => setMobileSubTab('map')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mobileSubTab === 'map' 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : isLightMode 
                      ? 'text-slate-600 hover:text-slate-900 font-bold' 
                      : 'text-gray-400 hover:text-white font-bold'
                }`}
              >
                <Compass size={13} />
                <span>Radial Map</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* Sidebar Column: Search, Filters, Active list */}
              <div className={`lg:col-span-4 space-y-6 ${mobileSubTab === 'list' ? 'block' : 'hidden lg:block'}`}>
              
              {/* QUERY BOX CONTAINER */}
              <div className={`p-5 rounded-3xl border ${
                isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/5'
              }`}>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-amber-500 mb-4">Filtering Portals</h3>
                
                {/* Search Text input */}
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
                    <Search size={15} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by specialty, name, city..."
                    className={`w-full text-xs pl-9.5 pr-4 py-3 rounded-xl border focus:outline-none transition-all ${
                      isLightMode 
                        ? 'bg-slate-100 border-slate-200 focus:border-amber-500' 
                        : 'bg-white/5 border-white/10 focus:border-amber-500/50 text-white'
                    }`}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Region Filter */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-2">Academic Region</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Northern & Central', 'Southern', 'Zamboanga & Sulu'].map(reg => (
                        <button
                          key={reg}
                          onClick={() => setFilterRegion(reg)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                            filterRegion === reg 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold' 
                              : isLightMode 
                                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200' 
                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specialty Focus Selector dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-2">Unique Specialty Core</label>
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                        isLightMode 
                          ? 'bg-slate-100 border-slate-200 text-slate-700' 
                          : 'bg-white/5 border-white/10 text-white'
                      }`}
                    >
                      <option value="All" className={isLightMode ? 'text-black' : 'text-white bg-[#0e0a05]'}>All Fields of Study</option>
                      {allSpecialties.map(spec => (
                        <option 
                          key={spec} 
                          value={spec} 
                          className={isLightMode ? 'text-black' : 'text-white bg-[#0e0a05]'}
                        >
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* LIST OF FILTERED ENTITIES */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-black">
                    Matching Citadels ({filteredCampuses.length})
                  </span>
                  {(searchQuery || filterRegion !== 'All' || filterSpecialty !== 'All') && (
                    <button 
                      onClick={() => { setSearchQuery(''); setFilterRegion('All'); setFilterSpecialty('All'); }}
                      className="text-[9px] text-amber-500 hover:underline font-mono uppercase"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredCampuses.length > 0 ? (
                    filteredCampuses.map(campus => {
                      const isSelected = selectedCampus?.slug === campus.slug;
                      return (
                        <motion.div
                          key={campus.slug}
                          whileHover={{ x: 2 }}
                          onClick={() => setSelectedCampus(campus)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-amber-500/[0.08] border-amber-500 shadow-md shadow-amber-500/5' 
                              : isLightMode 
                                ? 'bg-white border-slate-200 hover:bg-slate-50' 
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-bold text-gray-500 font-mono flex items-center gap-1">
                              <MapPin size={10} className="text-amber-500" /> {campus.location}
                            </span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full font-mono border ${campus.badgeColor}`}>
                              Est. {campus.founded}
                            </span>
                          </div>
                          
                          <h4 className="font-extrabold text-sm capitalize">{campus.name}</h4>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {campus.tagline}
                          </p>

                          {/* Stat chips */}
                          <div className="flex gap-4.5 mt-3 text-[10px] text-gray-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Users size={11} className="text-amber-500/70" /> {campus.stats.students} students
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={11} className="text-amber-500/70" /> {campus.stats.courses} programs
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center p-8 text-gray-500 text-xs rounded-2xl border border-dashed border-white/10">
                      No matching campuses mapped. Try clear filters!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Map & Detail Panel Column */}
            <div className={`lg:col-span-8 flex flex-col gap-6 ${mobileSubTab === 'map' ? 'block' : 'hidden lg:block'}`}>
              
              {/* GOOGLE MAPS STYLE HIGH-FIDELITY OFFLINE INTERACTIVE ENGINE */}
              <div className={`rounded-3xl border overflow-hidden relative flex flex-col h-[400px] md:h-[480px] shadow-2xl transition-all ${
                isLightMode 
                  ? 'bg-slate-100 border-slate-200' 
                  : 'bg-[#0f0906] border-white/5'
              }`}>
                
                {/* 1. FLOATING GOOGLE MAPS SEARCH OVERLAY CARD */}
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 z-30 flex flex-col gap-2">
                  <div className={`p-1.5 rounded-2xl shadow-xl flex items-center gap-2 border backdrop-blur-md ${
                    isLightMode 
                      ? 'bg-white/95 border-slate-200 text-slate-800' 
                      : 'bg-zinc-950/90 border-white/10 text-white'
                  }`}>
                    <div className="p-2 text-amber-500 rounded-xl bg-amber-500/10">
                      <Compass size={16} className="animate-spin-slow" />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={mapSearchQuery}
                        onChange={(e) => setMapSearchQuery(e.target.value)}
                        placeholder="Search maps or locate campus..."
                        className="w-full bg-transparent text-xs font-bold focus:outline-none placeholder-gray-500 py-1 pr-6"
                      />
                      {mapSearchQuery && (
                        <button
                          onClick={() => setMapSearchQuery('')}
                          className="absolute right-1 top-1 text-gray-500 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    {mapSearchQuery ? (
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 mr-1">
                        {CAMPUSES_DATA.filter(c => 
                          c.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
                          c.location.toLowerCase().includes(mapSearchQuery.toLowerCase())
                        ).length} matches
                      </span>
                    ) : (
                      <div className="p-2 text-gray-400">
                        <Search size={14} />
                      </div>
                    )}
                  </div>

                  {/* Search suggestions active dropdown panel */}
                  {mapSearchQuery && (
                    <div className={`max-h-[160px] overflow-y-auto rounded-xl border p-1 shadow-2xl flex flex-col gap-0.5 backdrop-blur-lg ${
                      isLightMode 
                        ? 'bg-white/95 border-slate-200 divide-y divide-slate-100 text-slate-700' 
                        : 'bg-zinc-950/95 border-white/15 divide-y divide-white/5 text-gray-200'
                    }`}>
                      {CAMPUSES_DATA.filter(c => 
                        c.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
                        c.location.toLowerCase().includes(mapSearchQuery.toLowerCase())
                      ).map(c => (
                        <button
                          key={c.slug}
                          onClick={() => {
                            setSelectedCampus(c);
                            setMapSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between text-left p-2.5 text-xs rounded-lg transition-colors ${
                            isLightMode ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold block text-xs">{c.name}</span>
                            <span className="text-[10px] text-gray-400 block">{c.location} • {c.region}</span>
                          </div>
                          <span className="text-[9px] font-mono text-amber-550 border border-amber-500/20 px-1.5 py-0.5 rounded bg-amber-500/5">
                            Locate ➔
                          </span>
                        </button>
                      ))}
                      {CAMPUSES_DATA.filter(c => 
                        c.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
                        c.location.toLowerCase().includes(mapSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No matching MSU campuses found offline
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. FLOATING MAP TYPE CONTROLLER OVERLAY (Google Style) */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-zinc-950/85 backdrop-blur-sm border border-white/10 p-1 rounded-xl shadow-2xl">
                  {['default', 'satellite', 'terrain'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMapType(type as any)}
                      className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer capitalize ${
                        mapType === type
                          ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-md'
                          : 'bg-transparent border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      {type === 'default' ? '🗺️ Map' : type === 'satellite' ? '🛰️ Satellite' : '⛰️ Terrain'}
                    </button>
                  ))}
                </div>

                {/* 3. STUNNING DYNAMIC MAP TELEMETRY STATUS BAR (Google Style coordinates and zoom) */}
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1 bg-zinc-950/85 backdrop-blur-sm border border-white/10 p-1.5 rounded-xl shadow-2xl text-[9px] font-mono text-gray-300">
                  <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 pl-1">
                    <Navigation size={10} className="text-amber-500 animate-pulse" />
                    <span>GPS Lock: <strong className="text-white">{mouseCoord.lat.toFixed(4)}° N, {mouseCoord.lng.toFixed(4)}° E</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2">
                    <span>Scale:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-1 border-b border-x border-white text-center bg-white/20" />
                      <span className="text-[7px] text-amber-400 mt-0.5">{Math.round(80 / zoom)} km</span>
                    </div>
                  </div>
                  {selectedCampus && (
                    <div className="flex items-center gap-1 text-amber-400 font-bold border-l border-white/10 pl-2">
                      <span>• Locked to {selectedCampus.name}</span>
                    </div>
                  )}
                </div>

                {/* 4. GOOGLE MAP SERVICE FLOATING BUTTON CONTROLS (3D View Tilt, Yaw Rotate, Zoom, and Traffic) */}
                <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-1.5 bg-zinc-950/90 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-2xl text-[10px] w-11 items-center">
                  {/* 2D/3D Toggle */}
                  <button
                    onClick={() => {
                      setIs3D(!is3D);
                      if (!is3D) {
                        setTilt(55);
                      } else {
                        setTilt(0);
                        setRotation(0);
                      }
                    }}
                    title={is3D ? "Switch to 2D flat map" : "Activate 3D Google Earth globe"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 relative ${
                      is3D 
                        ? 'bg-amber-500 text-black shadow-md font-extrabold border border-amber-400' 
                        : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {is3D ? "3D" : "2D"}
                  </button>

                  <div className="w-full h-px bg-white/10 my-0.5" />

                  {/* Pitch Tilt Controls (only visible/enabled in 3D mode) */}
                  <button
                    onClick={() => setTilt(prev => Math.min(prev + 10, 75))}
                    disabled={!is3D}
                    title="Tilt Camera Up (Pitch)"
                    className={`p-2 rounded-lg active:scale-95 transition-all cursor-pointer ${
                      is3D ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => setTilt(prev => Math.max(prev - 10, 15))}
                    disabled={!is3D}
                    title="Tilt Camera Down (Pitch)"
                    className={`p-2 rounded-lg active:scale-95 transition-all cursor-pointer ${
                      is3D ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    ▼
                  </button>

                  <div className="w-full h-px bg-white/10 my-0.5" />

                  {/* Yaw Rotate Controls (only visible/enabled in 3D mode) */}
                  <button
                    onClick={() => setRotation(prev => prev - 15)}
                    disabled={!is3D}
                    title="Rotate Camera CCW (Yaw)"
                    className={`p-2 rounded-lg active:scale-95 transition-all cursor-pointer ${
                      is3D ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    ⟲
                  </button>
                  <button
                    onClick={() => setRotation(prev => prev + 15)}
                    disabled={!is3D}
                    title="Rotate Camera CW (Yaw)"
                    className={`p-2 rounded-lg active:scale-95 transition-all cursor-pointer ${
                      is3D ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    ⟳
                  </button>

                  <div className="w-full h-px bg-white/10 my-0.5" />

                  <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg active:scale-90 transition-all text-center cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg active:scale-90 transition-all text-center cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                      if (is3D) {
                        setTilt(55);
                        setRotation(-15);
                      } else {
                        setTilt(0);
                        setRotation(0);
                      }
                    }}
                    title="Reset Camera Orientation & Centering"
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg active:scale-90 transition-all text-center cursor-pointer"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => setTrafficActive(!trafficActive)}
                    title={trafficActive ? "Disable Active Traffic Data Overlay" : "Enable Live Real-Time Transport Traffic Overlay"}
                    className={`p-2 rounded-lg transition-all text-center cursor-pointer ${
                      trafficActive 
                        ? 'text-green-400 bg-green-500/10' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {trafficActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>

                {/* 5. GIGANTIC VIRTUAL OFFLINE GEOGRAPHIC LAYERING SCREEN (Supports Pan & Zoom and works seamlessly offline/online) */}
                <div 
                  className={`flex-1 relative overflow-hidden flex items-center justify-center select-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  } ${
                    is3D
                      ? 'bg-black' 
                      : mapType === 'default'
                        ? 'bg-[#c6e3fc]' // Standard Google maps water color
                        : mapType === 'satellite'
                          ? 'bg-[#040d1a]' // Satellite ocean
                          : 'bg-[#afd6db]' // Terrain water
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={(e) => {
                    handleMouseMove(e);
                    handleMouseMoveOverMap(e);
                  }}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* self-contained custom CSS animations for Earth 3D atmosphere */}
                  <style>{`
                    @keyframes drift {
                      0% { transform: translateX(-40vw); }
                      100% { transform: translateX(140vw); }
                    }
                    .animate-drift-slow {
                      animation: drift 140s linear infinite;
                    }
                    .animate-drift-fast {
                      animation: drift 85s linear infinite;
                    }
                    /* Custom rotation animation for galaxy background glow */
                    @keyframes slow-rot {
                      0% { transform: translate(-50%, -50%) rotate(0deg); }
                      100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    .animate-slow-rot {
                      animation: slow-rot 240s linear infinite;
                    }
                  `}</style>
                  
                  {/* Atmospheric Deep Space Galaxy Background (only visible in 3D views) */}
                  {is3D && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-radial from-slate-950 via-[#030107] to-black z-0">
                      {/* Purple Nebula Cloud */}
                      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-indigo-500/5 blur-[130px] rounded-full animate-pulse animate-slow-rot" />
                      {/* Cyan Oceanic Glow */}
                      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[110px] rounded-full" />
                      {/* Twinkled Stars Matrices */}
                      <div className="absolute inset-0 opacity-55 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:18px_18px]" />
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-[size:36px_36px] animate-pulse" />
                      {/* Atmospheric Halo Rim around Earth structure */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[840px] h-[840px] border border-cyan-500/10 rounded-full blur-[10px]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] border border-cyan-400/20 rounded-full select-none" style={{ boxShadow: 'inset 0 0 100px rgba(6, 182, 212, 0.12), 0 0 100px rgba(6, 182, 212, 0.12)' }} />
                    </div>
                  )}

                  {/* Atmospheric Drifting Clouds Layers Overlay (Google Earth style) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45 mix-blend-color-dodge z-30">
                    <div className="absolute w-[350px] h-[160px] bg-white/20 blur-[25px] rounded-full top-[15%] left-[-150px] animate-drift-slow" />
                    <div className="absolute w-[450px] h-[220px] bg-white/25 blur-[35px] rounded-full top-[40%] left-[-350px] animate-drift-fast" />
                    <div className="absolute w-[280px] h-[130px] bg-white/15 blur-[20px] rounded-full top-[70%] left-[-250px] animate-drift-slow" />
                  </div>

                  {/* Grid Lines Overlay representing actual long/lat parameters */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

                  {/* Zoomable, pan-transformed client content container (with hardware accelerated 3D perspective!) */}
                  <div 
                    className="absolute w-full h-full relative"
                    style={{
                      transform: is3D
                        ? `perspective(1000px) rotateX(${tilt}deg) rotateZ(${rotation}deg) scale(${zoom}) translate3d(${pan.x}px, ${pan.y}px, 0)`
                        : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformStyle: 'preserve-3d',
                      transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.1, 0.8, 0.25, 1)',
                      transformOrigin: 'center center',
                    }}
                  >
                    
                    {/* SVG Base Drawing Canvas with high-fidelity vector shapes */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        {/* Shaded vegetation gradients for high satellite fidelity */}
                        <radialGradient id="sat-forest-grad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#1b4332" />
                          <stop offset="70%" stopColor="#122a1f" />
                          <stop offset="100%" stopColor="#08140f" />
                        </radialGradient>

                        <radialGradient id="terrain-contour-grad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ebdcb9" />
                          <stop offset="85%" stopColor="#dfcea7" />
                          <stop offset="100%" stopColor="#cca173" stopOpacity="0.8" />
                        </radialGradient>

                        <linearGradient id="vector-land" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f5f4ef" />
                          <stop offset="100%" stopColor="#ebe9e1" />
                        </linearGradient>

                        {/* Connection fiber lines */}
                        <linearGradient id="fiber-net-path" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* --- MAIN MINDANAO LAND MASS VECTOR FILL --- */}
                      <path 
                        d="M 12,88 
                           L 10,85 
                           L 17,80 
                           L 22,76 
                           L 25,72 
                           L 27,62 
                           L 25,55 
                           L 28,48 
                           L 34,44 
                           L 30,35 
                           L 38,32 
                           L 40,36 
                           L 47,38 
                           L 41,25 
                           L 48,22 
                           L 52,18 
                           L 55,14 
                           L 60,18 
                           L 65,22 
                           L 72,15 
                           L 78,16 
                           L 83,12 
                           L 86,15 
                           L 93,20 
                           L 95,30 
                           L 92,45 
                           L 94,60 
                           L 88,71 
                           L 85,75 
                           L 82,72 
                           L 78,85 
                           L 75,80 
                           L 75,68 
                           L 74,84 
                           L 71,85 
                           L 68,78 
                           L 63,73 
                           L 55,62 
                           L 50,60 
                           L 44,55 
                           L 40,55 
                           Z" 
                        fill={
                          mapType === 'default' 
                            ? 'url(#vector-land)' 
                            : mapType === 'satellite' 
                              ? 'url(#sat-forest-grad)' 
                              : 'url(#terrain-contour-grad)'
                        }
                        stroke={
                          mapType === 'default' 
                            ? '#d3cfc5' 
                            : mapType === 'satellite' 
                              ? '#17361a' 
                              : '#c6b69b'
                        }
                        strokeWidth="0.4"
                        className="transition-colors duration-450 ease-in-out"
                      />

                      {/* EXTRA ISLANDS AND BASINS OUT OF THE BASE PATH */}
                      {/* Basilan Island */}
                      <path 
                        d="M 26,58 Q 28,60 30,58 T 28,55 Z" 
                        fill={mapType === 'default' ? '#ebe9e1' : mapType === 'satellite' ? '#14301b' : '#ebdcb9'} 
                        stroke="#000" strokeWidth="0.05" opacity="0.8" 
                      />
                      {/* Samal Island in Davao Gulf */}
                      <path 
                        d="M 81,72 Q 82.5,74 81.5,76 T 80,73 Z" 
                        fill={mapType === 'default' ? '#ebe9e1' : mapType === 'satellite' ? '#14301b' : '#ebdcb9'} 
                        stroke="#000" strokeWidth="0.05" opacity="0.8" 
                      />
                      {/* Camiguin Island */}
                      <circle 
                        cx="62" cy="12" r="1.3" 
                        fill={mapType === 'default' ? '#ebe9e1' : mapType === 'satellite' ? '#14301b' : '#cbdcb9'} 
                        stroke="#000" strokeWidth="0.05" opacity="0.8" 
                      />

                      {/* --- LAKE LANAO WATER CUTOUT OVERLAY --- */}
                      <path 
                        d="M 50.5,29.5 Q 52,28.5 54,30 T 53,32.5 Q 51.5,33 50.5,31 Z" 
                        fill={
                          mapType === 'default' 
                            ? '#a5c9eb' 
                            : mapType === 'satellite' 
                              ? '#0c1d31' 
                              : '#9ad0d4'
                        }
                        stroke={mapType === 'default' ? '#7facd4' : '#14293f'}
                        strokeWidth="0.15"
                        className="transition-colors duration-450"
                      />

                      {/* GEOGRAPHIC LANDMARK MOUNTAIN RANGES (Terrain / topo peaks) */}
                      {mapType === 'terrain' && (
                        <g opacity="0.7">
                          {/* Mount Apo Elevation Shading (Davao sector) */}
                          <polygon points="76,64 74,67 78,67" fill="#cf7e53" stroke="#b05d33" strokeWidth="0.1" />
                          <text x="75" y="69" fontSize="1.4" fontFamily="monospace" fontWeight="bold" fill="#7d3c1b" textAnchor="middle">Mt. Apo (2,954m)</text>
                          {/* Bucas Grande Peaks */}
                          <polygon points="88,28 86,30 90,30" fill="#a89a7f" />
                          {/* Mount Kitanglad Elevations (Bukidnon area) */}
                          <polygon points="63,33 61,35 65,35" fill="#cf7e53" />
                          <text x="63" y="38" fontSize="1.2" fontFamily="monospace" fill="#755a30" textAnchor="middle">Kitanglad</text>
                        </g>
                      )}

                      {/* --- OFF-LINE DURABLE GEOGRAPHIC TRANSPORT SYSTEM (Highways representation) --- */}
                      <g opacity={mapType === 'satellite' ? '0.65' : '0.85'}>
                        {/* Major Highway Infrastructure paths connecting key academic hubs on land */}
                        <path 
                          id="pan-philippine-highway"
                          d="M 50,10 L 55,18 L 52,30 L 44,55 L 74,78" 
                          fill="none" 
                          stroke={
                            mapType === 'default' 
                              ? '#fca5a5' 
                              : mapType === 'satellite' 
                                ? '#f59e0b' 
                                : '#b91c1c'
                          } 
                          strokeWidth="0.5" 
                          strokeLinecap="round" 
                          className="transition-colors duration-450"
                        />
                        <path 
                          id="secondary-route-west"
                          d="M 52,30 L 34,44 L 26,52" 
                          fill="none" 
                          stroke={mapType === 'default' ? '#e2e8f0' : mapType === 'satellite' ? '#fbbf24' : '#e11d48'} 
                          strokeWidth="0.35" 
                          strokeLinecap="round"
                        />

                        {/* Real-time moving live-traffic flow dashes overlay */}
                        {trafficActive && (
                          <>
                            {/* Smooth green flowing lanes on Northern & Central segment */}
                            <path 
                              d="M 50,10 L 55,18 L 52,30" 
                              fill="none" 
                              stroke="#22c55e" 
                              strokeWidth="0.35" 
                              strokeDasharray="1.5 1" 
                              className="animate-pulse"
                            />
                            {/* Congested yellow-orange segment in internal road passes */}
                            <path 
                              d="M 52,30 L 44,55" 
                              fill="none" 
                              stroke="#eab308" 
                              strokeWidth="0.35" 
                              strokeDasharray="1 1"
                            />
                            {/* Red congested heavy-traffic slow bottleneck near major central spine */}
                            <path 
                              d="M 44,55 L 53,60" 
                              fill="none" 
                              stroke="#ef4444" 
                              strokeWidth="0.4" 
                              strokeDasharray="0.5 0.5"
                            />
                            {/* Clean rapid freeway lanes down to Southern port */}
                            <path 
                              d="M 44,55 L 74,78" 
                              fill="none" 
                              stroke="#22c55e" 
                              strokeWidth="0.35" 
                              strokeDasharray="2 1.5"
                            />
                          </>
                        )}
                      </g>

                      {/* --- UNIFIED UNIVERSITY SYSTEM HIGH-SPEED OPTIC NETWORK INTERLINK --- */}
                      <g>
                        {CAMPUSES_DATA.map((source, sIdx) => {
                          if (sIdx === 0) return null;
                          const target = CAMPUSES_DATA[0]; // Interlinked to MSU Main (academic router center)
                          return (
                            <line 
                              key={`fiber-${sIdx}`}
                              x1={source.coordinate.x}
                              y1={source.coordinate.y}
                              x2={target.coordinate.x}
                              y2={target.coordinate.y}
                              stroke="url(#fiber-net-path)"
                              strokeWidth="0.15"
                              strokeDasharray="1 1"
                            />
                          );
                        })}
                      </g>

                      {/* Simulated auxiliary maritime transport dotted lines */}
                      <g>
                        {/* Zamboanga to Sulu Sea marine ferry chain */}
                        <line x1="26" y1="52" x2="25" y2="72" stroke="#3b82f6" strokeWidth="0.16" strokeDasharray="0.8 0.8" opacity="0.6" />
                        {/* Sulu to Tawi tawi deep-sea ferry line */}
                        <line x1="25" y1="72" x2="10" y2="88" stroke="#0ea5e9" strokeWidth="0.18" strokeDasharray="0.8 1" opacity="0.7" />
                      </g>

                      {/* MINOR CITY TARGET LABELS FOR VAST SENSE OF SCALE AND DISCOVERY */}
                      <g opacity="0.5">
                        {/* Major external trade hubs */}
                        <circle cx="78" cy="50" r="0.4" fill="#000" />
                        <text x="78" y="52.2" fontSize="1.1" fontFamily="sans-serif" fill={mapType === 'satellite' ? '#94a3b8' : '#475569'} fontWeight="bold">Davao City</text>

                        <circle cx="68" cy="19" r="0.4" fill="#000" stroke="#fff" strokeWidth="0.1" />
                        <text x="68" y="17.6" fontSize="1.1" fontFamily="sans-serif" fill={mapType === 'satellite' ? '#94a3b8' : '#475569'}>Cagayan de Oro</text>

                        <circle cx="26" cy="52" r="0.4" fill="#000" />
                        <text x="26" y="54.2" fontSize="1.1" fontFamily="sans-serif" fill={mapType === 'satellite' ? '#94a3b8' : '#475569'}>Zamboanga City</text>
                      </g>
                    </svg>

                     {/* --- HIGH-FIDELITY OFFLINE CAMPUS HOTSPOT AGENT BEACONS --- */}
                    {CAMPUSES_DATA.map((campus) => {
                      const isSelected = selectedCampus?.slug === campus.slug;
                      const isMapped = filteredCampuses.some(fc => fc.slug === campus.slug);

                      return (
                        <div
                          key={campus.slug}
                          className="absolute cursor-pointer group"
                          style={{ 
                            top: `${campus.coordinate.y}%`, 
                            left: `${campus.coordinate.x}%`,
                            transform: is3D
                              ? `translate(-50%, -100%) rotateZ(${-rotation}deg) rotateX(${-tilt}deg) scale(${isSelected ? 1.25 : 1.0})`
                              : `translate(-50%, -50%) scale(${isSelected ? 1.25 : 1.0})`,
                            transformStyle: 'preserve-3d',
                            pointerEvents: 'auto',
                            zIndex: isSelected ? 100 : 10,
                            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.1, 0.8, 0.25, 1)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Stop background pan triggering
                            setSelectedCampus(campus);
                          }}
                        >
                          {/* 3D Ground Shadow Footprint */}
                          {is3D && (
                            <div className="absolute top-[35px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/60 rounded-full blur-[1px] transform rotateX(75deg) pointer-events-none" />
                          )}

                          {/* 3D Vertical Vector Pointer Rod (connector line to the ground) */}
                          {is3D && (
                            <div 
                              className="absolute w-[1.5px] bg-gradient-to-t from-amber-500 via-amber-400 to-transparent pointer-events-none z-0"
                              style={{
                                height: '35px',
                                bottom: '-35px',
                                left: 'calc(50% - 0.75px)',
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'bottom center',
                              }}
                            />
                          )}

                          {/* Pulsating live radar ring */}
                          {isMapped && (
                            <span className={`absolute -top-3.5 -left-3.5 w-10.5 h-10.5 rounded-full ring-2 animate-ping-slow pointer-events-none ${
                              isSelected ? 'ring-amber-500/60' : 'ring-amber-400/20'
                            }`} />
                          )}

                          {/* Standard Google-Pin-Styled Beacon container */}
                          <div className={`p-1 rounded-full border shadow-3d-needle shadow-black/50 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-amber-400 border-white scale-125 z-40' 
                              : isMapped 
                                ? 'bg-amber-500/25 border-amber-500 hover:bg-amber-400' 
                                : 'bg-zinc-800/25 border-zinc-750 opacity-40 hover:opacity-100'
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-black' : isMapped ? 'bg-amber-500' : 'bg-transparent'
                            }`}>
                              <span className="w-1 h-1 rounded-full bg-white block" />
                            </div>
                          </div>

                          {/* Float visual name panel labels (rotated elegantly with anti-matrix calculations) */}
                          <div className={`absolute left-6 -top-1 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-2xl pointer-events-none transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                            isSelected 
                              ? 'bg-amber-500 text-black border-white font-extrabold text-[10px] scale-105 z-50' 
                              : isLightMode
                                ? 'bg-white/95 text-slate-800 border-slate-200 font-bold text-[9px]'
                                : 'bg-black/90 text-gray-200 border-white/5 font-bold text-[9px] group-hover:text-white'
                          }`}>
                            <MapPin size={10} className={isSelected ? 'text-black' : 'text-amber-500'} />
                            <span>{campus.name}</span>
                            {isSelected && (
                              <span className="text-[7px] font-mono px-1 py-0.2 bg-black/30 text-white rounded uppercase font-black tracking-wider">
                                Active Pin
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>

                </div>

                {/* Base reference indicators footer to maintain neat structure */}
                <div className="flex flex-wrap justify-between items-center gap-3 p-3 text-[10px] text-gray-500 font-mono border-t border-white/5 bg-black/40 z-10">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Active Citadel</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10 opacity-40 inline-block" /> Outside Filter</span>
                    <span className="flex items-center gap-1"><span className="w-5 h-px border-t border-dashed border-amber-500/40 inline-block" /> High-speed Interlink</span>
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-amber-500/70 font-semibold flex items-center gap-1 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    Offline Persistent Maps Active
                  </div>
                </div>

              </div>

              {/* Mobile Touch-Friendly Hotspot Navigation Panel */}
              <div className="flex md:hidden flex-col gap-2.5 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 mt-3 text-center">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Quick Map Nav</span>
                  <span className="text-[9px] font-mono text-amber-550 font-extrabold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Step Through Nodes
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => {
                      const currentIndex = CAMPUSES_DATA.findIndex(c => c.slug === selectedCampus?.slug);
                      const prevIndex = currentIndex <= 0 ? CAMPUSES_DATA.length - 1 : currentIndex - 1;
                      setSelectedCampus(CAMPUSES_DATA[prevIndex]);
                    }}
                    className="flex-1 py-2.5 px-3 bg-white/5 text-gray-300 border border-white/5 font-extrabold rounded-xl text-xs hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer text-base font-black"
                  >
                    ← Prev Node
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = CAMPUSES_DATA.findIndex(c => c.slug === selectedCampus?.slug);
                      const nextIndex = currentIndex === -1 || currentIndex === CAMPUSES_DATA.length - 1 ? 0 : currentIndex + 1;
                      setSelectedCampus(CAMPUSES_DATA[nextIndex]);
                    }}
                    className="flex-1 py-2.5 px-3 bg-amber-500 text-black font-extrabold rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-all text-center cursor-pointer text-base font-black"
                  >
                    Next Node →
                  </button>
                </div>
              </div>

              {/* DYNAMIC SHOWER DETAIL CONTAINER (Selected Campus profile) */}
              <AnimatePresence mode="wait">
                {resolvedSelectedCampus ? (
                  <motion.div
                    key={resolvedSelectedCampus.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className={`rounded-3xl border overflow-hidden p-6 text-left ${
                      isLightMode 
                        ? 'bg-white border-slate-200' 
                        : 'bg-gradient-to-b from-white/[0.02] to-black/40 border-white/5'
                    }`}
                  >
                    
                    {/* Large visual headliner with custom theme gradient backplanes */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-5 mb-5 gap-4">
                      <div className="flex justify-between items-start w-full gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono border uppercase tracking-wider ${resolvedSelectedCampus.badgeColor}`}>
                              {resolvedSelectedCampus.region} Portal
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                              <Calendar size={11} /> Founded {resolvedSelectedCampus.founded}
                            </span>
                          </div>
                          <h2 className="text-3xl font-extrabold tracking-tight">{resolvedSelectedCampus.name}</h2>
                          <p className="text-xs text-amber-500 font-bold italic mt-0.5">{resolvedSelectedCampus.tagline}</p>
                        </div>
                        
                        <button
                          onClick={() => setSelectedCampus(null)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isLightMode 
                              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                          title="Click to Close / Deselect"
                          aria-label="Deselect Campus"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {/* Header metrics */}
                      <div className="flex gap-4">
                        <div className="text-center bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                          <p className="text-[9px] text-gray-500 font-mono uppercase">Student body</p>
                          <p className="text-lg font-black text-white">{resolvedSelectedCampus.stats.students}</p>
                        </div>
                        <div className="text-center bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                          <p className="text-[9px] text-gray-500 font-mono uppercase">Employability</p>
                          <p className="text-lg font-black text-amber-400">{resolvedSelectedCampus.stats.employmentRate}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-6">
                      {resolvedSelectedCampus.description}
                    </p>

                    {/* TWO COLUMN GRID Layout for details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      
                      {/* Specialties & Core focus */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                          <Award size={13} className="text-amber-500" /> Fields of Distinction
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {resolvedSelectedCampus.specialties.map(spec => (
                            <span 
                              key={spec} 
                              className="px-2.5 py-1 bg-white/5 rounded-xl border border-white/5 text-[11px] font-medium text-gray-200"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* List of colleges - hierarchical tree */}
                        <div className="pt-3 space-y-2 max-h-[500px] flex flex-col overflow-hidden">
                          <h4 className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                            <GraduationCap size={13} className="text-amber-500" /> Academic Structure
                          </h4>
                          <div className="flex-1 overflow-y-auto pr-2">
                            <CollegeTree colleges={resolvedSelectedCampus.colleges} />
                          </div>
                        </div>
                      </div>

                      {/* Landmarks */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                          <Compass size={13} className="text-amber-500" /> Scenic Tourism & Landmarks
                        </h4>
                        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                          {resolvedSelectedCampus.landmarks.map((land, lIdx) => (
                            <div key={lIdx} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
                              <p className="text-xs font-bold text-white flex items-center gap-1">
                                <span className="text-amber-500 font-mono text-[9px] font-black mr-1">{lIdx + 1}.</span> 
                                {land.name}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1 leading-normal">{land.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5">
                      <button 
                        onClick={() => {
                          // Allow comparisons
                          setCompareCampusA(resolvedSelectedCampus.slug);
                          setExplorerTab('compare');
                        }}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          isLightMode 
                            ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' 
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        }`}
                      >
                        Load in Comparison Engine
                      </button>

                      <a
                        href={`https://${resolvedSelectedCampus.slug}.edu.ph`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 text-xs font-bold rounded-xl bg-amber-500 text-black hover:bg-amber-400 text-center transition-all cursor-pointer"
                      >
                        Launch Interactive Campus Portal
                      </a>
                    </div>

                  </motion.div>
                ) : (
                  <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 opacity-60">
                    <Compass size={40} className="mx-auto text-amber-500/35 mb-4 animate-bounce" />
                    <h4 className="text-sm font-bold text-gray-300">No active campus selected</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-normal">
                      Select a node on the constellation network map above or scroll the matching list to load beautiful metrics, sightseeing landmarks and admissions.
                    </p>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </div>
          </div>
        )}

        {/* --- MAIN TAB 2: INTERACTIVE STUDENT MATCHMAKER ADVENTURE QUIZ --- */}
        {explorerTab === 'quiz' && (
          <div className="max-w-3xl mx-auto text-left">
            
            <AnimatePresence mode="wait">
              {quizStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-gold p-8 rounded-3xl bg-white/[0.01] text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                    <Sparkles size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-sans tracking-tight">Admissions Matchmaker Quiz</h2>
                    <p className="text-gray-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                      With campuses specializing in engineering, maritime aquaculture, agribusiness, and peace studies, let our interactive matching engine locate the campus that fits your academic goals.
                    </p>
                  </div>

                  <button
                    onClick={() => setQuizStep(1)}
                    className="px-8 py-3 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/10 cursor-pointer"
                  >
                    Start Matching Walkthrough
                  </button>
                </motion.div>
              )}

              {/* Question rendering loop (1..15 questions) */}
              {quizStep >= 1 && quizStep <= 15 && (() => {
                const currentQuestion = NEW_QUIZ_QUESTIONS[quizStep - 1];
                if (!currentQuestion) return null;
                return (
                  <motion.div
                    key={`step-${quizStep}`}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="card-gold p-8 rounded-3xl bg-white/[0.01] space-y-6"
                  >
                    <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                      <span>QUESTION {quizStep} OF 15</span>
                      <span className="text-amber-500 font-bold uppercase">{currentQuestion.category}</span>
                    </div>

                    {/* Dynamic Progress Indicator */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                        style={{ width: `${(quizStep / 15) * 100}%` }}
                      />
                    </div>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">{currentQuestion.title}</h3>

                    <div className="grid grid-cols-1 gap-3">
                      {currentQuestion.options.map(opt => {
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleQuizAnswer(quizStep - 1, opt.id)}
                            className="p-4 text-left rounded-2xl border bg-white/5 border-white/5 hover:border-amber-500/50 hover:bg-white/[0.08] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold text-xs md:text-sm text-amber-400 font-sans">{opt.label}</h4>
                              <p className="text-[11px] text-gray-400 font-sans leading-normal">{opt.desc}</p>
                            </div>
                            {/* Simple dynamic radio visual */}
                            <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center" />
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Return back options if student clicked erroneously */}
                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => setQuizStep(prev => Math.max(0, prev - 1))}
                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                      >
                        ← Back to Previous
                      </button>
                      <span className="text-[10px] font-mono text-gray-550">
                        Select any option to record and load next question
                      </span>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Quiz Result Match showing complete MSU affinity breakdown scores */}
              {quizStep === 16 && matchedCampus && (
                <motion.div
                  key="step-result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-gold p-8 rounded-3xl bg-white/[0.01] text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/25 px-4 py-1.5 rounded-full text-xs font-mono font-black animate-bounce">
                    <Sparkles size={13} /> 100% PERSONALIZED FIT MATCH FOUND!
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-500/85 uppercase block mb-1">Your Perfect Match:</span>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{matchedCampus.name}</h3>
                    <p className="text-xs md:text-sm text-amber-400 font-bold italic mt-1.5 bg-amber-500/5 px-3 py-1 rounded inline-block border border-amber-500/10">{matchedCampus.tagline}</p>
                    <p className="text-gray-300 text-xs mt-4 max-w-lg mx-auto leading-relaxed font-sans">
                      After compiling your preferences to <strong>15 distinct academic, environmental, and behavioral questions</strong>, the algorithm has identified <strong>{matchedCampus.name}</strong> as your highest affinity campus. It aligns perfectly with your specialty goals.
                    </p>
                  </div>

                  {/* Simple Founders Metrics */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2 text-left">
                    <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/5 font-mono text-[10px]">
                      <span className="text-gray-400 block uppercase mb-1">Founded Year</span>
                      <strong className="text-sm text-white">{matchedCampus.founded}</strong>
                    </div>
                    <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/5 font-mono text-[10px]">
                      <span className="text-gray-400 block uppercase mb-1">Citadel Focus</span>
                      <strong className="text-sm text-amber-400 truncate block">{matchedCampus.specialties[0]}</strong>
                    </div>
                  </div>

                  {/* Affinity Score Bar visual graph weights */}
                  <div className="bg-zinc-950/45 p-5 rounded-2xl border border-white/5 max-w-lg mx-auto text-left space-y-4">
                    <h4 className="text-xs font-black tracking-wider text-amber-550 uppercase flex items-center gap-2">
                      <span>📊 Comprehensive Campus Affinity Breakdown</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal font-sans">
                      Here is how your choices weighted across all Mindanao State University campuses (more answers matching a campus increases its fit score):
                    </p>
                    <div className="space-y-3 pt-1">
                      {CAMPUSES_DATA.map((c) => {
                        const score = campusMatchScores[c.slug] || 0;
                        const scoreValues = Object.values(campusMatchScores) as number[];
                        const maxVal = Math.max(...(scoreValues.length > 0 ? scoreValues : [1]), 1);
                        const pct = Math.min(Math.round((score / maxVal) * 100), 100);
                        const isBestFit = c.slug === matchedCampus.slug;

                        return (
                          <div key={c.slug} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-semibold">
                              <span className={isBestFit ? "text-amber-400 font-bold" : "text-gray-300"}>
                                {c.name} {isBestFit && " ★"}
                              </span>
                              <span className={isBestFit ? "text-amber-400 font-black" : "text-gray-400 font-mono"}>
                                {pct}% Match ({score} pts)
                              </span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isBestFit 
                                    ? "bg-gradient-to-r from-amber-500 to-amber-300" 
                                    : "bg-gray-600/40"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions line */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6 border-t border-white/5">
                    <button
                      onClick={restartQuiz}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Restart Matchmaker
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCampus(matchedCampus);
                        setExplorerTab('all');
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Locate Campus on 3D Map
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* --- MAIN TAB 3: DYNAMIC COMPARISON ENGINE MATRIX --- */}
        {explorerTab === 'compare' && (
          <div className="space-y-6 text-left">
            
            {/* Pick entities to compare */}
            <div className={`p-6 rounded-3xl border ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.01] border-white/5'
            }`}>
              <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-amber-500 mb-4">Pick Campuses to Compare</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Selector A */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Campus A Focus</label>
                  <select
                    value={compareCampusA}
                    onChange={(e) => setCompareCampusA(e.target.value)}
                    className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLightMode ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    {CAMPUSES_DATA.map(c => (
                      <option 
                        key={c.slug} 
                        value={c.slug} 
                        disabled={c.slug === compareCampusB}
                        className={isLightMode ? 'text-black' : 'text-white bg-[#0e0a05]'}
                      >
                        {c.name} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector B */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Campus B Focus</label>
                  <select
                    value={compareCampusB}
                    onChange={(e) => setCompareCampusB(e.target.value)}
                    className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-amber-500 ${
                      isLightMode ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    {CAMPUSES_DATA.map(c => (
                      <option 
                        key={c.slug} 
                        value={c.slug} 
                        disabled={c.slug === compareCampusA}
                        className={isLightMode ? 'text-black' : 'text-white bg-[#0e0a05]'}
                      >
                        {c.name} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Mobile swipe helper */}
            <div className="block sm:hidden text-center text-[10px] font-mono text-amber-500 italic bg-amber-500/5 py-2.5 rounded-xl border border-amber-500/10 mb-3">
              Swipe table sideways to view compared campuses 🔀
            </div>

            {/* Side-by-side spec comparison table */}
            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 font-bold text-gray-400 text-left w-1/4">Indicators</th>
                    <th className="p-4 font-bold text-amber-400 text-left w-3/8">{campusA.name}</th>
                    <th className="p-4 font-bold text-emerald-400 text-left w-3/8">{campusB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Tagline</td>
                    <td className="p-4 font-medium italic text-gray-300">{campusA.tagline}</td>
                    <td className="p-4 font-medium italic text-gray-300">{campusB.tagline}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Location</td>
                    <td className="p-4 text-white"><MapPin size={11} className="inline mr-1 text-rose-500" /> {campusA.location}</td>
                    <td className="p-4 text-white"><MapPin size={11} className="inline mr-1 text-emerald-500" /> {campusB.location}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Founded</td>
                    <td className="p-4 text-white font-mono">{campusA.founded} ({2026 - campusA.founded} years legacy)</td>
                    <td className="p-4 text-white font-mono">{campusB.founded} ({2026 - campusB.founded} years legacy)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Student Body</td>
                    <td className="p-4 text-white font-mono font-black text-sm">{campusA.stats.students}</td>
                    <td className="p-4 text-white font-mono font-black text-sm">{campusB.stats.students}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono font-bold">Programs On File</td>
                    <td className="p-4 text-white font-mono">{campusA.stats.courses} academic streams</td>
                    <td className="p-4 text-white font-mono">{campusB.stats.courses} academic streams</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Employment Rate</td>
                    <td className="p-4 text-white font-mono"><span className="text-amber-500 font-black">★ {campusA.stats.employmentRate}</span> matching industry placement</td>
                    <td className="p-4 text-white font-mono"><span className="text-emerald-500 font-black">★ {campusB.stats.employmentRate}</span> matching industry placement</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Distinct Specialties</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {campusA.specialties.map(spec => (
                          <span key={spec} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">{spec}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {campusB.specialties.map(spec => (
                          <span key={spec} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">{spec}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Key Core Colleges</td>
                    <td className="p-4 text-gray-400">
                      <ul className="list-disc pl-4 space-y-1">
                        {campusA.colleges.slice(0, 3).map((c, i) => <li key={i} className="truncate">{c}</li>)}
                      </ul>
                    </td>
                    <td className="p-4 text-gray-400">
                      <ul className="list-disc pl-4 space-y-1">
                        {campusB.colleges.slice(0, 3).map((c, i) => <li key={i} className="truncate">{c}</li>)}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-extrabold text-gray-500 uppercase tracking-wide text-[10px] font-mono">Iconic Sightseeing</td>
                    <td className="p-4 text-gray-400">
                      {campusA.landmarks.map((l, i) => <p key={i} className="mb-1"><span className="text-white font-bold">{l.name}</span>: {l.desc}</p>)}
                    </td>
                    <td className="p-4 text-gray-400">
                      {campusB.landmarks.map((l, i) => <p key={i} className="mb-1"><span className="text-white font-bold">{l.name}</span>: {l.desc}</p>)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Summary comparison widget */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-xs">
              <h4 className="font-bold text-amber-400 mb-1 font-mono uppercase flex items-center gap-1"><Sparkles size={13} /> Network Decision Advisor:</h4>
              <p className="text-gray-400 leading-relaxed font-mono text-[11px]">
                Both {campusA.name} ({campusA.region} region) and {campusB.name} ({campusB.region} region) have highly specialized focus systems. If you prioritize <span className="text-white font-bold">{campusA.specialties[0]}</span> and historic legacy established in {campusA.founded}, {campusA.name} is outstanding. For students choosing <span className="text-white font-bold">{campusB.specialties[0]}</span> and deep dive program tracks, {campusB.name} is recommended.
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
