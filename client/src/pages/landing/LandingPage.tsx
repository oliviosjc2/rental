import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">EquipRent</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-primary">Pricing</a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary">Testimonials</a>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button className="text-gray-700">
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">
              Efficient Construction Equipment Management
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Streamline your construction equipment rentals, maintenance, and 
              inventory with our comprehensive management solution.
            </p>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button className="px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="px-8 py-3 text-base font-medium">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="relative aspect-[16/9] bg-gray-100 rounded overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <i className="ri-building-line text-6xl text-gray-400 mb-4"></i>
                    <p className="text-gray-500">Equipment Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-lg text-gray-600 mt-2">Everything you need to manage your equipment rentals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-building-line text-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600">Keep track of your customers and their contact information with our comprehensive customer database.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-tools-line text-xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipment Inventory</h3>
              <p className="text-gray-600">Manage your equipment inventory, including details about brands, categories, and availability status.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-calendar-check-line text-xl text-yellow-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rental Tracking</h3>
              <p className="text-gray-600">Track rentals, due dates, and returns to ensure maximum equipment utilization and customer satisfaction.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-service-line text-xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Maintenance Scheduling</h3>
              <p className="text-gray-600">Schedule and track maintenance activities to keep your equipment in optimal condition.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-bar-chart-2-line text-xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reporting & Analytics</h3>
              <p className="text-gray-600">Generate insights with reports on equipment usage, rental history, and business performance.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-notification-3-line text-xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Alert System</h3>
              <p className="text-gray-600">Receive alerts for upcoming maintenance, overdue rentals, and low stock equipment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple Pricing</h2>
            <p className="text-lg text-gray-600 mt-2">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Up to 100 equipment items</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Basic maintenance tracking</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Customer management</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-primary transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$199</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Up to 500 equipment items</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Advanced maintenance tracking</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Customer & contact management</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Priority email & phone support</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Advanced reporting</span>
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$399</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Unlimited equipment items</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Comprehensive maintenance suite</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Full CRM functionality</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  <span>White-labeling options</span>
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 mt-2">Trusted by construction companies worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="ri-user-line text-primary"></i>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Henderson</h4>
                  <p className="text-sm text-gray-600">BuildWell Construction</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This system has transformed how we manage our equipment. The maintenance scheduling alone has saved us thousands in repair costs."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="ri-user-line text-green-600"></i>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Metro Builders</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The customer management features have improved our client relationships dramatically. We can track preferences and history easily."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-fill"></i>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <i className="ri-user-line text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Chen</h4>
                  <p className="text-sm text-gray-600">Skyline Construction</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The reporting features give us insights we never had before. We've optimized our inventory and improved our rental utilization by 30%."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your equipment management?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of construction companies that have streamlined their operations with EquipRent.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EquipRent</h3>
              <p className="text-gray-400">
                The complete solution for construction equipment rental management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Equipment Inventory</a></li>
                <li><a href="#" className="hover:text-white">Maintenance Tracking</a></li>
                <li><a href="#" className="hover:text-white">Customer Management</a></li>
                <li><a href="#" className="hover:text-white">Rental Operations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 EquipRent. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;