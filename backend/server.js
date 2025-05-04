const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/handymen', require ('./routes/handyman'));
const cleaningBookingRoutes = require('./routes/cleaningBooking');
app.use('/api/cleaning-bookings', cleaningBookingRoutes);

// Seed database function
const seedDatabase = async () => {
    const Handyman = require('./models/Handyman');// Ensure the model name matches your file
  try {
    // Clear existing data
    await Handyman.deleteMany({});
    
    const handymen = [
      // Rabat Handymen
      {
        name: 'Hassan Alaoui',
        phoneNumber: '0661234567',
        email: 'hassan@example.com',
        rating: 4.8,
        reviews: 127,
        skills: ['electrical'],
        yearsOfExperience: 10,
        zipCodes: ['10000', '10002', '10020', '10030', '10050', '10100', '10102', '10110', '10120'],
        city: 'Rabat',
        bio: 'Professional electrician with 10 years of experience',
        verified: true
      },
      {
        name: 'Karim Benjelloun',
        phoneNumber: '0667891234',
        email: 'karim@example.com',
        rating: 4.5,
        reviews: 84,
        skills: ['electrical'],
        yearsOfExperience: 7,
        zipCodes: ['10000', '10005', '10010', '10012', '10070', '10080', '10090', '10103', '10105'],
        city: 'Rabat',
        bio: 'Specialized in electrical installations and repairs',
        verified: true
      },
      {
        name: 'Mohammed Tazi',
        phoneNumber: '0668763412',
        email: 'mohammed@example.com',
        rating: 4.9,
        reviews: 156,
        skills: ['plumbing'],
        yearsOfExperience: 12,
        zipCodes: ['10010', '10011', '10012', '10040', '10060', '10080', '10110', '10112', '10130'],
        city: 'Rabat',
        bio: 'Master plumber with extensive experience',
        verified: true
      },
      {
        name: 'Omar El Yousfi',
        phoneNumber: '0669988776',
        email: 'omar.yousfi@example.com',
        rating: 4.8,
        reviews: 120,
        skills: ['carpentry'],
        yearsOfExperience: 10,
        zipCodes: ['20030', '20050', '20100', '20150', '20200', '20250'],
        city: 'Casablanca',
        bio: 'Expert in custom woodwork and furniture design',
        verified: true
      },
      {
        name: 'Mehdi Zaari',
        phoneNumber: '0661122334',
        email: 'mehdi.zaari@example.com',
        rating: 4.6,
        reviews: 85,
        skills: ['carpentry'],
        yearsOfExperience: 7,
        zipCodes: ['20000', '20100', '20200', '20300'],
        city: 'Casablanca',
        bio: 'Specialist in modern furniture assembly and repair',
        verified: true
      },
      {
        name: 'Karim Benchekroun',
        phoneNumber: '0665544332',
        email: 'karim.b@example.com',
        rating: 4.9,
        reviews: 145,
        skills: ['carpentry'],
        yearsOfExperience: 12,
        zipCodes: ['10000', '10100', '10120', '10200'],
        city: 'Rabat',
        bio: 'Traditional Moroccan wood carving specialist',
        verified: true
      },
      {
        name: 'Youssef Amrani',
        phoneNumber: '0667788991',
        email: 'youssef.a@example.com',
        rating: 4.5,
        reviews: 68,
        skills: ['carpentry'],
        yearsOfExperience: 5,
        zipCodes: ['10050', '10150', '10220'],
        city: 'Rabat',
        bio: 'Custom cabinet maker with European techniques',
        verified: true
      },
      
      // Casablanca Handymen
      {
        name: 'Ahmed El Mansouri',
        phoneNumber: '0661122334',
        email: 'ahmed@example.com',
        rating: 4.6,
        reviews: 112,
        skills: ['electrical'],
        yearsOfExperience: 8,
        zipCodes: ['20000', '20010', '20020', '20030', '20040', '20100', '20110', '20120', '20130', '20140', '20150', '20200', '20210', '20220'],
        city: 'Casablanca',
        bio: 'Electrical specialist in Casablanca',
        verified: true
      },
      {
        name: 'Mehdi Belhaj',
        phoneNumber: '0662233445',
        email: 'mehdi@example.com',
        rating: 4.4,
        reviews: 78,
        skills: ['plumbing'],
        yearsOfExperience: 6,
        zipCodes: ['20000', '20050', '20100', '20150', '20200', '20250', '20300', '20320', '20330', '20340', '20400'],
        city: 'Casablanca',
        bio: 'Bathroom plumbing expert',
        verified: true
      },
      {
        name: 'Samir Qasri',
        phoneNumber: '0663344556',
        email: 'samir@example.com',
        rating: 4.7,
        reviews: 95,
        skills: ['carpentry'],
        yearsOfExperience: 9,
        zipCodes: ['20030', '20080', '20130', '20180', '20230', '20270', '20310', '20350', '20410', '20420'],
        city: 'Casablanca',
        bio: 'Custom furniture specialist',
        verified: true
      },
      
      // Ifrane Handymen
      {
        name: 'Khalid Amrani',
        phoneNumber: '0664455667',
        email: 'khalid@example.com',
        rating: 4.9,
        reviews: 45,
        skills: ['carpentry'],
        yearsOfExperience: 11,
        zipCodes: ['53000', '53010', '53020', '53030', '53040', '53050'],
        city: 'Ifrane',
        bio: 'Woodworking specialist for homes and offices',
        verified: true
      },
      {
        name: 'Yassin Berrada',
        phoneNumber: '0665566778',
        email: 'yassin@example.com',
        rating: 4.7,
        reviews: 36,
        skills: ['electrical'],
        yearsOfExperience: 5,
        zipCodes: ['53000', '53015', '53025', '53035', '53045', '53055'],
        city: 'Ifrane',
        bio: 'Electrical systems specialist',
        verified: true
      },
      
      // Fes Handymen
      {
        name: 'Adil El Fassi',
        phoneNumber: '0666677889',
        email: 'adil@example.com',
        rating: 4.8,
        reviews: 89,
        skills: ['plumbing'],
        yearsOfExperience: 10,
        zipCodes: ['30000', '30002', '30010', '30020', '30030', '30040', '30050', '30060', '30070', '30080', '30090'],
        city: 'Fes',
        bio: 'Plumbing expert for all home needs',
        verified: true
      },
      {
        name: 'Nabil Cherkaoui',
        phoneNumber: '0667788990',
        email: 'nabil@example.com',
        rating: 4.5,
        reviews: 67,
        skills: ['masonry'],
        yearsOfExperience: 12,
        zipCodes: ['30100', '30110', '30120', '30130', '30140', '30150', '30160', '30170'],
        city: 'Fes',
        bio: 'Traditional Fes-style masonry specialist',
        verified: true
      },
      {
        name: 'Rachid Zemmouri',
        phoneNumber: '0668899001',
        email: 'rachid@example.com',
        rating: 4.6,
        reviews: 102,
        skills: ['electrical'],
        yearsOfExperience: 7,
        zipCodes: ['30000', '30050', '30100', '30150', '30200', '30210', '30220', '30230'],
        city: 'Fes',
        bio: 'Modern electrical solutions',
        verified: true
      },
      {
        name: 'Youssef Idrissi',
        phoneNumber: '0669900112',
        email: 'youssef@example.com',
        rating: 4.3,
        reviews: 62,
        skills: ['electrical'],
        yearsOfExperience: 4,
        zipCodes: ['30005', '30015', '30025', '30035', '30045', '30055', '30065', '30075'],
        city: 'Fes',
        bio: 'Specialized in electrical systems',
        verified: true
      },
      {
        name: 'Fatima Zahra Benali',
        phoneNumber: '0669876543',
        email: 'fatima.benali@example.com',
        rating: 4.9,
        reviews: 152,
        skills: ['cleaning'],
        yearsOfExperience: 8,
        zipCodes: ['10000', '10020', '10030', '10100', '10110', '10120', '10150', '10200'],
        city: 'Rabat',
        bio: 'Experienced cleaner specializing in apartments and villas',
        verified: true
      },
      {
        name: 'Khadija El Amrani',
        phoneNumber: '0654321987',
        email: 'khadija.amrani@example.com',
        rating: 4.7,
        reviews: 98,
        skills: ['cleaning'],
        yearsOfExperience: 6,
        zipCodes: ['20000', '20200', '20300', '20400', '20500', '20600', '20700', '20800'],
        city: 'Casablanca',
        bio: 'Detail-oriented and reliable cleaner',
        verified: true
      },
      {
        name: 'Salma Idrissi',
        phoneNumber: '0678912345',
        email: 'salma.idrissi@example.com',
        rating: 4.8,
        reviews: 110,
        skills: ['cleaning'],
        yearsOfExperience: 5,
        zipCodes: ['30000', '30050', '30100', '30200', '30300', '30400'],
        city: 'Fes',
        bio: 'Residential cleaning specialist',
        verified: true
      },
      {
        name: 'Nisrine Oukacha',
        phoneNumber: '0687654321',
        email: 'nisrine.oukacha@example.com',
        rating: 4.6,
        reviews: 76,
        skills: ['cleaning'],
        yearsOfExperience: 4,
        zipCodes: ['30000', '30100', '30200', '30300', '30400'],
        city: 'Fes',
        bio: 'Friendly and hardworking cleaner',
        verified: true
      },
      {
        name: 'Samira Bouzid',
        phoneNumber: '0645678921',
        email: 'samira.bouzid@example.com',
        rating: 4.5,
        reviews: 40,
        skills: ['cleaning'],
        yearsOfExperience: 3,
        zipCodes: ['30000', '30150', '30250', '30350'],
        city: 'Fes',
        bio: 'Affordable cleaning services',
        verified: true
      },
      {
        name: 'Meryem Qassimi',
        phoneNumber: '0691237894',
        email: 'meryem.qassimi@example.com',
        rating: 4.8,
        reviews: 65,
        skills: ['cleaning'],
        yearsOfExperience: 7,
        zipCodes: ['53000', '53100', '53200', '53300', '53400'],
        city: 'Ifrane',
        bio: 'Efficient cleaner known for attention to detail',
        verified: true
      },
      {
        name: 'Amina Lahlou',
        phoneNumber: '0673456789',
        email: 'amina.lahlou@example.com',
        rating: 4.9,
        reviews: 43,
        skills: ['cleaning'],
        yearsOfExperience: 5,
        zipCodes: ['53000', '53100', '53200', '53300'],
        city: 'Ifrane',
        bio: 'Passionate about creating clean spaces',
        verified: true
      },
      {
        name: 'Sanae Outmani',
        phoneNumber: '0656789123',
        email: 'sanae.outmani@example.com',
        rating: 4.6,
        reviews: 50,
        skills: ['cleaning'],
        yearsOfExperience: 4,
        zipCodes: ['10000', '10010', '10020', '10030', '10100', '10200'],
        city: 'Rabat',
        bio: 'Fast and affordable cleaning services',
        verified: true
      },
      {
        name: 'Yasmine Touhami',
        phoneNumber: '0632145678',
        email: 'yasmine.touhami@example.com',
        rating: 4.7,
        reviews: 90,
        skills: ['cleaning'],
        yearsOfExperience: 6,
        zipCodes: ['20000', '20100', '20200', '20300', '20400'],
        city: 'Casablanca',
        bio: 'Trustworthy cleaning professional',
        verified: true
      },
     
        {
          name: 'Ali Mansouri',
          phoneNumber: '0669876543',
          email: 'ali.mansouri@example.com',
          rating: 4.8,
          reviews: 120,
          skills: ['AC'],
          yearsOfExperience: 8,
          zipCodes: ['20000', '20100', '20200', '20300', '20400'],
          city: 'Casablanca',
          bio: 'Expert in AC installation and repair services',
          verified: true
        },
        {
          name: 'Sara El Fassi',
          phoneNumber: '0671234567',
          email: 'sara.elfassi@example.com',
          rating: 4.7,
          reviews: 95,
          skills: ['AC'],
          yearsOfExperience: 6,
          zipCodes: ['10000', '10100', '10200', '10300'],
          city: 'Rabat',
          bio: 'Specialist in energy-efficient AC systems',
          verified: true
        },
        {
          name: 'Omar Benali',
          phoneNumber: '0687654321',
          email: 'omar.benali@example.com',
          rating: 4.9,
          reviews: 110,
          skills: ['AC'],
          yearsOfExperience: 10,
          zipCodes: ['30000', '30100', '30200', '30300'],
          city: 'Fes',
          bio: 'Experienced in residential and commercial AC services',
          verified: true
        },
        {
          name: 'Fatima Zahra Idrissi',
          phoneNumber: '0698765432',
          email: 'fatima.idrissi@example.com',
          rating: 4.6,
          reviews: 85,
          skills: ['AC'],
          yearsOfExperience: 5,
          zipCodes: ['53000', '53100', '53200', '53300'],
          city: 'Ifrane',
          bio: 'Reliable AC technician with a focus on customer satisfaction',
          verified: true
        },
      
      {
        name: 'Imane Loukili',
        phoneNumber: '0676543212',
        email: 'imane.loukili@example.com',
        rating: 4.7,
        reviews: 88,
        skills: ['cleaning'],
        yearsOfExperience: 5,
        zipCodes: ['53000', '53100', '53200', '53300'],
        city: 'Ifrane',
        bio: 'Eco-friendly cleaning specialist',
        verified: true
      },
      {
        name: 'Mohamed Amrani',
        phoneNumber: '0662233445',
        email: 'mohamed.amrani@example.com',
        rating: 4.7,
        reviews: 45,
        skills: ['plumbing'],
        yearsOfExperience: 6,
        zipCodes: ['53000', '53015', '53025', '53035', '53045'],
        city: 'Ifrane',
        bio: 'Reliable plumber with expertise in pipe repairs and installations.',
        verified: true
      },
      {
        name: 'Youssef El Fassi',
        phoneNumber: '0663344556',
        email: 'youssef.elfassi@example.com',
        rating: 4.9,
        reviews: 60,
        skills: ['plumbing'],
        yearsOfExperience: 10,
        zipCodes: ['53000', '53020', '53030', '53040', '53050'],
        city: 'Ifrane',
        bio: 'Master plumber with a focus on eco-friendly plumbing solutions.',
        verified: true
      },
      {
        name: 'Khalid Benjelloun',
        phoneNumber: '0664455667',
        email: 'khalid.benjelloun@example.com',
        rating: 4.6,
        reviews: 40,
        skills: ['plumbing'],
        yearsOfExperience: 5,
        zipCodes: ['53000', '53010', '53020', '53030', '53040'],
        city: 'Ifrane',
        bio: 'Specialist in water heater installations and maintenance.',
        verified: true
      },
      {
        name: 'Ahmed Tazi',
        phoneNumber: '0665566778',
        email: 'ahmed.tazi@example.com',
        rating: 4.7,
        reviews: 55,
        skills: ['plumbing'],
        yearsOfExperience: 7,
        zipCodes: ['53000', '53015', '53025', '53035', '53045'],
        city: 'Ifrane',
        bio: 'Expert in leak detection and pipe replacement services.',
        verified: true
      }
    ];
    await Handyman.insertMany(handymen);
    console.log('Sample handymen inserted');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Uncomment the following line to seed the database when the server starts
seedDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));