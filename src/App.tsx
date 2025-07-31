import React, { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'preregister',
          'email': email
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <form 
                name="preregister" 
                method="POST" 
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="preregister" />
                
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