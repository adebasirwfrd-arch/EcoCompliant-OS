import { db } from './src/db';
import { complianceReports } from './src/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

async function main() {
    const id = uuidv4();
    const dueDate = addDays(new Date(), 7); // Exactly 7 days from now
    
    await db.insert(complianceReports).values({
        id,
        title: 'Auto-test Cron Report',
        agency: 'KLHK',
        dueDate,
        status: 'Pending',
        managerEmail: 'ade.basirwfrd@gmail.com', // User's email
    });
    
    console.log(`Created test report ${id} due on ${dueDate}`);
}

main().catch(console.error);
