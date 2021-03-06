const HUMANIZATION = {
  EditorsChoice: "Editors' Choice",
  FreshToday: "Fresh Today",
  FreshYesterday: "FreshYesterday",
  FreshWeek: "Fresh this week",
  iso: "ISO",
  favorites_count: "Fav count"
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.humanize = function() {
  return HUMANIZATION[this] || this.replace(/_/g, ' ');
}

let SourcesHelper = {
  humanize: function (string) {
    if (typeof string === 'string') {
      return HUMANIZATION[string] || string.replace(/_/g, ' ');
    } else {
      return string;
    }
  }
};

module.exports = SourcesHelper;
