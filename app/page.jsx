import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="blue_gradient head_text text-center">
        Share Your Thoughts
        <br className="max-md:hidden" />
        <span className="text-center"> With Others!</span>
      </h1>
      <p className="desc text-center">
        Look, you're important and your thoughts matter.
      </p>
      <Feed />
    </section>
  );
};

export default Home;
