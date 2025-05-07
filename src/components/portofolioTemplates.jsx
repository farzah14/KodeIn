export default function PortfolioTemplateDetail({setActiveNav}){
  return (
    <div className="pt-20 px-4 md:px-8 mb-16">
      <button 
        onClick={() => setActiveNav('home')}
        className="mb-6 flex items-center text-white hover:text-blue-800"><span className="text-2xl my-4 bg-indigo-500 px-4 py-2 rounded-lg">Kembali</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Template Header */}
        <div className="relative">
          <img src="/assets/portofolio/home.png" alt="Personal Portfolio Template Preview" className="w-full h-full rounded-lg" />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            Portfolio
          </div>
        </div>

        {/* Template Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-2 md:mb-0">Personal Portfolio</h1>
            <div className="flex items-center">
              <a href="https://farzah14.github.io/PersonalTemplates/" target="_blank" className="live">Live Demo</a>
              <span className="text-2xl font-bold text-blue-600 mx-4">Rp129.000</span>
              <a href="https://wa.me/+6283890170355" target="_blank" rel="noopener noreferrer">
                <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                  Beli Template
                </button>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Fitur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Desain Modern & Profesional</span>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Tampilan Responsif</span>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Bagian Proyek dengan Filter</span>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Animasi Scroll yang Menarik</span>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Formulir Kontak Fungsional</span>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <span>Integrasi Media Sosial</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src="/assets/portofolio/contact.png" alt="homepage" className="w-full rounded-lg hover:scale-106 transition delay-100 duration-300 ease-in-out hover:shadow-lg" />
              <img src="/assets/portofolio/home1.png" alt="projects" className="w-full rounded-lg hover:scale-106 transition delay-100 duration-300 ease-in-out hover:shadow-lg" />
              <img src="/assets/portofolio/blog.png" alt="skills" className="w-full rounded-lg hover:scale-106 transition delay-100 duration-300 ease-in-out hover:shadow-lg" />
              <img src="/assets/portofolio/portofolio.png" alt="contact" className="w-full rounded-lg hover:scale-106 transition delay-100 duration-300 ease-in-out hover:shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};