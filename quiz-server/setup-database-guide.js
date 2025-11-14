import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

console.log('\n========================================');
console.log('📋 NOTION DATABASE SETUP GUIDE');
console.log('========================================\n');

const REQUIRED_PROPERTIES = [
  {
    name: 'Name',
    type: 'title',
    instruction: 'Should already exist as the default title property',
    required: true,
  },
  {
    name: 'Email',
    type: 'email',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Email" → Type: "Email"',
    required: true,
  },
  {
    name: 'Company',
    type: 'rich_text',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Company" → Type: "Text"',
    required: true,
  },
  {
    name: 'Phone',
    type: 'phone_number',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Phone" → Type: "Phone"',
    required: true,
  },
  {
    name: 'Quiz Score',
    type: 'rich_text',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Quiz Score" → Type: "Text"',
    required: true,
  },
  {
    name: 'Risk Level',
    type: 'select',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Risk Level" → Type: "Select"\n   Then add these options: Critical, High, Medium, Low, Very Low, Unknown',
    selectOptions: ['Critical', 'High', 'Medium', 'Low', 'Very Low', 'Unknown'],
    required: true,
  },
  {
    name: 'Services Interested',
    type: 'rich_text',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Services Interested" → Type: "Text"',
    required: true,
  },
  {
    name: 'Lead Status',
    type: 'select',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Lead Status" → Type: "Select"\n   Then add these options: New, Contacted, Qualified, Lost',
    selectOptions: ['New', 'Contacted', 'Qualified', 'Lost'],
    required: true,
  },
  {
    name: 'Lead Source',
    type: 'select',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Lead Source" → Type: "Select"\n   Then add these options: Website Quiz, Referral, Direct, Social Media, Advertisement',
    selectOptions: ['Website Quiz', 'Referral', 'Direct', 'Social Media', 'Advertisement'],
    required: true,
  },
  {
    name: 'Submission Date',
    type: 'date',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Submission Date" → Type: "Date"',
    required: true,
  },
  {
    name: 'Quiz Responses',
    type: 'rich_text',
    instruction: 'Add a new property: Click "+ Add property" → Name: "Quiz Responses" → Type: "Text"',
    required: true,
  },
];

async function checkDatabaseProperties() {
  try {
    console.log('Checking current database properties...\n');

    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    // Check if this is a data source database
    if (database.data_sources && database.data_sources.length > 0) {
      console.log('⚠️  This appears to be a Notion Data Source database.');
      console.log('    Data sources:', database.data_sources);
      console.log('\n📝 Note: Data source databases work differently from regular databases.');
      console.log('    The properties are defined by the connected data source.');
      console.log();

      // Try to get the actual schema
      const dataSourceId = database.data_sources[0];
      console.log('Attempting to fetch schema from data source:', dataSourceId);
    }

    const existingProperties = database.properties || {};
    const existingPropertyNames = Object.keys(existingProperties);

    const databaseTitle = database.title?.[0]?.plain_text || database.title?.[0]?.text?.content || 'Untitled';
    console.log('✅ Successfully connected to database:', databaseTitle);
    console.log('📊 Current properties found:', existingPropertyNames.length);
    console.log();

    let missingProperties = [];
    let correctProperties = [];
    let incorrectTypeProperties = [];

    REQUIRED_PROPERTIES.forEach((required) => {
      const existing = existingProperties[required.name];

      if (!existing) {
        missingProperties.push(required);
      } else if (existing.type !== required.type) {
        incorrectTypeProperties.push({
          ...required,
          currentType: existing.type,
        });
      } else {
        // Check select options if applicable
        if (required.type === 'select' && required.selectOptions) {
          const existingOptions = existing.select.options.map(opt => opt.name);
          const missingOptions = required.selectOptions.filter(opt => !existingOptions.includes(opt));

          if (missingOptions.length > 0) {
            incorrectTypeProperties.push({
              ...required,
              currentType: existing.type,
              missingOptions,
            });
          } else {
            correctProperties.push(required);
          }
        } else {
          correctProperties.push(required);
        }
      }
    });

    if (correctProperties.length > 0) {
      console.log('✅ CORRECT PROPERTIES (' + correctProperties.length + '/' + REQUIRED_PROPERTIES.length + ')');
      correctProperties.forEach(prop => {
        console.log('   ✓', prop.name, `(${prop.type})`);
      });
      console.log();
    }

    if (incorrectTypeProperties.length > 0) {
      console.log('⚠️  PROPERTIES WITH ISSUES:');
      incorrectTypeProperties.forEach(prop => {
        console.log('   ⚠', prop.name);
        console.log('      Expected type:', prop.type);
        console.log('      Current type:', prop.currentType);
        if (prop.missingOptions) {
          console.log('      Missing select options:', prop.missingOptions.join(', '));
        }
        console.log();
      });
    }

    if (missingProperties.length > 0) {
      console.log('❌ MISSING PROPERTIES (' + missingProperties.length + ' needed):');
      console.log();

      missingProperties.forEach((prop, index) => {
        console.log(`${index + 1}. Property: "${prop.name}"`);
        console.log(`   Type: ${prop.type}`);
        console.log(`   📝 How to add:`);
        console.log(`      ${prop.instruction}`);
        if (prop.selectOptions) {
          console.log(`      Select options to add: ${prop.selectOptions.join(', ')}`);
        }
        console.log();
      });

      console.log('========================================');
      console.log('📖 STEP-BY-STEP INSTRUCTIONS:');
      console.log('========================================');
      console.log('1. Open your Notion database in a browser');
      console.log('2. Click the "+ Add property" button (or click any column header)');
      console.log('3. Add each missing property listed above');
      console.log('4. For Select properties, add all the options listed');
      console.log('5. Run this script again to verify: npm run test:notion');
      console.log();

      return false;
    }

    if (incorrectTypeProperties.length > 0) {
      console.log('⚠️  Some properties need to be fixed.');
      console.log('You may need to rename the incorrect ones and create new ones with the correct type.');
      console.log();
      return false;
    }

    console.log('========================================');
    console.log('✅ ALL PROPERTIES CONFIGURED CORRECTLY!');
    console.log('========================================');
    console.log('Your database is ready to receive quiz submissions.');
    console.log();
    console.log('Next steps:');
    console.log('1. Run: npm run server');
    console.log('2. Run: npm run dev');
    console.log('3. Test the quiz submission!');
    console.log();

    return true;

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    return false;
  }
}

checkDatabaseProperties();
