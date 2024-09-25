import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import uniqid from 'uniqid';

export async function POST(req: Request) {
  try {
    
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (file) {
      const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      const extension = file.name.split('.').pop();
      const newFileName = uniqid() + '.' + extension;
      
     
      const buffer = Buffer.from(await file.arrayBuffer());

      const bucket = 'eventia-media-storage';
      const params = {
        Bucket: bucket,
        Key: newFileName,
        Body: buffer,
        ContentType: file.type,
        ACL: ObjectCannedACL.public_read
      };

      await s3Client.send(new PutObjectCommand(params));
      const link = `https://${bucket}.s3.amazonaws.com/${newFileName}`;

      return new Response(JSON.stringify({ url: link }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}