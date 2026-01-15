import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const uid = formData.get("uid") as string;

        if (!file || !uid) {
            return NextResponse.json({ error: "Missing file or uid" }, { status: 400 });
        }

        // validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload directory
        const uploadDir = path.join(process.cwd(), "public/staff_pic");

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Delete existing files for this UID to clean up old photos
        const files = await fs.readdir(uploadDir);
        const userFiles = files.filter(f => f.startsWith(`${uid}-`) || f.startsWith(`${uid}.`));

        for (const oldFile of userFiles) {
            await fs.unlink(path.join(uploadDir, oldFile));
        }

        // Generate new filename with timestamp to prevent caching
        // Using a simple extension extraction or default to jpg
        const ext = file.name.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const filename = `${uid}-${timestamp}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        await fs.writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/staff_pic/${filename}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
