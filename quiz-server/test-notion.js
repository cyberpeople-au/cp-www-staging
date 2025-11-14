import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

console.log('Testing Notion Integration...\n');

// Test 1: Validate database connection
async function testDatabaseConnection() {
  console.log('1. Testing database connection...');
  try {
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    console.log('✅ Database found:', database.title[0]?.plain_text || 'Untitled');
    console.log('   Database ID:', database.id);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Ensure the database is shared with your integration');
    console.log('- Verify the database ID is correct');
    console.log('- Check that your integration token has access');
    return false;
  }
}

// Test 2: Create a test entry
async function testCreateEntry() {
  console.log('\n2. Testing entry creation...');
  try {
    const testData = {
      participant: {
        contact_name: 'Test User',
        contact_email: 'test@example.com',
        organization_name: 'Test Company Inc.',
        phone: '+1234567890',
        industry: 'Technology',
        employee_count: '50-100',
        location: 'San Francisco, CA',
        current_it_provider: 'None',
        interested_in_consultation: 'yes',
      },
      totalScore: 320,
      maxScore: 500,
      riskBand: {
        name: 'Moderate Risk',
      },
      completedAt: new Date().toISOString(),
      sectionScores: [
        { name: 'Network Security', earned: 60, max: 100, percentage: 60, priorityWeight: 'high' },
        { name: 'Data Protection', earned: 80, max: 100, percentage: 80, priorityWeight: 'critical' },
      ],
      responses: {
        1: { answerId: 'A' },
        2: { answerId: 'B' },
      },
    };

    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: testData.participant.contact_name,
              },
            },
          ],
        },
        Email: {
          email: testData.participant.contact_email,
        },
        Company: {
          rich_text: [
            {
              text: {
                content: testData.participant.organization_name,
              },
            },
          ],
        },
        Phone: {
          phone_number: testData.participant.phone,
        },
        'Quiz Score': {
          rich_text: [
            {
              text: {
                content: `${testData.totalScore}/${testData.maxScore} (${Math.round((testData.totalScore / testData.maxScore) * 100)}%)`,
              },
            },
          ],
        },
        'Risk Level': {
          select: {
            name: 'Medium',
          },
        },
        'Services Interested': {
          rich_text: [
            {
              text: {
                content: 'Security Consultation',
              },
            },
          ],
        },
        'Lead Status': {
          select: {
            name: 'New',
          },
        },
        'Lead Source': {
          select: {
            name: 'Website Quiz',
          },
        },
        'Submission Date': {
          date: {
            start: testData.completedAt,
          },
        },
        'Quiz Responses': {
          rich_text: [
            {
              text: {
                content: JSON.stringify(testData, null, 2).substring(0, 2000),
              },
            },
          ],
        },
      },
    });

    console.log('✅ Test entry created successfully!');
    console.log('   Page ID:', response.id);
    console.log('   View it at:', response.url);
    return true;
  } catch (error) {
    console.error('❌ Failed to create entry:', error.message);

    if (error.code === 'validation_error') {
      console.log('\nThis usually means:');
      console.log('- A required property is missing in your database');
      console.log('- A property type doesn\'t match (e.g., using text for email)');
      console.log('- A select option doesn\'t exist (e.g., "Medium" for Risk Level)');
      console.log('\nCheck NOTION_SETUP.md for the correct database schema.');
    }

    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Environment:');
  console.log('- API Key:', process.env.VITE_NOTION_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('- Database ID:', process.env.VITE_NOTION_DATABASE_ID ? '✓ Set' : '✗ Missing');
  console.log();

  if (!process.env.VITE_NOTION_API_KEY || !process.env.VITE_NOTION_DATABASE_ID) {
    console.error('❌ Missing required environment variables!');
    console.log('Please check your .env file.');
    process.exit(1);
  }

  const connectionSuccess = await testDatabaseConnection();

  if (connectionSuccess) {
    await testCreateEntry();
  } else {
    console.log('\n⚠️  Skipping entry creation test due to connection failure');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Test complete! Check your Notion database for the test entry.');
  console.log('='.repeat(50));
}

runTests().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
