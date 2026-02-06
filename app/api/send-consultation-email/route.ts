import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, company, country, project_type, estimated_start_time, preferred_date, preferred_time, description } = body

        const { data, error } = await resend.emails.send({
            from: 'Taskive Tech <onboarding@resend.dev>', // Recommended to use verified domain once set up
            to: ['info@taskivetech.tech'],
            subject: `New Consultation Request: ${name} (${company || 'No Company'})`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Consultation Request</h2>
          <p>You have received a new consultation booking from the website.</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Country</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${country}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Project Type</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${project_type}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Start Time</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${estimated_start_time}</td>
            </tr>
            ${preferred_date ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Date</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${preferred_date}</td>
            </tr>
            ` : ''}
            ${preferred_time ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Time</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${preferred_time}</td>
            </tr>
            ` : ''}
          </table>
          
          <h3 style="color: #2563eb; margin-top: 30px;">Project Description</h3>
          <p style="background-color: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6;">${description}</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
            Sent from Taskive Tech Website
          </div>
        </div>
      `,
        })

        if (error) {
            return NextResponse.json({ error }, { status: 400 })
        }

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
