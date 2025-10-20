// LinkedIn Search Service - Generates search URLs and contact messages

export interface LinkedInSearchParams {
  title?: string;
  company?: string;
  location?: string;
  keywords?: string[];
}

export interface ContactMessage {
  id: number;
  title: string;
  message: string;
  tone: 'professional' | 'friendly' | 'direct';
}

/**
 * Generate LinkedIn search URL for recruiters
 */
export function generateLinkedInSearchUrl(params: LinkedInSearchParams): string {
  const baseUrl = 'https://www.linkedin.com/search/results/people/';
  const searchParams = new URLSearchParams();

  // Build search query
  const queryParts: string[] = [];

  if (params.title) {
    queryParts.push(params.title);
  }

  if (params.keywords && params.keywords.length > 0) {
    queryParts.push(...params.keywords);
  }

  if (queryParts.length > 0) {
    searchParams.append('keywords', queryParts.join(' '));
  }

  // Add location if provided
  if (params.location) {
    searchParams.append('geoUrn', params.location);
  }

  // Add company filter if provided
  if (params.company) {
    searchParams.append('company', params.company);
  }

  // Add common filters for recruiters
  searchParams.append('origin', 'GLOBAL_SEARCH_HEADER');

  return `${baseUrl}?${searchParams.toString()}`;
}

/**
 * Generate personalized contact messages for recruiters
 */
export function generateContactMessages(recruiterData: {
  name: string;
  company: string;
  userSkills?: string[];
  userExperience?: string;
  language?: 'en' | 'pt';
}): ContactMessage[] {
  const { name, company, userSkills = [], userExperience = '', language = 'en' } = recruiterData;
  const firstName = name.split(' ')[0];
  const skillsText = userSkills.slice(0, 3).join(', ') || (language === 'pt' ? 'desenvolvimento de software' : 'software development');

  if (language === 'pt') {
    return [
      {
        id: 1,
        title: 'Profissional e Direta',
        tone: 'professional',
        message: `Olá ${firstName},

Vi seu perfil e notei que você recruta para a ${company}. Sou engenheiro(a) de software com experiência em ${skillsText}, e estou explorando novas oportunidades.

Adoraria me conectar e conhecer mais sobre vagas que possam alinhar com meu perfil.

Obrigado(a) pelo seu tempo!

Atenciosamente`
      },
      {
        id: 2,
        title: 'Amigável e Conversacional',
        tone: 'friendly',
        message: `Oi ${firstName}!

Espero que esteja tudo bem com você. Vi que você trabalha com recrutamento na ${company} e gostaria de entrar em contato.

Sou um(a) engenheiro(a) de software apaixonado(a), especializado(a) em ${skillsText}. Tenho acompanhado a ${company} e adoraria explorar como posso contribuir com o time.

Você estaria aberto(a) para uma conversa rápida?

Aguardo seu retorno!

Abraços`
      },
      {
        id: 3,
        title: 'Focada em Valor',
        tone: 'direct',
        message: `Olá ${firstName},

Estou entrando em contato porque acredito que minhas habilidades em ${skillsText} podem ser uma ótima combinação para a ${company}.

${userExperience ? `Com experiência em ${userExperience}, tenho ` : 'Tenho '}um histórico comprovado de entrega de soluções de alta qualidade e colaboração efetiva com times multifuncionais.

Gostaria muito de discutir possíveis oportunidades na ${company}.

Aguardo seu retorno.

Atenciosamente`
      }
    ];
  }

  return [
    {
      id: 1,
      title: 'Professional & Direct',
      tone: 'professional',
      message: `Hi ${firstName},

I came across your profile and noticed you recruit for ${company}. I am a software engineer with experience in ${skillsText}, and I am currently exploring new opportunities.

I would love to connect and learn more about any openings that might align with my background.

Thank you for your time!

Best regards`
    },
    {
      id: 2,
      title: 'Friendly & Conversational',
      tone: 'friendly',
      message: `Hey ${firstName}!

I hope this message finds you well. I saw that you work with talent acquisition at ${company}, and I wanted to reach out.

I am a passionate software engineer specializing in ${skillsText}. I have been following ${company} and would love to explore how I might contribute to your team.

Would you be open to a quick chat?

Looking forward to connecting!

Cheers`
    },
    {
      id: 3,
      title: 'Value-Focused',
      tone: 'direct',
      message: `Hello ${firstName},

I am reaching out because I believe my skills in ${skillsText} could be a great fit for ${company}.

${userExperience ? `With experience in ${userExperience}, I ` : 'I '}have a proven track record of delivering high-quality solutions and collaborating effectively with cross-functional teams.

I would appreciate the opportunity to discuss potential openings at ${company}.

Looking forward to hearing from you.

Best`
    }
  ];
}

/**
 * Generate multiple LinkedIn search URLs based on different criteria
 * Focused on LATAM recruiters and global hiring
 */
export function generateMultipleSearchUrls(userProfile: {
  skills: string[];
  location?: string;
  targetCompanies?: string[];
}): Array<{ description: string; url: string }> {
  const searches: Array<{ description: string; url: string }> = [];

  // LATAM Technical Recruiters
  searches.push({
    description: 'Technical Recruiters - LATAM',
    url: generateLinkedInSearchUrl({
      title: 'Technical Recruiter',
      keywords: ['LATAM', 'Latin America', ...userProfile.skills.slice(0, 1)],
      location: userProfile.location
    })
  });

  // Global Remote Recruiters
  searches.push({
    description: 'Global Remote Talent Acquisition',
    url: generateLinkedInSearchUrl({
      title: 'Talent Acquisition',
      keywords: ['remote', 'global', 'worldwide', 'international'],
      location: userProfile.location
    })
  });

  // LATAM Engineering Recruiters
  searches.push({
    description: 'Engineering Recruiters - LATAM Focus',
    url: generateLinkedInSearchUrl({
      title: 'Engineering Recruiter',
      keywords: ['Latin America', 'Brazil', 'Argentina', 'remote'],
      location: userProfile.location
    })
  });

  // Global Hiring Managers
  searches.push({
    description: 'Global Hiring - Remote Positions',
    url: generateLinkedInSearchUrl({
      title: 'Recruiter',
      keywords: ['global hiring', 'remote first', 'distributed team'],
      location: userProfile.location
    })
  });

  // Company-specific searches (if any)
  if (userProfile.targetCompanies && userProfile.targetCompanies.length > 0) {
    userProfile.targetCompanies.forEach(company => {
      searches.push({
        description: `Recruiters at ${company} - Global Roles`,
        url: generateLinkedInSearchUrl({
          title: 'Recruiter',
          company: company,
          keywords: ['global', 'remote'],
          location: userProfile.location
        })
      });
    });
  }

  return searches;
}
