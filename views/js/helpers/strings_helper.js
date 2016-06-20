const HUMANIZATION = {
  EditorsChoice: "Editors' Choice",
  FreshToday: "Fresh Today",
  FreshYesterday: "FreshYesterday",
  FreshWeek: "Fresh this week",
  Iso: "ISO"
};

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
