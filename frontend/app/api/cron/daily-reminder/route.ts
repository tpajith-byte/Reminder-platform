import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const today = new Date().toISOString().split('T')[0]

        // Fetch active reminders due today or earlier (that haven't been processed? 
        // For now, let's just check for reminders with reminder_date <= today. 
        // Ideally we should mark them as sent, but the requirement says "checking all reminders".
        // Let's assume we want to remind for anything due today.

        const { data: reminders, error } = await supabase
            .from('reminders')
            .select('*, users(email)')
            .lte('reminder_date', today)
            .eq('is_active', true)

        if (error) throw error

        if (!reminders || reminders.length === 0) {
            return NextResponse.json({ message: 'No reminders found' })
        }

        // Group reminders by user
        const remindersByUser: Record<string, any[]> = {}
        reminders.forEach((reminder) => {
            const email = reminder.users?.email
            if (email) {
                if (!remindersByUser[email]) {
                    remindersByUser[email] = []
                }
                remindersByUser[email].push(reminder)
            }
        })

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use your SMTP settings
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        // Send emails
        const results = []
        for (const [email, userReminders] of Object.entries(remindersByUser)) {
            const reminderList = userReminders
                .map(
                    (r) =>
                        `- ${r.reminder_type === 'Others' ? r.other_reminder_type : r.reminder_type}: ${r.document_name} (Expires: ${r.expiry_date})`
                )
                .join('\n')

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Your Daily Reminders',
                text: `Here are your reminders for today:\n\n${reminderList}\n\nPlease log in to the application to view more details.`,
            }

            try {
                await transporter.sendMail(mailOptions)
                results.push({ email, status: 'sent' })
            } catch (err: any) {
                console.error(`Failed to send email to ${email}:`, err)
                results.push({ email, status: 'failed', error: err.message })
            }
        }

        return NextResponse.json({ results })
    } catch (err: any) {
        console.error('Error in daily reminder job:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
