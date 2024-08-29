import React from 'react'
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Carpooling App. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center">
            <a href="about/privacypolicy" className="text-gray-400 hover:text-white mx-2 mb-2">Privacy Policy</a>
            <a href="about/termsofservice" className="text-gray-400 hover:text-white mx-2 mb-2">Terms of Service</a>
            <a href="about/contactus" className="text-gray-400 hover:text-white mx-2 mb-2">Contact Us</a>
          </div>
         
        </div>
      </footer>
  )
}

export default Footer