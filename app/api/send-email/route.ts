import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(req: NextRequest) {
    const { name, email, company, role, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    try {
        await transporter.sendMail({
            from: `"ForNet Web" <${process.env.SMTP_USER}>`,
            to: "fornetgle@gmail.com",
            replyTo: email,
            subject: "Nueva solicitud desde la web ForNet",
            html: `
        <h2>Nueva solicitud de demo</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || "-"}</p>
        <p><strong>Cargo:</strong> ${role || "-"}</p>
        <hr />
        <p>${message}</p>
      `,
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Email error:", err);
        return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }
}
