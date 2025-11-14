import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

console.log('\n🏗️  Creating Notion Database for Quiz App\n');
console.log('='.repeat(50));

async function createQuizDatabase() {
  try {
    // First, we need to get a page ID to create the database in
    console.log('\n1️⃣  Searching for a parent page...');

    const searchResults = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 1
    });

    if (searchResults.results.length === 0) {
      console.error('❌ No accessible pages found. Please create a page in Notion and share it with the integration first.');
      process.exit(1);
    }

    const parentPage = searchResults.results[0];
    console.log('✅ Found parent page:', parentPage.id);

    // Create the database
    console.log('\n2️⃣  Creating database with all properties...');

    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPage.id
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Website Quiz Leads'
          }
        }
      ],
      properties: {
        // 1. Name (Title) - required, always the first property
        'Name': {
          title: {}
        },

        // 2. Email
        'Email': {
          email: {}
        },

        // 3. Company
        'Company': {
          rich_text: {}
        },

        // 4. Phone
        'Phone': {
          phone_number: {}
        },

        // 5. Quiz Score
        'Quiz Score': {
          rich_text: {}
        },

        // 6. Risk Level (Select with options)
        'Risk Level': {
          select: {
            options: [
              { name: 'Critical', color: 'red' },
              { name: 'High', color: 'orange' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'green' },
              { name: 'Very Low', color: 'blue' },
              { name: 'Unknown', color: 'gray' }
            ]
          }
        },

        // 7. Services Interested
        'Services Interested': {
          rich_text: {}
        },

        // 8. Lead Status (Select with options)
        'Lead Status': {
          select: {
            options: [
              { name: 'New', color: 'blue' },
              { name: 'Contacted', color: 'yellow' },
              { name: 'Qualified', color: 'green' },
              { name: 'Lost', color: 'red' }
            ]
          }
        },

        // 9. Lead Source (Select with options)
        'Lead Source': {
          select: {
            options: [
              { name: 'Website Quiz', color: 'blue' },
              { name: 'Referral', color: 'green' },
              { name: 'Direct', color: 'purple' },
              { name: 'Social Media', color: 'pink' },
              { name: 'Advertisement', color: 'orange' }
            ]
          }
        },

        // 10. Submission Date
        'Submission Date': {
          date: {}
        },

        // 11. Quiz Responses
        'Quiz Responses': {
          rich_text: {}
        }
      }
    });

    console.log('\n✅ Database created successfully!');
    console.log('\n' + '='.repeat(50));
    console.log('📋 DATABASE DETAILS:');
    console.log('='.repeat(50));
    console.log('Title:', database.title[0]?.plain_text || 'Website Quiz Leads');
    console.log('ID:', database.id);
    console.log('URL:', database.url);
    console.log('\n📝 Properties created:');

    Object.keys(database.properties).forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop} (${database.properties[prop].type})`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('🎯 NEXT STEPS:');
    console.log('='.repeat(50));
    console.log('1. Update your .env file with this database ID:');
    console.log(`   VITE_NOTION_DATABASE_ID=${database.id.replace(/-/g, '')}`);
    console.log('\n2. Test the connection:');
    console.log('   npm run test:notion');
    console.log('\n3. Start your servers:');
    console.log('   npm run server');
    console.log('   npm run dev');
    console.log('\n' + '='.repeat(50));

  } catch (error) {
    console.error('\n❌ Error creating database:', error.message);
    console.error('Code:', error.code);

    if (error.code === 'object_not_found') {
      console.log('\nTroubleshooting:');
      console.log('- Make sure you have at least one page in your Notion workspace');
      console.log('- Share that page with your integration (CP_MCP)');
    }

    process.exit(1);
  }
}

createQuizDatabase();
