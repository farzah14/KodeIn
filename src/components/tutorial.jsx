export default function TutorialPage(){
  const tutorials = [
    {
      id: 1,
      title: "Cara Memasang Template Website",
      desc: "Panduan lengkap untuk menginstal dan menjalankan template website KodeIn",
      image: "/api/placeholder/400/200",
      duration: "10 menit"
    },
    {
      id: 2,
      title: "Kustomisasi Warna dan Font",
      desc: "Belajar cara mengubah warna dan typography pada template KodeIn",
      image: "/api/placeholder/400/200",
      duration: "15 menit"
    },
    {
      id: 3,
      title: "Menambahkan Produk di Template E-Commerce",
      desc: "Tutorial lengkap untuk mengelola produk di template toko online",
      image: "/api/placeholder/400/200",
      duration: "20 menit"
    }
  ];

  return (
    <div className="mt-8 pt-20 px-4 md:px-8 mb-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tutorial KodeIn</h1>
      <p className="text-gray-600 mb-8">
        Pelajari cara menggunakan dan memaksimalkan template website KodeIn Anda melalui tutorial berikut ini.
      </p>

      <div className="space-y-6">
        {tutorials.map(tutorial => (
          <div key={tutorial.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-4">{tutorial.duration}</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">Tutorial</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{tutorial.title}</h2>
              <p className="text-gray-600 mb-4">{tutorial.desc}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Lihat Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};