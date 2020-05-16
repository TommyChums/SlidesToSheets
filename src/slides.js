const GoogleSlides = (google) => {
  const slides = google.slides('v1');
  return {
    getPresentationInfo: (params) => slides.presentations.get(params),
  };
};

module.exports = GoogleSlides;
