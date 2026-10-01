export type UserRole = 'Parent' | 'Driver' | 'Walker';

export interface ChildItem {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  school: string;
  schoolAddress: string;
  pickupTime: string;
  dropoffTime: string;
  assignedChaperone: string;
  commuteMode: 'RideShare Van' | 'WalkShare Group';
  notes: string;
  boosterSeatRequired: boolean;
  emergencyPhone: string;
}

export interface VehicleInfo {
  model: string;
  year: number;
  plate: string;
  seats: number;
  color: string;
  vin: string;
  safetyCertExpiry: string;
  safetyFeatures: string[];
}

export interface DriverKYC {
  licenseNumber: string;
  licenseExpiry: string;
  licenseClass: string;
  vscCheck: 'Approved' | 'Pending' | 'Expired';
  vscReference: string;
  insurancePolicy: string;
  insuranceProvider: string;
  insuranceExpiry: string;
}

export interface WalkerInfo {
  zone: string;
  maxGroupSize: number;
  currentChildrenCount: number;
  certifications: string[];
  meetingPoint: string;
  chaperoneBadge: string;
}

export interface RoleTripHistory {
  id: string;
  date: string;
  time: string;
  tripType: string;
  route: string;
  companionOrDriver: string;
  status: 'Completed' | 'In Progress' | 'Cancelled' | 'Scheduled';
  amount: string;
  rating?: number;
}

export interface UserItem {
  id: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
  phone: string;
  email: string;
  joined: string;
  trips: number;
  spent: string;
  status: 'Active' | 'Pending' | 'Banned';
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  details?: {
    vehicleOrChildren: string;
    rating: string;
    address: string;
  };
  parentDetails?: {
    children: ChildItem[];
    subscriptionPlan: string;
    paymentMethod: string;
    totalSpent: string;
    tripsBooked: number;
    history: RoleTripHistory[];
  };
  driverDetails?: {
    vehicle: VehicleInfo;
    kyc: DriverKYC;
    rating: number;
    totalEarnings: string;
    tripsCompleted: number;
    onTimeRate: string;
    history: RoleTripHistory[];
  };
  walkerDetails?: {
    info: WalkerInfo;
    rating: number;
    totalEarnings: string;
    tripsCompleted: number;
    punctualityRate: string;
    history: RoleTripHistory[];
  };
}

export const INITIAL_USERS: UserItem[] = [
  {
    id: 'P001',
    name: 'Sarah Tremblay',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0192',
    email: 'sarah.t@example.com',
    joined: 'Sep 8, 2026',
    trips: 24,
    spent: '$218',
    status: 'Active',
    address: '142 Elmwood Ave, Toronto, ON M4K 1P2',
    emergencyContact: {
      name: 'David Tremblay',
      relation: 'Spouse / Father',
      phone: '+1 (416) 555-0199',
    },
    details: {
      vehicleOrChildren: '2 Children (Liam - Gr 3, Emma - Gr 1)',
      rating: '4.9 ★ (Parent)',
      address: '142 Elmwood Ave, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'Monthly Commute Pass ($19.99/mo)',
      paymentMethod: 'Visa ending in 4242',
      totalSpent: '$218 CAD',
      tripsBooked: 24,
      children: [
        {
          id: 'CH001',
          name: 'Liam Tremblay',
          age: 8,
          grade: 'Grade 3',
          avatar: '👦',
          school: 'Fern Avenue Junior & Senior Public School',
          schoolAddress: '128 Fern Ave, Toronto, ON',
          pickupTime: '08:05 AM',
          dropoffTime: '03:35 PM',
          assignedChaperone: 'Tariq Ahmed (Driver • Toyota Sienna)',
          commuteMode: 'RideShare Van',
          notes: 'Peanut allergy. Carries EpiPen in front blue backpack pocket.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0192',
        },
        {
          id: 'CH002',
          name: 'Emma Tremblay',
          age: 6,
          grade: 'Grade 1',
          avatar: '👧',
          school: 'Fern Avenue Junior & Senior Public School',
          schoolAddress: '128 Fern Ave, Toronto, ON',
          pickupTime: '08:05 AM',
          dropoffTime: '03:35 PM',
          assignedChaperone: 'Tariq Ahmed (Driver • Toyota Sienna)',
          commuteMode: 'RideShare Van',
          notes: 'High-back booster seat required. Prefers window seat.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0192',
        },
      ],
      history: [
        {
          id: 'TRP-9021',
          date: 'Sep 30, 2026',
          time: '08:05 AM',
          tripType: 'Morning Commute (RideShare)',
          route: '142 Elmwood Ave ➔ Fern Ave School',
          companionOrDriver: 'Tariq Ahmed (Toyota Sienna)',
          status: 'Completed',
          amount: '$12.50',
          rating: 5,
        },
        {
          id: 'TRP-8994',
          date: 'Sep 29, 2026',
          time: '03:35 PM',
          tripType: 'Afternoon Return (RideShare)',
          route: 'Fern Ave School ➔ 142 Elmwood Ave',
          companionOrDriver: 'Tariq Ahmed (Toyota Sienna)',
          status: 'Completed',
          amount: '$12.50',
          rating: 5,
        },
        {
          id: 'TRP-8940',
          date: 'Sep 28, 2026',
          time: '08:05 AM',
          tripType: 'Morning Commute (RideShare)',
          route: '142 Elmwood Ave ➔ Fern Ave School',
          companionOrDriver: 'Farhana Yasmin (Honda Odyssey)',
          status: 'Completed',
          amount: '$12.50',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'D001',
    name: 'Tariq Ahmed',
    roles: ['Driver', 'Parent'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0182',
    email: 'tariq.ahmed@example.com',
    joined: 'Aug 14, 2026',
    trips: 128,
    spent: '$2,860',
    status: 'Active',
    address: '210 Danforth Ave, Toronto, ON M4K 1N1',
    emergencyContact: {
      name: 'Nadia Ahmed',
      relation: 'Spouse',
      phone: '+1 (416) 555-0189',
    },
    details: {
      vehicleOrChildren: '2023 Toyota Sienna (7 Seater) • Plate #H2S-882 • 1 Child',
      rating: '4.95 ★ (Top Driver & Parent)',
      address: '210 Danforth Ave, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'School Term Pass ($89/term)',
      paymentMethod: 'Mastercard ending in 8812',
      totalSpent: '$178 CAD',
      tripsBooked: 32,
      children: [
        {
          id: 'CH003',
          name: 'Zayd Ahmed',
          age: 7,
          grade: 'Grade 2',
          avatar: '👦',
          school: 'Danforth Collegiate Junior School',
          schoolAddress: '800 Greenwood Ave, Toronto, ON',
          pickupTime: '08:15 AM',
          dropoffTime: '03:20 PM',
          assignedChaperone: 'Self (Tariq Ahmed - Driver)',
          commuteMode: 'RideShare Van',
          notes: 'Rides in family minivan alongside school carpool peers.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0182',
        },
      ],
      history: [
        {
          id: 'TRP-8810',
          date: 'Sep 30, 2026',
          time: '08:15 AM',
          tripType: 'Carpool Route (Combined)',
          route: 'Danforth Corridor ➔ Greenwood Ave School',
          companionOrDriver: 'Self (Driver Tariq)',
          status: 'Completed',
          amount: '$0.00 (Self-Ride)',
          rating: 5,
        },
      ],
    },
    driverDetails: {
      rating: 4.95,
      totalEarnings: '$2,860 CAD',
      tripsCompleted: 128,
      onTimeRate: '99.4%',
      vehicle: {
        model: 'Toyota Sienna XLE (7-Seater Child Transport)',
        year: 2023,
        plate: 'H2S-882',
        seats: 7,
        color: 'Silver Metallic',
        vin: '2T3K1RFV8NW091823',
        safetyCertExpiry: 'Aug 2027',
        safetyFeatures: [
          'Dual Power Sliding Doors with Child-Proof Lock',
          '3x Diono Radian 3R All-in-One Child Safety Seats',
          'Dual Facing HD Cloud Dashcam (Audio Off per Child Privacy)',
          'St. John Ambulance Certified First Aid Kit & Window Punch',
          'Rear Passenger Occupant Alert Sensor',
        ],
      },
      kyc: {
        licenseNumber: 'A4129-91820-91829',
        licenseExpiry: 'May 2029',
        licenseClass: 'Ontario Class G (Clean Abstract, 0 Demerit Points)',
        vscCheck: 'Approved',
        vscReference: 'TPS-VSC-2026-08149',
        insurancePolicy: 'COMM-99120-CAN',
        insuranceProvider: 'Aviva Canada Commercial Fleet & Rideshare',
        insuranceExpiry: 'Aug 2027',
      },
      history: [
        {
          id: 'DRV-1049',
          date: 'Sep 30, 2026',
          time: '07:55 AM – 08:35 AM',
          tripType: 'Morning High Park Multi-Child Carpool',
          route: '3 Stops: Elmwood Ave ➔ Bloor W ➔ Fern Ave School',
          companionOrDriver: 'Transported 5 Children (Liam, Emma, Lucas, Zayd, Maya)',
          status: 'Completed',
          amount: '+$42.50',
          rating: 5,
        },
        {
          id: 'DRV-1048',
          date: 'Sep 29, 2026',
          time: '03:20 PM – 04:05 PM',
          tripType: 'Afternoon School Return Shuttle',
          route: 'Fern Ave School ➔ 3 Neighborhood Home Drops',
          companionOrDriver: 'Transported 5 Children',
          status: 'Completed',
          amount: '+$42.50',
          rating: 5,
        },
        {
          id: 'DRV-1042',
          date: 'Sep 29, 2026',
          time: '07:55 AM – 08:35 AM',
          tripType: 'Morning High Park Multi-Child Carpool',
          route: '3 Stops: Elmwood Ave ➔ Bloor W ➔ Fern Ave School',
          companionOrDriver: 'Transported 4 Children',
          status: 'Completed',
          amount: '+$36.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'W001',
    name: 'Sarah Jenkins',
    roles: ['Walker', 'Parent'],
    activeRole: 'Walker',
    phone: '+1 (416) 555-0185',
    email: 'sarah.j@example.com',
    joined: 'Sep 1, 2026',
    trips: 45,
    spent: '$1,580',
    status: 'Active',
    address: '500 Yonge St, Toronto, ON M4Y 1X8',
    emergencyContact: {
      name: 'Robert Jenkins',
      relation: 'Brother',
      phone: '+1 (416) 555-0177',
    },
    details: {
      vehicleOrChildren: 'WalkShare Zone Leader • 1 Child enrolled',
      rating: '4.92 ★ (Certified Walker)',
      address: '500 Yonge St, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'Monthly Commute Pass ($19.99/mo)',
      paymentMethod: 'Visa ending in 9011',
      totalSpent: '$98 CAD',
      tripsBooked: 18,
      children: [
        {
          id: 'CH004',
          name: 'Oliver Jenkins',
          age: 9,
          grade: 'Grade 4',
          avatar: '👦',
          school: 'Church Street Junior Public School',
          schoolAddress: '83 Alexander St, Toronto, ON',
          pickupTime: '08:20 AM',
          dropoffTime: '03:15 PM',
          assignedChaperone: 'Self (Sarah Jenkins - Walker)',
          commuteMode: 'WalkShare Group',
          notes: 'Enjoys leading the walking school bus front banner.',
          boosterSeatRequired: false,
          emergencyPhone: '+1 (416) 555-0185',
        },
      ],
      history: [
        {
          id: 'TRP-7712',
          date: 'Sep 30, 2026',
          time: '08:20 AM',
          tripType: 'Walking School Bus Commute',
          route: 'Yonge & Wellesley ➔ Church St Junior School',
          companionOrDriver: 'Self (Walker Sarah)',
          status: 'Completed',
          amount: '$0.00 (Chaperone Child)',
          rating: 5,
        },
      ],
    },
    walkerDetails: {
      rating: 4.92,
      totalEarnings: '$1,580 CAD',
      tripsCompleted: 45,
      punctualityRate: '100%',
      info: {
        zone: 'Downtown Yonge & Church Corridor (Zone #1)',
        maxGroupSize: 6,
        currentChildrenCount: 4,
        certifications: [
          'St. John Ambulance Standard First Aid & CPR-C Level',
          'TPS Vulnerable Sector Criminal Record Clearance (Active)',
          'Vision Zero Pedestrian Crossing Safety Certification',
          'Child Behavior & Calming De-escalation Protocol',
        ],
        meetingPoint: 'Courtyard of 500 Yonge St (Safe Pedestrian Plaza)',
        chaperoneBadge: 'H2S-WALK-TOR-041',
      },
      history: [
        {
          id: 'WLK-302',
          date: 'Sep 30, 2026',
          time: '08:15 AM – 08:45 AM',
          tripType: 'Morning Walking School Bus Route',
          route: 'Yonge Plaza ➔ Alexander St (Church Public School)',
          companionOrDriver: 'Chaperoned 4 Children (Oliver, Maya, Leo, Zoe)',
          status: 'Completed',
          amount: '+$28.00',
          rating: 5,
        },
        {
          id: 'WLK-301',
          date: 'Sep 29, 2026',
          time: '03:15 PM – 03:45 PM',
          tripType: 'Afternoon Walking School Bus Escort',
          route: 'Church Public School ➔ Yonge St Plaza',
          companionOrDriver: 'Chaperoned 4 Children',
          status: 'Completed',
          amount: '+$28.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'P002',
    name: 'Amanda Roy',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0201',
    email: 'amanda.roy@example.com',
    joined: 'Sep 12, 2026',
    trips: 16,
    spent: '$159',
    status: 'Active',
    address: '88 Bloor St W, Toronto, ON M5S 1M4',
    emergencyContact: {
      name: 'Marc Roy',
      relation: 'Father',
      phone: '+1 (416) 555-0209',
    },
    details: {
      vehicleOrChildren: '1 Child (Lucas - Gr 2)',
      rating: '5.0 ★ (Parent)',
      address: '88 Bloor St W, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'Monthly Commute Pass ($19.99/mo)',
      paymentMethod: 'Amex ending in 1004',
      totalSpent: '$159 CAD',
      tripsBooked: 16,
      children: [
        {
          id: 'CH005',
          name: 'Lucas Roy',
          age: 7,
          grade: 'Grade 2',
          avatar: '🧒',
          school: 'Jesse Ketchum Junior and Senior Public School',
          schoolAddress: '61 Davenport Rd, Toronto, ON',
          pickupTime: '08:15 AM',
          dropoffTime: '03:30 PM',
          assignedChaperone: 'Farhana Yasmin (Driver • Honda Odyssey)',
          commuteMode: 'RideShare Van',
          notes: 'Carries mild asthma inhaler.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0201',
        },
      ],
      history: [
        {
          id: 'TRP-6129',
          date: 'Sep 30, 2026',
          time: '08:15 AM',
          tripType: 'Morning Commute (RideShare)',
          route: '88 Bloor St W ➔ 61 Davenport Rd',
          companionOrDriver: 'Farhana Yasmin',
          status: 'Completed',
          amount: '$10.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'D002',
    name: 'Farhana Yasmin',
    roles: ['Driver'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0183',
    email: 'farhana.y@example.com',
    joined: 'Aug 22, 2026',
    trips: 97,
    spent: '$2,410',
    status: 'Active',
    address: '45 Markham Rd, Scarborough, ON M1M 2V5',
    emergencyContact: {
      name: 'Salim Yasmin',
      relation: 'Spouse',
      phone: '+1 (416) 555-0172',
    },
    details: {
      vehicleOrChildren: '2022 Honda Odyssey (7 Seater) • Plate #H2S-914',
      rating: '4.98 ★ (Driver)',
      address: '45 Markham Rd, Scarborough, ON',
    },
    driverDetails: {
      rating: 4.98,
      totalEarnings: '$2,410 CAD',
      tripsCompleted: 97,
      onTimeRate: '99.8%',
      vehicle: {
        model: 'Honda Odyssey Touring (7 Seater)',
        year: 2022,
        plate: 'H2S-914',
        seats: 7,
        color: 'Deep Pearl Blue',
        vin: '5FNRL6H88NB029411',
        safetyCertExpiry: 'Sep 2027',
        safetyFeatures: [
          'Magic Slide 2nd-Row Seats with Child Latch Anchor',
          'CabinWatch Passenger Camera Monitoring System',
          '3x Graco TurboBooster Seats with High Backs',
          'Certified First Aid & Trauma Kit',
        ],
      },
      kyc: {
        licenseNumber: 'Y1924-81729-01923',
        licenseExpiry: 'Oct 2028',
        licenseClass: 'Ontario Class G (Clean Abstract)',
        vscCheck: 'Approved',
        vscReference: 'TPS-VSC-2026-08819',
        insurancePolicy: 'INTACT-COMM-44109',
        insuranceProvider: 'Intact Insurance Commercial Rideshare',
        insuranceExpiry: 'Sep 2027',
      },
      history: [
        {
          id: 'DRV-891',
          date: 'Sep 30, 2026',
          time: '08:00 AM – 08:35 AM',
          tripType: 'Morning School Carpool',
          route: 'Bloor St W ➔ Davenport Rd School',
          companionOrDriver: 'Lucas Roy, Chloe Dubois',
          status: 'Completed',
          amount: '+$32.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'P003',
    name: 'Marcus Vance',
    roles: ['Parent', 'Driver'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0188',
    email: 'marcus.v@example.com',
    joined: 'Sep 20, 2026',
    trips: 8,
    spent: '$79',
    status: 'Pending',
    address: '19 Queen St E, Toronto, ON M5C 2W5',
    emergencyContact: {
      name: 'Jessica Vance',
      relation: 'Spouse',
      phone: '+1 (416) 555-0181',
    },
    details: {
      vehicleOrChildren: '1 Child (Noah) • Driver KYC under review',
      rating: 'New Parent & Driver applicant',
      address: '19 Queen St E, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'Pay As You Go ($0/mo)',
      paymentMethod: 'Visa ending in 7741',
      totalSpent: '$79 CAD',
      tripsBooked: 8,
      children: [
        {
          id: 'CH006',
          name: 'Noah Vance',
          age: 5,
          grade: 'Senior Kindergarten',
          avatar: '👦',
          school: 'Market Lane Junior Public School',
          schoolAddress: '246 The Esplanade, Toronto, ON',
          pickupTime: '08:25 AM',
          dropoffTime: '03:15 PM',
          assignedChaperone: 'Pending Route Assignment',
          commuteMode: 'RideShare Van',
          notes: 'First time using school carpool service.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0188',
        },
      ],
      history: [
        {
          id: 'TRP-5510',
          date: 'Sep 26, 2026',
          time: '08:25 AM',
          tripType: 'Trial Commute Ride',
          route: '19 Queen St E ➔ The Esplanade School',
          companionOrDriver: 'Tariq Ahmed',
          status: 'Completed',
          amount: '$10.00',
          rating: 5,
        },
      ],
    },
    driverDetails: {
      rating: 0,
      totalEarnings: '$0.00 CAD',
      tripsCompleted: 0,
      onTimeRate: 'N/A',
      vehicle: {
        model: 'Chrysler Pacifica Hybrid (7 Seater)',
        year: 2023,
        plate: 'H2S-401',
        seats: 7,
        color: 'Velvet Red',
        vin: '2C4RC1N73PR591823',
        safetyCertExpiry: 'Pending Verification',
        safetyFeatures: [
          'SafetyTec Plus with Pedestrian Auto Emergency Braking',
          'Built-in Stow n Go Seating with Child LATCH anchors',
        ],
      },
      kyc: {
        licenseNumber: 'V2819-91820-19283',
        licenseExpiry: 'Dec 2027',
        licenseClass: 'Ontario Class G',
        vscCheck: 'Pending',
        vscReference: 'TPS-VSC-SUBMITTED-WAITING',
        insurancePolicy: 'DESJARDINS-APP-091',
        insuranceProvider: 'Desjardins Commercial Fleet',
        insuranceExpiry: 'Pending Verification',
      },
      history: [],
    },
  },
  {
    id: 'W002',
    name: 'Sophie Bouchard',
    roles: ['Walker'],
    activeRole: 'Walker',
    phone: '+1 (416) 555-0186',
    email: 'sophie.b@example.com',
    joined: 'Sep 10, 2026',
    trips: 38,
    spent: '$1,120',
    status: 'Active',
    address: '124 St George St, Toronto, ON M5S 2E4',
    emergencyContact: {
      name: 'Luc Bouchard',
      relation: 'Father',
      phone: '+1 (416) 555-0164',
    },
    details: {
      vehicleOrChildren: 'Certified Walking School Bus Chaperone',
      rating: '4.96 ★ (Walker)',
      address: '124 St George St, Toronto, ON',
    },
    walkerDetails: {
      rating: 4.96,
      totalEarnings: '$1,120 CAD',
      tripsCompleted: 38,
      punctualityRate: '99.5%',
      info: {
        zone: 'The Annex & Huron Corridor (Zone #3)',
        maxGroupSize: 6,
        currentChildrenCount: 5,
        certifications: [
          'Red Cross Standard Child Care First Aid & CPR',
          'Toronto Police Vulnerable Sector Cleared',
          'Active School Travel Safe Route Specialist',
        ],
        meetingPoint: 'St. George Subway Station (Bedford Entrance Parkette)',
        chaperoneBadge: 'H2S-WALK-TOR-058',
      },
      history: [
        {
          id: 'WLK-210',
          date: 'Sep 30, 2026',
          time: '08:10 AM – 08:40 AM',
          tripType: 'Morning Annex Walking School Bus',
          route: 'St George Parkette ➔ Huron Street Junior School',
          companionOrDriver: 'Chaperoned 5 Children',
          status: 'Completed',
          amount: '+$35.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'D003',
    name: 'Kabir Hossain',
    roles: ['Driver'],
    activeRole: 'Driver',
    phone: '+1 (416) 555-0184',
    email: 'kabir.h@example.com',
    joined: 'Sep 15, 2026',
    trips: 62,
    spent: '$1,920',
    status: 'Active',
    address: '77 Lawrence Ave, North York, ON M4N 1S6',
    emergencyContact: {
      name: 'Amina Hossain',
      relation: 'Spouse',
      phone: '+1 (416) 555-0169',
    },
    details: {
      vehicleOrChildren: '2024 Toyota HiAce Minivan • Plate #H2S-305',
      rating: '4.89 ★ (Driver)',
      address: '77 Lawrence Ave, North York, ON',
    },
    driverDetails: {
      rating: 4.89,
      totalEarnings: '$1,920 CAD',
      tripsCompleted: 62,
      onTimeRate: '98.8%',
      vehicle: {
        model: 'Toyota HiAce Luxury Commuter Minivan (8 Seater)',
        year: 2024,
        plate: 'H2S-305',
        seats: 8,
        color: 'Pure White',
        vin: 'JT3H810B829103819',
        safetyCertExpiry: 'Sep 2027',
        safetyFeatures: [
          '8 Individual Child Harness & Booster Compatible Seats',
          'Toyota Safety Sense with Automatic Emergency Braking',
          'Onboard Emergency Escape Hammer & First Aid Station',
        ],
      },
      kyc: {
        licenseNumber: 'H1920-39182-91820',
        licenseExpiry: 'Jun 2028',
        licenseClass: 'Ontario Class G (Commercial Endorsement)',
        vscCheck: 'Approved',
        vscReference: 'TPS-VSC-2026-09012',
        insurancePolicy: 'COOP-COMM-77129',
        insuranceProvider: 'The Co-operators Commercial Fleet',
        insuranceExpiry: 'Sep 2027',
      },
      history: [
        {
          id: 'DRV-740',
          date: 'Sep 30, 2026',
          time: '08:00 AM – 08:45 AM',
          tripType: 'North York School Transit Route',
          route: 'Lawrence Ave ➔ Toronto French School',
          companionOrDriver: 'Transported 6 Children',
          status: 'Completed',
          amount: '+$48.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'P004',
    name: 'Claire Dubois',
    roles: ['Parent'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0191',
    email: 'claire.d@example.com',
    joined: 'Sep 25, 2026',
    trips: 4,
    spent: '$40',
    status: 'Active',
    address: '320 Bay St, Toronto, ON M5H 4A6',
    emergencyContact: {
      name: 'Jean-Luc Dubois',
      relation: 'Spouse',
      phone: '+1 (416) 555-0160',
    },
    details: {
      vehicleOrChildren: '1 Child (Chloe - Gr 4)',
      rating: '5.0 ★ (Parent)',
      address: '320 Bay St, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'Pay As You Go ($0/mo)',
      paymentMethod: 'Mastercard ending in 3319',
      totalSpent: '$40 CAD',
      tripsBooked: 4,
      children: [
        {
          id: 'CH007',
          name: 'Chloe Dubois',
          age: 9,
          grade: 'Grade 4',
          avatar: '👧',
          school: 'Downtown Alternative School',
          schoolAddress: '85 Robinson St, Toronto, ON',
          pickupTime: '08:20 AM',
          dropoffTime: '03:30 PM',
          assignedChaperone: 'Farhana Yasmin (Driver • Honda Odyssey)',
          commuteMode: 'RideShare Van',
          notes: 'No allergies. Loves drawing in car.',
          boosterSeatRequired: false,
          emergencyPhone: '+1 (416) 555-0191',
        },
      ],
      history: [
        {
          id: 'TRP-4109',
          date: 'Sep 30, 2026',
          time: '08:20 AM',
          tripType: 'Morning Commute (RideShare)',
          route: '320 Bay St ➔ 85 Robinson St',
          companionOrDriver: 'Farhana Yasmin',
          status: 'Completed',
          amount: '$10.00',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'MULTI001',
    name: 'Emma Wilson',
    roles: ['Parent', 'Driver', 'Walker'],
    activeRole: 'Parent',
    phone: '+1 (416) 555-0195',
    email: 'emma.wilson@example.com',
    joined: 'Sep 02, 2026',
    trips: 52,
    spent: '$1,420',
    status: 'Active',
    address: '75 High Park Ave, Toronto, ON M6P 2S3',
    emergencyContact: {
      name: 'Thomas Wilson',
      relation: 'Spouse',
      phone: '+1 (416) 555-0196',
    },
    details: {
      vehicleOrChildren: '2 Children • 2023 Kia Carnival • WalkShare Zone 2 Leader',
      rating: '4.97 ★ (Parent, Driver & Walker)',
      address: '75 High Park Ave, Toronto, ON',
    },
    parentDetails: {
      subscriptionPlan: 'School Term Pass ($89/term)',
      paymentMethod: 'Visa ending in 5501',
      totalSpent: '$178 CAD',
      tripsBooked: 22,
      children: [
        {
          id: 'CH008',
          name: 'Benjamin Wilson',
          age: 8,
          grade: 'Grade 3',
          avatar: '👦',
          school: 'High Park Alternative Junior School',
          schoolAddress: '265 Annette St, Toronto, ON',
          pickupTime: '08:10 AM',
          dropoffTime: '03:25 PM',
          assignedChaperone: 'Self (Emma Wilson - Driver/Walker)',
          commuteMode: 'RideShare Van',
          notes: 'Lactose intolerant.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0195',
        },
        {
          id: 'CH009',
          name: 'Charlotte Wilson',
          age: 6,
          grade: 'Grade 1',
          avatar: '👧',
          school: 'High Park Alternative Junior School',
          schoolAddress: '265 Annette St, Toronto, ON',
          pickupTime: '08:10 AM',
          dropoffTime: '03:25 PM',
          assignedChaperone: 'Self (Emma Wilson - Driver/Walker)',
          commuteMode: 'RideShare Van',
          notes: 'Booster seat required.',
          boosterSeatRequired: true,
          emergencyPhone: '+1 (416) 555-0195',
        },
      ],
      history: [
        {
          id: 'TRP-3310',
          date: 'Sep 30, 2026',
          time: '08:10 AM',
          tripType: 'Morning Commute (RideShare)',
          route: '75 High Park Ave ➔ Annette St School',
          companionOrDriver: 'Self',
          status: 'Completed',
          amount: '$0.00',
          rating: 5,
        },
      ],
    },
    driverDetails: {
      rating: 4.96,
      totalEarnings: '$980 CAD',
      tripsCompleted: 24,
      onTimeRate: '99.1%',
      vehicle: {
        model: 'Kia Carnival Multi-Purpose Minivan (8 Seater)',
        year: 2023,
        plate: 'H2S-773',
        seats: 8,
        color: 'Aurora Black',
        vin: 'KNDR25E48P6109283',
        safetyCertExpiry: 'Jul 2027',
        safetyFeatures: [
          'Blind-Spot View Monitor with Child Safety Lock',
          '4x Britax HighPoint Booster Seats with LATCH',
          'Complete Certified First Aid & Clean-up Kit',
        ],
      },
      kyc: {
        licenseNumber: 'W1920-81920-39182',
        licenseExpiry: 'Nov 2028',
        licenseClass: 'Ontario Class G',
        vscCheck: 'Approved',
        vscReference: 'TPS-VSC-2026-09221',
        insurancePolicy: 'DESJARDINS-FLEET-902',
        insuranceProvider: 'Desjardins General Insurance',
        insuranceExpiry: 'Jul 2027',
      },
      history: [
        {
          id: 'DRV-509',
          date: 'Sep 29, 2026',
          time: '08:00 AM – 08:30 AM',
          tripType: 'High Park Carpool Run',
          route: 'High Park Ave ➔ Annette St School',
          companionOrDriver: 'Benjamin, Charlotte, Leo',
          status: 'Completed',
          amount: '+$24.00',
          rating: 5,
        },
      ],
    },
    walkerDetails: {
      rating: 4.98,
      totalEarnings: '$440 CAD',
      tripsCompleted: 16,
      punctualityRate: '100%',
      info: {
        zone: 'High Park West Walking School Bus (Zone #2)',
        maxGroupSize: 6,
        currentChildrenCount: 4,
        certifications: [
          'Standard First Aid & CPR-C',
          'Toronto Police Vulnerable Sector Clearance',
          'Active School Travel Walking Leader Certified',
        ],
        meetingPoint: 'High Park Library Plaza (228 Roncesvalles Ave)',
        chaperoneBadge: 'H2S-WALK-TOR-092',
      },
      history: [
        {
          id: 'WLK-119',
          date: 'Sep 28, 2026',
          time: '08:15 AM – 08:45 AM',
          tripType: 'Sunny Day Walking School Bus',
          route: 'Roncesvalles Plaza ➔ Annette St Public School',
          companionOrDriver: 'Chaperoned 4 Children',
          status: 'Completed',
          amount: '+$28.00',
          rating: 5,
        },
      ],
    },
  },
];
