import { db } from "@/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, User, Clock, FileJson } from "lucide-react"

export default async function AuditTrailPage() {
    const logs = await db.query.auditLogs.findMany({
        orderBy: (logs, { desc }) => [desc(logs.timestamp)],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
                <p className="text-muted-foreground">
                    Comprehensive log of all data modifications and system activities.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        <CardTitle>System Activity Log</CardTitle>
                    </div>
                    <CardDescription>Tracking CREATE, UPDATE, and DELETE operations across modules.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs font-mono">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            log.action === 'CREATE' ? 'default' :
                                                log.action === 'DELETE' ? 'destructive' : 'secondary'
                                        }>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize font-medium">
                                        {log.entity} <span className="text-xs text-muted-foreground">({log.entityId.slice(0, 8)}...)</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            <span className="text-sm">{log.performedBy || "System"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <FileJson className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No activity recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
