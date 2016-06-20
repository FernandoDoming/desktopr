const HUMANIZATION = {
  EditorsChoice: "Editors' Choice",
  FreshToday: "Fresh Today",
  FreshYesterday: "FreshYesterday",
  FreshWeek: "Fresh this week"
};

let SourcesHelper = {
  humanize: function (string) {
    return HUMANIZATION[string] || string.replace(/_/g, ' ');
  }
};

module.exports = SourcesHelper;
