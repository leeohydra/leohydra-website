export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-reading py-20 lg:py-28 space-y-16">

        {/* Section label */}
        <div className="animate-fade-in">
          <p className="text-sm tracking-widest uppercase text-gray-500">
            About the Artist
          </p>
          <div className="mt-2 h-px w-16 bg-gray-300" />
        </div>

        {/* Intro statement */}
        <div className="animate-slide-up max-w-3xl">
          <p className="text-xl leading-relaxed border-l border-gray-300 pl-6">
            <strong>LEO HYDRA</strong> paints from a dreamy perspective, where
            illusion and dimension intertwine.
          </p>
        </div>

        {/* Main editorial body */}
        <div className="animate-slide-up max-w-3xl space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            His works submerge viewers in a world of magical realism and organic
            forms, crafting compositions that pulse with life and texture.
            Blending abstraction with structured geometric elements, his art
            invites the viewer into a journey of surreal distortions and dynamic,
            living shapes.
          </p>

          <p>
            With a masterful command of color and an urban-art edge, LEO HYDRA
            creates vivid, electrifying works that echo the essence of chaos,
            tribal energy, and exotic mystique.
          </p>

          <p>
            Having lived across multiple countries, LEO HYDRA’s upbringing
            exposed him to a rich tapestry of cultures, traditions, and social
            landscapes. A life shaped by movement and change sharpened his
            ability to perceive the world through a lens of curiosity—seeing
            people and places as magical universes waiting to be explored.
          </p>

          <p>
            His art is a manifestation of controlled chaos, a fearless
            exploration of evolving styles and uncharted dimensions. With every
            stroke, he challenges boundaries, constantly seeking new
            perspectives and hidden nuances.
          </p>
        </div>

        {/* Themes */}
        <div className="animate-slide-up max-w-3xl space-y-6 pt-6">
          <p className="text-sm tracking-widest uppercase text-gray-500">
            Themes & Inspirations
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "Lettering & Urban Art",
              "Surreal Distortions",
              "Abstract Impressions",
              "Cartoons & Street Art",
              "Dreams & Consciousness",
              "Energy & Metaphysics",
            ].map((theme) => (
              <span
                key={theme}
                className="
                          px-4 py-2 text-sm rounded-sm
                          border border-gray-300 text-gray-700
                          transition-all duration-300 ease-out
                          hover:-translate-y-0.5
                          hover:border-gray-900
                          hover:text-gray-900
                          hover:bg-gray-50
                        "

              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Closing reflection */}
        <div className="animate-slide-up max-w-3xl pt-4">
          <p className="text-xl leading-relaxed border-l border-gray-300 pl-6">
            Each creation is a gateway, an invitation to step beyond the visible
            and lose yourself in a world of vivid imagination and endless
            possibilities.
          </p>
        </div>

      </div>
    </div>
  );
}
