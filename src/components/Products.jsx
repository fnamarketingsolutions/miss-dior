import React from 'react';

// Product dataset replicating each column from the reference image
const products = [
  {
    id: 1,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', // Replace with your NIVA EDP image
    title: 'NIVA Eau de Parfum',
    description: 'Floral, vanilla, and sensual notes',
    intensity: 1, // 1 of 5 filled dots
    price: 'From ₹ 13,400 - Sprays 50 ml',
  },
  {
    id: 2,
    type: 'editorial',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop', // Replace with center ribbon/campaign visual
    title: 'NIVA Eau de Parfum, the new couture icon',
    actionText: 'Discover',
    actionUrl: '#',
  },
  {
    id: 3,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop', // Replace with NIVA Essence image
    title: 'NIVA Essence',
    description: 'Essence de parfum - jammy, floral and woody notes',
    intensity: 4, // 4 of 5 filled dots
    price: 'From ₹ 16,400 - Sprays 35 ml',
  },
];

// Dot rating indicator for perfume intensity
const IntensityDots = ({ level = 1, max = 5 }) => {
  return (
    <div className="inline-flex items-center gap-1 ml-2 align-middle">
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          className={`inline-block w-[6px] h-[6px] rounded-full transition-colors ${
            index < level ? 'bg-neutral-700' : 'border border-neutral-400 bg-transparent'
          }`}
        />
      ))}
    </div>
  );
};

export default function NivaShowcase() {
  return (
    /* my-12 sm:my-16 md:my-24 adds the requested top and bottom margin to the entire section */
    <section className="w-full bg-[#f9f9f9] my-12 sm:my-16 md:my-24 py-6 font-sans antialiased text-[#202020]">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* 'gap-1 sm:gap-2' gives a minor, seamless spacing between the 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-1 sm:gap-x-2">
          {products.map((item) => (
            <div key={item.id} className="flex flex-col group bg-white/40 pb-4">
              
              {/* Image Block */}
              <div className="w-full aspect-[4/5] bg-[#ececec] overflow-hidden flex items-center justify-center relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Information & Details Block */}
              <div className="pt-6 pb-2 px-3 text-center flex flex-col items-center justify-start flex-grow">
                {/* Title */}
                <h3 className="text-[13px] sm:text-[14px] font-normal tracking-wide text-neutral-800 uppercase line-clamp-1">
                  {item.title}
                </h3>

                {/* Subtitle / Notes */}
                {item.description && (
                  <p className="mt-1.5 text-[11px] sm:text-[12px] text-neutral-500 font-light tracking-wide max-w-[280px]">
                    {item.description}
                  </p>
                )}

                {/* Intensity Indicator */}
                {item.intensity !== undefined && (
                  <div className="mt-2 text-[11px] sm:text-[12px] text-neutral-500 font-light tracking-wide flex items-center">
                    <span>Intensity</span>
                    <IntensityDots level={item.intensity} />
                  </div>
                )}

                {/* Price (Indian Rupees) */}
                {item.price && (
                  <span className="mt-3 text-[11px] sm:text-[12px] text-neutral-600 font-light tracking-wider">
                    {item.price}
                  </span>
                )}

                {/* Action Link (For Center Editorial Column) */}
                {item.actionText && (
                  <div className="mt-4">
                    <a
                      href={item.actionUrl}
                      className="text-[12px] font-medium tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors uppercase"
                    >
                      {item.actionText}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}