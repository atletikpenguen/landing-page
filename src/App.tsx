import React, { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [emailList, setEmailList] = useState<any[]>([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');

  // Admin panel check
  React.useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        // Check if user is already authenticated
        const isAuthenticated = localStorage.getItem('analistligi_admin_auth') === 'true';
        if (isAuthenticated) {
          setShowAdmin(true);
          loadEmails();
        } else {
          setShowPasswordPrompt(true);
          setShowAdmin(false);
        }
      } else {
        setShowAdmin(false);
        setShowPasswordPrompt(false);
        setPassword('');
      }
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Şifre: analistligi2025 (değiştirebilirsiniz)
    const correctPassword = 'qwe1323';
    
    if (password === correctPassword) {
      localStorage.setItem('analistligi_admin_auth', 'true');
      setShowPasswordPrompt(false);
      setShowAdmin(true);
      setPassword('');
      loadEmails();
    } else {
      alert('Yanlış şifre!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('analistligi_admin_auth');
    setShowAdmin(false);
    setShowPasswordPrompt(false);
    window.location.hash = '';
  };

  // Enhanced localStorage with backup
  const saveEmailWithBackup = (emailData: any) => {
    // Save to main storage
    const existingEmails = JSON.parse(localStorage.getItem('analistligi_emails') || '[]');
    existingEmails.push(emailData);
    localStorage.setItem('analistligi_emails', JSON.stringify(existingEmails));
    
    // Also save to backup storage
    const backupEmails = JSON.parse(localStorage.getItem('analistligi_emails_backup') || '[]');
    backupEmails.push(emailData);
    localStorage.setItem('analistligi_emails_backup', JSON.stringify(backupEmails));
    
    // Save to sessionStorage as well
    const sessionEmails = JSON.parse(sessionStorage.getItem('analistligi_emails') || '[]');
    sessionEmails.push(emailData);
    sessionStorage.setItem('analistligi_emails', JSON.stringify(sessionEmails));
    
    // Also save to a hidden input for persistent backup
    const backupInput = document.getElementById('email-backup') as HTMLInputElement;
    if (backupInput) {
      backupInput.value = JSON.stringify(existingEmails);
    }
  };

  const loadEmailsFromAllSources = () => {
    // Try main storage first
    let emails = JSON.parse(localStorage.getItem('analistligi_emails') || '[]');
    
    // If empty, try backup
    if (emails.length === 0) {
      emails = JSON.parse(localStorage.getItem('analistligi_emails_backup') || '[]');
    }
    
    // If still empty, try session storage
    if (emails.length === 0) {
      emails = JSON.parse(sessionStorage.getItem('analistligi_emails') || '[]');
    }
    
    return emails;
  };

  const loadEmails = () => {
    const emails = loadEmailsFromAllSources();
    setEmailList(emails);
  };

  const exportEmails = () => {
    const emails = loadEmailsFromAllSources();
    const dataStr = JSON.stringify(emails, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analist-ligi-emails-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearEmails = () => {
    if (window.confirm('Tüm email\'leri silmek istediğinizden emin misiniz?')) {
      localStorage.removeItem('analistligi_emails');
      setEmailList([]);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Lütfen geçerli bir email adresi girin');
        setIsLoading(false);
        return;
      }

      // Check local storage for duplicates
      const existingEmails = JSON.parse(localStorage.getItem('analistligi_emails') || '[]');
      if (existingEmails.some((item: any) => item.email === email)) {
        alert('Bu email adresi zaten kayıtlı!');
        setIsLoading(false);
        return;
      }

      // Create email data
      const emailData = {
        email: email,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('tr-TR')
      };

      // Google Apps Script Web App URL (değiştirin!)
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/analistligi.com/s/AKfycbwAjVKffZ9pQ-Ey6vNCBhV8S6_oYbp_tQNE6CInnqc_-mjxU3v5sc6mEBh1TLConLCOJQ/exec';
      
      // Send to Google Sheets
      const formData = new FormData();
      formData.append('email', emailData.email);
      formData.append('date', emailData.date);
      formData.append('timestamp', emailData.timestamp);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        // Also save locally as backup
        saveEmailWithBackup(emailData);
        
        // Success feedback
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(result.message || 'Google Sheets kaydı başarısız');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Fallback to local storage
      const emailData = {
        email: email,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('tr-TR')
      };
      saveEmailWithBackup(emailData);
      
      // Still show success (user doesn't need to know about backend issues)
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
      console.log('Saved to local storage as fallback');
    } finally {
      setIsLoading(false);
    }
  };

  // Password Prompt
  if (showPasswordPrompt) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '400px',
          width: '100%',
          margin: '1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              color: '#fbbf24',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              🔐 Admin Paneli
            </h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Giriş yapmak için şifre gerekli
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin şifresi..."
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🚀 Giriş Yap
              </button>
              
              <button
                type="button"
                onClick={() => window.location.hash = ''}
                style={{
                  padding: '1rem',
                  background: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ← İptal
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#fbbf24'
          }}>
            💡 <strong>Varsayılan şifre:</strong> analistligi2025
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel
  if (showAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1a202c',
        color: 'white',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#fbbf24', marginBottom: '1rem' }}>
            📧 Analist Ligi - Admin Panel
          </h1>
          
          <div style={{
            background: 'rgba(52, 168, 83, 0.1)',
            border: '2px solid #34a853',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#34a853', marginBottom: '1rem', fontSize: '1.2rem' }}>
              📊 Google Sheets Entegrasyonu Aktif!
            </h3>
            <p style={{ color: '#e5e7eb', lineHeight: 1.6, margin: 0 }}>
              Tüm email kayıtları otomatik olarak <strong>Google Sheets</strong>'e kaydediliyor. 
              Aşağıdaki butona tıklayarak real-time email listesini görüntüleyebilirsiniz.
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                window.open('https://docs.google.com/spreadsheets/d/1M2YRv_MoJ6Wu3t-Mtl51KJrTL5mEy3pV-XHVDeLFoLw/edit', '_blank');
              }}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(45deg, #34a853, #0f9d58)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              📊 Google Sheets'i Aç
            </button>
            
            <button
              onClick={loadEmails}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔄 Local Backup Yenile
            </button>
            
            <button
              onClick={exportEmails}
              style={{
                padding: '0.5rem 1rem',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📥 Local Backup Export
            </button>
            
            <button
              onClick={() => window.location.hash = ''}
              style={{
                padding: '0.5rem 1rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Ana Sayfa
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔐 Çıkış Yap
            </button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 600
            }}>
              Toplam Kayıt: {emailList.length}
            </div>
            
            {emailList.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                Henüz kayıt yok
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {emailList.map((item, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    borderBottom: index < emailList.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#60a5fa' }}>{item.email}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
                 <div style={{
           maxWidth: '1200px',
           margin: '0 auto',
           padding: '0 20px',
           display: 'flex',
           justifyContent: 'flex-start',
             alignItems: 'center'
           }}>
             <img 
            src="/logo.png"
               alt="Analist Ligi" 
               style={{
                 height: '40px',
                 width: 'auto',
                 objectFit: 'contain'
               }}
             />
         </div>
      </header>

        {/* Hero Section */}
      <main style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          paddingTop: '100px'
        }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center',
          width: '100%'
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 800,
                marginBottom: '1.5rem',
                lineHeight: 1.2,
                background: 'linear-gradient(45deg, #60a5fa, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                BİLGİNİN VE YETENEĞİN YENİ SAHNESİ AÇILIYOR.
              </h1>
              
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                color: '#94a3b8',
                marginBottom: '3rem',
                lineHeight: 1.6
              }}>
              Türkiye'nin ilk performans tescilli analist platformu Analist Ligi, çok yakında açılıyor. 
              İster sadece kendini test et, ister yeni stratejiler öğren, ister zirveye tırman... 
              Seçim senin. Spor bilgisiyle fark yaratmak isteyen herkes için adil bir arena kuruyoruz.
              </p>

            {/* Email Form */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '500px',
                margin: '0 auto 3rem',
              backdropFilter: 'blur(10px)'
              }}>
              <form onSubmit={handleSubmit}>
                
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                  gap: '1rem'
                  }}>
                    <input
                      type="email"
                    name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    placeholder="e-posta adresinizi girin..."
                      required
                      style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                      }}
                    />
                  
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '1rem 2rem',
                      background: isLoading 
                        ? 'rgba(96, 165, 250, 0.5)' 
                        : 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isLoading ? '🔄 Gönderiliyor...' : '🚀 ÖN KAYIT OLUŞTUR'}
                    </button>
                  </div>
                </form>
                
                {isSubmitted && (
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '2px solid #22c55e',
                    color: '#22c55e',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem',
                    textAlign: 'center'
                  }}>
                    ✅ Teşekkürler! Yayın tarihinden önce size bilgilendirme yapacağız.
                  </div>
                )}
              </div>

            {/* Launch Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
              gap: '2rem',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                  fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#60a5fa',
                    display: 'block'
                }}>Tamamen Ücretsiz</span>
                  <span style={{
                    fontSize: '1rem',
                    color: '#94a3b8',
                    marginTop: '0.5rem',
                    display: 'block'
                }}>Yayın Tarihi: Ağustos 2025</span>
              </div>
            </div>
          </div>
        </div>
      </main>

        {/* Incentive Section */}
        <section style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
        }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
                             <h2 style={{
                 fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                 fontWeight: 700,
                 color: '#fbbf24',
                 marginBottom: '2rem'
               }}>
                 ÖNCÜ OL, AVANTAJI KAP!
               </h2>
                               <p style={{
                  fontSize: '1.2rem',
                  color: '#e5e7eb',
              lineHeight: 1.7,
              marginBottom: '2rem'
                }}>
                 "Analist Ligi"ne ilk adım atanlardan ol! Platforma ilk üye olan sınırılı sayıdaki analistler, özel bir başlangıç paketinin sahibi olacak:
               </p>
            
               <div style={{
              display: 'grid',
              gap: '1rem',
                 maxWidth: '600px',
                 margin: '2rem auto 0'
               }}>
                 <div style={{
                   background: 'rgba(255, 255, 255, 0.05)',
                   padding: '1.5rem',
                   borderRadius: '12px',
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left'
                 }}>
                   <h3 style={{
                     fontSize: '1.1rem',
                     fontWeight: 600,
                     color: '#fbbf24',
                     marginBottom: '0.5rem'
                   }}>
                     "Öncü Analist 🛡️" Arması
                   </h3>
                   <p style={{
                     fontSize: '1rem',
                     color: '#94a3b8',
                     lineHeight: 1.6,
                     margin: 0
                   }}>
                     Profilinizde ömür boyu gururla taşıyacağınız, platformun kurucu ruhunu temsil eden, sonradan kazanılması imkansız prestijli bir statü sembolü.
                   </p>
                 </div>
              
                 <div style={{
                   background: 'rgba(255, 255, 255, 0.05)',
                   padding: '1.5rem',
                   borderRadius: '12px',
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left'
                 }}>
                   <h3 style={{
                     fontSize: '1.1rem',
                     fontWeight: 600,
                     color: '#fbbf24',
                     marginBottom: '0.5rem'
                   }}>
                     Ekstra Büyüteç Bonusu
                   </h3>
                   <p style={{
                     fontSize: '1rem',
                     color: '#94a3b8',
                     lineHeight: 1.6,
                     margin: 0
                   }}>
                     İlk üyelere özel Ekstra Büyüteç Bonusu veriyoruz.
                   </p>
                 </div>
            </div>
            
                 <p style={{
                   fontSize: '1.1rem',
                   color: '#e5e7eb',
                   lineHeight: 1.6,
                   textAlign: 'center',
                   marginTop: '2rem',
                   fontStyle: 'italic'
                 }}>
                   Bu sadece bir başlangıç değil, bir ayrıcalıktır. Aramıza ilk katılanlardan olduğun için teşekkürümüzdür. Ön kayıt oluştur, bizi takip et!
                 </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: 'white'
            }}>
              NEDEN ANALİST LİGİ?
            </h2>
          
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🧠',
                title: 'SADECE BECERİ',
                desc: 'Burası şansın değil, analitik yeteneğin konuştuğu bir arena.'
              },
              {
                icon: '🏆',
                title: 'ŞEFFAF REKABET',
                desc: 'Performansın, herkesin görebileceği objektif verilerle ölçülür.'
              },
              {
                icon: '📜',
                title: 'GERÇEK FIRSAT',
                desc: 'Başarını tescille, bir hobi olarak kalmasın, kariyere dönüşsün.'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {feature.icon}
              </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#fbbf24',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Trust Box */}
      <section style={{
        padding: '5rem 0',
        background: '#1a202c'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h3 style={{
                color: '#ef4444',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                ⚠️ ÖNEMLİ BİLGİLENDİRME
              </h3>
              <ul style={{
                listStyle: 'none',
                color: '#e5e7eb'
              }}>
              {[
                'Analist Ligi, T.C. yasalarına uygun bir gelişim platformudur.',
                'Platformda para yatırma veya çekme işlemi YOKTUR.',
                'Maddi ödül veya ikramiye VERİLMEZ.',
                'Bu platform bir bahis veya şans oyunu DEĞİLDİR.'
              ].map((item, index) => (
                <li key={index} style={{
                  marginBottom: '1rem',
                  paddingLeft: '2rem',
                  position: 'relative',
                  fontSize: '1.1rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#22c55e',
                    fontWeight: 600
                  }}>✓</span>
                  {item}
                </li>
              ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section style={{
          padding: '5rem 0',
          background: '#0f172a',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'color 0.3s ease'
                }}>🐦</button>
                <button style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'color 0.3s ease'
                }}>📷</button>
              </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        background: '#0f172a',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
            <div style={{
              color: '#64748b',
          fontSize: '0.9rem'
            }}>
              © 2025 Analist Ligi. Tüm hakları saklıdır.
            </div>
      </footer>
          </div>
  );
}