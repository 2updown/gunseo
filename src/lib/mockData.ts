import { ATLSkill, Grade, Unit, ATLCluster } from '../types';

export const ATL_CLUSTERS: ATLCluster[] = [
    // Communication
    { id: 'comm-skills', areaId: 'Communication', labelEn: 'Communication skills', labelKo: '의사소통 기술' },
    // Social
    { id: 'soc-social', areaId: 'Social', labelEn: 'Social', labelKo: '사회성' }, // Assuming simple mapping for now
    // Self-management
    { id: 'sm-org', areaId: 'Self-management', labelEn: 'Organization', labelKo: '조직' },
    { id: 'sm-aff', areaId: 'Self-management', labelEn: 'Affective', labelKo: '정서적 기술' },
    { id: 'sm-ref', areaId: 'Self-management', labelEn: 'Reflection', labelKo: '성찰' }, // Added based on image
    // Research
    { id: 'res-info', areaId: 'Research', labelEn: 'Information literacy', labelKo: '정보 문해력' },
    { id: 'res-media', areaId: 'Research', labelEn: 'Media literacy', labelKo: '미디어 문해력' },
    // Thinking
    { id: 'think-crit', areaId: 'Thinking', labelEn: 'Critical thinking', labelKo: '비판적 사고' },
    { id: 'think-creat', areaId: 'Thinking', labelEn: 'Creative thinking', labelKo: '창의적 사고' },
    { id: 'think-trans', areaId: 'Thinking', labelEn: 'Transfer', labelKo: '전이' },
];

export const ATL_SKILLS: ATLSkill[] = [
    // Communication
    { id: 'comm-01', code: 'COMM-01', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Give and receive meaningful feedback', descriptionKo: '의미 있는 피드백을 주고받기' },
    { id: 'comm-02', code: 'COMM-02', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Use intercultural understanding to interpret communication', descriptionKo: '상호문화적 이해를 사용하여 소통 해석하기' },
    { id: 'comm-03', code: 'COMM-03', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Use appropriate forms of writing for different purposes and audiences', descriptionKo: '다양한 목적과 청중에 맞는 적절한 형태의 글쓰기 사용하기' },
    { id: 'comm-04', code: 'COMM-04', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Use a variety of speaking techniques to communicate with a variety of audiences', descriptionKo: '다양한 청중과 소통하기 위해 다양한 말하기 기법 사용하기' },
    { id: 'comm-05', code: 'COMM-05', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Interpret and use effectively modes of non-verbal communication', descriptionKo: '비언어적 소통 방식을 효과적으로 해석하고 사용하기' },
    { id: 'comm-06', code: 'COMM-06', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Negotiate ideas and knowledge with peers and teachers', descriptionKo: '동료 및 교사와 아이디어와 지식 협상하기' },
    { id: 'comm-07', code: 'COMM-07', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Participate in, and contribute to, digital social media networks', descriptionKo: '디지털 소셜 미디어 네트워크에 참여하고 기여하기' },
    { id: 'comm-08', code: 'COMM-08', area: 'Communication', clusterId: 'comm-skills', descriptionEn: 'Collaborate with peers and experts using a variety of digital environments and media', descriptionKo: '다양한 디지털 환경과 미디어를 사용하여 동료 및 전문가와 협력하기' },

    // Social
    { id: 'soc-01', code: 'SOC-01', area: 'Social', clusterId: 'soc-social', descriptionEn: 'Working effectively with others', descriptionKo: '타인과 효과적으로 협력하기' },
    { id: 'soc-02', code: 'SOC-02', area: 'Social', clusterId: 'soc-social', descriptionEn: 'Developing positive interpersonal relationships', descriptionKo: '긍정적인 대인 관계 형성하기' },

    // Self-management
    { id: 'sm-01', code: 'SM-01', area: 'Self-management', clusterId: 'sm-org', descriptionEn: 'Managing time and tasks effectively', descriptionKo: '시간과 과제를 효과적으로 관리하기' },
    { id: 'sm-02', code: 'SM-02', area: 'Self-management', clusterId: 'sm-aff', descriptionEn: 'Managing state of mind', descriptionKo: '마음가짐 관리하기' },

    // Research
    { id: 'res-01', code: 'RES-01', area: 'Research', clusterId: 'res-info', descriptionEn: 'Finding, interpreting, judging and creating information', descriptionKo: '정보를 찾고, 해석하고, 판단하고, 생성하기' },
    { id: 'res-02', code: 'RES-02', area: 'Research', clusterId: 'res-media', descriptionEn: 'Interacting with media to use and create ideas and information', descriptionKo: '아이디어와 정보를 사용하고 생성하기 위해 미디어와 상호작용하기' },

    // Thinking
    { id: 'think-01', code: 'TH-01', area: 'Thinking', clusterId: 'think-crit', descriptionEn: 'Analyzing and evaluating issues and ideas', descriptionKo: '이슈와 아이디어를 분석하고 평가하기' },
    { id: 'think-02', code: 'TH-02', area: 'Thinking', clusterId: 'think-creat', descriptionEn: 'Generating novel ideas and considering new perspectives', descriptionKo: '새로운 아이디어를 생성하고 새로운 관점 고려하기' },
    { id: 'think-03', code: 'TH-03', area: 'Thinking', clusterId: 'think-trans', descriptionEn: 'Using skills and knowledge in multiple contexts', descriptionKo: '다양한 맥락에서 기술과 지식 활용하기' },
];

/*
export const ATL_SKILLS: ATLSkill[] = ATL_DATA.flatMap(areaGroup =>
    areaGroup.skills.map(skill => ({
        id: skill.code.toLowerCase(),
        code: skill.code,
        area: areaGroup.area,
        cluster: areaGroup.cluster || areaGroup.area,
        description: skill.description
    }))
);
*/

// Generate Units (UOIs)
// Grades 1-6, each has 6 UOIs
export const UNITS: Unit[] = [];

([1, 2, 3, 4, 5, 6] as Grade[]).forEach(grade => {
    for (let i = 1; i <= 6; i++) {
        UNITS.push({
            id: `uoi-g${grade}-${i}`,
            grade: grade,
            unitNo: i,
            name: `Grade ${grade} UOI ${i}`
        });
    }
});
