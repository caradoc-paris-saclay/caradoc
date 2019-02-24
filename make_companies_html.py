from os import walk
from os.path import abspath, join, dirname, basename

root = dirname(abspath(__file__))
companies_folder = join(root, "assets/img/companies")
html_path = join(root, "_includes/companies_array.html")

html = open(html_path, "w")


for root, dirs, files in walk(companies_folder):

        for f in sorted(files, key=str.lower):
                if "DS_Store" in f:
                        pass
                else:
                        name = basename(f)
                        name = name[0].upper() + name[1:-4]
                        if "_" in name:
                                name = name.replace("_", " ")
                        print(name)
                        html.write(
                        "<li class=\"mix " + basename(root) + "\">\n" +
                        "  <img src=\"{{ site.baseurl }}{% link /assets/img/companies/" +
                           join(basename(root),basename(f)) + " %}\" " +
                           "alt=\"" + name + "\">\n"+
                        "</li>\n")
