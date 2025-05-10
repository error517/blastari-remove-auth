
import emailjs from '@emailjs/browser';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const { email, subject, content } = await req.json();

    // For server-side EmailJS, you need to use a different approach
    // This is just a placeholder - in a real app, you would use a proper email service
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      {
        to_email: email,
        subject: subject,
        content: content,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
