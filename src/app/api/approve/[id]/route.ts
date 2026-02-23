import { approveComplianceReport } from "@/app/actions/environmental";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await approveComplianceReport(id);

        return new NextResponse(`
            <html>
                <head>
                    <title>Report Approved</title>
                    <style>
                        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; }
                        .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; }
                        h1 { color: #059669; margin-top: 0; }
                        p { color: #475569; line-height: 1.6; }
                        .icon { font-size: 48px; color: #059669; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="icon">✓</div>
                        <h1>Report Approved</h1>
                        <p>The compliance report has been successfully marked as <strong>Approved</strong>. The environmental department has been notified.</p>
                        <p style="font-size: 14px; margin-top: 20px;">You can close this window now.</p>
                    </div>
                </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        return new NextResponse("Failed to approve report", { status: 500 });
    }
}
