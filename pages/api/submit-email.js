export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir email adresi girin' });
    }

    // Here you can:
    // 1. Save to database
    // 2. Send to email service
    // 3. Save to file
    // For now, we'll just log it
    console.log('New email registration:', email, new Date().toISOString());
    
    // You can integrate with services like:
    // - Airtable
    // - Google Sheets
    // - Mailchimp
    // - SendGrid
    // - Database

    return res.status(200).json({ 
      message: 'Email başarıyla kaydedildi!',
      success: true 
    });

  } catch (error) {
    console.error('Email submission error:', error);
    return res.status(500).json({ 
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
      success: false 
    });
  }
}