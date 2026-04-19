import React from "react";

import Header from "./Header";
import ParkGallery from "./ParkGallery";
import HowWorks from "./HowWorks";
import CityParkSlider from "./CityParkSlider";
import TestimonialSlider from "./TestimonialSlider";
import SponsoredSlider from "./SponsoredSlider";
import FAQ from "./FAQ";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section>
        <Header />
      </section>

      <section>
        <CityParkSlider />
      </section>

      <SponsoredSlider />

      <section className="py-10">
        <HowWorks />
      </section>

      <section>
        <TestimonialSlider />
      </section>

      <section className="py-10">
        <ParkGallery />
      </section>

      <section className="py-10">
        <FAQ />
      </section>
    </div>
  );
}