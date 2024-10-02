import { NextRequest, NextResponse } from "next/server";
import { PythonShell } from 'python-shell';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json({ message: "User email is required" }, { status: 400 });
    }

    const options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: './utils',
      args: [userEmail]
    };

    const results = await PythonShell.run('recommendations.py', options);
    const recommendations = JSON.parse(results[0]);

    if (recommendations.error) {
      return NextResponse.json({ message: recommendations.error }, { status: 404 });
    }

    return NextResponse.json(recommendations, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}