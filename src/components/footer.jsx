export default function Footer(){
  return(
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="containe mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              KodeIn
            </h2>
            <p className="text-gray-400 max-w-md">Template Website untuk bisnis anda.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div>
            <h3 className="text-lg font-semibold mn-2">Link</h3>
            <ul className="space-y-2 px-2">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Tutorial</a></li>
            </ul>
          </div>
          <div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Kontak</h3>
              <ul className="space-y-2 text-gray-400 px-2">
                <li>+6283890170355</li>
                <li>kodein82</li>
                <li>di_kodein</li>
              </ul>
              <img src="/assets/logo-putih.png" className="w-60 ml-[360px] mt-[-180px]" alt="" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} KodeIn. All rights reserved.
        </div>
      </div>
    </footer>
  )
}