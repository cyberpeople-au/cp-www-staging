import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Notion client
const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

/**
 * Calculate risk level based on score and risk band
 */
const calculateRiskLevel = (riskBand) => {
  if (!riskBand) return 'Unknown';

  const riskMap = {
    'Critical Risk': 'Critical',
    'High Risk': 'High',
    'Moderate Risk': 'Medium',
    'Low Risk': 'Low',
    'Mature': 'Very Low'
  };

  return riskMap[riskBand.name] || riskBand.name;
};

/**
 * Extract services interested from participant data and risk band
 */
const extractServicesInterested = (participant, riskBand) => {
  const services = [];

  if (participant.interested_in_consultation === 'yes') {
    services.push('Security Consultation');
  }

  if (riskBand && (riskBand.name === 'Critical Risk' || riskBand.name === 'High Risk')) {
    services.push('Immediate Security Assessment');
    services.push('Incident Response Planning');
  }

  if (participant.current_it_provider === '' || participant.current_it_provider.toLowerCase().includes('none')) {
    services.push('Managed Security Services');
  }

  return services.length > 0 ? services.join(', ') : 'General Inquiry';
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Validate Notion connection
app.get('/api/notion/validate', async (req, res) => {
  try {
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    res.json({
      success: true,
      database: {
        id: database.id,
        title: database.title,
      },
    });
  } catch (error) {
    console.error('Error validating Notion connection:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Submit quiz results to Notion
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const {
      participant,
      responses,
      totalScore,
      maxScore,
      riskBand,
      sectionScores,
      completedAt,
    } = req.body;

    // Validate required fields
    if (!participant || !responses || totalScore === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const riskLevel = calculateRiskLevel(riskBand);
    const servicesInterested = extractServicesInterested(participant, riskBand);

    // Prepare quiz responses as structured JSON
    const quizResponsesData = {
      totalScore: `${totalScore}/${maxScore}`,
      scorePercentage: Math.round((totalScore / maxScore) * 100),
      riskBand: riskBand?.name || 'Unknown',
      completedAt,
      participant: {
        organizationName: participant.organization_name,
        industry: participant.industry,
        employeeCount: participant.employee_count,
        location: participant.location,
        currentITProvider: participant.current_it_provider,
        interestedInConsultation: participant.interested_in_consultation,
      },
      sectionScores: sectionScores.map(section => ({
        name: section.name,
        score: `${section.earned}/${section.max}`,
        percentage: section.percentage,
        priority: section.priorityWeight,
      })),
      responses: Object.entries(responses).map(([questionId, response]) => ({
        questionId: parseInt(questionId),
        answerId: response.answerId,
      })),
    };

    // Create page in Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        // Name field (title)
        Name: {
          title: [
            {
              text: {
                content: participant.contact_name || 'Unknown',
              },
            },
          ],
        },

        // Email field
        Email: {
          email: participant.contact_email || null,
        },

        // Company field
        Company: {
          rich_text: [
            {
              text: {
                content: participant.organization_name || '',
              },
            },
          ],
        },

        // Phone field
        Phone: {
          phone_number: participant.phone || null,
        },

        // Quiz Score field
        'Quiz Score': {
          rich_text: [
            {
              text: {
                content: `${totalScore}/${maxScore} (${Math.round((totalScore / maxScore) * 100)}%)`,
              },
            },
          ],
        },

        // Risk Level field
        'Risk Level': {
          select: {
            name: riskLevel,
          },
        },

        // Services Interested field
        'Services Interested': {
          rich_text: [
            {
              text: {
                content: servicesInterested,
              },
            },
          ],
        },

        // Lead Status field
        'Lead Status': {
          select: {
            name: 'New',
          },
        },

        // Lead Source field
        'Lead Source': {
          select: {
            name: 'Website Quiz',
          },
        },

        // Submission Date field
        'Submission Date': {
          date: {
            start: completedAt,
          },
        },

        // Quiz Responses field (full JSON)
        'Quiz Responses': {
          rich_text: [
            {
              text: {
                content: JSON.stringify(quizResponsesData, null, 2).substring(0, 2000), // Notion has a 2000 char limit per rich_text block
              },
            },
          ],
        },
      },
    });

    console.log('Successfully submitted to Notion:', response.id);
    res.json({
      success: true,
      pageId: response.id,
      url: response.url,
    });
  } catch (error) {
    console.error('Error submitting to Notion:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Notion Integration Active');
});
