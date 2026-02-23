/**
 * ESG Maturity Scoring Engine
 * 
 * Scores are calculated on a 0-3 scale per question:
 * 0: Not Reported
 * 1: Partially Reported (Policy exists)
 * 2: Fully Reported (Data provided, no evidence)
 * 3: Verified (Data + valid evidenceUrl)
 * 
 * The final score is normalized to 0-100%.
 */

export interface EsgAnswer {
    maturityScore: number; // 0-3
    hasEvidence: boolean;
}

/**
 * Calculates the normalized maturity score (0-100)
 * @param answers Array of maturity scores (0-3)
 * @returns Normalized score as percentage
 */
export function calculateNormalizedScore(scores: number[]): number {
    if (scores.length === 0) return 0;

    const maxPossibleScore = scores.length * 3;
    const totalActualScore = scores.reduce((sum, score) => sum + Math.min(Math.max(score, 0), 3), 0);

    return Math.round((totalActualScore / maxPossibleScore) * 100);
}

/**
 * Calculates scores for a specific pillar within a class
 */
export function calculatePillarScore(pillarName: string, classId: number, answers: any[], openEsClasses: any[]): { scoring: number, progress: number, answered: number, total: number } {
    const targetClass = openEsClasses.find(c => c.id === classId);
    if (!targetClass) return { scoring: 0, progress: 0, answered: 0, total: 0 };

    const targetPillar = targetClass.pillars.find((p: any) => p.name === pillarName);
    if (!targetPillar) return { scoring: 0, progress: 0, answered: 0, total: 0 };

    const allQuestions = targetPillar.topics.flatMap((t: any) => t.questions);
    const total = allQuestions.length;
    if (total === 0) return { scoring: 0, progress: 0, answered: 0, total: 0 };

    const pillarAnswers = answers.filter(a => allQuestions.some((q: any) => q.id === a.questionId));
    const answered = pillarAnswers.length;
    const scores = pillarAnswers.map(a => a.maturityScore);

    const maxPossibleScore = total * 3;
    const totalActualScore = scores.reduce((sum, score) => sum + Math.min(Math.max(score, 0), 3), 0);

    return {
        scoring: Math.round((totalActualScore / maxPossibleScore) * 100) || 0,
        progress: Math.round((answered / total) * 100) || 0,
        answered,
        total
    };
}

/**
 * Determines the maturity level name based on the normalized score
 */
export function getMaturityLevel(normalizedScore: number): string {
    if (normalizedScore <= 20) return "Initial";
    if (normalizedScore <= 40) return "Managed";
    if (normalizedScore <= 60) return "Defined";
    if (normalizedScore <= 85) return "Strategic";
    return "Optimized";
}
