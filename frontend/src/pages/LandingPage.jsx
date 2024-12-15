import Footer from "../components/LandingPageComponents/Footer";
import Hero from "../components/LandingPageComponents/Hero";
import NavBar from "../components/LandingPageComponents/NavBar";
import SubHero from "../components/LandingPageComponents/SubHero";
import mobileImg from "../assets/mobile.png";
import Offers from "../components/LandingPageComponents/Offers";
import laptop from "../assets/laptop.jpg";
const LandingPage = function () {
  return (
    <>
      <NavBar />
      <Hero />
      <SubHero
        subHeading="SalesSphere benefits"
        heading="What Makes SalesSphere Different?"
        imgUrl={laptop}
        button={false}
        description="We’ve built SalesSphere to help teams stay organized, save time, and boost sales performance."
        ID="About"
      />
      <Offers />
      <SubHero
        subHeading="Mobile App Section"
        heading="Stay Connected Anytime, Anywhere!"
        description="Our mobile app ensures your team stays productive, even on the move. Track deals, update customer data, and receive notifications in real-time, making it easy to manage sales operations anytime, anywhere."
        imgUrl={mobileImg}
        button={true}
        buttonText="Download Now"
        ID="Mobile"
      />
      <Footer />
    </>
  );
};

export default LandingPage;
