export const BASE='/surfactants';
export const sustainabilityUrl='https://www.klkoleo.com/sustainability-principled-by-integrity/';
export const homeDescription='KLK OLEO Surfactants is a surfactant manufacturer & supplier, providing specialty surfactants, custom chemical manufacturing, and sustainable solutions. Contact us.';
export const introduction='Oleo-based, synthetic, and biodegradable surfactant solutions for customers worldwide, backed by 100 years of expertise, integrated oleochemical strength, and manufacturing in Europe and Asia.';
export const portfolioCopy='KLK OLEO Surfactants supplies global customers with non-ionic, anionic, and cationic surfactants, including ethoxylated and alkoxylated surfactants, tailored specialty surfactants, and custom chemical manufacturing solutions.';
export const ctaCopy='From surfactant selection to industrial scale-up of a customised product, KLK OLEO Surfactants helps you achieve reliable performance, consistent quality, and global supply.';
export const footerCopy='KLK OLEO Surfactants is your global partner for surfactants. We combine quality, dependable capacity, and technical support to help you achieve results from development to full scale production.';
export const markets=[
 {name:'Home Care and I&I Cleaning',slug:'home-care',copy:'Surfactants for detergency, wetting, degreasing, and low-foam cleaning systems.',colour:'teal',url:'https://www.klkoleo.com/markets/home-care-industries-institutional-ii-cleaning/'},
 {name:'Beauty & Personal Care',slug:'beauty-personal-care',copy:'Surfactants and blends for mild cleansing, solubilising, and formulation stability, with well-balanced sensory performance.',colour:'pink',url:'https://www.klkoleo.com/markets/beauty-personal-care/'},
 {name:'Agrochemicals',slug:'agrochemicals',copy:'Surfactants for emulsifying, dispersing, wetting, penetrating, defoaming, and formulation stability in conventional, biological crop protection and related application.',colour:'green',url:'https://www.klkoleo.com/agrochemicals'},
 {name:'Lubricants & Metalworking Fluids',slug:'lubricants',copy:'Surfactant solutions for emulsification, system stability, and robust process performance.',colour:'grey',url:'https://www.klkoleo.com/markets/lubricants/'},
 {name:'Textile & Leather',slug:'textile-leather',copy:'Surfactants for pretreatment, scouring, dyeing support and consistent finishing results in the textile industry, as well as for tanning and beamhouse processes in leather production.',colour:'purple',url:'https://www.klkoleo.com/brand/imbentin-ethoxylates-alkoxylates/'},
];
export const heroSlides=[
 {title:'100 YEARS',copy:'A Century of Surfactant Excellence.',image:'hero-01-100-years.jpg',alt:'A historic gathering beside a steam train',action:'Read More',kind:'article',target:'century',position:'50% 45%'},
 {title:'SUSTAINABILITY IN ACTION',copy:'20% more capacity and 30% less CO₂ emissions.',image:'hero-02-sustainability.jpg',alt:'A glass globe resting among green plants',action:'Read More',kind:'article',target:'sustainability',position:'65% 50%'},
 {title:'CUSTOM MANUFACTURING THAT BRINGS YOUR IDEAS TO LIFE',copy:'Scale-up, quality, and long-term capacity built around your needs.',image:'hero-03-custom-manufacturing.jpg',alt:'Stainless steel manufacturing tanks and walkways',action:'Read More',kind:'deferred',target:'Custom Manufacturing',position:'60% 50%'},
 {title:'OUR MARKETS',copy:'High-impact surfactants for every market we serve. Designed for performance, built for reliable scale-up.',image:'hero-04-our-markets.jpg',alt:'Personal care packaging with cotton and natural materials',action:'Explore Our Markets',kind:'anchor',target:'#markets-we-serve',position:'65% 50%'},
 {title:'FROM LAB IDEA TO 1,000 KG BATCH',copy:'Our pilot plant bridges the gap between R&D and full-scale production.',image:'hero-05-pilot-plant.jpg',alt:'Aerial view of a manufacturing facility surrounded by woodland',action:'Read More',kind:'deferred',target:'Pilot Plant',position:'50% 50%'},
];
export const capabilities=[
 ['Global manufacturing','Produced in Switzerland, the Netherlands, Belgium and Malaysia'],
 ['Scale-up support','From lab trials to industrial production'],
 ['Custom manufacturing','Tailored surfactants and customer-specific solutions'],
 ['Sustainable choices','Oleo-based options, RSPO and ISCC PLUS certifications'],
];
export const helpItems=[
 ['Improve supply flexibility','with production in Europe and Asia and efficient regional logistics.'],
 ['Reduce scale-up risk','with application support from first lab trials to industrial production.'],
 ['Speed up approvals and audits','with responsible sourcing, certifications, and documentation support.'],
 ['Avoid supply risk','with diversified manufacturing capacity across Europe and Asia.'],
];
export const faqs=[
 ['What does KLK OLEO Surfactants manufacture?','KLK OLEO Surfactants manufactures industrial and specialty surfactants for a wide range of applications. Our portfolio includes nonionic, anionic, and cationic surfactants, as well as tailored customer-specific solutions designed for performance, consistency, and reliable supply.'],
 ['Is KLK OLEO Surfactants part of an oleochemical manufacturing group?','Yes. KLK OLEO Surfactants is part of KLK OLEO, one of the world’s largest vertically integrated oleochemical groups. This integration supports raw material security, supply continuity, and the development of oleo-based surfactant solutions for global markets. Nevertheless, we also supply surfactants based on synthetic fatty alcohols.'],
 ['How does KLK OLEO Surfactants support industrial chemical supply?','We support reliable industrial chemical supply through integrated oleochemical sourcing, diversified manufacturing, technical documentation, and global supply capabilities.'],
 ['Does KLK OLEO Surfactants offer custom chemical manufacturing?','Yes. We provide custom chemical manufacturing and tailored production support for customers who need specific performance profiles, blends, or manufacturing routes. Our teams support projects from product selection and development through to industrial production.'],
 ['Can KLK OLEO Surfactants support scale-up from lab trials to industrial production?','Yes. KLK OLEO Surfactants supports scale-up from early development through to full industrial production. We help reduce scale-up risk with technical support, process know-how, and manufacturing capabilities designed to move formulations forward efficiently.'],
];
export const newsCategories=['Exhibition','Product','Corporate','Sustainability'] as const;
export type NewsCategory=typeof newsCategories[number];
export const articles:{slug:string;title:string;category:NewsCategory;summary:string}[]=[
 {slug:'century',title:'A Century of Surfactant Excellence',category:'Corporate',summary:'100 years of surfactant excellence.'},
 {slug:'sustainability',title:'Sustainability in Action',category:'Sustainability',summary:'20% more capacity and 30% less CO₂ emissions.'},
];
