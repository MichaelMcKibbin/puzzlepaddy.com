// /pages/contact.js
export default function Contact() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Contact</h1>
                
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <p className="text-lg text-gray-700 mb-8">
                        Thanks for your interest in PuzzlePaddy! For inquiries, feedback, or collaboration opportunities, please reach out through:
                    </p>
                    
                    <div className="space-y-6">
                        <a 
                            href="https://michaelmckibbin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            Visit My Website: michaelmckibbin.com
                        </a>
                        
                        <a 
                            href="https://www.linkedin.com/in/michaelkevinmckibbin/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            Connect on LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}