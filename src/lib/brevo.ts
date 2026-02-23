const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

export async function sendApprovalEmail({
    managerEmail,
    reportId,
    reportTitle,
    attachmentUrl
}: {
    managerEmail: string;
    reportId: string;
    reportTitle: string;
    attachmentUrl?: string | null;
}) {
    const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/approve/${reportId}`;

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
            <h2 style="color: #0f172a;">Compliance Report Approval Request</h2>
            <p style="color: #475569;">A new compliance report has been submitted for your approval.</p>
            
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p><strong>Report:</strong> ${reportTitle}</p>
                <p><strong>ID:</strong> ${reportId}</p>
                ${attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}" style="color: #2563eb;">Download Report File</a></p>` : ''}
            </div>

            <p style="color: #475569; margin-bottom: 24px;">Please review the report and click the button below to approve it.</p>
            
            <a href="${approveUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Approve Report</a>
            
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                This is an automated message from the Environmental Management System.
            </p>
        </div>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: { name: "EMS - Compliance System", email: managerEmail }, // Using recipient as sender for better deliverability
            to: [{ email: managerEmail }],
            subject: `[Approval Required] ${reportTitle}`,
            htmlContent: htmlContent
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Brevo API Error:", error);
        throw new Error("Failed to send email");
    }

    return await response.json();
}

export async function sendReminderEmail({
    recipientEmail,
    reportId,
    reportTitle,
    dueDate
}: {
    recipientEmail: string;
    reportId: string;
    reportTitle: string;
    dueDate: string | Date;
}) {
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/compliance/${reportId}`;
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <h2 style="color: #0f172a; margin: 0;">⏳ Upcoming Deadline Reminder</h2>
            </div>
            
            <p style="color: #475569; font-size: 16px;">This is an automated reminder that a compliance report requires your attention within the next <strong>7 Days</strong>.</p>
            
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 6px 6px 0; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Report:</strong> ${reportTitle}</p>
                <p style="margin: 0 0 8px 0; color: #b45309;"><strong>Due Date:</strong> ${formattedDate}</p>
                <p style="margin: 0;"><strong>Status:</strong> <span style="background-color: #fce7f3; color: #be185d; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">Action Required</span></p>
            </div>

            <p style="color: #475569; margin-bottom: 24px;">Please ensure all necessary data and attachments are finalized and submitted before the deadline to maintain compliance.</p>
            
            <a href="${reportUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Report Details</a>
            
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                This is an automated priority reminder from the Environmental Management System. 
            </p>
        </div>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: { name: "EMS - Compliance System", email: recipientEmail }, // Using recipient as sender trick for deliverability
            to: [{ email: recipientEmail }],
            subject: `[Action Required] Deadline Approaching: ${reportTitle}`,
            htmlContent: htmlContent
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Brevo API Reminder Error:", error);
        throw new Error("Failed to send reminder email");
    }

    return await response.json();
}

export async function sendWasteReminderEmail({
    managerEmail,
    manifestNumber,
    wasteType,
    deadlineDate,
    maxStorageDays
}: {
    managerEmail: string;
    manifestNumber: string;
    wasteType: string;
    deadlineDate: string | Date;
    maxStorageDays: number;
}) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/waste`;
    const formattedDate = new Date(deadlineDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <h2 style="color: #0f172a; margin: 0;">⚠️ TPS Storage Limit Reminder (H-7)</h2>
            </div>
            
            <p style="color: #475569; font-size: 16px;">This is an automated reminder that hazardous waste stored at your Temporary Storage (TPS) is approaching its legal maximum storage limit of <strong>${maxStorageDays} Days</strong> based on PP 22/2021.</p>
            
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 6px 6px 0; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Waste Type:</strong> ${wasteType}</p>
                <p style="margin: 0 0 8px 0;"><strong>Manifest/Logbook:</strong> ${manifestNumber || 'N/A'}</p>
                <p style="margin: 0 0 8px 0; color: #b45309;"><strong>Storage Deadline:</strong> ${formattedDate}</p>
                <p style="margin: 0;"><strong>Status:</strong> <span style="background-color: #fce7f3; color: #be185d; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">Transport Required Soon</span></p>
            </div>

            <p style="color: #475569; margin-bottom: 24px;">Please arrange for a licensed third-party transporter to collect this waste before the deadline to prevent regulatory non-compliance.</p>
            
            <a href="${dashboardUrl}" style="display: inline-block; background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Waste Dashboard</a>
            
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                This is an automated priority reminder from the Environmental Management System. 
            </p>
        </div>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: { name: "EMS - Limbah B3 System", email: managerEmail }, // Using recipient as sender trick for deliverability
            to: [{ email: managerEmail }],
            subject: `[TPS Limit Alert] Less than 7 days for ${wasteType}`,
            htmlContent: htmlContent
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Brevo API Waste Reminder Error:", error);
        throw new Error("Failed to send waste reminder email");
    }

    return await response.json();
}
