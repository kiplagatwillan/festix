import React from "react";
import { Ticket, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ticket className="text-indigo-600 w-6 h-6" />
              <span className="text-xl font-bold dark:text-white">Festix</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              The world's most trusted platform for secure event ticketing and
              management. Experience the future of events.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Social
            </h3>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-500" />
              <Github className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-500" />
              <Linkedin className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-500" />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 Festix Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
