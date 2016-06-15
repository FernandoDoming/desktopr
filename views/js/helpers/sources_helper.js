const HUMANIZATION = {
  EditorsChoice: "Editors' Choice",
};

let SourcesHelper = {
  humanize: function (string) {
    return HUMANIZATION[string] || string;
  }
};

module.exports = SourcesHelper;
