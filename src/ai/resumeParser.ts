/**
 * AI Resume Parser Module
 * Parses resume text using OpenAI API with mock fallback
 */

export interface ParsedResume {
  job_title: string;
  skills: string[];
  tools: string[];
  years_experience: number;
  certifications: string[];
  education?: string[];
  languages?: string[];
}

/**
 * Parse resume text using OpenAI API
 * Falls back to mock parsing if API key is missing
 */
export async function parseResume(resumeText: string): Promise<ParsedResume> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OpenAI API key not found, using mock parser');
    return mockParseResume(resumeText);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. Extract structured information from resume text and return ONLY valid JSON in this exact format:
{
  "job_title": "string",
  "skills": ["string"],
  "tools": ["string"],
  "years_experience": number,
  "certifications": ["string"],
  "education": ["string"],
  "languages": ["string"]
}`
          },
          {
            role: 'user',
            content: `Parse this resume:\n\n${resumeText}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    
    return {
      job_title: parsed.job_title || '',
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      years_experience: parsed.years_experience || 0,
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
    };
  } catch (error) {
    console.error('Error parsing resume with OpenAI:', error);
    console.warn('Falling back to mock parser');
    return mockParseResume(resumeText);
  }
}

/**
 * Mock resume parser (fallback when API key is missing)
 */
function mockParseResume(resumeText: string): ParsedResume {
  const text = resumeText.toLowerCase();
  
  // Extract job title
  const jobTitlePatterns = [
    /(?:senior|junior|lead|principal)?\s*(?:software|full.?stack|front.?end|back.?end|devops|data|machine learning|ml|ai)?\s*(?:engineer|developer|architect|scientist|analyst)/gi,
    /(?:product|project|engineering|technical)?\s*(?:manager|lead|director)/gi,
  ];
  
  let jobTitle = 'Software Engineer';
  for (const pattern of jobTitlePatterns) {
    const match = text.match(pattern);
    if (match) {
      jobTitle = match[0].trim();
      break;
    }
  }

  // Extract skills
  const commonSkills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL',
    'Vue.js', 'Angular', 'Next.js', 'Express', 'Django', 'Flask',
    'Git', 'CI/CD', 'Microservices', 'REST API', 'Agile', 'Scrum'
  ];
  
  const skills = commonSkills.filter(skill => 
    text.includes(skill.toLowerCase())
  );

  // Extract tools
  const commonTools = [
    'VS Code', 'GitHub', 'Jira', 'Confluence', 'Slack', 'Figma',
    'Postman', 'Jenkins', 'Terraform', 'Ansible', 'Elasticsearch',
    'Redis', 'Kafka', 'RabbitMQ', 'Splunk', 'Datadog'
  ];
  
  const tools = commonTools.filter(tool => 
    text.includes(tool.toLowerCase())
  );

  // Extract years of experience
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
  const yearsExperience = expMatch ? parseInt(expMatch[1], 10) : 3;

  // Extract certifications
  const certPatterns = [
    /aws\s*(?:certified|certification)/gi,
    /google\s*cloud\s*(?:certified|certification)/gi,
    /azure\s*(?:certified|certification)/gi,
    /pmp|cissp|scrum\s*master/gi,
  ];
  
  const certifications: string[] = [];
  for (const pattern of certPatterns) {
    const match = text.match(pattern);
    if (match) {
      certifications.push(match[0].trim());
    }
  }

  return {
    job_title: jobTitle,
    skills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js'],
    tools: tools.length > 0 ? tools : ['Git', 'VS Code'],
    years_experience: yearsExperience,
    certifications: certifications.length > 0 ? certifications : [],
    education: ['Bachelor\'s Degree'],
    languages: ['English'],
  };
}
