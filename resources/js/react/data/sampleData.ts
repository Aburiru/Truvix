import { TextScanReport, ImageForensicReport } from '../types';

export const SAMPLE_TEXT_AI = `The project kickoff was initially met with some confusion, given the tight turnaround times proposed by the steering committee.

Furthermore, the implementation of robust synergy paradigms is essential for maximizing cross-functional deliverables. By leveraging state-of-the-art methodologies, organizations can proactively address underlying infrastructural bottlenecks.

It is imperative to note that scalable solutions facilitate seamless integration across diverse operational verticals. This paradigm shift will undoubtedly yield optimized return on investment while maintaining stringent compliance protocols.

I honestly think we need to push back on the Q3 deadlines if they expect this level of integration.

Comprehensive data analytics serve as the foundational bedrock for evidence-based decision-making in modern enterprise management.`;

export const SAMPLE_TEXT_HUMAN = `Hey team, just wanted to follow up on yesterday's discussion about the mobile redesign. 

I tested the new checkout flow on my iPhone 14 last night. The overall layout feels much smoother, but I ran into a weird bug when tapping the discount code field—it seems to shift the footer up and cover the primary CTA.

We should probably take a look at that before pushing to staging on Thursday. Let me know if anyone else can reproduce it or if it's just my device. Thanks!`;

export const DEFAULT_TEXT_REPORT: TextScanReport = {
  id: 'rpt-txt-001',
  title: 'Project_Alpha_Brief.txt',
  timestamp: 'Just now',
  aiProbability: 87,
  confidenceLabel: 'High Confidence',
  perplexityScore: 'Low',
  perplexityDescription: 'Highly predictable word choices.',
  burstiness: 'Uniform',
  burstinessDescription: 'Lack of structural variation.',
  sentenceLength: 'Static',
  avgSentenceLength: 'Average 14.2 words/sentence.',
  linguisticPatternSummary: `The analysis strongly indicates artificial generation. The text exhibits remarkably uniform syntax and a significant lack of cognitive bursting typical of human writing. Sentence length variation is minimal, and the perplexity score is consistently low across multiple paragraphs, suggesting a highly predictable statistical model generated this content.`,
  highlightedTags: ['Highly Uniform', 'Low Burstiness', 'LLM Signature'],
  originalText: SAMPLE_TEXT_AI,
  paragraphs: [
    {
      text: 'The project kickoff was initially met with some confusion, given the tight turnaround times proposed by the steering committee.',
      isAi: false,
      reasoning: 'Displays organic human phrasing and contextual variance.'
    },
    {
      text: 'Furthermore, the implementation of robust synergy paradigms is essential for maximizing cross-functional deliverables. By leveraging state-of-the-art methodologies, organizations can proactively address underlying infrastructural bottlenecks.',
      isAi: true,
      reasoning: 'High density of corporate LLM buzzwords ("synergy paradigms", "cross-functional deliverables") and predictable syntactic sequence.'
    },
    {
      text: 'It is imperative to note that scalable solutions facilitate seamless integration across diverse operational verticals. This paradigm shift will undoubtedly yield optimized return on investment while maintaining stringent compliance protocols.',
      isAi: true,
      reasoning: 'Classic formulaic academic transition ("It is imperative to note") and static sentence cadence.'
    },
    {
      text: 'I honestly think we need to push back on the Q3 deadlines if they expect this level of integration.',
      isAi: false,
      reasoning: 'Authentic conversational voice and personal opinion marker ("I honestly think").'
    },
    {
      text: 'Comprehensive data analytics serve as the foundational bedrock for evidence-based decision-making in modern enterprise management.',
      isAi: true,
      reasoning: 'High token predictability score and typical LLM closing summary pattern.'
    }
  ]
};

// Hotlinked sample synthetic face / portrait image
export const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop';

export const DEFAULT_IMAGE_REPORT: ImageForensicReport = {
  id: 'rpt-img-001',
  fileName: 'Profile_Photo.png',
  imageUrl: SAMPLE_IMAGE_URL,
  timestamp: 'Just now',
  aiProbability: 94,
  confidenceLabel: 'SYNTHETIC',
  riskLevel: 'High Probability',
  riskSummary: 'Strong indications of generative AI synthesis detected across multiple forensic vectors.',
  findings: {
    noisePattern: {
      risk: 'High Risk',
      title: 'Noise Pattern Analysis',
      description: 'Detects unnatural sensor noise patterns common in generative models (Midjourney/DALL-E). Lack of organic camera sensor noise.'
    },
    metadata: {
      risk: 'High Risk',
      title: 'Metadata Analysis',
      description: 'Missing EXIF data and software signature anomalies detected. The structural footprint matches known AI upscaling pipelines.'
    },
    pixelArtifacts: {
      risk: 'Medium Risk',
      title: 'Pixel-Level Artifacts',
      description: 'Structural anomalies and blending errors identified in the background depth-of-field transition.'
    }
  },
  analysisSummary: "The analyzed image exhibits multiple hallmarks of synthetic generation. The primary flag is the inconsistent light source and GAN-generated texture patterns observed in the subject's hair and the background elements. Furthermore, the complete absence of typical organic sensor noise, coupled with scrubbed structural metadata, strongly aligns with outputs from modern diffusion models.",
  heatmapRegions: [
    { x: 48, y: 38, radius: 42, intensity: 0.9, label: 'Facial geometry variance' },
    { x: 72, y: 52, radius: 36, intensity: 0.75, label: 'Background inconsistency' },
    { x: 32, y: 65, radius: 30, intensity: 0.65, label: 'Lighting source mismatch' }
  ]
};
