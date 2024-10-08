import { faUniversity, faBuilding,faMonument, faHandHoldingHeart, faClinicMedical, faFutbol, faPaintBrush, faGlobe, faBaby, faBirthdayCake, faBook, faBroadcastTower, faBullhorn, faChalkboardTeacher, faChurch, faCode, faComments, faDumbbell, faFileAlt, faFilm, faFlask, faGamepad, faHandHoldingUsd, faHandshake, faHandsHelping, faHiking, faHome, faLandmark, faLaptop, faLeaf, faMapSigns, faMicrophone, faMusic, faOm, faPaw, faPizzaSlice, faRecycle, faRing, faScissors, faSeedling, faSmile, faStar, faStore, faTree, faTrophy, faTshirt, faUmbrellaBeach, faUserGraduate, faUsers, faUsersCog, faUserTie, faUtensils, faVideo, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faChalkboard, faGraduationCap, faUserFriends, faBriefcase, faSchool, faCalendarAlt, faSoccerBall, faHeart, faLemon, faTheaterMasks, faEarth, faHotel } from '@fortawesome/free-solid-svg-icons';

const organizerTypes = [
  { name: "Educational Institutions", symbol: faUniversity },
  { name: "Corporate and Business Entities", symbol: faBuilding },
  { name: "Government and Public Sector", symbol: faMonument },
  { name: "Non-Profit and Community Organizations", symbol: faHandHoldingHeart },
  { name: "Health and Wellness", symbol: faClinicMedical },
  { name: "Sports and Recreation", symbol: faFutbol },
  { name: "Arts and Culture", symbol: faPaintBrush },
  { name: "Travel and Tourism", symbol: faGlobe }
];


const eventsWithLogos = [
  { name: "Academic Conferences", logo: faChalkboard },
  { name: "Graduation Ceremonies", logo: faGraduationCap },
  { name: "Guest Lectures", logo: faUserFriends },
  { name: "Workshops and Seminars", logo: faBriefcase },
  { name: "Parent-Teacher Meetings", logo: faSchool },
  { name: "School Fairs and Carnivals", logo: faCalendarAlt },
  { name: "Sports Days", logo: faSoccerBall },
  { name: "Extracurricular Activities", logo: faHeart },
  { name: "Exam Preparation Workshops", logo: faLemon },
  { name: "Skill Development Programs", logo: faChalkboard },
  { name: "Competitive Exam Prep Events", logo: faBriefcase },
  { name: "Professional Development Workshops", logo: faBriefcase },
  { name: "Certification Courses", logo: faChalkboard },
  { name: "Corporate Training Sessions", logo: faBriefcase },
  { name: "Product Launches", logo: faBriefcase },
  { name: "Corporate Meetings and Conferences", logo: faBriefcase },
  { name: "Team Building Events", logo: faUserFriends },
  { name: "Business Networking Events", logo: faUserFriends },
  { name: "Industry Trade Shows", logo: faBriefcase },
  { name: "Cultural Festivals", logo: faPaintBrush },
  { name: "Alumni Meetups", logo: faUsers },
  { name: "Science Fairs", logo: faFlask },
  { name: "Educational Exhibitions", logo: faChalkboard },
  { name: "Student Orientation Programs", logo: faMapSigns },
  { name: "Teacher Training Sessions", logo: faChalkboardTeacher },
  { name: "Corporate Retreats", logo: faUmbrellaBeach },
  { name: "Company Anniversaries", logo: faBirthdayCake },
  { name: "Board Meetings", logo: faUsersCog },
  { name: "Sales Kickoff Events", logo: faBullhorn },
  { name: "Business Dinners", logo: faUtensils },
  { name: "Press Conferences", logo: faMicrophone },
  { name: "Art Exhibitions", logo: faPaintBrush },
  { name: "Music Concerts", logo: faMusic },
  { name: "Theater Performances", logo: faTheaterMasks },
  { name: "Charity Galas", logo: faHandHoldingHeart },
  { name: "Food Festivals", logo: faPizzaSlice },
  { name: "Holiday Celebrations", logo: faTree },
  { name: "Craft Fairs", logo: faScissors },
  { name: "Religious Ceremonies", logo: faChurch },
  { name: "Historical Reenactments", logo: faLandmark },
  { name: "Fashion Shows", logo: faTshirt },
  { name: "Talent Shows", logo: faStar },
  { name: "Sports Tournaments", logo: faTrophy },
  { name: "Fitness Bootcamps", logo: faDumbbell },
  { name: "Dance Competitions", logo: faUserFriends },
  { name: "Outdoor Adventure Trips", logo: faHiking },
  { name: "Gaming Tournaments", logo: faGamepad },
  { name: "Yoga and Meditation Retreats", logo: faOm },
  { name: "Film Screenings", logo: faFilm },
  { name: "Cooking Classes", logo: faUtensils },
  { name: "Book Clubs", logo: faBook },
  { name: "Nature Walks and Hikes", logo: faLeaf },
  { name: "Gardening Workshops", logo: faSeedling },
  { name: "Career Fairs", logo: faBriefcase },
  { name: "Resume Writing Workshops", logo: faFileAlt },
  { name: "Job Interviews", logo: faUserTie },
  { name: "Internship Programs", logo: faUniversity },
  { name: "Networking Mixers", logo: faHandshake },
  { name: "Leadership Bootcamps", logo: faChalkboardTeacher },
  { name: "Business Seminars", logo: faBriefcase },
  { name: "Mentorship Programs", logo: faUserGraduate },
  { name: "Birthday Parties", logo: faBirthdayCake },
  { name: "Weddings", logo: faRing },
  { name: "Anniversaries", logo: faHeart },
  { name: "Baby Showers", logo: faBaby },
  { name: "Family Reunions", logo: faUsers },
  { name: "Housewarming Parties", logo: faHome },
  { name: "Retirement Celebrations", logo: faSmile },
  { name: "Engagement Parties", logo: faRing },
  { name: "Webinars", logo: faLaptop },
  { name: "Virtual Conferences", logo: faBroadcastTower },
  { name: "Online Workshops", logo: faChalkboard },
  { name: "Virtual Networking Events", logo: faWifi },
  { name: "Live Streaming Events", logo: faVideo },
  { name: "Virtual Meet and Greet", logo: faHandsHelping },
  { name: "Fundraising Events", logo: faHandHoldingUsd },
  { name: "Hackathons", logo: faCode },
  { name: "Flea Markets", logo: faStore },
  { name: "Public Speaking Events", logo: faMicrophone },
  { name: "Debates", logo: faComments },
  { name: "Town Hall Meetings", logo: faLandmark },
  { name: "Environmental Cleanup Drives", logo: faRecycle },
  { name: "Pet Adoption Fairs", logo: faPaw }
];
  

export { organizerTypes ,eventsWithLogos };


