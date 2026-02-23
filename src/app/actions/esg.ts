"use server"

import { db } from "@/db"
import { esgAssessments, esgAnswers, esgQuestions, esgDisclosures, esgTopics } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { calculateNormalizedScore, getMaturityLevel } from "@/lib/esg-scoring"

/**
 * Saves or updates a single disclosure assessment
 */
export async function saveDisclosureAssessment(data: {
    assessmentId: string,
    questionId: string,
    maturityScore: number,
    evidenceUrl?: string,
    remarks?: string
}) {
    try {
        const { assessmentId, questionId, maturityScore, evidenceUrl, remarks } = data

        const existingAnswer = await db.query.esgAnswers.findFirst({
            where: and(
                eq(esgAnswers.assessmentId, assessmentId),
                eq(esgAnswers.questionId, questionId)
            )
        })

        if (existingAnswer) {
            await db.update(esgAnswers)
                .set({
                    maturityScore,
                    evidenceUrl: evidenceUrl || null,
                    remarks: remarks || null,
                    updatedAt: new Date()
                })
                .where(eq(esgAnswers.id, existingAnswer.id))
        } else {
            await db.insert(esgAnswers).values({
                id: uuidv4(),
                assessmentId,
                questionId,
                maturityScore,
                evidenceUrl: evidenceUrl || null,
                remarks: remarks || null,
                updatedAt: new Date()
            })
        }

        // Trigger recalculation of overall score
        await updateOverallMaturityScore(assessmentId)

        revalidatePath("/dashboard/esg")
        return { success: true }
    } catch (error) {
        console.error("Save Disclosure Error:", error)
        return { success: false, error: "Failed to save assessment" }
    }
}

/**
 * Updates the overall maturity score for an assessment
 */
async function updateOverallMaturityScore(assessmentId: string) {
    const allAnswers = await db.query.esgAnswers.findMany({
        where: eq(esgAnswers.assessmentId, assessmentId)
    })

    // Total questions across Class 1 & 2 = 212
    const TOTAL_QUESTIONS_COUNT = 212
    const maxPossibleScore = TOTAL_QUESTIONS_COUNT * 3

    const scores = allAnswers.map(a => a.maturityScore)
    const totalActualScore = scores.reduce((sum, score) => sum + Math.min(Math.max(score, 0), 3), 0)

    const overallScore = Math.round((totalActualScore / maxPossibleScore) * 100)
    const maturityLevel = getMaturityLevel(overallScore)

    await db.update(esgAssessments)
        .set({
            overallScore,
            maturityLevel,
            updatedAt: new Date()
        })
        .where(eq(esgAssessments.id, assessmentId))
}

/**
 * Fetches maturity data, creating a skeleton if none exists
 * Now supports fetching by ID primarily, falling back to year if needed
 */
export async function getEsgMaturityData(idOrYear: string | number = 2026) {
    let assessment;

    if (typeof idOrYear === 'string') {
        assessment = await db.query.esgAssessments.findFirst({
            where: eq(esgAssessments.id, idOrYear),
            with: {
                answers: true
            }
        })
    } else {
        assessment = await db.query.esgAssessments.findFirst({
            where: eq(esgAssessments.year, idOrYear),
            with: {
                answers: true
            }
        })
    }

    if (!assessment && typeof idOrYear === 'number') {
        const id = uuidv4()
        await db.insert(esgAssessments).values({
            id,
            year: idOrYear,
            title: `Assessment ${idOrYear}`,
            status: "Draft",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        assessment = {
            id,
            year: idOrYear,
            title: `Assessment ${idOrYear}`,
            overallScore: 0,
            maturityLevel: "Initial",
            status: "Draft",
            createdAt: new Date(),
            updatedAt: new Date(),
            answers: []
        } as any
    }

    return assessment
}

/**
 * Fetches all ESG assessments for the management table
 */
export async function getAllEsgAssessments() {
    try {
        const assessments = await db.query.esgAssessments.findMany({
            with: {
                answers: true
            },
            orderBy: (assessments, { desc }) => [desc(assessments.updatedAt)]
        });
        return assessments;
    } catch (error) {
        console.error("Fetch All Assessments Error:", error);
        return [];
    }
}

/**
 * Creates a new ESG Context Index
 */
export async function createEsgAssessment(data: {
    title: string;
    companyName: string;
    year: number;
    sector: string;
    picName: string;
    picEmail: string;
}) {
    try {
        const id = uuidv4();
        await db.insert(esgAssessments).values({
            id,
            ...data,
            status: "Draft",
            overallScore: 0,
            maturityLevel: "Initial",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        revalidatePath("/dashboard/esg");
        return { success: true, id };
    } catch (error) {
        console.error("Create Context Index Error:", error);
        return { success: false, error: "Failed to create context index" };
    }
}

/**
 * Updates reporting metadata for an assessment
 */
export async function updateEsgReportingMetadata(data: {
    assessmentId: string,
    title?: string,
    companyName?: string,
    organizationType?: string,
    reportingPeriod?: string,
    contactPoint?: string,
    sector?: string,
    picName?: string,
    picEmail?: string
}) {
    try {
        const { assessmentId, ...metadata } = data

        await db.update(esgAssessments)
            .set({
                ...metadata,
                updatedAt: new Date()
            })
            .where(eq(esgAssessments.id, assessmentId))

        revalidatePath("/dashboard/esg")
        return { success: true }
    } catch (error) {
        console.error("Update Metadata Error:", error)
        return { success: false, error: "Failed to update reporting metadata" }
    }
}
