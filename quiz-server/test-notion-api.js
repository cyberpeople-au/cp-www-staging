import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

console.log('\n🔍 Testing Notion API Connection\n');
console.log('='.repeat(50));

async function testConnection() {
  try {
    // Test 1: Get bot info
    console.log('\n1️⃣  Testing: Get bot user info...');
    const botInfo = await notion.users.me();
    console.log('✅ Bot user retrieved successfully!');
    console.log('   Name:', botInfo.name || 'N/A');
    console.log('   Type:', botInfo.type);
    console.log('   Bot ID:', botInfo.bot?.owner?.user?.id || botInfo.id);

    // Test 2: Search for databases and data sources
    console.log('\n2️⃣  Testing: Search for accessible databases...');
    const searchResults = await notion.search({
      filter: {
        property: 'object',
        value: 'data_source'
      },
      page_size: 10
    });

    console.log(`✅ Search successful! Found ${searchResults.results.length} database(s)`);

    if (searchResults.results.length > 0) {
      console.log('\n   Accessible databases:');
      searchResults.results.forEach((db, index) => {
        const title = db.title?.[0]?.plain_text || 'Untitled';
        console.log(`   ${index + 1}. ${title}`);
        console.log(`      ID: ${db.id}`);
      });
    } else {
      console.log('\n⚠️  No databases found. Make sure you\'ve shared databases with your integration.');
    }

    // Test 3: Try to retrieve the specific database
    console.log('\n3️⃣  Testing: Retrieve specific database...');
    console.log('   Database ID:', DATABASE_ID);

    try {
      const database = await notion.databases.retrieve({
        database_id: DATABASE_ID,
      });

      const dbTitle = database.title?.[0]?.plain_text ||
                      database.title?.[0]?.text?.content ||
                      'Untitled';

      console.log('✅ Database retrieved successfully!');
      console.log('   Title:', dbTitle);
      console.log('   Object:', database.object);
      console.log('   Is inline:', database.is_inline);

      // Check if it's a data source
      if (database.data_sources && database.data_sources.length > 0) {
        console.log('\n   ℹ️  This is a Data Source database');
        console.log('   Data Source ID:', database.data_sources[0].id);
        console.log('   Data Source Name:', database.data_sources[0].name);
      }

      // Check properties
      const properties = database.properties || {};
      const propertyCount = Object.keys(properties).length;

      if (propertyCount > 0) {
        console.log(`\n   Properties found: ${propertyCount}`);
        Object.entries(properties).forEach(([name, prop]) => {
          console.log(`   - ${name} (${prop.type})`);
        });
      } else {
        console.log('\n   ⚠️  No properties found (this is expected for data source databases)');
      }

    } catch (dbError) {
      console.log('❌ Failed to retrieve database:', dbError.message);

      if (dbError.code === 'object_not_found') {
        console.log('\n   Troubleshooting:');
        console.log('   - Make sure the database is shared with your integration');
        console.log('   - Verify the database ID is correct');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Connection test complete!\n');

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.error('   Code:', error.code);
    console.log('\n' + '='.repeat(50));
    process.exit(1);
  }
}

testConnection();
