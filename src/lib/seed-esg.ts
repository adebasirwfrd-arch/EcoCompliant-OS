import { db } from "@/db";
import { esgTopics, esgDisclosures, esgQuestions } from "@/db/schema";
import { OPEN_ES_CLASSES } from "./esg-standards-data";
import { v4 as uuidv4 } from "uuid";

async function seedEsg() {
    console.log("🌱 Seeding ESG Standard Data...");

    try {
        for (const cls of OPEN_ES_CLASSES) {
            for (const pillar of cls.pillars) {
                for (const topic of pillar.topics) {
                    // 1. Insert Topic if not exists
                    const existingTopic = await db.query.esgTopics.findFirst({
                        where: (t, { eq }) => eq(t.id, topic.id)
                    });

                    if (!existingTopic) {
                        await db.insert(esgTopics).values({
                            id: topic.id,
                            name: topic.name,
                            pillar: pillar.name as any,
                            order: 1 // Default order
                        });
                        console.log(`+ Topic: ${topic.name} (${topic.id})`);
                    }

                    // 2. Insert a Disclosure for this topic (1:1 mapping for simplicity)
                    const disclosureId = `D-${topic.id}`;
                    const existingDisclosure = await db.query.esgDisclosures.findFirst({
                        where: (d, { eq }) => eq(d.id, disclosureId)
                    });

                    if (!existingDisclosure) {
                        await db.insert(esgDisclosures).values({
                            id: disclosureId,
                            topicId: topic.id,
                            name: `${topic.name} Disclosure`,
                            reference: topic.id
                        });
                    }

                    // 3. Insert Questions
                    for (const q of topic.questions) {
                        const existingQuestion = await db.query.esgQuestions.findFirst({
                            where: (eq, { eq: eqOp }) => eqOp(eq.id, q.id)
                        });

                        if (!existingQuestion) {
                            await db.insert(esgQuestions).values({
                                id: q.id,
                                disclosureId: disclosureId,
                                text: q.text,
                                type: "maturity"
                            });
                            console.log(`  + Question: ${q.id}`);
                        }
                    }
                }
            }
        }

        console.log("✅ ESG Seeding Complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

seedEsg();
