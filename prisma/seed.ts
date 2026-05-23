import { db } from '@/lib/db'

const scholarships = [
  {
    title: "Erasmus Mundus Joint Master in Textile Engineering",
    description: "A prestigious joint master's program offered by multiple European universities, focusing on advanced textile engineering, smart textiles, and sustainable manufacturing processes. Students study in at least two different European countries.",
    university: "Erasmus Mundus Consortium",
    country: "Multiple European Countries",
    subject: "Textile Engineering",
    degree: "Master's",
    amount: "Full tuition + €1,400/month stipend",
    applicationUrl: "https://erasmusmundus.eu/textile-engineering",
    openDate: new Date("2026-09-01"),
    deadlineDate: new Date("2026-12-15"),
    status: "open",
    isTextile: true,
    requirements: "Bachelor's degree in Textile Engineering or related field, IELTS 6.5+, Two recommendation letters, Statement of purpose",
    benefits: "Full tuition waiver, Monthly stipend, Travel allowance, Health insurance"
  },
  {
    title: "DAAD Scholarship for Textile and Clothing Technology",
    description: "German Academic Exchange Service scholarship for international students pursuing master's degrees in textile and clothing technology at German universities. Covers living expenses and health insurance for the duration of the program.",
    university: "RWTH Aachen University",
    country: "Germany",
    subject: "Textile and Clothing Technology",
    degree: "Master's",
    amount: "€934/month + tuition waiver",
    applicationUrl: "https://www.daad.de/textile-scholarship",
    openDate: new Date("2026-08-01"),
    deadlineDate: new Date("2026-11-30"),
    status: "open",
    isTextile: true,
    requirements: "Bachelor's degree, 2 years work experience, Language proficiency (German or English)",
    benefits: "Monthly stipend, Health insurance, Travel allowance, Study materials allowance"
  },
  {
    title: "Chevening Scholarship - Textile Design",
    description: "UK government's global scholarship program that offers full financial support for one year of master's study in the UK. This particular track focuses on textile design, fashion innovation, and sustainable textile practices.",
    university: "University of the Arts London",
    country: "United Kingdom",
    subject: "Textile Design",
    degree: "Master's",
    amount: "Full tuition + living allowance + travel",
    applicationUrl: "https://www.chevening.org/scholarship/textile-design",
    openDate: new Date("2026-08-01"),
    deadlineDate: new Date("2026-11-02"),
    status: "open",
    isTextile: true,
    requirements: "2 years work experience, Undergraduate degree, English proficiency, Leadership potential",
    benefits: "Full tuition fees, Monthly living allowance, Return flight to UK, Arrival allowance"
  },
  {
    title: "MEXT Scholarship - Textile Science",
    description: "Japanese Government Scholarship for international students to study textile science and advanced fiber engineering at top Japanese universities. Includes Japanese language training for the first 6 months.",
    university: "Tokyo Institute of Technology",
    country: "Japan",
    subject: "Textile Science",
    degree: "Master's",
    amount: "¥143,000/month + tuition waiver",
    applicationUrl: "https://www.studyinjapan.go.jp/en/mext/",
    openDate: new Date("2026-04-01"),
    deadlineDate: new Date("2026-05-31"),
    status: "closing_soon",
    isTextile: true,
    requirements: "Under 35 years old, Bachelor's degree, Good academic record, Japanese or English proficiency",
    benefits: "Full tuition waiver, Monthly stipend, Round-trip airfare, Japanese language training"
  },
  {
    title: "Australia Awards Scholarship - Textile Manufacturing",
    description: "Australian Government scholarship for students from developing countries to study textile manufacturing and sustainable fashion at Australian universities. Covers full tuition, living expenses, and overseas health cover.",
    university: "RMIT University",
    country: "Australia",
    subject: "Textile Manufacturing",
    degree: "Master's",
    amount: "Full tuition + AUD 30,000/year living allowance",
    applicationUrl: "https://www.dfat.gov.au/australia-awards",
    openDate: new Date("2026-02-01"),
    deadlineDate: new Date("2026-04-30"),
    status: "closed",
    isTextile: true,
    requirements: "Citizen of eligible developing country, Bachelor's degree, Work experience in textile sector, English proficiency",
    benefits: "Full tuition, Living contribution, Overseas Health Cover, Introductory academic program"
  },
  {
    title: "Chinese Government Scholarship - Textile Chemistry",
    description: "CSC scholarship for international students to pursue graduate studies in textile chemistry, dyeing and finishing at Donghua University, one of China's premier textile institutions.",
    university: "Donghua University",
    country: "China",
    subject: "Textile Chemistry",
    degree: "Master's",
    amount: "Full tuition + CNY 3,000/month stipend",
    applicationUrl: "http://www.campuschina.org/",
    openDate: new Date("2026-10-01"),
    deadlineDate: new Date("2027-01-15"),
    status: "open",
    isTextile: true,
    requirements: "Bachelor's degree, Under 35 years old, HSK or English proficiency, Good health",
    benefits: "Full tuition waiver, Monthly stipend, Free accommodation, Comprehensive medical insurance"
  },
  {
    title: "Fulbright Scholarship - Textile Technology",
    description: "The Fulbright Program offers research and study opportunities in textile technology and smart fabrics at leading US universities. Promotes mutual understanding between the US and other countries.",
    university: "North Carolina State University",
    country: "United States",
    subject: "Textile Technology",
    degree: "PhD",
    amount: "Full tuition + $2,500/month stipend",
    applicationUrl: "https://fulbright.org/apply/",
    openDate: new Date("2026-03-01"),
    deadlineDate: new Date("2026-08-01"),
    status: "open",
    isTextile: true,
    requirements: "Master's degree, Research proposal in textile technology, TOEFL 100+, Three recommendation letters",
    benefits: "Full tuition, Monthly stipend, Health insurance, Book allowance, Conference travel fund"
  },
  {
    title: "Swedish Institute Scholarship - Smart Textiles",
    description: "Swedish Institute Study Scholarship for international students from selected countries to pursue master's studies in smart textiles and wearable technology at Swedish universities.",
    university: "University of Borås",
    country: "Sweden",
    subject: "Smart Textiles",
    degree: "Master's",
    amount: "Full tuition + SEK 10,000/month",
    applicationUrl: "https://si.se/scholarship/",
    openDate: new Date("2026-10-01"),
    deadlineDate: new Date("2027-01-15"),
    status: "open",
    isTextile: true,
    requirements: "Citizen of eligible country, 3,000 hours work experience, Bachelor's degree, Leadership experience",
    benefits: "Full tuition fee, Monthly living allowance, Insurance, Travel grant"
  },
  {
    title: "VLIR-UOS Scholarship - Textile Sustainability",
    description: "Belgian development cooperation scholarship for students from developing countries to study sustainable textile production and circular fashion at Flemish universities.",
    university: "Ghent University",
    country: "Belgium",
    subject: "Textile Sustainability",
    degree: "Master's",
    amount: "Full tuition + €1,100/month allowance",
    applicationUrl: "https://www.vliruos.be/en/scholarships",
    openDate: new Date("2026-10-01"),
    deadlineDate: new Date("2027-02-01"),
    status: "open",
    isTextile: true,
    requirements: "Citizen of eligible developing country, Bachelor's degree, Professional experience in textile sector",
    benefits: "Full tuition waiver, Monthly allowance, Insurance, Travel costs, Accommodation"
  },
  {
    title: "Commonwealth Scholarship - Fashion & Textile Business",
    description: "Commonwealth Scholarship for students from Commonwealth countries to study fashion business and textile management in the UK. Focuses on sustainable textile supply chains and ethical fashion.",
    university: "University of Leeds",
    country: "United Kingdom",
    subject: "Fashion & Textile Business",
    degree: "Master's",
    amount: "Full tuition + £1,236/month allowance",
    applicationUrl: "https://cscuk.fcdo.gov.uk/scholarships/",
    openDate: new Date("2026-09-01"),
    deadlineDate: new Date("2026-12-12"),
    status: "open",
    isTextile: true,
    requirements: "Commonwealth citizen, Bachelor's degree with 2:1 or above, IELTS 6.5+, Development impact statement",
    benefits: "Full tuition fees, Stipend, Travel allowance, Warm clothing allowance, Thesis grant"
  },
  {
    title: "Gates Cambridge Scholarship - Textile Materials Science",
    description: "One of the most prestigious scholarships in the world, funding outstanding applicants to pursue graduate study in textile materials science at the University of Cambridge.",
    university: "University of Cambridge",
    country: "United Kingdom",
    subject: "Textile Materials Science",
    degree: "PhD",
    amount: "Full tuition + £18,744/year stipend",
    applicationUrl: "https://www.gatescambridge.org/apply/",
    openDate: new Date("2026-09-01"),
    deadlineDate: new Date("2026-12-03"),
    status: "open",
    isTextile: true,
    requirements: "Outstanding academic record, Research proposal, Four references, IELTS 7.5+",
    benefits: "Full cost of studying at Cambridge, Discretionary funding for conferences, Family allowance"
  },
  {
    title: "Rhodes Scholarship - Sustainable Fashion Engineering",
    description: "The Rhodes Scholarship is the oldest international scholarship program, enabling outstanding young people from around the world to study at the University of Oxford. This track focuses on sustainable fashion engineering.",
    university: "University of Oxford",
    country: "United Kingdom",
    subject: "Sustainable Fashion Engineering",
    degree: "Master's",
    amount: "Full tuition + £18,180/year stipend",
    applicationUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/apply/",
    openDate: new Date("2026-06-01"),
    deadlineDate: new Date("2026-10-01"),
    status: "open",
    isTextile: true,
    requirements: "Age 19-25, Undergraduate degree, Literary and scholastic attainments, Energy to use talents fully",
    benefits: "Full tuition, Living stipend, Travel to and from Oxford, Settlement allowance"
  },
  {
    title: "Korean Government Scholarship - Apparel Industry",
    description: "KGSP scholarship for international students to study apparel industry management and textile technology at Korean universities. Includes one year of Korean language training.",
    university: "Seoul National University",
    country: "South Korea",
    subject: "Apparel Industry",
    degree: "Master's",
    amount: "Full tuition + ₩900,000/month stipend",
    applicationUrl: "https://www.studyinkorea.go.kr/",
    openDate: new Date("2026-02-01"),
    deadlineDate: new Date("2026-03-20"),
    status: "closed",
    isTextile: true,
    requirements: "Under 40 years old, Bachelor's degree, GPA 2.64+, Good health",
    benefits: "Full tuition, Monthly stipend, Korean language training, Medical insurance, Settlement allowance"
  },
  {
    title: "New Zealand Scholarship - Textile Innovation",
    description: "New Zealand Government scholarship for students from developing countries to study textile innovation and sustainable manufacturing at New Zealand universities.",
    university: "University of Auckland",
    country: "New Zealand",
    subject: "Textile Innovation",
    degree: "Master's",
    amount: "Full tuition + NZD 28,000/year living allowance",
    applicationUrl: "https://www.mfat.govt.nz/en/aid-and-development/scholarships/",
    openDate: new Date("2026-02-01"),
    deadlineDate: new Date("2026-03-31"),
    status: "closed",
    isTextile: true,
    requirements: "Citizen of eligible country, Work experience, Bachelor's degree, English proficiency",
    benefits: "Full tuition, Living allowance, Establishment allowance, Medical and travel insurance"
  },
  {
    title: "Eiffel Excellence Scholarship - Textile Engineering",
    description: "French Government scholarship for international students to pursue master's level studies in textile engineering and technical textiles at French institutions.",
    university: "ENSISA (University of Haute-Alsace)",
    country: "France",
    subject: "Textile Engineering",
    degree: "Master's",
    amount: "€1,181/month + housing allowance",
    applicationUrl: "https://www.campusfrance.org/en/eiffel-scholarship",
    openDate: new Date("2026-09-01"),
    deadlineDate: new Date("2027-01-10"),
    status: "open",
    isTextile: true,
    requirements: "Under 30 years old, Bachelor's degree, Non-French nationality, Strong academic record",
    benefits: "Monthly allowance, Housing allowance, Travel expenses, Health insurance, Cultural activities"
  },
  {
    title: "EU Marie Sklodowska-Curie Fellowship - Smart Textiles",
    description: "European research fellowship for experienced researchers in smart textiles and wearable electronics. Involves mobility between countries and advanced research training.",
    university: "Polytechnic University of Milan",
    country: "Italy",
    subject: "Smart Textiles",
    degree: "Postdoc",
    amount: "€4,880/month + research costs",
    applicationUrl: "https://marie-sklodowska-curie-actions.ec.europa.eu/",
    openDate: new Date("2026-09-01"),
    deadlineDate: new Date("2027-01-14"),
    status: "open",
    isTextile: true,
    requirements: "PhD in relevant field, Research experience in smart textiles, Mobility requirement, Publication record",
    benefits: "Monthly living allowance, Mobility allowance, Family allowance, Research training network"
  },
  {
    title: "ITU/BDT Fellowship - Digital Textile Printing",
    description: "International Telecommunication Union fellowship for researchers from developing countries to study digital textile printing technology and its applications in the textile industry.",
    university: "ETH Zurich",
    country: "Switzerland",
    subject: "Digital Textile Printing",
    degree: "Master's",
    amount: "Full tuition + CHF 2,000/month",
    applicationUrl: "https://www.itu.int/en/ITU-D/",
    openDate: new Date("2026-07-01"),
    deadlineDate: new Date("2026-09-30"),
    status: "open",
    isTextile: true,
    requirements: "Citizen of developing country, Bachelor's degree in relevant field, Professional experience",
    benefits: "Full tuition, Monthly stipend, Travel costs, Research funding"
  },
  {
    title: "Islamic Development Bank Scholarship - Textile Technology",
    description: "IsDB scholarship for citizens of IsDB member countries to study textile technology and industrial engineering. Focuses on contributing to the development of the textile sector in member countries.",
    university: "University of Manchester",
    country: "United Kingdom",
    subject: "Textile Technology",
    degree: "Master's",
    amount: "Full tuition + monthly living allowance",
    applicationUrl: "https://www.isdb.org/scholarships",
    openDate: new Date("2026-01-01"),
    deadlineDate: new Date("2026-03-31"),
    status: "closed",
    isTextile: true,
    requirements: "Citizen of IsDB member country, Bachelor's degree, Work experience in textile sector, Age under 35",
    benefits: "Full tuition, Monthly living allowance, Health insurance, Return airfare, Books/clothing allowance"
  },
  {
    title: "Turkish Government Scholarship - Textile Design",
    description: "Türkiye Burslari scholarship for international students to study textile design and fashion at Turkish universities. Includes one year of Turkish language preparation.",
    university: "Istanbul Technical University",
    country: "Turkey",
    subject: "Textile Design",
    degree: "Master's",
    amount: "Full tuition + 4,500 TL/month stipend",
    applicationUrl: "https://www.turkiyeburslari.gov.tr/",
    openDate: new Date("2026-01-10"),
    deadlineDate: new Date("2026-02-20"),
    status: "closed",
    isTextile: true,
    requirements: "Under 35 years old, Bachelor's degree, Minimum 70% academic score, Health requirements",
    benefits: "Full tuition, Monthly stipend, Free accommodation, Health insurance, Turkish language course"
  },
  {
    title: "Aga Khan Foundation Scholarship - Textile Management",
    description: "Aga Khan Foundation International Scholarship for outstanding students from developing countries to study textile management and supply chain at top universities worldwide.",
    university: "University of British Columbia",
    country: "Canada",
    subject: "Textile Management",
    degree: "Master's",
    amount: "50% grant + 50% loan",
    applicationUrl: "https://the.akdn/how-we-work/our-agencies/aga-khan-foundation",
    openDate: new Date("2026-01-01"),
    deadlineDate: new Date("2026-03-31"),
    status: "closed",
    isTextile: true,
    requirements: "Citizen of eligible developing country, Strong academic record, Admission to target university, Financial need",
    benefits: "50% grant (non-repayable), 50% loan (low interest), Tuition and living costs coverage"
  }
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await db.notification.deleteMany()
  await db.scholarship.deleteMany()
  await db.userPreference.deleteMany()

  // Insert scholarships
  for (const scholarship of scholarships) {
    const created = await db.scholarship.create({ data: scholarship })
    
    // Create notifications for open and closing soon scholarships
    if (scholarship.status === 'open') {
      await db.notification.create({
        data: {
          scholarshipId: created.id,
          type: 'application_open',
          message: `${scholarship.title} at ${scholarship.university} is now accepting applications. Deadline: ${scholarship.deadlineDate.toLocaleDateString()}`,
          isRead: false
        }
      })
    }
    
    if (scholarship.status === 'closing_soon') {
      await db.notification.create({
        data: {
          scholarshipId: created.id,
          type: 'deadline_approaching',
          message: `⚠️ ${scholarship.title} at ${scholarship.university} deadline is approaching! Apply before ${scholarship.deadlineDate.toLocaleDateString()}`,
          isRead: false
        }
      })
    }
  }

  // Create user preferences
  await db.userPreference.create({
    data: {
      preferredSubjects: "Textile Engineering,Smart Textiles,Textile Design,Textile Technology,Textile Sustainability",
      preferredCountries: "Germany,United Kingdom,Japan,Sweden,Australia",
      notificationEnabled: true,
      emailNotifications: true
    }
  })

  console.log(`Seeded ${scholarships.length} scholarships and notifications`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
