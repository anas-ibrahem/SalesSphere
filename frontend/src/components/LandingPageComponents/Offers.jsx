import RevealOnScroll from "./RevealOnScroll.jsx";
const Offers = function Offers() {
  return (
    <RevealOnScroll>
      <div className="bg-white py-16 px-6 my-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
          What SalesSphere Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            {
              icon: "🤝",
              title: "Streamlined Deal Management",
              description:
                "Organize and track every deal with ease. Stay on top of negotiations.",
            },
            {
              icon: "📊",
              title: "Customer Interaction Tracking",
              description:
                "Keep a detailed log of customer interactions to better understand their needs.",
            },
            {
              icon: "🏆",
              title: "Monitor Employee Performance",
              description:
                "Track your team’s progress and reward top performers.",
            },
            {
              icon: "📱",
              title: "Stay Connected On-the-Go",
              description:
                "Access deals, notifications, and updates anytime with our mobile app.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-4 border rounded-lg shadow-md flex flex-col items-center 
              transition-all duration-300 ease-in-out hover:scale-105 cursor-default"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4 text-cyan-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
};
export default Offers;
