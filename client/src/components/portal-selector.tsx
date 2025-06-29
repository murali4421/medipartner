import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hospital, Truck } from "lucide-react";
import { useLocation } from "wouter";

export default function PortalSelector() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mb-4 lg:mb-6 shadow-lg">
            <span className="text-white text-xl lg:text-2xl font-bold">MP</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3 lg:mb-4">
            Medi Partner
          </h1>
          <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Streamline your medicine supply chain with our comprehensive management platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Hospital Portal */}
          <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => setLocation("/hospital/login")}>
            <CardContent className="p-6 lg:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20 -translate-y-6 translate-x-6 lg:-translate-y-8 lg:translate-x-8"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-16 h-16 lg:w-24 lg:h-24 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Hospital className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                </div>
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">Hospital Portal</h2>
                <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                  Complete inventory management, smart ordering system, real-time tracking, and streamlined procurement workflow.
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
                  <Hospital className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Enter Hospital Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Portal */}
          <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => setLocation("/supplier/login")}>
            <CardContent className="p-6 lg:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-20 -translate-y-6 translate-x-6 lg:-translate-y-8 lg:translate-x-8"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl w-16 h-16 lg:w-24 lg:h-24 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                </div>
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">Supplier Portal</h2>
                <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                  Advanced catalog management, quotation system, order fulfillment tracking, and comprehensive business analytics.
                </p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
                  <Truck className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Enter Supplier Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Why Choose Medi Partner?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Real-time updates and instant notifications keep you always informed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Smart Analytics</h4>
              <p className="text-gray-600">AI-powered insights to optimize your supply chain operations</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 lg:mt-20 text-center text-gray-500">
          <div className="border-t border-gray-200 pt-6 lg:pt-8">
            <p className="text-xs lg:text-sm px-4">
              © 2025 Medi Partner. Transforming healthcare supply chains with intelligent technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-3 lg:mt-4 text-xs">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
