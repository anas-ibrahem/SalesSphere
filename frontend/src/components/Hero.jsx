import "../index.css";
import RevealOnScroll from "./RevealOnScroll.jsx";
import HeroImg from "../assets/Hero.jpg";
const Hero = function () {
  return (
    <RevealOnScroll>
      <div
        className="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid md:py-14 pl-8 lg:py-24 xl:py-14 lg:mt-3 xl:mt-5"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        <div className="pb-10 overflow-hidden md:p-10 lg:p-0 sm:pb-0">
          <img
            id="heroImg1"
            className="transition-all duration-300 ease-in-out hover:scale-105 lg:w-full sm:mx-auto sm:w-4/6 sm:pb-12 lg:pb-0"
            src={HeroImg}
            alt="hero page image"
            width="500"
            height="488"
          />
        </div>
        <div className="pr-2 md:mb-14 py-14 md:py-0">
          <h1 className="text-3xl font-semibold text-blue-900 xl:text-5xl lg:text-3xl">
            <span className="block w-full">Simplify Your Sales Process</span>
          </h1>
          <p className="py-4 text-lg text-gray-500 2xl:py-8 md:py-6 2xl:pr-5">
            <span className="text-cyan-600 italic ">
              <a href="/" className="hover:text-sky-800">
                SalesSphere
              </a>
            </span>{" "}
            is An intuitive platform for small businesses to manage deals, track
            performance, and boost productivity...
          </p>
          <div className="mt-4">
            <a
              href="/business-registration"
              className="px-5 py-3 text-lg tracking-wider text-white bg-blue-500 rounded-lg md:px-8 hover:bg-blue-600 group"
            >
              <span>Get Started</span>
            </a>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
};

export default Hero;
