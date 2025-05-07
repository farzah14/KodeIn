export default function HomePage({ setTemplateView}) {
  const templates = [
    {
      id: 1,
      title: "Coffee Shop",
      price: "Rp99.000",
      image: "/assets/coffee/home.png",
      category: "Coffee",
      type: "ecommerce"
    },
    {
      id: 2,
      title: "Personal Portfolio",
      price: "Rp129.000",
      image: "/assets/portofolio/home.png",
      category: "Portfolio",
      type: "portfolio"
    },
    {
      id: 4,
      title: "Company Profile",
      price: "Rp299.000",
      image: "/assets/company/home.png",
      category: "Business",
      type: "business"
    },
  ];

  return (
    <div className="mt-8 pt-20 px-4 md:px-8 mb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12 px-6 rounded-lg mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Ingin Punya Website? Mari di KodeIn Aja</h1>
        <p className="text-lg mb-6">Temukan berbagai template website berkualitas tinggi dan siap pakai</p>
        <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-md">
          Lihat Template
        </button>
      </div>

      {/* Templates Section */}
      <h2 className="text-2xl font-bold mb-4 text-center">Template Terpopuler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="hover:scale-102 transition delay-100 duration-300 ease-in-out hover:shadow-lg bg-white rounded-lg">
            <img src={template.image} alt={template.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{template.category}</span>
              <h3 className="text-lg font-semibold mt-2">{template.title}</h3>
              <p className="text-gray-600 mt-1">{template.price}</p>
              <button 
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Check if we have a component for this template type
                  if (['ecommerce', 'portfolio', 'business'].includes(template.type)) {
                    setTemplateView({ show: true, type: template.type });
                  } else {
                    // Could display a message that this template isn't available yet
                    alert('Template detail coming soon!');
                  }
                }}
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}