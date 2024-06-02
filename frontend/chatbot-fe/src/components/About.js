import React from "react";
import './../styles/About.css';

function About() {
  return (
    <div>
      <h1 className="about_header">Hakkında</h1>
      <p className="about_text">Bu uygulama, Yıldız Teknik Üniversitesi Bilgi Teknolojileri programının biritme projesi olarak 2024 yılında Yavuz Selim Doğdu tarafından hazırlanmıştır. Proje kapsamında üç farklı karakter üslubunu taklit etmesi için 7 milyar parametrelik bir model eğitilmiş ve bu model için full-stack bir web uygulaması geliştirilmiştir. Model eğitimi için gereken veriler de sıfırdan hazırlanmıştır. Proje hakkındaki tüm detaylara https://github.com/selimvuz/BT-Project adresinden ulaşabilirsiniz.</p>
    </div>
  );
}

export default About;