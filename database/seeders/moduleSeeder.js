const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Module = require('../models/Module');

dotenv.config();

const sampleModules = [
    {
        title: 'Introduction to Room Cleaning',
        description: 'Learn the fundamentals of professional room cleaning in the hospitality industry.',
        category: 'Room Cleaning',
        difficulty: 'beginner',
        estimatedTime: 30,
        points: 10,
        order: 1,
        content: `
      <h2>Welcome to Room Cleaning Basics</h2>
      <p>This module will teach you the essential skills needed for professional room cleaning in hotels.</p>
      
      <h3>What You'll Learn:</h3>
      <ul>
        <li>Proper cleaning techniques</li>
        <li>Time management strategies</li>
        <li>Quality standards</li>
        <li>Safety protocols</li>
      </ul>
      
      <h3>Room Cleaning Checklist:</h3>
      <ol>
        <li><strong>Knock and announce:</strong> Always knock and announce yourself before entering</li>
        <li><strong>Ventilate:</strong> Open windows or turn on ventilation</li>
        <li><strong>Strip the bed:</strong> Remove all linens and place in laundry bag</li>
        <li><strong>Dust surfaces:</strong> Start from top to bottom</li>
        <li><strong>Clean mirrors and glass:</strong> Use streak-free cleaner</li>
        <li><strong>Vacuum floors:</strong> Pay attention to corners and under furniture</li>
        <li><strong>Make the bed:</strong> Use fresh linens with hospital corners</li>
        <li><strong>Restock amenities:</strong> Check and refill all supplies</li>
        <li><strong>Final inspection:</strong> Walk through and verify quality</li>
      </ol>
      
      <h3>Pro Tips:</h3>
      <p>Work systematically from one side of the room to the other. This prevents you from missing areas and improves efficiency.</p>
    `,
        quiz: {
            passingScore: 70,
            questions: [
                {
                    question: 'What should you do before entering a guest room?',
                    options: [
                        'Enter quietly',
                        'Knock and announce yourself',
                        'Use your master key immediately',
                        'Call the front desk'
                    ],
                    correctAnswer: 'Knock and announce yourself',
                    explanation: 'Always knock and announce yourself to respect guest privacy and avoid surprising anyone who might be in the room.'
                },
                {
                    question: 'When dusting, which direction should you work?',
                    options: [
                        'Bottom to top',
                        'Left to right',
                        'Top to bottom',
                        'Random order'
                    ],
                    correctAnswer: 'Top to bottom',
                    explanation: 'Working from top to bottom ensures that dust falling from higher surfaces will be cleaned when you reach lower areas.'
                },
                {
                    question: 'What is the recommended time to complete a standard room?',
                    options: [
                        '15 minutes',
                        '30 minutes',
                        '45 minutes',
                        '60 minutes'
                    ],
                    correctAnswer: '30 minutes',
                    explanation: 'Industry standard is approximately 30 minutes per room, though this can vary based on room size and condition.'
                }
            ]
        }
    },
    {
        title: 'Bathroom Sanitation Standards',
        description: 'Master the art of deep cleaning and sanitizing bathrooms to hotel standards.',
        category: 'Bathroom Sanitation',
        difficulty: 'intermediate',
        estimatedTime: 45,
        points: 15,
        order: 2,
        content: `
      <h2>Professional Bathroom Cleaning</h2>
      <p>Bathrooms require special attention and proper sanitization techniques to maintain health and safety standards.</p>
      
      <h3>Essential Cleaning Products:</h3>
      <ul>
        <li>Disinfectant cleaner</li>
        <li>Glass cleaner</li>
        <li>Toilet bowl cleaner</li>
        <li>Tile and grout cleaner</li>
        <li>Microfiber cloths (color-coded)</li>
        <li>Scrub brushes</li>
      </ul>
      
      <h3>Step-by-Step Process:</h3>
      <ol>
        <li><strong>Prepare:</strong> Put on gloves and gather all supplies</li>
        <li><strong>Pre-treat:</strong> Apply toilet bowl cleaner and let it sit</li>
        <li><strong>Clear surfaces:</strong> Remove all items from counters</li>
        <li><strong>Spray and wipe:</strong> Clean mirrors, counters, and fixtures</li>
        <li><strong>Clean toilet:</strong> Scrub bowl, seat, and exterior</li>
        <li><strong>Shower/tub:</strong> Clean walls, fixtures, and drain</li>
        <li><strong>Floor:</strong> Sweep and mop, starting from farthest corner</li>
        <li><strong>Restock:</strong> Replace towels, toiletries, and paper products</li>
        <li><strong>Final touch:</strong> Fold toilet paper into a point</li>
      </ol>
      
      <h3>Safety Reminders:</h3>
      <p><strong>Never mix cleaning chemicals!</strong> This can create dangerous fumes. Always use products as directed.</p>
    `,
        quiz: {
            passingScore: 75,
            questions: [
                {
                    question: 'Why should you never mix cleaning chemicals?',
                    options: [
                        'It wastes product',
                        'It can create dangerous fumes',
                        'It reduces cleaning effectiveness',
                        'It stains surfaces'
                    ],
                    correctAnswer: 'It can create dangerous fumes',
                    explanation: 'Mixing chemicals, especially bleach and ammonia, can create toxic gases that are extremely dangerous.'
                },
                {
                    question: 'What should you do first when cleaning a bathroom?',
                    options: [
                        'Mop the floor',
                        'Clean the mirror',
                        'Put on gloves and gather supplies',
                        'Scrub the toilet'
                    ],
                    correctAnswer: 'Put on gloves and gather supplies',
                    explanation: 'Always protect yourself first and have all necessary supplies ready before starting.'
                }
            ]
        }
    },
    {
        title: 'Laundry Operations',
        description: 'Learn proper handling, washing, and care of hotel linens and guest items.',
        category: 'Laundry',
        difficulty: 'beginner',
        estimatedTime: 35,
        points: 12,
        order: 3,
        content: `
      <h2>Hotel Laundry Best Practices</h2>
      <p>Proper laundry handling ensures guest satisfaction and extends the life of hotel linens.</p>
      
      <h3>Sorting Guidelines:</h3>
      <ul>
        <li><strong>Whites:</strong> Sheets, pillowcases, towels</li>
        <li><strong>Colors:</strong> Colored linens and uniforms</li>
        <li><strong>Delicates:</strong> Special fabrics requiring gentle care</li>
        <li><strong>Heavily soiled:</strong> Items needing pre-treatment</li>
      </ul>
      
      <h3>Washing Temperatures:</h3>
      <ul>
        <li>Hot water (140-160°F): White linens, heavily soiled items</li>
        <li>Warm water (90-110°F): Colored items, uniforms</li>
        <li>Cold water: Delicates, items prone to shrinking</li>
      </ul>
      
      <h3>Stain Treatment:</h3>
      <p>Always treat stains before washing. Common hotel stains include:</p>
      <ul>
        <li>Makeup: Pre-treat with liquid detergent</li>
        <li>Blood: Rinse with cold water immediately</li>
        <li>Wine: Blot and treat with stain remover</li>
        <li>Grease: Apply dish soap before washing</li>
      </ul>
    `,
        quiz: {
            passingScore: 70,
            questions: [
                {
                    question: 'What temperature water should be used for white hotel linens?',
                    options: [
                        'Cold water',
                        'Warm water',
                        'Hot water (140-160°F)',
                        'Room temperature'
                    ],
                    correctAnswer: 'Hot water (140-160°F)',
                    explanation: 'Hot water effectively sanitizes white linens and removes tough stains.'
                },
                {
                    question: 'How should blood stains be treated?',
                    options: [
                        'Wash in hot water immediately',
                        'Rinse with cold water immediately',
                        'Let it dry first',
                        'Use bleach directly'
                    ],
                    correctAnswer: 'Rinse with cold water immediately',
                    explanation: 'Cold water prevents blood from setting into the fabric. Hot water will cause it to set permanently.'
                }
            ]
        }
    },
    {
        title: 'Workplace Safety and Ergonomics',
        description: 'Essential safety protocols and ergonomic practices to prevent injuries.',
        category: 'Safety',
        difficulty: 'beginner',
        estimatedTime: 25,
        points: 10,
        order: 4,
        content: `
      <h2>Stay Safe on the Job</h2>
      <p>Your safety is our priority. Learn how to protect yourself while working efficiently.</p>
      
      <h3>Common Hazards:</h3>
      <ul>
        <li>Slips, trips, and falls</li>
        <li>Chemical exposure</li>
        <li>Repetitive strain injuries</li>
        <li>Heavy lifting</li>
        <li>Sharp objects</li>
      </ul>
      
      <h3>Proper Lifting Technique:</h3>
      <ol>
        <li>Stand close to the object</li>
        <li>Bend at the knees, not the waist</li>
        <li>Keep your back straight</li>
        <li>Lift with your legs</li>
        <li>Hold the load close to your body</li>
        <li>Turn with your feet, not your torso</li>
      </ol>
      
      <h3>Chemical Safety:</h3>
      <ul>
        <li>Always read product labels</li>
        <li>Use proper protective equipment (gloves, goggles)</li>
        <li>Ensure adequate ventilation</li>
        <li>Never mix chemicals</li>
        <li>Know the location of SDS (Safety Data Sheets)</li>
      </ul>
      
      <h3>Ergonomic Tips:</h3>
      <p>To prevent repetitive strain injuries:</p>
      <ul>
        <li>Vary your tasks throughout the day</li>
        <li>Use proper posture when making beds</li>
        <li>Take short breaks to stretch</li>
        <li>Use long-handled tools to reduce bending</li>
        <li>Report any pain or discomfort early</li>
      </ul>
    `,
        quiz: {
            passingScore: 80,
            questions: [
                {
                    question: 'When lifting heavy objects, which part of your body should do most of the work?',
                    options: [
                        'Your back',
                        'Your arms',
                        'Your legs',
                        'Your shoulders'
                    ],
                    correctAnswer: 'Your legs',
                    explanation: 'Your leg muscles are stronger and designed for lifting. Using your back can cause serious injury.'
                },
                {
                    question: 'What should you do before using any cleaning chemical?',
                    options: [
                        'Mix it with water',
                        'Read the product label',
                        'Test it on fabric',
                        'Smell it to identify it'
                    ],
                    correctAnswer: 'Read the product label',
                    explanation: 'Always read labels to understand proper usage, safety precautions, and potential hazards.'
                }
            ]
        }
    },
    {
        title: 'Guest Service Excellence',
        description: 'Deliver exceptional customer service and handle guest interactions professionally.',
        category: 'Customer Service',
        difficulty: 'intermediate',
        estimatedTime: 40,
        points: 15,
        order: 5,
        content: `
      <h2>Creating Memorable Guest Experiences</h2>
      <p>As housekeeping staff, you play a crucial role in guest satisfaction.</p>
      
      <h3>Core Service Principles:</h3>
      <ul>
        <li><strong>Respect privacy:</strong> Always knock and announce</li>
        <li><strong>Be professional:</strong> Maintain appropriate boundaries</li>
        <li><strong>Show courtesy:</strong> Smile and greet guests warmly</li>
        <li><strong>Be responsive:</strong> Address requests promptly</li>
        <li><strong>Maintain discretion:</strong> Never discuss guests or rooms</li>
      </ul>
      
      <h3>Handling Guest Requests:</h3>
      <ol>
        <li>Listen carefully to understand the need</li>
        <li>Acknowledge the request with a positive attitude</li>
        <li>Provide a realistic timeframe</li>
        <li>Follow through promptly</li>
        <li>Follow up to ensure satisfaction</li>
      </ol>
      
      <h3>Common Scenarios:</h3>
      <p><strong>Guest in room during cleaning time:</strong></p>
      <p>"Good morning! I'm here to clean your room. Would you prefer I come back later?"</p>
      
      <p><strong>Guest requests extra towels:</strong></p>
      <p>"Of course! I'll bring those to you right away. How many would you like?"</p>
      
      <p><strong>Guest complains about cleanliness:</strong></p>
      <p>"I sincerely apologize. I'll take care of that immediately and ensure it meets our standards."</p>
      
      <h3>Going the Extra Mile:</h3>
      <ul>
        <li>Remember regular guests' preferences</li>
        <li>Leave a welcoming touch (arrange items neatly)</li>
        <li>Report maintenance issues proactively</li>
        <li>Offer assistance when you see a need</li>
      </ul>
    `,
        quiz: {
            passingScore: 75,
            questions: [
                {
                    question: 'What should you do if a guest is in their room during scheduled cleaning time?',
                    options: [
                        'Enter and clean around them',
                        'Skip the room entirely',
                        'Knock and ask if they prefer you come back later',
                        'Wait outside until they leave'
                    ],
                    correctAnswer: 'Knock and ask if they prefer you come back later',
                    explanation: 'Always respect guest privacy and give them the option to have their room cleaned at a more convenient time.'
                },
                {
                    question: 'How should you respond to a guest complaint about cleanliness?',
                    options: [
                        'Explain that you just cleaned it',
                        'Apologize and fix it immediately',
                        'Tell them to call the front desk',
                        'Ignore it if it seems minor'
                    ],
                    correctAnswer: 'Apologize and fix it immediately',
                    explanation: 'Take ownership, apologize sincerely, and resolve the issue promptly to maintain guest satisfaction.'
                }
            ]
        }
    }
];

const seedModules = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing modules
        await Module.deleteMany({});
        console.log('✓ Cleared existing modules');

        // Insert sample modules
        await Module.insertMany(sampleModules);
        console.log(`✓ Inserted ${sampleModules.length} sample modules`);

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding database:', error);
        process.exit(1);
    }
};

seedModules();
