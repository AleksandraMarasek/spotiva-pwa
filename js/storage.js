const Storage = {
  key: "photomap_places",

  getPlaces() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  },

  savePlace(place) {
    const places = this.getPlaces();
    places.push(place);
    
    try {
      localStorage.setItem(this.key, JSON.stringify(places));
    } catch (error) {
      throw error;
    }
  },

  getPlaceById(id) {
    return this.getPlaces().find((place) => place.id === id);
  },

  deletePlace(id) {
    let places = this.getPlaces();
    places = places.filter((place) => place.id !== id);
    localStorage.setItem(this.key, JSON.stringify(places));
  }
};