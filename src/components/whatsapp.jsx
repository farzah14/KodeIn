export default function WhatsAppBubble(){
  return (
    <a 
      href="https://wa.me/+6283890170355" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-20"
    >
      <MessageCircle size={24} />
    </a>
  );
};