class App {
  constructor() {
    this._updateHistory();

    document.querySelector('.countries')?.addEventListener('click', this._handleCountryClick.bind(this));
  }

  _updateHistory() {
    if (USER_COUNTRY) {
      window.history.pushState({}, "", `?country=${USER_COUNTRY}`);
    }
  }

  /**
   * @param {Event} ev
   */
  _handleCountryClick(ev) {
    const countryCard = ev.target.closest('.country');
    if (!countryCard) return;

    const countryName = countryCard.id;
    if (countryName) {
      window.location.href = `/?country=${countryName}`;
    }
  }
}

new App();
