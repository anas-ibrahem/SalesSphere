import RevealOnScroll from "./RevealOnScroll";

const SubHero = function (props) {
  return (
    <RevealOnScroll>
      <div className="w-full bg-white px-4 py-16">
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8 items-center">
          <img
            className="w-[500px] my-4 "
            src={props.imgUrl}
            alt={props.altText}
          />
          <div className="flex flex-col justify-center md:pr-8">
            <p className="text-cyan-600 font-bold">{props.subHeading}</p>
            <h1 className="md:text-4xl text-blue-900 sm:text-3xl text-2xl font-bold py-2">
              {props.heading}
            </h1>
            <p>{props.description}</p>
            {props.button && (
              <button className="bg-black text-white w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3 transition duration-300 ease-in-out transform hover:bg-gray-800 hover:scale-105 active:scale-95">
                {props.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
};

export default SubHero;
