export default function AboutPage(){
  return (
    <div className="mt-8 pt-20 px-4 md:px-8 mb-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tentang KodeIn</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Siapa Kami?</h2>
        <p className="text-gray-700 mb-4">
          KodeIn adalah platform penyedia template website berkualitas tinggi yang didirikan pada tahun 2025. 
          Kami berkomitmen untuk menyediakan solusi website yang mudah digunakan, modern, dan responsif untuk 
          berbagai kebutuhan bisnis dan personal.
        </p>
        <p className="text-gray-700">
          Tim kami terdiri dari desainer UI/UX dan 2 developer yang selalu mengikuti trend terbaru
          dalam dunia web design dan development.
        </p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Visi & Misi</h2>
        <p className="text-gray-700 mb-4">
          <strong>Visi:</strong> Menjadi platform terdepan dalam penyediaan template website berkualitas tinggi 
          di Indonesia dan membantu UMKM Go Digital.
        </p>
        <p className="text-gray-700">
          <strong>Misi:</strong> Menyediakan template website dengan kode yang bersih, desain yang menarik, dan 
          performa yang optimal dengan harga terjangkau.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Keunggulan KodeIn</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Template dengan desain modern dan responsif</li>
          <li>✅ Kode bersih dan teroptimasi untuk performa</li>
          <li>✅ Dukungan teknis 24/7</li>
          <li>✅ Update template berkala</li>
          <li>✅ Dokumentasi lengkap dan tutorial penggunaan</li>
        </ul>
      </div>
    </div>
  );
};