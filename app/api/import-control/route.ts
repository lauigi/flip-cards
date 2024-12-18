import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { FILE_SIZE_LIMIT, FILE_SIZE_LIMIT_WORDING } from '@/lib/config';
import connect from '@/lib/mongodb';
import Topic from '@/models/Topic';

// some config for vercel
export const maxDuration = 300;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resultSchema = z.object({
  name: z.string(),
  summary: z.string(),
  longerSummary: z.string(),
  cards: z.array(
    z.object({
      id: z.number({ description: '5 digits serial id for the card' }),
      question: z.string({ description: 'The question of the card' }),
      answer: z.string({ description: 'The answer of the card' }),
    }),
  ),
});

export const POST = async function (req: NextRequest) {
  let email = '';
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  } else {
    email = session.user!.email as string;
  }
  await connect();
  const formData: FormData = await req.formData();
  const topicId = formData.get('topicId') as string;
  const topic = await Topic.findById(topicId).populate('chapters');
  if (!topic) {
    return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
  }
  const uploadedFiles = formData.getAll('file');
  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];
    console.log('Uploaded file:', uploadedFile);
    console.log('user email:', email);

    // Check if uploadedFile is of type File
    if (uploadedFile instanceof File) {
      // Check file size
      if (uploadedFile.size > FILE_SIZE_LIMIT) {
        return NextResponse.json({ error: `File size exceeds ${FILE_SIZE_LIMIT_WORDING} limit` }, { status: 413 });
      }
      // Convert ArrayBuffer to Buffer
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      console.log('File buffer:', fileBuffer);
      const result = await generateObject({
        schema: resultSchema,
        model: anthropic('claude-3-5-sonnet-20241022'),
        messages: [
          {
            role: 'system',
            content: `You are an expert for education area. Please generate contents based on the document the user provided, include the following:

1. A suitable title within 10 words
2. A 3-sentence summary
3. A longer summary within 8 sentences.
4. as much as possible (best for 7 to 14) most important key points organized in Q&A format

for teaching purpose.
in the meantime, please consider the topic's background and the user's previous feedback.
`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'I am a university student and I am studying a course. I have a PDF file that contains the course content.',
              },
              {
                type: 'file',
                data: fileBuffer,
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });
      console.log(result.usage);
      return NextResponse.json(result.object);
    }
  }
  return NextResponse.json({ message: 'internal error' }, { status: 500 });
};
