import { db } from "./index"
import { esgAssessments, esgAnswers } from "./schema"
import { eq } from "drizzle-orm"

async function fixScores() {
    console.log("Starting score correction...")
    const assessments = await db.query.esgAssessments.findMany({
        with: {
            answers: true
        }
    })

    const TOTAL_QUESTIONS_COUNT = 212
    const maxPossibleScore = TOTAL_QUESTIONS_COUNT * 3

    for (const assessment of assessments) {
        console.log(`Processing assessment: ${assessment.title || assessment.id}`)

        const scores = assessment.answers.map((a: any) => a.maturityScore)
        const totalActualScore = scores.reduce((sum: number, score: number) => sum + Math.min(Math.max(score, 0), 3), 0)

        const overallScore = Math.round((totalActualScore / maxPossibleScore) * 100)

        let maturityLevel = "Initial"
        if (overallScore > 85) maturityLevel = "Optimized"
        else if (overallScore > 60) maturityLevel = "Strategic"
        else if (overallScore > 40) maturityLevel = "Defined"
        else if (overallScore > 20) maturityLevel = "Managed"

        await db.update(esgAssessments)
            .set({
                overallScore,
                maturityLevel,
                updatedAt: new Date()
            })
            .where(eq(esgAssessments.id, assessment.id))

        console.log(`Updated ${assessment.id}: ${overallScore}% (${maturityLevel})`)
    }

    console.log("Score correction complete.")
}

fixScores().catch(console.error)
